# Deploying the React Frontend to CentOS 10 Stream

This guide outlines exactly how the `TOKENPAPSYSTEM` React frontend was deployed to the CentOS 10 Stream server.

## 1. Initial Setup & Dependencies
First, we connected via SSH and installed Node.js 20, which is required to build the frontend application.

```bash
# Install NodeSource repository for Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -

# Install Node.js
dnf install -y nodejs
```

## 2. Deploying the React Application
Unlike a traditional backend app that runs constantly, a React frontend requires a build step that generates a static site (`dist` folder), which is then served directly by Nginx.

```bash
# Ensure the web directory exists
mkdir -p /var/www

# Clone the repository
git clone https://github.com/BKerio/TOKENAPP.git /var/www/frontend
cd /var/www/frontend

# Create the environment variables file
cat > .env <<'EOF'
VITE_API_URL=https://api.tokenpap.com/api
EOF

# Install all npm dependencies (using legacy peer deps for compatibility)
npm install --legacy-peer-deps

# Build the static, production-ready bundle
npm run build
```
Once completed, the production assets are available in the `/var/www/frontend/dist` directory.

## 3. Web Server & Permissions (Nginx & SELinux)
CentOS 10 uses extremely strict security settings (SELinux) by default. Nginx will return a **403 Forbidden** error if it is not explicitly granted permission to read our new `dist` directory.

```bash
# Explicitly set the SELinux context for the frontend files so the web server can read them
chcon -Rt httpd_sys_content_t /var/www/frontend/dist

# Also ensure standard ownership is set
chown -R nginx:nginx /var/www/frontend/dist
```

## 4. Nginx Configuration
We created an Nginx virtual host block to serve the React application from the `dist` folder on the domain `app.tokenpap.com`. 

> [!IMPORTANT]
> Because React is an SPA (Single Page Application), we must ensure that all routing paths (like `/dashboard`) fall back to `/index.html` on the server using `try_files`. Otherwise, a hard refresh on a sub-page will render a 404 error. Also, ensure there are no conflicting server configs containing the `app.tokenpap.com` name.

```bash
# Create the Nginx config
cat > /etc/nginx/conf.d/frontend.conf << 'EOF'
server {
    listen 80;
    server_name app.tokenpap.com;

    # Point directly to the Vite build directory
    root /var/www/frontend/dist;
    index index.html;

    # Important for SPAs: Serve the file if found, otherwise serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Highly aggressive caching for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip compression for better load times
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF

# Validate and reload Nginx
nginx -t
systemctl reload nginx
```

## 5. SSL Configuration (HTTPS)
SSL was handled automatically by Certbot, which modifies the above `frontend.conf` to add proper `listen 443 ssl` directives and HTTP-to-HTTPS redirects.

```bash
# Run certbot strictly for the frontend subdomain
certbot --nginx -d app.tokenpap.com --non-interactive --agree-tos -m <your_email@domain.com> --redirect

# Test Nginx and reload
nginx -t
systemctl reload nginx
```

Your React application is now live, fully cached, secured via HTTPS, and accessible at **https://app.tokenpap.com**.
