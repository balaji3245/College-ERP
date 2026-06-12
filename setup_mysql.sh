#!/bin/bash
# Run this script with: sudo bash setup_mysql.sh

echo "Setting up MySQL database for SmartCampus ERP..."

# 1. Create database and user
mysql -u root -p -e "
CREATE DATABASE IF NOT EXISTS smartcampus_erp;
CREATE USER IF NOT EXISTS 'erp_admin'@'localhost' IDENTIFIED BY 'erp_pass_123';
GRANT ALL PRIVILEGES ON smartcampus_erp.* TO 'erp_admin'@'localhost';
FLUSH PRIVILEGES;
"

echo ""
echo "✅ MySQL setup complete!"
echo "Database: smartcampus_erp"
echo "User: erp_admin"
echo "Password: erp_pass_123"
