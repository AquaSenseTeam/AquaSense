package com.nathaliaay.aquasense.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ConsumoRespostaDTO(
    Integer id,
    Integer enderecoId,
    LocalDate mesReferencia,
    BigDecimal volumeM3
) {}