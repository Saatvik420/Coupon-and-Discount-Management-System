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

### Backend Deployment (Render/Railway)
1. Connect your Git repository
2. Set environment variables for MongoDB connection
3. Deploy with Maven build command

### Frontend Deployment (Vercel/Netlify)
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

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
