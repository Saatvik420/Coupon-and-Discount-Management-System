# Step-by-Step Deployment Guide

## Part 1: Deploy Backend to Render.com

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com)
2. Click **"Sign Up"** in the top right
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Render to access your GitHub account
5. Choose a plan (select **Free**)

### Step 2: Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"**
3. Create account or sign in with Google
4. Click **"Create a Cluster"**
5. Select **Cloud Provider**: AWS
6. Select **Region**: Choose nearest to you
7. Select **Cluster Tier**: M0 Sandbox (Free)
8. Click **"Create Cluster"**
9. Wait for cluster to create (2-3 minutes)
10. Click **"Database Access"** on left menu
11. Click **"Add New Database User"**
12. Enter username: `admin`
13. Enter password: `your-secure-password` (save this!)
14. Click **"Create User"**
15. Click **"Network Access"** on left menu
16. Click **"Add IP Address"**
17. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
18. Click **"Confirm"**
19. Go back to **"Clusters"** and click **"Connect"**
20. Select **"Connect your application"**
21. Copy the connection string:
```
mongodb+srv://admin:your-secure-password@cluster.mongodb.net/coupon_management
```

### Step 3: Push Code to GitHub (if not already done)
1. Open terminal/command prompt
2. Navigate to your project folder
3. Run these commands:
```bash
git init
git add .
git commit -m "Ready for deployment"
```
4. Go to [GitHub.com](https://github.com)
5. Click **"+"** in top right, select **"New repository"**
6. Repository name: `coupon-management`
7. Make it **Public**
8. Click **"Create repository"**
9. Copy the commands shown and run in terminal:
```bash
git remote add origin https://github.com/YOUR_USERNAME/coupon-management.git
```

### Step 4: Deploy Backend to Render
**Option A: Automatic Deployment with render.yaml (Recommended)**
1. Go to [Render.com](https://render.com) and log in
2. Click **"New +"** button in top right
3. Select **"Web Service"**
4. Click **"Connect a repository"**
5. Find and select your `coupon-management` repository
6. Click **"Connect"**
7. **Important**: Render will automatically detect `render.yaml` in root directory
8. Review the configuration (should be pre-filled)
9. Click **"Create Web Service"**
10. **Add Environment Variables** (if not auto-configured):
    - Click **"Environment"** tab
    - Add these variables:
      - `MONGODB_URI`: `mongodb+srv://admin:your-secure-password@cluster.mongodb.net/coupon_management`
      - `JWT_SECRET`: `your-super-secret-jwt-key-change-this-in-production-12345`
      - `CORS_ALLOWED_ORIGINS`: `https://your-frontend-url.netlify.app`
      - `SPRING_PROFILES_ACTIVE`: `production`

**Option B: Manual Configuration**
1. Follow steps 1-6 above
2. **Configure service manually**:
   - **Name**: `coupon-backend`
   - **Environment**: `Java`
   - **Root Directory**: `backend`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/coupon-management-0.0.1-SNAPSHOT.jar`
   - **Instance Type**: `Free`
3. Add environment variables as shown above
4. Click **"Create Web Service"**
5. **Wait for deployment** (5-10 minutes)
6. You'll see logs showing the build process
7. When done, you'll get a URL like: `https://coupon-backend.onrender.com`
8. **Test the backend**: Visit `https://coupon-backend.onrender.com/api/actuator/health`
    - Should show: `{"status":"UP"}`

---

## Part 2: Deploy Frontend to Netlify.com

### Step 1: Create Netlify Account
1. Go to [Netlify.com](https://netlify.com)
2. Click **"Sign up"** in top right
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Netlify to access your GitHub account
5. Choose a plan (select **Free**)

### Step 2: Deploy Frontend to Netlify
1. After signing up, you'll be on the dashboard
2. Click **"Add new site"** button
3. Select **"Import an existing project"**
4. **Connect to Git Provider**:
   - Click **"GitHub"**
   - Authorize if prompted
5. **Select Repository**:
   - Find and select `coupon-management`
   - Click **"Continue"**
6. **Configure Build Settings**:
   - **Base directory**: Leave empty
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: Leave empty
7. **Environment Variables** (optional but recommended):
   - Click **"New variable"**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://coupon-backend.onrender.com/api`
8. Click **"Deploy site"**
9. **Wait for deployment** (2-3 minutes)
10. When done, you'll get a URL like: `https://amazing-coupons.netlify.app`
11. **Save this URL** - you'll need it for CORS configuration

---

## Part 3: Final Configuration

### Step 1: Update CORS Settings in Render
1. Go back to [Render.com](https://render.com)
2. Click on your `coupon-backend` service
3. Click **"Environment"** tab
4. Find the `CORS_ALLOWED_ORIGINS` variable
5. Click **"Edit"**
6. Update the value to your actual Netlify URL:
   ```
   https://your-actual-frontend-url.netlify.app
   ```
7. Click **"Save"**
8. Wait for automatic redeployment (2-3 minutes)

### Step 2: Test Everything
1. **Test Backend**: Visit `https://coupon-backend.onrender.com/api/actuator/health`
2. **Test Frontend**: Visit your Netlify URL
3. **Test Full Flow**:
   - Sign up as new user
   - Login
   - Create a coupon (if admin)
   - Apply a coupon
   - Check that all features work

---

## Part 4: Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Issue: Build fails on Render**
- **Solution**: Check the build logs in Render dashboard
- **Common causes**:
  - Missing Maven wrapper files
  - Java version mismatch
  - Dependencies not downloading

**Issue: Database connection error**
- **Solution**: Verify MongoDB connection string
- **Check**: Username, password, cluster name
- **Make sure**: IP access is set to "Allow from Anywhere"

**Issue: CORS errors**
- **Solution**: Update CORS_ALLOWED_ORIGINS in Render
- **Format**: `https://your-frontend-url.netlify.app`
- **Note**: No trailing slash

#### Frontend Issues

**Issue: Build fails on Netlify**
- **Solution**: Check build logs in Netlify dashboard
- **Common causes**:
  - Missing dependencies
  - Node.js version mismatch
  - Build command incorrect

**Issue: API connection errors**
- **Solution**: Check API URL in environment variables
- **Verify**: Backend URL is correct and accessible
- **Check**: CORS is properly configured

**Issue: 404 errors on page refresh**
- **Solution**: This is handled by netlify.toml
- **If still occurs**: Check that netlify.toml is in root directory

---

## Part 5: Quick Reference

### Important URLs to Save
- **GitHub**: `https://github.com/YOUR_USERNAME/coupon-management`
- **Render Backend**: `https://coupon-backend.onrender.com`
- **Netlify Frontend**: `https://your-frontend-url.netlify.app`
- **MongoDB Atlas**: `https://cloud.mongodb.com`

### Environment Variables Summary
**Render Backend**:
```
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/coupon_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
CORS_ALLOWED_ORIGINS=https://your-frontend-url.netlify.app
SPRING_PROFILES_ACTIVE=production
```

**Netlify Frontend** (optional):
```
VITE_API_BASE_URL=https://coupon-backend.onrender.com/api
```

### Commands for Future Updates
```bash
# Update backend
git add .
git commit -m "Backend update"
git push origin main

# Update frontend
git add .
git commit -m "Frontend update" 
git push origin main
```

---

## Part 6: Success Checklist

### Backend Deployment
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP access configured (0.0.0.0/0)
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Health check returns `{"status":"UP"}`

### Frontend Deployment
- [ ] Netlify account created
- [ ] GitHub repository connected
- [ ] Build settings configured
- [ ] Frontend deployed successfully
- [ ] Site loads without errors

### Integration Testing
- [ ] CORS configured properly
- [ ] API calls work from frontend
- [ ] User registration works
- [ ] Login works
- [ ] Coupon creation works (admin)
- [ ] Coupon application works
- [ ] No console errors

### Final Verification
- [ ] All features tested in production
- [ ] No broken links or pages
- [ ] Responsive design works
- [ ] Error handling works
- [ ] Database operations work

---

**Congratulations! Your Coupon Management System is now live!** 

**Total Cost**: $0/month (free tiers)
**Deployment Time**: 15-20 minutes
**Maintenance**: Automatic deployments on git push
