package com.nathaliaay.aquasense.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.AtualizacaoOcorrenciaDTO;
import com.nathaliaay.aquasense.dtos.AtualizacaoStatusOcorrenciaDTO;
import com.nathaliaay.aquasense.dtos.OcorrenciaCadastroDTO;
import com.nathaliaay.aquasense.dtos.OcorrenciaRespostaDTO;
import com.nathaliaay.aquasense.entities.Endereco;
import com.nathaliaay.aquasense.entities.Ocorrencia;
import com.nathaliaay.aquasense.enums.StatusOcorrencia;
import com.nathaliaay.aquasense.repositories.EnderecoRepository;
import com.nathaliaay.aquasense.repositories.OcorrenciaRepository;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;
import com.nathaliaay.aquasense.entities.Usuario;


@Service
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;
    private final EnderecoRepository enderecoRepository;
    private final UsuarioRepository usuarioRepository;
    
    public OcorrenciaService(
            OcorrenciaRepository ocorrenciaRepository,
            EnderecoRepository enderecoRepository, 
            UsuarioRepository usuarioRepository) {
        this.ocorrenciaRepository = ocorrenciaRepository;
        this.enderecoRepository = enderecoRepository;
        this.usuarioRepository = usuarioRepository;
    }


	@Transactional
	public OcorrenciaRespostaDTO cadastrar(OcorrenciaCadastroDTO dto) {
	    Integer usuarioId = obterUsuarioIdAutenticado();
	
	    if (dto.tipo() == null) {
	        throw new ResponseStatusException(
	                HttpStatus.BAD_REQUEST,
	                "O tipo da ocorrência é obrigatório"
	        );
	    }
	
	    boolean temEndereco = dto.enderecoId() != null;
	    boolean temLatitude = dto.latitude() != null;
	    boolean temLongitude = dto.longitude() != null;
	
	    if (temEndereco == (temLatitude && temLongitude)) {
	        throw new ResponseStatusException(
	                HttpStatus.BAD_REQUEST,
	                "Informe um endereço cadastrado ou a localização atual"
	        );
	    }
	
	    if (temLatitude != temLongitude) {
	        throw new ResponseStatusException(
	                HttpStatus.BAD_REQUEST,
	                "Latitude e longitude devem ser informadas juntas"
	        );
	    }
	
	    Endereco endereco = null;
	
	    if (temEndereco) {
	        endereco = enderecoRepository
	                .findByIdAndUsuarioId(dto.enderecoId(), usuarioId)
	                .orElseThrow(() -> new ResponseStatusException(
	                        HttpStatus.NOT_FOUND,
	                        "Endereço não encontrado para este usuário"
	                ));
	    }
	
	    if (temLatitude && (dto.latitude() < -90 || dto.latitude() > 90)) {
	        throw new ResponseStatusException(
	                HttpStatus.BAD_REQUEST,
	                "Latitude inválida"
	        );
	    }
	
	    if (temLongitude && (dto.longitude() < -180 || dto.longitude() > 180)) {
	        throw new ResponseStatusException(
	                HttpStatus.BAD_REQUEST,
	                "Longitude inválida"
	        );
	    }
	
	    Ocorrencia ocorrencia = new Ocorrencia();
	
	    ocorrencia.setUsuario(
	            endereco != null
	                    ? endereco.getUsuario()
	                    : buscarUsuarioAutenticado(usuarioId)
	    );
	
	    ocorrencia.setEndereco(endereco);
	    ocorrencia.setLatitude(dto.latitude());
	    ocorrencia.setLongitude(dto.longitude());
	    ocorrencia.setTipo(dto.tipo());
	    ocorrencia.setDescricao(dto.descricao());
	    ocorrencia.setStatus(StatusOcorrencia.PENDENTE);
	    ocorrencia.setDataRegistro(LocalDateTime.now());
	
	    Ocorrencia salva = ocorrenciaRepository.save(ocorrencia);
	
	    return new OcorrenciaRespostaDTO(
	            salva.getId(),
	            salva.getEndereco() != null ? salva.getEndereco().getId() : null,
	            salva.getLatitude(),
	            salva.getLongitude(),
	            salva.getTipo(),
	            salva.getDescricao(),
	            salva.getStatus(),
	            salva.getDataRegistro(),
	            salva.getDataResolucao()
	    );
	}


    private Integer obterUsuarioIdAutenticado() {
        Authentication autenticacao =
                SecurityContextHolder.getContext().getAuthentication();

        if (autenticacao == null || !autenticacao.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado"
            );
        }

        try {
            return Integer.valueOf(autenticacao.getPrincipal().toString());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identificação do usuário inválida"
            );
        }
    }

    @Transactional(readOnly = true)
    public List<OcorrenciaRespostaDTO> listarMinhasOcorrencias() {
        Integer usuarioId = obterUsuarioIdAutenticado();

        return ocorrenciaRepository
                .findByUsuarioIdOrderByDataRegistroDesc(usuarioId)
                .stream()
                .map(ocorrencia -> new OcorrenciaRespostaDTO(
                        ocorrencia.getId(),
                        ocorrencia.getEndereco() != null
                        ? ocorrencia.getEndereco().getId()
                        : null,
                        ocorrencia.getLatitude(),
                        ocorrencia.getLongitude(),
                        ocorrencia.getTipo(),
                        ocorrencia.getDescricao(),
                        ocorrencia.getStatus(),
                        ocorrencia.getDataRegistro(),
                        ocorrencia.getDataResolucao()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OcorrenciaRespostaDTO buscarPorId(Integer id) {
        Integer usuarioId = obterUsuarioIdAutenticado();

        Ocorrencia ocorrencia = ocorrenciaRepository
                .findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ocorrência não encontrada"
                ));

        return new OcorrenciaRespostaDTO(
                ocorrencia.getId(),
                ocorrencia.getEndereco() != null
                        ? ocorrencia.getEndereco().getId()
                        : null,
                ocorrencia.getLatitude(),
                ocorrencia.getLongitude(),
                ocorrencia.getTipo(),
                ocorrencia.getDescricao(),
                ocorrencia.getStatus(),
                ocorrencia.getDataRegistro(),
                ocorrencia.getDataResolucao()
        );
    }

    @Transactional
    public OcorrenciaRespostaDTO atualizarStatus(
            Integer id,
            AtualizacaoStatusOcorrenciaDTO dto) {

        Integer usuarioId = obterUsuarioIdAutenticado();

        Ocorrencia ocorrencia = ocorrenciaRepository
                .findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ocorrência não encontrada"
                ));

        if (dto.status() != StatusOcorrencia.CANCELADA) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "O usuário pode apenas cancelar a própria ocorrência"
            );
        }

        if (ocorrencia.getStatus() == StatusOcorrencia.CANCELADA
                || ocorrencia.getStatus() == StatusOcorrencia.RESOLVIDA) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esta ocorrência não pode mais ser cancelada"
            );
        }

        ocorrencia.setStatus(StatusOcorrencia.CANCELADA);

        Ocorrencia atualizada = ocorrenciaRepository.save(ocorrencia);

        return new OcorrenciaRespostaDTO(
                atualizada.getId(),
                atualizada.getEndereco() != null
                        ? atualizada.getEndereco().getId()
                                : null,
                atualizada.getLatitude(),
                atualizada.getLongitude(),
                atualizada.getTipo(),
                atualizada.getDescricao(),
                atualizada.getStatus(),
                atualizada.getDataRegistro(),
                atualizada.getDataResolucao()
        );
    }

    @Transactional
    public OcorrenciaRespostaDTO atualizar(
            Integer id,
            AtualizacaoOcorrenciaDTO dto) {

        Integer usuarioId = obterUsuarioIdAutenticado();

        Ocorrencia ocorrencia = ocorrenciaRepository
                .findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ocorrência não encontrada"
                ));

        if (ocorrencia.getStatus() != StatusOcorrencia.PENDENTE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Só é possível editar ocorrências pendentes"
            );
        }

        if (dto.tipo() == null && dto.descricao() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe ao menos um campo para atualizar"
            );
        }

        if (dto.tipo() != null) {
            ocorrencia.setTipo(dto.tipo());
        }

        if (dto.descricao() != null) {
            ocorrencia.setDescricao(dto.descricao());
        }

        Ocorrencia atualizada = ocorrenciaRepository.save(ocorrencia);

        return new OcorrenciaRespostaDTO(
                atualizada.getId(),
                atualizada.getEndereco()  != null
                        ? atualizada.getEndereco().getId()
                                : null,
                atualizada.getLatitude(),
                atualizada.getLongitude(),
                atualizada.getTipo(),
                atualizada.getDescricao(),
                atualizada.getStatus(),
                atualizada.getDataRegistro(),
                atualizada.getDataResolucao()
        );
    }
    
    private Usuario buscarUsuarioAutenticado(Integer usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário autenticado não encontrado"
                ));
    }
}