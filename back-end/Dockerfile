FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Install dependencies and build the Spring Boot application
COPY pom.xml .
COPY src ./src
RUN mvn -ntp -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
