
package com.nathaliaay.aquasense.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.ComparacaoConsumoDTO;
import com.nathaliaay.aquasense.dtos.ConsumoCadastroDTO;
import com.nathaliaay.aquasense.dtos.ConsumoRespostaDTO;
import com.nathaliaay.aquasense.services.ConsumoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/consumos")
public class ConsumoController {

    private final ConsumoService consumoService;

    public ConsumoController(ConsumoService consumoService) {
        this.consumoService = consumoService;
    }

    @PostMapping
    public ResponseEntity<ConsumoRespostaDTO> cadastrar(
            @Valid @RequestBody ConsumoCadastroDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(consumoService.cadastrar(dto));
    }

    @GetMapping
    public ResponseEntity<List<ConsumoRespostaDTO>> listarMeusConsumos() {
        return ResponseEntity.ok(
                consumoService.listarMeusConsumos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsumoRespostaDTO> buscarPorId(
            @PathVariable Integer id) {
        return ResponseEntity.ok(
                consumoService.buscarPorId(id));
    }

    @GetMapping("/analise")
    public ResponseEntity<ComparacaoConsumoDTO> compararConsumos() {
        return ResponseEntity.ok(consumoService.compararConsumos());
    }
}
