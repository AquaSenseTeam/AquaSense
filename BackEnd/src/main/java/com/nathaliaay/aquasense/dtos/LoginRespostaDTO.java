
package com.nathaliaay.aquasense.dtos;

public record LoginRespostaDTO(
    String token,
    String tipo,
    Integer usuarioId,
    String nomeCompleto
) {}
