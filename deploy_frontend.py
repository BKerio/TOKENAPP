import paramiko
import time
import sys

HOST = "178.79.137.240"
PORT = 22
USERNAME = "root"
PASSWORD = "TokenPap.0102"
GITHUB_REPO = "https://github.com/BKerio/TOKENAPP.git"
APP_DIR = "/var/www/frontend"
NGINX_SITE = "/etc/nginx/conf.d/frontend.conf"

def run(shell, cmd, wait=3, show=True):
    print(f"\n>>> {cmd}")
    shell.send(cmd + "\n")
    time.sleep(wait)
    output = ""
    while shell.recv_ready():
        chunk = shell.recv(4096).decode("utf-8", errors="replace")
        output += chunk
        time.sleep(0.3)
    if show and output.strip():
        print(output.strip())
    return output

def deploy():
    print("=" * 60)
    print("  TokenPap Frontend Deployment")
    print("=" * 60)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    print(f"\n[1/8] Connecting to {HOST}...")
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=20)
        print("      Connected successfully!")
    except Exception as e:
        print(f"      Connection failed: {e}")
        sys.exit(1)

    shell = client.invoke_shell()
    time.sleep(1)
    shell.recv(4096)  # clear banner

    # 2. Install Node.js if not present
    print("\n[2/8] Checking Node.js installation...")
    run(shell, "node --version 2>/dev/null || echo 'NODE_NOT_FOUND'", wait=3)
    run(shell, """
if ! command -v node &>/dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf install -y nodejs
fi
""", wait=30)
    run(shell, "node --version && npm --version", wait=3)

    # 3. Clone / update repo
    print("\n[3/8] Cloning/updating repository...")
    run(shell, f"""
if [ -d "{APP_DIR}/.git" ]; then
  echo "Repo exists – pulling latest..."
  cd {APP_DIR} && git fetch --all && git reset --hard origin/main
else
  echo "Cloning repo..."
  rm -rf {APP_DIR}
  git clone {GITHUB_REPO} {APP_DIR}
fi
""", wait=30)

    # 4. Write production .env
    print("\n[4/8] Writing production .env...")
    run(shell, f"""cat > {APP_DIR}/.env <<'EOF'
VITE_API_URL=https://api.tokenpap.com/api
EOF
echo ".env written"
""", wait=3)

    # 5. Install dependencies
    print("\n[5/8] Installing npm dependencies (this may take a while)...")
    run(shell, f"cd {APP_DIR} && npm install --legacy-peer-deps 2>&1 | tail -5", wait=120)

    # 6. Build
    print("\n[6/8] Building production bundle...")
    run(shell, f"cd {APP_DIR} && npm run build 2>&1 | tail -10", wait=120)
    run(shell, f"ls -lh {APP_DIR}/dist/", wait=3)

    # 7. Nginx config
    print("\n[7/8] Configuring Nginx for frontend (tokenpap.com)...")
    nginx_conf = f"""server {{
    listen 80;
    server_name app.tokenpap.com;

    root {APP_DIR}/dist;
    index index.html;

    location / {{
        try_files $uri $uri/ /index.html;
    }}

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {{
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}}"""

    run(shell, f"""cat > {NGINX_SITE} <<'NGINXEOF'
{nginx_conf}
NGINXEOF
echo "Nginx config written"
""", wait=5)

    # 8. Test & reload Nginx
    print("\n[8/8] Testing and reloading Nginx...")
    run(shell, "nginx -t", wait=5)
    run(shell, "systemctl reload nginx", wait=5)
    run(shell, "systemctl status nginx --no-pager | head -10", wait=5)

    # Done
    print("\n" + "=" * 60)
    print("  Deployment complete!")
    print(f"  Frontend: https://app.tokenpap.com")
    print(f"  Files at: {APP_DIR}/dist")
    print("=" * 60)

    shell.close()
    client.close()

if __name__ == "__main__":
    deploy()
