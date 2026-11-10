package com.nathaliaay.aquasense.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record ConsumoCadastroDTO(
    Integer enderecoId,
    LocalDate mesReferencia,

    @NotNull(message = "O volume consumido é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "O volume deve ser maior que zero")
    BigDecimal volumeM3
) {}