FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace
# copy pom first to leverage layer caching for dependencies
COPY pom.xml ./
RUN mvn -B -DskipTests dependency:go-offline

# copy source and build
COPY src ./src
RUN mvn -B -DskipTests package

# Use a minimal runtime image (distroless) for smaller surface and size
FROM gcr.io/distroless/java17-debian11
WORKDIR /app
COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
