package com.nathaliaay.aquasense.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.NotificacaoRespostaDTO;
import com.nathaliaay.aquasense.entities.Notificacao;
import com.nathaliaay.aquasense.entities.Ocorrencia;
import com.nathaliaay.aquasense.entities.Usuario;
import com.nathaliaay.aquasense.repositories.NotificacaoRepository;
import com.nathaliaay.aquasense.repositories.OcorrenciaRepository;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;

@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final OcorrenciaRepository ocorrenciaRepository;

    public NotificacaoService(
            NotificacaoRepository notificacaoRepository,
            UsuarioRepository usuarioRepository,
            OcorrenciaRepository ocorrenciaRepository) {

        this.notificacaoRepository = notificacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.ocorrenciaRepository = ocorrenciaRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificacaoRespostaDTO> listarMinhasNotificacoes() {
        Integer usuarioId = obterUsuarioIdAutenticado();

        return notificacaoRepository
                .findByUsuarioIdOrderByDataHoraDesc(usuarioId)
                .stream()
                .map(this::converter)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificacaoRespostaDTO> listarNaoLidas() {
        Integer usuarioId = obterUsuarioIdAutenticado();

        return notificacaoRepository
                .findByUsuarioIdAndLidaFalseOrderByDataHoraDesc(usuarioId)
                .stream()
                .map(this::converter)
                .toList();
    }

    @Transactional
    public NotificacaoRespostaDTO marcarComoLida(Integer id) {
        Integer usuarioId = obterUsuarioIdAutenticado();

        Notificacao notificacao = notificacaoRepository
                .findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notificação não encontrada"
                ));

        notificacao.setLida(true);

        return converter(notificacaoRepository.save(notificacao));
    }

    @Transactional
    public Notificacao criarNotificacao(
            Integer usuarioId,
            Integer ocorrenciaId,
            String tipo,
            String titulo,
            String mensagem) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));

        Ocorrencia ocorrencia = null;

        if (ocorrenciaId != null) {
            ocorrencia = ocorrenciaRepository
                    .findByIdAndUsuarioId(ocorrenciaId, usuarioId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Ocorrência não encontrada para este usuário"
                    ));
        }

        if (tipo == null || tipo.isBlank() || tipo.length() > 20) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O tipo deve ter entre 1 e 20 caracteres"
            );
        }

        if (titulo == null || titulo.isBlank() || titulo.length() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O título deve ter entre 1 e 100 caracteres"
            );
        }

        Notificacao notificacao = new Notificacao();
        notificacao.setUsuario(usuario);
        notificacao.setOcorrencia(ocorrencia);
        notificacao.setTipo(tipo);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setDataHora(LocalDateTime.now());
        notificacao.setLida(false);

        return notificacaoRepository.save(notificacao);
    }

    private NotificacaoRespostaDTO converter(Notificacao notificacao) {
        Integer ocorrenciaId = notificacao.getOcorrencia() == null
                ? null
                : notificacao.getOcorrencia().getId();

        return new NotificacaoRespostaDTO(
                notificacao.getId(),
                ocorrenciaId,
                notificacao.getTipo(),
                notificacao.getTitulo(),
                notificacao.getMensagem(),
                notificacao.getDataHora(),
                notificacao.isLida()
        );
    }

    private Integer obterUsuarioIdAutenticado() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado"
            );
        }

        try {
            return Integer.parseInt(
                    authentication.getPrincipal().toString());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identificação do usuário inválida"
            );
        }
    }
}