
package com.nathaliaay.aquasense.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.CidadeAtendidaCadastroDTO;
import com.nathaliaay.aquasense.dtos.CidadeAtendidaRespostaDTO;
import com.nathaliaay.aquasense.entities.CidadeAtendida;
import com.nathaliaay.aquasense.entities.EmpresaSaneamento;
import com.nathaliaay.aquasense.repositories.CidadeAtendidaRepository;
import com.nathaliaay.aquasense.repositories.EmpresaSaneamentoRepository;

@Service
public class CidadeAtendidaService {

    private final CidadeAtendidaRepository cidadeRepository;
    private final EmpresaSaneamentoRepository empresaRepository;

    public CidadeAtendidaService(
            CidadeAtendidaRepository cidadeRepository,
            EmpresaSaneamentoRepository empresaRepository) {

        this.cidadeRepository = cidadeRepository;
        this.empresaRepository = empresaRepository;
    }

    // Lista as cidades da empresa autenticada
    @Transactional(readOnly = true)
    public List<CidadeAtendidaRespostaDTO> listarMinhasCidades() {

        Integer usuarioId = obterUsuarioIdAutenticado();

        EmpresaSaneamento empresa = buscarEmpresaDoUsuario(usuarioId);

        return cidadeRepository.findByEmpresaId(empresa.getId())
                .stream()
                .map(this::converterParaResposta)
                .toList();
    }

    // Adiciona uma cidade à área de atendimento da empresa
    @Transactional
    public CidadeAtendidaRespostaDTO adicionar(
            CidadeAtendidaCadastroDTO dto) {

        Integer usuarioId = obterUsuarioIdAutenticado();

        EmpresaSaneamento empresa = buscarEmpresaDoUsuario(usuarioId);

        String cidade = dto.cidade().trim();
        String estado = dto.estado().trim().toUpperCase();

        // Verifica se a cidade já pertence a alguma empresa
        if (cidadeRepository
                .existsByCidadeIgnoreCaseAndEstadoIgnoreCase(
                        cidade,
                        estado)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esta cidade já possui uma empresa responsável."
            );
        }

        CidadeAtendida novaCidade = new CidadeAtendida();

        novaCidade.setCidade(cidade);
        novaCidade.setEstado(estado);
        novaCidade.setEmpresa(empresa);

        CidadeAtendida salva = cidadeRepository.save(novaCidade);

        return converterParaResposta(salva);
    }

    // Remove uma cidade pertencente à empresa autenticada
    @Transactional
    public void remover(Integer cidadeId) {

        Integer usuarioId = obterUsuarioIdAutenticado();

        EmpresaSaneamento empresa = buscarEmpresaDoUsuario(usuarioId);

        CidadeAtendida cidade = cidadeRepository
                .findByIdAndEmpresaId(cidadeId, empresa.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cidade não encontrada na área de atendimento da empresa."
                ));

        cidadeRepository.delete(cidade);
    }

    // Busca a empresa vinculada ao usuário autenticado
    private EmpresaSaneamento buscarEmpresaDoUsuario(Integer usuarioId) {

        return empresaRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Empresa vinculada ao usuário não encontrada."
                ));
    }

    // Recupera o ID do usuário pelo token autenticado
    private Integer obterUsuarioIdAutenticado() {

        Authentication autenticacao =
                SecurityContextHolder.getContext().getAuthentication();

        if (autenticacao == null || !autenticacao.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado."
            );
        }

        try {
            return Integer.valueOf(
                    autenticacao.getPrincipal().toString()
            );

        } catch (NumberFormatException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identificação do usuário inválida."
            );
        }
    }

    // Converte a entidade para o DTO de resposta
    private CidadeAtendidaRespostaDTO converterParaResposta(
            CidadeAtendida cidade) {

        return new CidadeAtendidaRespostaDTO(
                cidade.getId(),
                cidade.getCidade(),
                cidade.getEstado()
        );
    }
}
