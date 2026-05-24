@echo off
title Lanzador UCBet - Apuestas Deportivas
echo =======================================================
echo    Iniciando Arquitectura Distribuida - UCBet
echo =======================================================
echo.

echo [0/4] Cargando variables de entorno desde .env...
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
  set "line=%%A"
  if not "!line:~0,1!"=="#" if not "%%A"=="" (
    set "%%A=%%B"
  )
)
echo Variables cargadas.
echo.

echo [1/4] Levantando Infraestructura (Kafka)...
start "Kafka (Docker)" cmd /c "docker-compose up -d && echo Kafka iniciado. && timeout /t 5"

echo [2/4] Iniciando Microservicio Billetera (Java Spring Boot)...
ping 127.0.0.1 -n 3 > nul
start "Spring Boot (Puerto 8080)" cmd /k "cd billetera-service && mvnw.cmd spring-boot:run -Dspring-boot.run.jvmArguments=""-DDB_HOST=%DB_HOST% -DDB_PORT=%DB_PORT% -DDB_NAME=%DB_NAME% -DDB_USER=%DB_USER% -DDB_PASSWORD=%DB_PASSWORD%"""

echo [3/4] Iniciando Microservicio Apuestas (Node.js)...
ping 127.0.0.1 -n 3 > nul
start "Node.js (Puerto 3000)" cmd /k "npm run dev"

echo [4/4] Iniciando Frontend UI (React + Vite)...
ping 127.0.0.1 -n 3 > nul
start "React Frontend (Puerto 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================
echo ¡Todos los servicios han sido lanzados!
echo.
echo - Frontend React: http://localhost:5173
echo - API Apuestas:   http://localhost:3000/docs
echo - Billetera API:  http://localhost:8080
echo - Kafka UI:       http://localhost:8081
echo =======================================================
echo.
pause
