# Coupon and Discount Management System

A full-stack coupon and discount management system built with Java Spring Boot backend, MongoDB database, and React frontend.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (ADMIN/USER)
- Protected routes

### Coupon Management (Admin)
- Create, update, delete coupons
- Activate/deactivate coupons
- View usage statistics
- Filter coupons by status (active/expired/inactive)

### User Features
- View available active coupons
- Apply coupon codes with validation
- Track discount calculations
- View coupon history

### Business Logic
- Unique coupon code validation
- Expiration date checking
- Usage limit enforcement
- Minimum order amount requirements
- Percentage and flat discount support
- Usage count tracking

## Tech Stack

### Backend
- **Java 17** with Spring Boot 3.2.0
- **MongoDB** for data storage
- **Spring Security** with JWT authentication
- **Maven** for dependency management

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

## Project Structure

```
Coupon and Discount Management System/
|-- backend/
|   |-- src/main/java/com/coupon/management/
|   |   |-- controller/          # REST API controllers
|   |   |-- service/             # Business logic
|   |   |-- repository/          # Data access layer
|   |   |-- entity/              # Data models
|   |   |-- dto/                 # Data transfer objects
|   |   |-- security/            # JWT configuration
|   |   |-- exception/           # Global exception handling
|   |   |-- CouponManagementApplication.java
|   |-- src/main/resources/
|   |   |-- application.properties
|   |-- pom.xml
|
|-- src/
|   |-- components/              # React components
|   |-- contexts/                # React contexts
|   |-- services/                # API services
|   |-- App.jsx                  # Main app component
|   |-- main.jsx                 # App entry point
|
|-- package.json
|-- tailwind.config.js
|-- vite.config.js
```

## Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Update MongoDB connection in `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/coupon_management
```

3. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### User Coupons
- `GET /api/coupons/active` - Get active coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons/apply` - Apply a coupon
- `POST /api/coupons/validate` - Validate a coupon

### Admin Management
- `POST /api/admin/coupons` - Create coupon
- `PUT /api/admin/coupons/{id}` - Update coupon
- `DELETE /api/admin/coupons/{id}` - Delete coupon
- `PUT /api/admin/coupons/{id}/activate` - Activate coupon
- `PUT /api/admin/coupons/{id}/deactivate` - Deactivate coupon
- `GET /api/admin/coupons/active` - Get active coupons
- `GET /api/admin/coupons/expired` - Get expired coupons
- `GET /api/admin/coupons/inactive` - Get inactive coupons

## Default Users

After starting the application, you can create users through the signup page. The first user can be promoted to admin by updating their role in the database.

## Testing the Application

1. **Create Admin User**: 
   - Sign up with any credentials
   - Update role to ADMIN in MongoDB

2. **Create Coupons**:
   - Login as admin
   - Navigate to Admin dashboard
   - Create test coupons

3. **Test User Flow**:
   - Sign up as regular user
   - View available coupons
   - Apply coupons to test validation logic

## Deployment

### Quick Deployment Guide

This project is configured for easy deployment to:
- **Backend**: Render.com (Java Spring Boot)
- **Frontend**: Netlify.com (React)

### Step 1: Prepare GitHub Repository

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Create GitHub Repository**:
   - Go to GitHub.com
   - Create new repository: `coupon-management`
   - Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/coupon-management.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. **Go to Render.com** and sign up
2. **Create New Web Service**:
   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Environment: `Java`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/coupon-management-0.0.1-SNAPSHOT.jar`

3. **Set Environment Variables**:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coupon_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_URL.netlify.app
SPRING_PROFILES_ACTIVE=production
```

4. **Deploy**: Click "Create Web Service" - Render will automatically deploy

### Step 3: Deploy Frontend to Netlify

1. **Go to Netlify.com** and sign up
2. **Add New Site**:
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables** (if needed):
```
VITE_API_BASE_URL=https://YOUR_BACKEND_URL.onrender.com/api
```

4. **Deploy**: Click "Deploy Site" - Netlify will automatically deploy

### Step 4: Update Configuration

After deployment, update the backend URL in:
- `src/services/api.jsx` (already configured for production)
- Netlify environment variables

### Step 5: Test Deployment

1. **Backend**: Visit `https://YOUR_BACKEND_URL.onrender.com/api/actuator/health`
2. **Frontend**: Visit `https://YOUR_FRONTEND_URL.netlify.app`
3. **Test full flow**: Create user, login, create coupons, apply coupons

### Deployment Scripts

Use the provided scripts for easy deployment:

```bash
# Deploy backend (after Git setup)
./scripts/deploy-backend.sh

# Deploy frontend (requires netlify-cli)
./scripts/deploy-frontend.sh
```

### Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

### Troubleshooting

**Backend Issues:**
- Check Render logs for build errors
- Verify MongoDB connection string
- Check environment variables

**Frontend Issues:**
- Verify API URL is correct
- Check Netlify build logs
- Ensure CORS is properly configured

**Common Issues:**
- CORS errors: Update `CORS_ALLOWED_ORIGINS` in backend
- API connection: Verify frontend API URL matches backend URL
- Build failures: Check dependencies and Node.js version

## Important Business Rules

- Coupon codes must be unique
- Cannot apply expired coupons
- Cannot apply inactive coupons
- Usage cannot exceed maxUsage limit
- Order amount must meet minimum requirements
- Percentage discount maximum is 100%
- Used count increments correctly on successful application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
