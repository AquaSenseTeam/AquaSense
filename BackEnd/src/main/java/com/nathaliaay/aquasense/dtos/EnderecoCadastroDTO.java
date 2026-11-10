
package com.nathaliaay.aquasense.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoCadastroDTO(

    @NotBlank(message = "O CEP é obrigatório")
    @Pattern(regexp = "\\d{8}", message = "O CEP deve conter 8 números")
    String cep,

    @NotBlank(message = "O logradouro é obrigatório")
    @Size(max = 150)
    String logradouro,

    @NotBlank(message = "O número é obrigatório")
    @Size(max = 10)
    String numero,

    @Size(max = 100)
    String complemento,

    @NotBlank(message = "A cidade é obrigatória")
    @Size(max = 100)
    String cidade,

    @NotBlank(message = "O estado é obrigatório")
    @Pattern(regexp = "[A-Za-z]{2}", message = "Informe a sigla do estado")
    String estado

) {}
