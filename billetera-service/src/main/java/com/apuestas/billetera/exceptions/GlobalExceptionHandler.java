package com.apuestas.billetera.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SaldoInsuficienteException.class)
    public ResponseEntity<Map<String, String>> handleSaldoInsuficiente(SaldoInsuficienteException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("detail", ex.getMessage());
        error.put("code", "SALDO_INSUFICIENTE");
        return new ResponseEntity<>(error, HttpStatus.CONFLICT); // 409
    }

    @ExceptionHandler(BilleteraNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleBilleteraNotFound(BilleteraNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("detail", ex.getMessage());
        error.put("code", "BILLETERA_NO_ENCONTRADA");
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND); // 404
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("detail", ex.toString() + " - " + ex.getMessage());
        error.put("code", "INTERNAL_ERROR");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR); // 500
    }
}
