package com.apuestas.billetera.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DebitoRequest {
    private Long usuarioId;
    private BigDecimal monto;
    private Long apuestaId;
    private String descripcion;
}
