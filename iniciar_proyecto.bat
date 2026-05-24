@echo off
title Lanzador UCBet - Apuestas Deportivas
echo =======================================================
echo    Iniciando Arquitectura Distribuida - UCBet
echo =======================================================
echo.

echo [0/4] Cargando variables de entorno desde .env...
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
  if not "%%A"=="" if not "%%A:~0,1%"=="#" (
    set "%%A=%%B"
  )
)
echo Variables cargadas correctamente.
echo.

echo [1/4] Levantando Infraestructura (Kafka)...
start "Kafka (Docker)" cmd /c "docker-compose up -d && echo Kafka e interfaz grafica iniciados con exito. && timeout /t 5"

echo [2/4] Iniciando Microservicio Billetera (Java Spring Boot)...
:: Usamos ping como un pequeño retraso para asegurar que Kafka empiece a despertar
ping 127.0.0.1 -n 3 > nul
start "Spring Boot (Puerto 8080)" cmd /k "cd billetera-service && mvnw.cmd spring-boot:run"

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
