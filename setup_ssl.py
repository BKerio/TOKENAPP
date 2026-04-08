import paramiko
import time

HOST = "178.79.137.240"
PORT = 22
USERNAME = "root"
PASSWORD = "TokenPap.0102"
DOMAIN = "app.tokenpap.com"

def run_interactive(shell, cmd, wait_time=5):
    print(f">>> {cmd}")
    shell.send(cmd + "\n")
    time.sleep(wait_time)
    output = ""
    while shell.recv_ready():
        output += shell.recv(4096).decode("utf-8", errors="replace")
    print(output)
    return output

def setup_ssl():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
    
    shell = client.invoke_shell()
    time.sleep(1)
    
    # Ensure certbot is available
    print("\n[1/3] Checking Certbot...")
    run_interactive(shell, "certbot --version")
    
    # Run Certbot for app.tokenpap.com
    print("\n[2/3] Requesting SSL Certificate for " + DOMAIN + "...")
    # --non-interactive: runs without user prompts
    # --agree-tos: agree to Terms of Service
    # -m brian.kerio@gmail.com (assumed email for cert notifications)
    # --nginx: use nginx plugin
    # -d app.tokenpap.com: the domain
    run_interactive(shell, f"certbot --nginx -d {DOMAIN} --non-interactive --agree-tos -m brian.kerio@gmail.com --no-eff-email --redirect", 60)
    
    # Test Nginx and reload
    print("\n[3/3] Finalizing Nginx...")
    run_interactive(shell, "nginx -t")
    run_interactive(shell, "systemctl reload nginx")
    
    print("\nDone! Please check https://" + DOMAIN)
    client.close()

if __name__ == "__main__":
    setup_ssl()
