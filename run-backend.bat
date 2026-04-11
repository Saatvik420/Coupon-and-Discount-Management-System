@echo off
echo Starting Backend Spring Boot Application...
cd /d "%~dp0backend"
mvn spring-boot:run
pause
