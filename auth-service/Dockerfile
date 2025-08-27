FROM maven:3.9.5-eclipse-temurin-21 AS builder

WORKDIR /opt/build

COPY . .

RUN ./mvnw dependency:resolve
RUN ./mvnw -U clean install -Dmaven.test.skip=true

FROM ubuntu/jre:21-24.04_stable

WORKDIR /opt/app

COPY --from=builder /opt/build/target/auth-service*.jar /opt/app/auth-service.jar 

CMD [ "exec", "java", "-Xmx256M","-Dspring.profiles.active=default","-jar", "/opt/app/auth-service.jar" ]
