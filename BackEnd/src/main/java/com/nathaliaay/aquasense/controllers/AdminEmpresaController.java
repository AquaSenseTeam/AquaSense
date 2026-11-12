package com.nathaliaay.aquasense.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.EmpresaRespostaDTO;
import com.nathaliaay.aquasense.services.EmpresaSaneamentoService;

@RestController
@RequestMapping("/api/admin/empresas")
public class AdminEmpresaController {

    private final EmpresaSaneamentoService empresaService;

    public AdminEmpresaController(
            EmpresaSaneamentoService empresaService) {
        this.empresaService = empresaService;
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<EmpresaRespostaDTO>> listarPendentes() {

        return ResponseEntity.ok(
                empresaService.listarPendentes()
        );
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<EmpresaRespostaDTO> aprovar(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                empresaService.aprovar(id)
        );
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<EmpresaRespostaDTO> rejeitar(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                empresaService.rejeitar(id)
        );
    }
    
    @GetMapping
	public ResponseEntity<List<EmpresaRespostaDTO>> listarTodas() {
	    return ResponseEntity.ok(empresaService.listarTodas());
	}

}