
package com.nathaliaay.aquasense.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.EmpresaCadastroDTO;
import com.nathaliaay.aquasense.dtos.EmpresaRespostaDTO;
import com.nathaliaay.aquasense.services.EmpresaSaneamentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaSaneamentoController {

    private final EmpresaSaneamentoService empresaService;

    public EmpresaSaneamentoController(
            EmpresaSaneamentoService empresaService) {
        this.empresaService = empresaService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<EmpresaRespostaDTO> cadastrar(
            @Valid @RequestBody EmpresaCadastroDTO dados) {

        EmpresaRespostaDTO resposta = empresaService.cadastrar(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

	
}
