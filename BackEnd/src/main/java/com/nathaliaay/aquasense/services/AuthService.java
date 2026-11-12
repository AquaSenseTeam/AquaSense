
package com.nathaliaay.aquasense.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.LoginDTO;
import com.nathaliaay.aquasense.dtos.LoginRespostaDTO;
import com.nathaliaay.aquasense.entities.Usuario;
import com.nathaliaay.aquasense.enums.TipoUsuario;
import com.nathaliaay.aquasense.enums.StatusAprovacao;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;
import com.nathaliaay.aquasense.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            JwtService jwtService,
            BCryptPasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }
    public LoginRespostaDTO login(LoginDTO dados) {

        String email = dados.email().trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha inválidos"
                ));

        boolean senhaCorreta = passwordEncoder.matches(
                dados.senha(),
                usuario.getSenhaHash()
        );

        if (!senhaCorreta) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "E-mail ou senha inválidos"
            );
        }

        // Verifica se a empresa está aprovada
        if (usuario.getTipo() == TipoUsuario.EMPRESA) {

            if (usuario.getEmpresa() == null) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Não foi possível localizar o cadastro da empresa."
                );
            }

            StatusAprovacao status = usuario.getEmpresa().getStatusAprovacao();

            if (status != StatusAprovacao.APROVADA) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        status == StatusAprovacao.PENDENTE
                                ? "Seu cadastro está aguardando aprovação."
                                : "O cadastro da sua empresa foi rejeitado."
                );
            }
        }

        String token = jwtService.gerarToken(
                usuario.getId(),
                usuario.getEmail()
        );

        return new LoginRespostaDTO(
                token,
                "Bearer",
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getTipo()
        );
    }
}
