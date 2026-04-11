FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw mvnw.cmd .mvn ./
COPY pom.xml ./

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port (Render will set PORT)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/coupon-management-0.0.1-SNAPSHOT.jar"]
