package com.apuestas.billetera.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "BILLETERA")
@Data
@NoArgsConstructor
public class Billetera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false, unique = true)
    private Long usuarioId;

    @Column(name = "saldo_real", nullable = false, precision = 15, scale = 2)
    private BigDecimal saldoReal;

}
