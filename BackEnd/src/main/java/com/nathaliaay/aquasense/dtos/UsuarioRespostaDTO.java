package com.nathaliaay.aquasense.dtos;

import java.time.LocalDateTime;

public record UsuarioRespostaDTO(
    Integer id,
    String nomeCompleto,
    String cpf,
    String email,
    String telefone,
    LocalDateTime dataCadastro
) {}
