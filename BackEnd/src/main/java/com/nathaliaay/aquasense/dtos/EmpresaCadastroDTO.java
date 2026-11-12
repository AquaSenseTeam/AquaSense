
package com.nathaliaay.aquasense.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EmpresaCadastroDTO(

    @NotBlank
    @Size(max = 150)
    String nome,

    @Size(max = 150)
    String nomeFantasia,

    @NotBlank
    @Pattern(regexp = "\\d{14}", message = "O CNPJ deve conter 14 números")
    String cnpj,

    @NotBlank
    @Email
    @Size(max = 255)
    String email,

    @Pattern(regexp = "^$|^[0-9()+.\\- ]{8,20}$")
    String telefone,

    @NotBlank
    @Size(max = 100)
    String cidade,

    @NotBlank
    @Pattern(regexp = "(?i)[a-z]{2}", message = "Informe uma UF válida")
    String estado,

    @NotBlank
    @Size(min = 8, max = 72)
    String senha

) {}
