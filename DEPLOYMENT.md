# Deployment Guide - Coupon Management System

## Quick Start Deployment

This project is fully configured for deployment to:
- **Backend**: Render.com (Free tier available)
- **Frontend**: Netlify.com (Free tier available)

## Prerequisites

1. **GitHub Account**: For version control and deployment
2. **Render Account**: For backend deployment
3. **Netlify Account**: For frontend deployment
4. **MongoDB Atlas**: For cloud database (free tier available)

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/coupon_management`

## Step 2: Setup GitHub Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/coupon-management.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend to Render

1. **Sign up at Render.com**
2. **Create New Web Service**:
   - Connect GitHub repository
   - Root Directory: `backend`
   - Environment: `Java`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/coupon-management-0.0.1-SNAPSHOT.jar`

3. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coupon_management
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_URL.netlify.app
   SPRING_PROFILES_ACTIVE=production
   ```

4. **Deploy**: Click "Create Web Service"

## Step 4: Deploy Frontend to Netlify

1. **Sign up at Netlify.com**
2. **Add New Site**:
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables** (optional):
   ```
   VITE_API_BASE_URL=https://YOUR_BACKEND_URL.onrender.com/api
   ```

4. **Deploy**: Click "Deploy Site"

## Step 5: Final Configuration

After deployment, update the Render environment variable:
```
CORS_ALLOWED_ORIGINS=https://YOUR_ACTUAL_FRONTEND_URL.netlify.app
```

## Step 6: Test Everything

1. **Backend Health**: `https://YOUR_BACKEND_URL.onrender.com/api/actuator/health`
2. **Frontend**: `https://YOUR_FRONTEND_URL.netlify.app`
3. **Full Test Flow**:
   - Create admin user
   - Create coupons
   - Test coupon application

## Deployment Scripts

Use the provided scripts for easier deployment:

```bash
# Backend deployment
chmod +x scripts/deploy-backend.sh
./scripts/deploy-backend.sh

# Frontend deployment
chmod +x scripts/deploy-frontend.sh
./scripts/deploy-frontend.sh
```

## Troubleshooting

### Common Issues

**CORS Errors**:
```bash
# Update backend CORS settings
CORS_ALLOWED_ORIGINS=https://your-frontend-url.netlify.app
```

**API Connection Issues**:
```bash
# Check frontend API URL
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

**Build Failures**:
- Check Node.js version (18+)
- Check Java version (17+)
- Verify all dependencies are installed

### Environment Variables Template

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Update values:
- MongoDB connection string
- JWT secret
- Frontend URL
- Backend URL

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] GitHub repository created and pushed
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Full application tested
- [ ] Admin user created and tested

## Cost Summary

- **MongoDB Atlas**: Free tier (512MB)
- **Render**: Free tier (750 hours/month)
- **Netlify**: Free tier (100GB bandwidth/month)
- **GitHub**: Free tier

**Total Cost**: $0/month for basic usage

## Support

If you encounter issues:

1. Check Render build logs
2. Check Netlify build logs
3. Verify environment variables
4. Test API endpoints directly
5. Check CORS configuration

## Next Steps

After successful deployment:

1. Monitor application performance
2. Set up analytics if needed
3. Configure custom domains
4. Set up CI/CD pipelines
5. Add monitoring and alerting
