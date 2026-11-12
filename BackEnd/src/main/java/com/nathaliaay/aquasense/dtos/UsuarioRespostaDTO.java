package com.nathaliaay.aquasense.dtos;

import java.time.LocalDateTime;
import com.nathaliaay.aquasense.enums.TipoUsuario;

public record UsuarioRespostaDTO(
    Integer id,
    String nomeCompleto,
    String cpf,
    String email,
    String telefone,
    LocalDateTime dataCadastro,
    TipoUsuario tipo
) {}