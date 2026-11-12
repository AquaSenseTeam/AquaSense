
package com.nathaliaay.aquasense.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CidadeAtendidaCadastroDTO(

    @NotBlank(message = "A cidade é obrigatória.")
    @Size(max = 100, message = "A cidade deve ter no máximo 100 caracteres.")
    String cidade,

    @NotBlank(message = "O estado é obrigatório.")
    @Size(min = 2, max = 2, message = "Informe a sigla do estado.")
    String estado

) {}
