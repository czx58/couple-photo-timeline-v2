#!/bin/bash
set -e

# 配置
APP_DIR="/opt/calculus-site"
DB_NAME="calculus"
DB_USER="calculus"
DB_PASS="${DB_PASS:-changeme}"
SESSION_SECRET="${SESSION_SECRET:-changeme}"
DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY:-}"
APP_NAME="Calculus Helper"

# 1. 关闭 SELinux
setenforce 0 || true
sed -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config || true

# 2. 安装基础软件
dnf install -y git curl wget vim nginx postgresql-server postgresql-contrib

# 3. 初始化 PostgreSQL
postgresql-setup --initdb || true
systemctl enable postgresql
systemctl start postgresql

# 4. 创建数据库和用户
su - postgres -c "psql -c \"CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';\"" || true
su - postgres -c "psql -c \"CREATE DATABASE $DB_NAME OWNER $DB_USER;\"" || true
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;\""

# 5. 配置 PostgreSQL 允许本地连接
sed -i 's/^host.*all.*all.*127.0.0.1\/32.*ident/host    all             all             127.0.0.1\/32            scram-sha-256/' /var/lib/pgsql/data/pg_hba.conf || true
sed -i 's/^host.*all.*all.*::1\/128.*ident/host    all             all             ::1\/128                 scram-sha-256/' /var/lib/pgsql/data/pg_hba.conf || true
systemctl restart postgresql

# 6. 安装 Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# 7. 安装 PM2
npm install -g pm2

# 8. 克隆项目
rm -rf $APP_DIR
git clone https://github.com/czx58/calculus-site.git $APP_DIR
cd $APP_DIR

# 9. 创建 .env 文件
cat > .env <<EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public
DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY
NEXT_PUBLIC_APP_NAME=$APP_NAME
SESSION_SECRET=$SESSION_SECRET
EOF

# 10. 安装依赖并构建
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# 11. 使用 PM2 启动
pm2 delete calculus-site || true
pm2 start ecosystem.config.js || pm2 start npm --name "calculus-site" -- start
pm2 save
pm2 startup systemd -u root --hp /root || true

# 12. 配置 Nginx
cat > /etc/nginx/conf.d/calculus-site.conf <<'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 13. 启动 Nginx
systemctl enable nginx
systemctl restart nginx

# 14. 开放防火墙
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload || true

echo "Deployment completed!"
echo "Access: http://$(curl -s http://metadata.tencentyun.com/latest/meta-data/public-ipv4 2>/dev/null || echo 'your-server-ip')"
