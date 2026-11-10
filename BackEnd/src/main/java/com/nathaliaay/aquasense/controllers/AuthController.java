
package com.nathaliaay.aquasense.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nathaliaay.aquasense.dtos.LoginDTO;
import com.nathaliaay.aquasense.dtos.LoginRespostaDTO;
import com.nathaliaay.aquasense.services.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginRespostaDTO> login(
            @Valid @RequestBody LoginDTO dados) {

        LoginRespostaDTO resposta = authService.login(dados);

        return ResponseEntity.ok(resposta);
    }
}
