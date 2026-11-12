
package com.nathaliaay.aquasense.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.EmpresaCadastroDTO;
import com.nathaliaay.aquasense.dtos.EmpresaRespostaDTO;
import com.nathaliaay.aquasense.entities.EmpresaSaneamento;
import com.nathaliaay.aquasense.entities.Usuario;
import com.nathaliaay.aquasense.enums.StatusAprovacao;
import com.nathaliaay.aquasense.enums.TipoUsuario;
import com.nathaliaay.aquasense.repositories.EmpresaSaneamentoRepository;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;

@Service
public class EmpresaSaneamentoService {

    private final EmpresaSaneamentoRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public EmpresaSaneamentoService(
            EmpresaSaneamentoRepository empresaRepository,
            UsuarioRepository usuarioRepository,
            BCryptPasswordEncoder passwordEncoder) {

        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public EmpresaRespostaDTO cadastrar(EmpresaCadastroDTO dados) {

        String email = dados.email().trim().toLowerCase();
        String cnpj = dados.cnpj().replaceAll("\\D", "");

        String nome = dados.nome().trim();

        String nomeFantasia = dados.nomeFantasia() == null
                || dados.nomeFantasia().isBlank()
                ? null
                : dados.nomeFantasia().trim();

        String telefone = dados.telefone() == null
                || dados.telefone().isBlank()
                ? null
                : dados.telefone().trim();

        String cidade = dados.cidade().trim();
        String estado = dados.estado().trim().toUpperCase();

        // Verifica se o e-mail já está cadastrado
        if (usuarioRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado."
            );
        }

        // Verifica se o CNPJ já está cadastrado
        if (empresaRepository.existsByCnpj(cnpj)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este CNPJ já está cadastrado."
            );
        }

        // Cria o usuário da empresa
        Usuario usuario = new Usuario();

        usuario.setNomeCompleto(nome);
        usuario.setEmail(email);
        usuario.setTelefone(telefone);
        usuario.setSenhaHash(passwordEncoder.encode(dados.senha()));
        usuario.setDataCadastro(LocalDateTime.now());
        usuario.setTipo(TipoUsuario.EMPRESA);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // Cria o cadastro da empresa
        EmpresaSaneamento empresa = new EmpresaSaneamento();

        empresa.setNome(nome);
        empresa.setNomeFantasia(nomeFantasia);
        empresa.setCnpj(cnpj);
        empresa.setEmail(email);
        empresa.setTelefone(telefone);
        empresa.setCidade(cidade);
        empresa.setEstado(estado);
        empresa.setStatusAprovacao(StatusAprovacao.PENDENTE);

        // Vincula a empresa ao usuário
        empresa.setUsuario(usuarioSalvo);
        usuarioSalvo.setEmpresa(empresa);

        EmpresaSaneamento empresaSalva =
                empresaRepository.save(empresa);

        // Retorna os dados do cadastro
        return new EmpresaRespostaDTO(
                empresaSalva.getId(),
                empresaSalva.getNome(),
                empresaSalva.getCnpj(),
                empresaSalva.getEmail(),
                empresaSalva.getStatusAprovacao()
        );
    }
    
    @Transactional(readOnly = true)
    public List<EmpresaRespostaDTO> listarPendentes() {

        return empresaRepository
                .findByStatusAprovacao(StatusAprovacao.PENDENTE)
                .stream()
                .map(empresa -> new EmpresaRespostaDTO(
                        empresa.getId(),
                        empresa.getNome(),
                        empresa.getCnpj(),
                        empresa.getEmail(),
                        empresa.getStatusAprovacao()
                ))
                .toList();
    }

    @Transactional
    public EmpresaRespostaDTO aprovar(Integer id) {

        EmpresaSaneamento empresa = buscarEmpresaPendente(id);

        empresa.setStatusAprovacao(StatusAprovacao.APROVADA);

        EmpresaSaneamento salva = empresaRepository.save(empresa);

        return converterParaResposta(salva);
    }

    @Transactional
    public EmpresaRespostaDTO rejeitar(Integer id) {

        EmpresaSaneamento empresa = buscarEmpresaPendente(id);

        empresa.setStatusAprovacao(StatusAprovacao.REJEITADA);

        EmpresaSaneamento salva = empresaRepository.save(empresa);

        return converterParaResposta(salva);
    }

    private EmpresaSaneamento buscarEmpresaPendente(Integer id) {

        EmpresaSaneamento empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Empresa não encontrada."
                ));

        if (empresa.getStatusAprovacao() != StatusAprovacao.PENDENTE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esta empresa já foi analisada."
            );
        }

        return empresa;
    }

    private EmpresaRespostaDTO converterParaResposta(
            EmpresaSaneamento empresa) {

        return new EmpresaRespostaDTO(
                empresa.getId(),
                empresa.getNome(),
                empresa.getCnpj(),
                empresa.getEmail(),
                empresa.getStatusAprovacao()
        );
    }
    

	@Transactional(readOnly = true)
	public List<EmpresaRespostaDTO> listarTodas() {
	    return empresaRepository.findAll()
	        .stream()
	        .map(this::converterParaResposta)
	        .toList();
	}

}
