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

import com.nathaliaay.aquasense.dtos.DicaCadastroDTO;
import com.nathaliaay.aquasense.entities.Dica;
import com.nathaliaay.aquasense.services.DicaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/dicas")
public class DicaController {

    private final DicaService dicaService;

    public DicaController(DicaService dicaService) {
        this.dicaService = dicaService;
    }

    @GetMapping
    public ResponseEntity<List<Dica>> listarTodas() {
        return ResponseEntity.ok(dicaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dica> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(dicaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Dica> cadastrar(
            @Valid @RequestBody DicaCadastroDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(dicaService.cadastrar(dto));
    }
}