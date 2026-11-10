package com.nathaliaay.aquasense.dtos;

import com.nathaliaay.aquasense.enums.StatusOcorrencia;

import jakarta.validation.constraints.NotNull;

public record AtualizacaoStatusOcorrenciaDTO(
    @NotNull(message = "O status é obrigatório")
    StatusOcorrencia status
) {}