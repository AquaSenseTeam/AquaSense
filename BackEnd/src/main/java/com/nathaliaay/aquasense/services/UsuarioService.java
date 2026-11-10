package com.nathaliaay.aquasense.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import com.nathaliaay.aquasense.dtos.EnderecoCadastroDTO;
import com.nathaliaay.aquasense.dtos.SenhaAtualizacaoDTO;
import com.nathaliaay.aquasense.dtos.UsuarioAtualizacaoDTO;
import com.nathaliaay.aquasense.dtos.UsuarioCadastroDTO;
import com.nathaliaay.aquasense.dtos.UsuarioRespostaDTO;
import com.nathaliaay.aquasense.entities.Endereco;
import com.nathaliaay.aquasense.entities.PreferenciaNotificacoes;
import com.nathaliaay.aquasense.entities.Usuario;
import com.nathaliaay.aquasense.repositories.EnderecoRepository;
import com.nathaliaay.aquasense.repositories.PreferenciaNotificacoesRepository;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EnderecoRepository enderecoRepository;
    private final PreferenciaNotificacoesRepository preferenciaRepository;
    
    @Value("${aquasense.upload.diretorio:uploads/perfis}")
    private String diretorioUploads;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            EnderecoRepository enderecoRepository,
            PreferenciaNotificacoesRepository preferenciaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
        this.preferenciaRepository = preferenciaRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional
    public UsuarioRespostaDTO cadastrar(UsuarioCadastroDTO dados) {
        String email = dados.email().trim().toLowerCase();
        String cpf = dados.cpf().replaceAll("\\D", "");

        if (usuarioRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado");
        }
        if (usuarioRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este CPF já está cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNomeCompleto(dados.nomeCompleto().trim());
        usuario.setCpf(cpf);
        usuario.setEmail(email);
        usuario.setTelefone(dados.telefone() == null || dados.telefone().isBlank() ? null : dados.telefone().trim());
        usuario.setSenhaHash(passwordEncoder.encode(dados.senha()));
        usuario.setDataCadastro(LocalDateTime.now());
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        EnderecoCadastroDTO dadosEndereco = dados.endereco();
        Endereco endereco = new Endereco();
        endereco.setUsuario(usuarioSalvo);
        endereco.setCep(dadosEndereco.cep().replaceAll("\\D", ""));
        endereco.setLogradouro(dadosEndereco.logradouro().trim());
        endereco.setNumero(dadosEndereco.numero().trim());
        endereco.setComplemento(dadosEndereco.complemento());
        endereco.setCidade(dadosEndereco.cidade().trim());
        endereco.setEstado(dadosEndereco.estado().toUpperCase());
        enderecoRepository.save(endereco);

        PreferenciaNotificacoes preferencias = new PreferenciaNotificacoes();
        preferencias.setUsuario(usuarioSalvo);
        preferencias.setReceberOcorrencia(true);
        preferencias.setReceberSistema(true);
        preferencias.setReceberDicas(true);
        preferencias.setReceberAlertaConsumo(true);
        preferenciaRepository.save(preferencias);

        return converter(usuarioSalvo);
    }

    @Transactional(readOnly = true)
    public UsuarioRespostaDTO obterMeuPerfil() {
        return converter(obterUsuarioAutenticado());
    }

    @Transactional
    public UsuarioRespostaDTO atualizarMeuPerfil(UsuarioAtualizacaoDTO dados) {
        Usuario usuario = obterUsuarioAutenticado();
        usuario.setNomeCompleto(dados.nomeCompleto().trim());
        usuario.setTelefone(dados.telefone() == null || dados.telefone().isBlank() ? null : dados.telefone().trim());
        return converter(usuarioRepository.save(usuario));
    }

    @Transactional
    public void alterarSenha(SenhaAtualizacaoDTO dados) {
        Usuario usuario = obterUsuarioAutenticado();
        if (!passwordEncoder.matches(dados.senhaAtual(), usuario.getSenhaHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha atual está incorreta");
        }
        if (passwordEncoder.matches(dados.novaSenha(), usuario.getSenhaHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A nova senha deve ser diferente da senha atual");
        }
        usuario.setSenhaHash(passwordEncoder.encode(dados.novaSenha()));
        usuarioRepository.save(usuario);
    }

    private Usuario obterUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        try {
            Integer id = Integer.valueOf(authentication.getPrincipal().toString());
            return usuarioRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identificação do usuário inválida");
        }
    }

    private UsuarioRespostaDTO converter(Usuario usuario) {
        return new UsuarioRespostaDTO(usuario.getId(), usuario.getNomeCompleto(), usuario.getCpf(), usuario.getEmail(), usuario.getTelefone(), usuario.getDataCadastro());
    }
    
    @Transactional
    public void salvarFotoPerfil(MultipartFile arquivo) {
        Usuario usuario = obterUsuarioAutenticado();

        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Selecione uma imagem."
            );
        }

        if (arquivo.getSize() > 5 * 1024 * 1024) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "A imagem deve ter no máximo 5 MB."
            );
        }

        String tipo = arquivo.getContentType();

        String extensao;
        if ("image/jpeg".equals(tipo)) {
            extensao = ".jpg";
        } else if ("image/png".equals(tipo)) {
            extensao = ".png";
        } else if ("image/webp".equals(tipo)) {
            extensao = ".webp";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Formato inválido. Envie uma imagem JPG, PNG ou WEBP."
            );
        }

        try {
            Path pasta = Paths.get(diretorioUploads)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(pasta);

            String nomeArquivo = UUID.randomUUID() + extensao;
            Path destino = pasta.resolve(nomeArquivo).normalize();

            if (!destino.startsWith(pasta)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Caminho de arquivo inválido."
                );
            }

            Files.copy(arquivo.getInputStream(), destino);

            usuario.setFotoPerfil(destino.toString());
            usuarioRepository.save(usuario);

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Não foi possível salvar a foto."
            );
        }
    }

    @Transactional(readOnly = true)
    public Path obterCaminhoFotoPerfil() {
        Usuario usuario = obterUsuarioAutenticado();

        if (usuario.getFotoPerfil() == null
                || usuario.getFotoPerfil().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Você ainda não possui foto de perfil."
            );
        }

        Path pasta = Paths.get(diretorioUploads)
                .toAbsolutePath()
                .normalize();

        Path foto = Paths.get(usuario.getFotoPerfil())
                .toAbsolutePath()
                .normalize();

        if (!foto.startsWith(pasta) || !Files.isRegularFile(foto)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Foto de perfil não encontrada."
            );
        }

        return foto;
    }
}
