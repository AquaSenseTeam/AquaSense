
package com.nathaliaay.aquasense.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioCadastroDTO(

    @NotBlank(message = "O nome completo é obrigatório")
    @Size(max = 150)
    String nomeCompleto,

    @NotBlank(message = "O CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "O CPF deve conter 11 números")
    String cpf,

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Informe um e-mail válido")
    @Size(max = 255)
    String email,

    @Pattern(regexp = "^$|^[0-9()+.\\- ]{8,20}$",
             message = "O telefone informado é inválido")
    String telefone,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, max = 72)
    String senha,

    @NotNull(message = "O endereço é obrigatório")
    @Valid
    EnderecoCadastroDTO endereco

) {}
