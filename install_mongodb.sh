#!/bin/bash
# Script to install MongoDB on Kali Linux
echo "Starting MongoDB installation..."

# Update package lists
sudo apt-get update

# Install MongoDB server package
sudo apt-get install -y mongodb-server

# Start the MongoDB service
sudo systemctl start mongodb

# Enable MongoDB to start on boot
sudo systemctl enable mongodb

echo ""
echo "✅ MongoDB installation complete!"
echo "Service status:"
sudo systemctl status mongodb --no-pager | grep Active
