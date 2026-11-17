
package com.nathaliaay.aquasense.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.Ocorrencia;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Integer> {

    List<Ocorrencia> findByUsuarioIdOrderByDataRegistroDesc(Integer usuarioId);

    Optional<Ocorrencia> findByIdAndUsuarioId(Integer id, Integer usuarioId);

    List<Ocorrencia> findByEnderecoCidadeIgnoreCaseAndEnderecoEstadoIgnoreCaseOrderByDataRegistroDesc(
            String cidade,
            String estado);

    Optional<Ocorrencia> findByIdAndEmpresaId(Integer id, Integer empresaId);

    List<Ocorrencia> findByEmpresaIdOrderByDataRegistroDesc(Integer empresaId);
}
