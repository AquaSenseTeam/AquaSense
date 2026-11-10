package com.nathaliaay.aquasense.controllers;

import org.springframework.http.HttpStatus;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.SenhaAtualizacaoDTO;
import com.nathaliaay.aquasense.dtos.UsuarioAtualizacaoDTO;
import com.nathaliaay.aquasense.dtos.UsuarioCadastroDTO;
import com.nathaliaay.aquasense.dtos.UsuarioRespostaDTO;
import com.nathaliaay.aquasense.services.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioRespostaDTO> cadastrar(@Valid @RequestBody UsuarioCadastroDTO dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.cadastrar(dados));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioRespostaDTO> obterMeuPerfil() {
        return ResponseEntity.ok(usuarioService.obterMeuPerfil());
    }

    @PatchMapping("/me")
    public ResponseEntity<UsuarioRespostaDTO> atualizarMeuPerfil(@Valid @RequestBody UsuarioAtualizacaoDTO dados) {
        return ResponseEntity.ok(usuarioService.atualizarMeuPerfil(dados));
    }

    @PatchMapping("/me/senha")
    public ResponseEntity<?> alterarSenha(@Valid @RequestBody SenhaAtualizacaoDTO dados) {
        usuarioService.alterarSenha(dados);
        return ResponseEntity.ok(java.util.Map.of("ok", true));
    }
    
    @PostMapping(
    	    value = "/me/foto",
    	    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    	)
    	public ResponseEntity<?> enviarFotoPerfil(
    	        @RequestParam("foto") MultipartFile foto) {

    	    usuarioService.salvarFotoPerfil(foto);

    	    return ResponseEntity.ok(
    	            java.util.Map.of("mensagem", "Foto de perfil atualizada.")
    	    );
    	}

    	@GetMapping(
    	    value = "/me/foto",
    	    produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    	)
    	public ResponseEntity<byte[]> obterFotoPerfil() throws IOException {
    	    Path caminho = usuarioService.obterCaminhoFotoPerfil();

    	    String tipo = Files.probeContentType(caminho);
    	    MediaType mediaType = MediaType.parseMediaType(
    	            tipo != null && tipo.startsWith("image/")
    	                    ? tipo
    	                    : MediaType.APPLICATION_OCTET_STREAM_VALUE
    	    );

    	    return ResponseEntity.ok()
    	            .contentType(mediaType)
    	            .body(Files.readAllBytes(caminho));
    	}
}
