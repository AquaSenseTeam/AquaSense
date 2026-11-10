package com.nathaliaay.aquasense.dtos;

import java.time.LocalDateTime;

public record NotificacaoRespostaDTO(
    Integer id,
    Integer ocorrenciaId,
    String tipo,
    String titulo,
    String mensagem,
    LocalDateTime dataHora,
    boolean lida
) {}