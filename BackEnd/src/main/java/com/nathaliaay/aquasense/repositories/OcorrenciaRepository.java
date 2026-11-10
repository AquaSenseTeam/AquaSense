
package com.nathaliaay.aquasense.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.Ocorrencia;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Integer> {

    List<Ocorrencia> findByUsuarioIdOrderByDataRegistroDesc(
            Integer usuarioId);

    Optional<Ocorrencia> findByIdAndUsuarioId(
            Integer id,
            Integer usuarioId);
}
