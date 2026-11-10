package com.nathaliaay.aquasense.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.PreferenciasNotificacaoDTO;
import com.nathaliaay.aquasense.entities.PreferenciaNotificacoes;
import com.nathaliaay.aquasense.entities.Usuario;
import com.nathaliaay.aquasense.repositories.PreferenciaNotificacoesRepository;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;

@Service
public class PreferenciaNotificacoesService {
    private final PreferenciaNotificacoesRepository repository;
    private final UsuarioRepository usuarioRepository;

    public PreferenciaNotificacoesService(PreferenciaNotificacoesRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PreferenciasNotificacaoDTO obter() {
        Integer usuarioId = usuarioIdAutenticado();
        PreferenciaNotificacoes preferencias = repository.findByUsuarioId(usuarioId).orElseGet(() -> criarPadrao(usuarioId));
        return converter(preferencias);
    }

    @Transactional
    public PreferenciasNotificacaoDTO atualizar(PreferenciasNotificacaoDTO dados) {
        Integer usuarioId = usuarioIdAutenticado();
        PreferenciaNotificacoes preferencias = repository.findByUsuarioId(usuarioId).orElseGet(() -> criarPadrao(usuarioId));
        if (dados.receberOcorrencia() != null) {
			preferencias.setReceberOcorrencia(dados.receberOcorrencia());
		}
        if (dados.receberSistema() != null) {
			preferencias.setReceberSistema(dados.receberSistema());
		}
        if (dados.receberDicas() != null) {
			preferencias.setReceberDicas(dados.receberDicas());
		}
        if (dados.receberAlertaConsumo() != null) {
			preferencias.setReceberAlertaConsumo(dados.receberAlertaConsumo());
		}
        return converter(repository.save(preferencias));
    }

    private PreferenciaNotificacoes criarPadrao(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        PreferenciaNotificacoes p = new PreferenciaNotificacoes();
        p.setUsuario(usuario);
        p.setReceberOcorrencia(true);
        p.setReceberSistema(true);
        p.setReceberDicas(true);
        p.setReceberAlertaConsumo(true);
        return repository.save(p);
    }

    private PreferenciasNotificacaoDTO converter(PreferenciaNotificacoes p) {
        return new PreferenciasNotificacaoDTO(Boolean.TRUE.equals(p.getReceberOcorrencia()), Boolean.TRUE.equals(p.getReceberSistema()), Boolean.TRUE.equals(p.getReceberDicas()), Boolean.TRUE.equals(p.getReceberAlertaConsumo()));
    }

    private Integer usuarioIdAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        try { return Integer.valueOf(authentication.getPrincipal().toString()); }
        catch (NumberFormatException ex) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identificação do usuário inválida"); }
    }
}
