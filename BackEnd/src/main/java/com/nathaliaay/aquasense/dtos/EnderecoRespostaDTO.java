package com.nathaliaay.aquasense.dtos;

public record EnderecoRespostaDTO(
    Integer id,
    Integer usuarioId,
    String cep,
    String logradouro,
    String numero,
    String complemento,
    String cidade,
    String estado
) {}
