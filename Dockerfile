FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy Maven wrapper and pom.xml from backend directory
COPY backend/mvnw backend/mvnw.cmd ./
COPY backend/.mvn ./.mvn
COPY backend/pom.xml ./

# Make Maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code from backend directory
COPY backend/src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port (Render will set PORT)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/coupon-management-0.0.1-SNAPSHOT.jar"]
