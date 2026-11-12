
package com.nathaliaay.aquasense.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nathaliaay.aquasense.entities.EmpresaSaneamento;
import com.nathaliaay.aquasense.entities.Usuario;
import com.nathaliaay.aquasense.enums.StatusAprovacao;
import com.nathaliaay.aquasense.enums.TipoUsuario;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UsuarioRepository usuarioRepository) {

        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if (authorization != null && authorization.startsWith("Bearer ")) {

            String token = authorization.substring(7);

            if (jwtService.tokenValido(token)) {

                String usuarioId = jwtService.extrairUsuarioId(token);

                try {
                    Integer id = Integer.valueOf(usuarioId);

                    usuarioRepository.findById(id).ifPresent(usuario -> {

                        // Verifica se o usuário possui um tipo válido
                        if (usuario.getTipo() == null) {
                            return;
                        }

                        // Verifica a aprovação das empresas
                        if (usuario.getTipo() == TipoUsuario.EMPRESA) {

                            EmpresaSaneamento empresa = usuario.getEmpresa();

                            if (empresa == null ||
                                    empresa.getStatusAprovacao() != StatusAprovacao.APROVADA) {
                                return;
                            }
                        }

                        // Define a autoridade do usuário
                        String autoridade = "ROLE_" + usuario.getTipo().name();

                        UsernamePasswordAuthenticationToken autenticacao =
                                new UsernamePasswordAuthenticationToken(
                                        usuario.getId(),
                                        null,
                                        List.of(new SimpleGrantedAuthority(autoridade))
                                );

                        SecurityContextHolder.getContext()
                                .setAuthentication(autenticacao);
                    });

                } catch (NumberFormatException e) {
                    SecurityContextHolder.clearContext();
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
