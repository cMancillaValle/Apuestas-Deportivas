package com.apuestas.billetera.repositories;

import com.apuestas.billetera.entities.Billetera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface BilleteraRepository extends JpaRepository<Billetera, Long> {

    Optional<Billetera> findByUsuarioId(Long usuarioId);

    /**
     * UPDATE Atómico: Actualiza el saldo solo si hay fondos suficientes.
     * Esto previene saldos negativos bajo concurrencia extrema sin necesidad de bloqueos a nivel de tabla.
     * Retorna la cantidad de filas afectadas (1 = éxito, 0 = falló por falta de saldo).
     */
    @Modifying
    @Query("UPDATE Billetera b SET b.saldoReal = b.saldoReal - :monto WHERE b.usuarioId = :usuarioId AND b.saldoReal >= :monto")
    int descontarSaldoAtomicamente(Long usuarioId, BigDecimal monto);
}
