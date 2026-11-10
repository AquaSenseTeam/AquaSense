package com.nathaliaay.aquasense.dtos;

public record PreferenciasNotificacaoDTO(
    Boolean receberOcorrencia,
    Boolean receberSistema,
    Boolean receberDicas,
    Boolean receberAlertaConsumo
) {}
