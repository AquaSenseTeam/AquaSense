
package com.nathaliaay.aquasense.dtos;

import com.nathaliaay.aquasense.enums.TipoUsuario;

public record LoginRespostaDTO(
    String token,
    String tipo,
    Integer usuarioId,
    String nomeCompleto,
    TipoUsuario tipoUsuario
) {}
