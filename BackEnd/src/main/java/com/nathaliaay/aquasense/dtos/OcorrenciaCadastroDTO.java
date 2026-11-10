package com.nathaliaay.aquasense.dtos;

import com.nathaliaay.aquasense.enums.TipoOcorrencia;

import jakarta.validation.constraints.Size;

public record OcorrenciaCadastroDTO(
    Integer enderecoId,

    TipoOcorrencia tipo,

    @Size(max = 5000, message = "A descrição deve ter no máximo 5000 caracteres")
    String descricao,

    Double latitude,

    Double longitude
) {}
