
package com.nathaliaay.aquasense.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.ComparacaoConsumoDTO;
import com.nathaliaay.aquasense.dtos.ConsumoCadastroDTO;
import com.nathaliaay.aquasense.dtos.ConsumoRespostaDTO;
import com.nathaliaay.aquasense.entities.Consumo;
import com.nathaliaay.aquasense.entities.Endereco;
import com.nathaliaay.aquasense.entities.Usuario;
import com.nathaliaay.aquasense.repositories.ConsumoRepository;
import com.nathaliaay.aquasense.repositories.EnderecoRepository;
import com.nathaliaay.aquasense.repositories.UsuarioRepository;

@Service
public class ConsumoService {

    private final ConsumoRepository consumoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;

    public ConsumoService(
            ConsumoRepository consumoRepository,
            UsuarioRepository usuarioRepository,
            EnderecoRepository enderecoRepository) {
        this.consumoRepository = consumoRepository;
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
    }

    @Transactional
    public ConsumoRespostaDTO cadastrar(ConsumoCadastroDTO dto) {
        Integer usuarioId = obterUsuarioIdAutenticado();

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));

        Endereco endereco = null;

        if (dto.enderecoId() != null) {
            endereco = enderecoRepository
                    .findByIdAndUsuarioId(dto.enderecoId(), usuarioId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Endereço não encontrado para este usuário"
                    ));
        }

        Consumo consumo = new Consumo();
        consumo.setUsuario(usuario);
        consumo.setEndereco(endereco);
        consumo.setMesReferencia(dto.mesReferencia());
        consumo.setVolumeM3(dto.volumeM3());

        return converter(consumoRepository.save(consumo));
    }

    @Transactional(readOnly = true)
    public List<ConsumoRespostaDTO> listarMeusConsumos() {
        Integer usuarioId = obterUsuarioIdAutenticado();

        return consumoRepository
                .findByUsuarioIdOrderByMesReferenciaDesc(usuarioId)
                .stream()
                .map(this::converter)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConsumoRespostaDTO buscarPorId(Integer id) {
        Integer usuarioId = obterUsuarioIdAutenticado();

        Consumo consumo = consumoRepository
                .findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Consumo não encontrado"
                ));

        return converter(consumo);
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
            return Integer.valueOf(
                    autenticacao.getPrincipal().toString());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Identificação do usuário inválida"
            );
        }
    }

    private ConsumoRespostaDTO converter(Consumo consumo) {
        return new ConsumoRespostaDTO(
                consumo.getId(),
                consumo.getEndereco() != null
                        ? consumo.getEndereco().getId()
                        : null,
                consumo.getMesReferencia(),
                consumo.getVolumeM3()
        );
    }

    @Transactional(readOnly = true)
    public ComparacaoConsumoDTO compararConsumos() {
        Integer usuarioId = obterUsuarioIdAutenticado();

        Map<YearMonth, BigDecimal> consumosPorMes = new TreeMap<>();

        consumoRepository
                .findByUsuarioIdOrderByMesReferenciaDesc(usuarioId)
                .forEach(consumo -> {
                    if (consumo.getMesReferencia() != null) {
                        YearMonth mes = YearMonth.from(
                                consumo.getMesReferencia());

                        consumosPorMes.merge(
                                mes,
                                consumo.getVolumeM3(),
                                BigDecimal::add);
                    }
                });

        if (consumosPorMes.size() < 2) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "São necessários consumos de pelo menos dois meses diferentes"
            );
        }

        var meses = consumosPorMes.keySet().stream()
                .sorted(java.util.Comparator.reverseOrder())
                .limit(2)
                .toList();

        YearMonth mesAtual = meses.get(0);
        YearMonth mesAnterior = meses.get(1);

        BigDecimal volumeAtual = consumosPorMes.get(mesAtual);
        BigDecimal volumeAnterior = consumosPorMes.get(mesAnterior);

        BigDecimal diferenca = volumeAtual.subtract(volumeAnterior);

        BigDecimal variacao = volumeAnterior.signum() == 0
                ? null
                : diferenca.multiply(BigDecimal.valueOf(100))
                        .divide(volumeAnterior, 2, RoundingMode.HALF_UP);

        return new ComparacaoConsumoDTO(
                mesAtual.atDay(1),
                volumeAtual,
                mesAnterior.atDay(1),
                volumeAnterior,
                diferenca,
                variacao
        );
    }


}
