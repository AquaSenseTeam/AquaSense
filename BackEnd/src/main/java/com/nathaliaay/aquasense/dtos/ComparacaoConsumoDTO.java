package com.nathaliaay.aquasense.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ComparacaoConsumoDTO(
    LocalDate mesAtual,
    BigDecimal volumeAtual,
    LocalDate mesAnterior,
    BigDecimal volumeAnterior,
    BigDecimal diferencaM3,
    BigDecimal variacaoPercentual
) {}