package com.nathaliaay.aquasense.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.EnderecoCadastroDTO;
import com.nathaliaay.aquasense.dtos.EnderecoRespostaDTO;
import com.nathaliaay.aquasense.services.EnderecoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {
    private final EnderecoService enderecoService;
    public EnderecoController(EnderecoService enderecoService) { this.enderecoService = enderecoService; }

    @GetMapping
    public ResponseEntity<List<EnderecoRespostaDTO>> listar() { return ResponseEntity.ok(enderecoService.listarMeusEnderecos()); }

    @PostMapping
    public ResponseEntity<EnderecoRespostaDTO> criar(@Valid @RequestBody EnderecoCadastroDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enderecoService.criar(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EnderecoRespostaDTO> atualizar(@PathVariable Integer id, @Valid @RequestBody EnderecoCadastroDTO dto) {
        return ResponseEntity.ok(enderecoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<java.util.Map<String, Boolean>> remover(@PathVariable Integer id) {
        return ResponseEntity.ok(enderecoService.remover(id));
    }
}
