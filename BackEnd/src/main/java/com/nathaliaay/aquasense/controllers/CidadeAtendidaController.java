
package com.nathaliaay.aquasense.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.CidadeAtendidaCadastroDTO;
import com.nathaliaay.aquasense.dtos.CidadeAtendidaRespostaDTO;
import com.nathaliaay.aquasense.services.CidadeAtendidaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/empresa/cidades")
public class CidadeAtendidaController {

    private final CidadeAtendidaService cidadeService;

    public CidadeAtendidaController(
            CidadeAtendidaService cidadeService) {

        this.cidadeService = cidadeService;
    }

    // Lista as cidades atendidas pela empresa autenticada
    @GetMapping
    public ResponseEntity<List<CidadeAtendidaRespostaDTO>> listar() {

        return ResponseEntity.ok(
                cidadeService.listarMinhasCidades()
        );
    }

    // Adiciona uma cidade à área de atendimento
    @PostMapping
    public ResponseEntity<CidadeAtendidaRespostaDTO> adicionar(
            @Valid @RequestBody CidadeAtendidaCadastroDTO dto) {

        CidadeAtendidaRespostaDTO resposta =
                cidadeService.adicionar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    // Remove uma cidade da área de atendimento
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(
            @PathVariable Integer id) {

        cidadeService.remover(id);

        return ResponseEntity.noContent().build();
    }
}
