#!/bin/bash

echo "Deploying Backend to Render..."

# Navigate to backend directory
cd backend

# Clean and package
./mvnw clean package -DskipTests

echo "Backend build completed!"
echo "Push to GitHub and Render will automatically deploy."

# Git commands for deployment
git add .
git commit -m "Backend deployment ready"
git push origin main

echo "Backend deployment triggered on Render!"
