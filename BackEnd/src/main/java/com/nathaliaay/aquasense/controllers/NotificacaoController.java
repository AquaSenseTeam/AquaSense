package com.nathaliaay.aquasense.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.NotificacaoRespostaDTO;
import com.nathaliaay.aquasense.services.NotificacaoService;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(
            NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping
    public ResponseEntity<List<NotificacaoRespostaDTO>> listarMinhasNotificacoes() {
        return ResponseEntity.ok(
                notificacaoService.listarMinhasNotificacoes());
    }

    @GetMapping("/nao-lidas")
    public ResponseEntity<List<NotificacaoRespostaDTO>> listarNaoLidas() {
        return ResponseEntity.ok(
                notificacaoService.listarNaoLidas());
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<NotificacaoRespostaDTO> marcarComoLida(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                notificacaoService.marcarComoLida(id));
    }
}