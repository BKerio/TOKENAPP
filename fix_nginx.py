import paramiko
import time

HOST = "[IP_ADDRESS]"
USERNAME = "root"
PASSWORD = "[PASSWORD]"

def run(client, cmd):
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    return out, err

def fix():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USERNAME, password=PASSWORD)

    print("=== Current Nginx configs ===")
    out, _ = run(client, "ls /etc/nginx/conf.d/")
    print(out)

    print("\n=== chatbot.conf ===")
    out, _ = run(client, "cat /etc/nginx/conf.d/chatbot.conf")
    print(out)

    print("\n=== frontend.conf ===")
    out, _ = run(client, "cat /etc/nginx/conf.d/frontend.conf")
    print(out)

    print("\n=== Checking dist folder ===")
    out, _ = run(client, "ls /var/www/frontend/dist/ 2>/dev/null | head -5 || echo 'dist NOT FOUND'")
    print(out)

    # Fix: write a clean frontend.conf for app.tokenpap.com only
    print("\n=== Writing clean frontend.conf ===")
    new_conf = """server {
    listen 80;
    server_name app.tokenpap.com;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}"""

    write_cmd = f"cat > /etc/nginx/conf.d/frontend.conf << 'ENDOFCONF'\n{new_conf}\nENDOFCONF"
    out, err = run(client, write_cmd)

    # Remove app.tokenpap.com from chatbot.conf if it's there (replace with _)
    print("\n=== Checking if chatbot.conf has app.tokenpap.com ===")
    out, _ = run(client, "grep 'app.tokenpap.com' /etc/nginx/conf.d/chatbot.conf || echo 'Not in chatbot.conf'")
    print(out)

    if "app.tokenpap.com" in out:
        print("Removing app.tokenpap.com from chatbot.conf...")
        run(client, "sed -i 's/app\\.tokenpap\\.com/chatbot.tokenpap.com/g' /etc/nginx/conf.d/chatbot.conf")
        print("Done.")

    print("\n=== Testing Nginx config ===")
    out, err = run(client, "nginx -t 2>&1")
    print(out or err)

    print("\n=== Reloading Nginx ===")
    out, err = run(client, "systemctl reload nginx 2>&1")
    print(out or err or "Reloaded OK")

    print("\n=== Checking HTTPS availability ===")
    out, _ = run(client, "curl -sk -o /dev/null -w '%{http_code}' https://app.tokenpap.com/ || echo 'curl failed'")
    print(f"HTTP status: {out}")

    print("\n=== Certbot certs ===")
    out, _ = run(client, "certbot certificates 2>&1 | grep -E 'Domains|Expiry|Certificate'")
    print(out)

    client.close()
    print("\nDone!")

if __name__ == "__main__":
    fix()
