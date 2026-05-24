package com.apuestas.billetera.controllers;

import com.apuestas.billetera.dto.DebitoRequest;
import com.apuestas.billetera.entities.Billetera;
import com.apuestas.billetera.services.BilleteraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/billeteras")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BilleteraController {

    private final BilleteraService billeteraService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Billetera> obtenerSaldo(@PathVariable Long usuarioId) {
        Billetera billetera = billeteraService.obtenerPorUsuarioId(usuarioId);
        return ResponseEntity.ok(billetera);
    }

    @PostMapping("/debito")
    public ResponseEntity<Map<String, Object>> solicitarDebito(@RequestBody DebitoRequest request) {
        Map<String, Object> response = billeteraService.procesarDebito(request);
        return ResponseEntity.ok(response);
    }
}
