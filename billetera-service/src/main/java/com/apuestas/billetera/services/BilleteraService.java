package com.apuestas.billetera.services;

import com.apuestas.billetera.dto.DebitoRequest;
import com.apuestas.billetera.entities.Billetera;
import com.apuestas.billetera.entities.Transaccion;
import com.apuestas.billetera.exceptions.BilleteraNotFoundException;
import com.apuestas.billetera.exceptions.SaldoInsuficienteException;
import com.apuestas.billetera.repositories.BilleteraRepository;
import com.apuestas.billetera.repositories.TransaccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BilleteraService {

    private final BilleteraRepository billeteraRepository;
    private final TransaccionRepository transaccionRepository;

    public Billetera obtenerPorUsuarioId(Long usuarioId) {
        return billeteraRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new BilleteraNotFoundException("No se encontró billetera para el usuario " + usuarioId));
    }

    /**
     * Procesa un débito garantizando consistencia mediante un UPDATE atómico.
     */
    @Transactional
    public Map<String, Object> procesarDebito(DebitoRequest request) {
        Billetera billetera = obtenerPorUsuarioId(request.getUsuarioId());

        // Intento de descuento atómico
        int filasAfectadas = billeteraRepository.descontarSaldoAtomicamente(request.getUsuarioId(), request.getMonto());

        if (filasAfectadas == 0) {
            throw new SaldoInsuficienteException("Saldo insuficiente o concurrencia extrema impidió el débito.");
        }

        // Si tuvo éxito, registramos la transacción.
        // Volvemos a consultar la billetera para tener el saldo_nuevo real (o lo calculamos lógicamente).
        BigDecimal saldoAnterior = billetera.getSaldoReal();
        BigDecimal saldoNuevo = saldoAnterior.subtract(request.getMonto());

        Transaccion tx = new Transaccion();
        tx.setBilleteraId(billetera.getId());
        tx.setTipo("APUESTA");
        tx.setMonto(request.getMonto());
        
        transaccionRepository.save(tx);

        Map<String, Object> response = new HashMap<>();
        response.put("transaccion_id", tx.getId());
        response.put("nuevo_saldo", saldoNuevo);

        return response;
    }
}
