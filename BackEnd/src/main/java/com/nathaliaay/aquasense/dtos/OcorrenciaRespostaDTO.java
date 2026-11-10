
package com.nathaliaay.aquasense.dtos;

import java.time.LocalDateTime;

import com.nathaliaay.aquasense.enums.StatusOcorrencia;
import com.nathaliaay.aquasense.enums.TipoOcorrencia;

public record OcorrenciaRespostaDTO(
    Integer id,
    Integer enderecoId,
    Double latitude,
    Double longitude,
    TipoOcorrencia tipo,
    String descricao,
    StatusOcorrencia status,
    LocalDateTime dataRegistro,
    LocalDateTime dataResolucao
) {}
