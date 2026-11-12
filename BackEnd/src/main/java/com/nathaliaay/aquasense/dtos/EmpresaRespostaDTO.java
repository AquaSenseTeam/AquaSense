
package com.nathaliaay.aquasense.dtos;

import com.nathaliaay.aquasense.enums.StatusAprovacao;

public record EmpresaRespostaDTO(
    Integer id,
    String nome,
    String cnpj,
    String email,
    StatusAprovacao statusAprovacao
) {}
