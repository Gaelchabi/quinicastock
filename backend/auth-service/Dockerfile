FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy all modules
COPY pom.xml .
COPY common-lib ./common-lib
COPY auth-service ./auth-service
COPY tenant-service ./tenant-service
COPY inventory-service ./inventory-service
COPY api-gateway ./api-gateway

# Build all modules with Maven
RUN apk add --no-cache maven && mvn clean package -DskipTests

# Final stage - copy only the auth-service jar
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/auth-service/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]