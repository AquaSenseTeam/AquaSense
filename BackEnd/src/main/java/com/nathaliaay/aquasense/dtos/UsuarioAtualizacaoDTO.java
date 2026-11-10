package com.nathaliaay.aquasense.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioAtualizacaoDTO(
    @NotBlank(message = "O nome completo é obrigatório")
    @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
    String nomeCompleto,

    @Pattern(regexp = "^$|^[0-9()+.\\- ]{8,20}$", message = "O telefone informado é inválido")
    String telefone
) {}
