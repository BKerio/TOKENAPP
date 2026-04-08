import paramiko
import time

HOST = "178.79.137.240"
PORT = 22
USERNAME = "root"
PASSWORD = "TokenPap.0102"

def run_cmd(client, cmd):
    stdin, stdout, stderr = client.exec_command(cmd)
    return stdout.read().decode().strip(), stderr.read().decode().strip()

def check_server():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
    
    print("Checking Nginx Configuration...")
    out, err = run_cmd(client, "cat /etc/nginx/conf.d/frontend.conf")
    print(f"--- Nginx Config ---\n{out}\n")
    
    print("Checking Certbot Installation...")
    out, err = run_cmd(client, "certbot --version || echo 'Certbot not found'")
    print(f"Certbot version: {out}")
    
    print("Checking Nginx Status...")
    out, err = run_cmd(client, "systemctl is-active nginx")
    print(f"Nginx status: {out}")
    
    client.close()

if __name__ == "__main__":
    check_server()
