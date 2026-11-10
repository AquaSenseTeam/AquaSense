package com.nathaliaay.aquasense.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.AtualizacaoOcorrenciaDTO;
import com.nathaliaay.aquasense.dtos.AtualizacaoStatusOcorrenciaDTO;
import com.nathaliaay.aquasense.dtos.OcorrenciaCadastroDTO;
import com.nathaliaay.aquasense.dtos.OcorrenciaRespostaDTO;
import com.nathaliaay.aquasense.services.OcorrenciaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ocorrencias")
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;

    public OcorrenciaController(OcorrenciaService ocorrenciaService) {
        this.ocorrenciaService = ocorrenciaService;
    }

    @PostMapping
    public ResponseEntity<OcorrenciaRespostaDTO> cadastrar(
            @Valid @RequestBody OcorrenciaCadastroDTO dto) {

        OcorrenciaRespostaDTO resposta =
                ocorrenciaService.cadastrar(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    public ResponseEntity<List<OcorrenciaRespostaDTO>> listarMinhasOcorrencias() {
        List<OcorrenciaRespostaDTO> ocorrencias =
                ocorrenciaService.listarMinhasOcorrencias();

        return ResponseEntity.ok(ocorrencias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcorrenciaRespostaDTO> buscarPorId(
            @PathVariable Integer id) {

        OcorrenciaRespostaDTO ocorrencia =
                ocorrenciaService.buscarPorId(id);

        return ResponseEntity.ok(ocorrencia);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OcorrenciaRespostaDTO> atualizarStatus(
            @PathVariable Integer id,
            @Valid @RequestBody AtualizacaoStatusOcorrenciaDTO dto) {

        OcorrenciaRespostaDTO resposta =
                ocorrenciaService.atualizarStatus(id, dto);

        return ResponseEntity.ok(resposta);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<OcorrenciaRespostaDTO> atualizar(
            @PathVariable Integer id,
            @Valid @RequestBody AtualizacaoOcorrenciaDTO dto) {

        OcorrenciaRespostaDTO resposta =
                ocorrenciaService.atualizar(id, dto);

        return ResponseEntity.ok(resposta);
    }
}