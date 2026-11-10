package com.nathaliaay.aquasense.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.EnderecoCadastroDTO;
import com.nathaliaay.aquasense.dtos.EnderecoRespostaDTO;
import com.nathaliaay.aquasense.entities.Endereco;
import com.nathaliaay.aquasense.entities.Usuario;
import com.nathaliaay.aquasense.repositories.EnderecoRepository;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;

@Service
public class EnderecoService {
    private final EnderecoRepository enderecoRepository;
    private final UsuarioRepository usuarioRepository;

    public EnderecoService(EnderecoRepository enderecoRepository, UsuarioRepository usuarioRepository) {
        this.enderecoRepository = enderecoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<EnderecoRespostaDTO> listarMeusEnderecos() {
        Integer usuarioId = usuarioIdAutenticado();
        return enderecoRepository.findByUsuarioId(usuarioId).stream().map(this::converter).toList();
    }

    @Transactional
    public EnderecoRespostaDTO criar(EnderecoCadastroDTO dto) {
        Integer usuarioId = usuarioIdAutenticado();
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Endereco endereco = new Endereco();
        endereco.setUsuario(usuario);
        aplicarDados(endereco, dto);
        return converter(enderecoRepository.save(endereco));
    }

    @Transactional
    public EnderecoRespostaDTO atualizar(Integer id, EnderecoCadastroDTO dto) {
        Integer usuarioId = usuarioIdAutenticado();
        Endereco endereco = enderecoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Endereço não encontrado"));
        aplicarDados(endereco, dto);
        return converter(enderecoRepository.save(endereco));
    }

    @Transactional
    public java.util.Map<String, Boolean> remover(Integer id) {
        Integer usuarioId = usuarioIdAutenticado();
        Endereco endereco = enderecoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Endereço não encontrado"));
        try {
            enderecoRepository.delete(endereco);
            enderecoRepository.flush();
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este endereço está vinculado a registros existentes e não pode ser removido", ex);
        }
        return java.util.Map.of("ok", true);
    }

    private void aplicarDados(Endereco endereco, EnderecoCadastroDTO dto) {
        endereco.setCep(dto.cep().replaceAll("\\D", ""));
        endereco.setLogradouro(dto.logradouro().trim());
        endereco.setNumero(dto.numero().trim());
        endereco.setComplemento(dto.complemento() == null || dto.complemento().isBlank() ? null : dto.complemento().trim());
        endereco.setCidade(dto.cidade().trim());
        endereco.setEstado(dto.estado().toUpperCase());
    }

    private EnderecoRespostaDTO converter(Endereco endereco) {
        return new EnderecoRespostaDTO(endereco.getId(), endereco.getUsuario().getId(), endereco.getCep(), endereco.getLogradouro(), endereco.getNumero(), endereco.getComplemento(), endereco.getCidade(), endereco.getEstado());
    }

    private Integer usuarioIdAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        try {
            return Integer.valueOf(authentication.getPrincipal().toString());
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identificação do usuário inválida");
        }
    }
}
