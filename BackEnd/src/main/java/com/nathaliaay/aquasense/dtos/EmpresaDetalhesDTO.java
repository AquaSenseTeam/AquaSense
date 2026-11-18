
package com.nathaliaay.aquasense.dtos;

import com.nathaliaay.aquasense.enums.StatusAprovacao;

public record EmpresaDetalhesDTO(
    Integer id,
    String nome,
    String nomeFantasia,
    String cnpj,
    String email,
    String telefone,
    String cidade,
    String estado,
    StatusAprovacao statusAprovacao
) {}
