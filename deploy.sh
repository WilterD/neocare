#!/bin/bash
set -e

echo "Stopping pm2 processes if they exist..."
pm2 delete neocare-backend || true
pm2 delete neocare-frontend || true

echo "Stopping postgres container..."
docker rm -f neocare-postgres || true

echo "Removing old directory..."
rm -rf /var/www/neocare.enlatribuna.com/private/neocare2
rm -rf /var/www/neocare.enlatribuna.com/private/neocare

echo "Cloning new repository..."
cd /var/www/neocare.enlatribuna.com/private
git clone -b master https://github.com/WilterD/neocare.git neocare

cd neocare

echo "Setting up docker-compose for PostgreSQL..."
cat << 'EOF' > docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: neocare-postgres
    environment:
      POSTGRES_USER: neocare_user
      POSTGRES_PASSWORD: neocare_pass
      POSTGRES_DB: neocare_db
    ports:
      - "5434:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
EOF

docker compose up -d

echo "Waiting for PostgreSQL to start..."
sleep 10

echo "Setting up backend..."
cd backend
npm install
cat << 'EOF' > .env
PORT=3002
NODE_ENV=production
DB_TYPE=postgres
DATABASE_URL=postgresql://neocare_user:neocare_pass@127.0.0.1:5434/neocare_db?schema=public
JWT_SECRET=neocare_jwt_secret_2024_production
FRONTEND_URL=http://neocare.enlatribuna.com
EOF

echo "Initializing database..."
cat database/schema_postgresql.sql | docker exec -i neocare-postgres psql -U neocare_user -d neocare_db || echo "Database probably already initialized"

cd ..

echo "Setting up frontend..."
cd frontend
npm install
cat << 'EOF' > .env
VITE_API_URL=http://neocare.enlatribuna.com/api
EOF
npm run build
cd ..

echo "Setting up PM2..."
cat << 'EOF' > ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'neocare-backend',
      script: 'node',
      args: 'src/server.js',
      cwd: '/var/www/neocare.enlatribuna.com/private/neocare/backend',
      env: {
        PORT: 3002,
        NODE_ENV: 'production',
        DB_TYPE: 'postgres',
        DATABASE_URL: 'postgresql://neocare_user:neocare_pass@127.0.0.1:5434/neocare_db?schema=public',
        JWT_SECRET: 'neocare_jwt_secret_2024_production',
        FRONTEND_URL: 'http://neocare.enlatribuna.com'
      }
    },
    {
      name: 'neocare-frontend',
      script: 'npx',
      args: 'serve -s dist -l 3003',
      cwd: '/var/www/neocare.enlatribuna.com/private/neocare/frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

pm2 start ecosystem.config.js
pm2 save

echo "Deployment complete!"
