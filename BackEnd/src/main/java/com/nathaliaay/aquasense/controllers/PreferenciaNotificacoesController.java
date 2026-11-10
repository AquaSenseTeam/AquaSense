package com.nathaliaay.aquasense.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.PreferenciasNotificacaoDTO;
import com.nathaliaay.aquasense.services.PreferenciaNotificacoesService;

@RestController
@RequestMapping("/api/preferencias")
public class PreferenciaNotificacoesController {
    private final PreferenciaNotificacoesService service;
    public PreferenciaNotificacoesController(PreferenciaNotificacoesService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<PreferenciasNotificacaoDTO> obter() { return ResponseEntity.ok(service.obter()); }
    @PatchMapping
    public ResponseEntity<PreferenciasNotificacaoDTO> atualizar(@RequestBody PreferenciasNotificacaoDTO dados) { return ResponseEntity.ok(service.atualizar(dados)); }
}
