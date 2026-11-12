
package com.nathaliaay.aquasense.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.CidadeAtendida;

public interface CidadeAtendidaRepository
        extends JpaRepository<CidadeAtendida, Integer> {

    List<CidadeAtendida> findByEmpresaId(Integer empresaId);

    Optional<CidadeAtendida> findByCidadeIgnoreCaseAndEstadoIgnoreCase(
            String cidade,
            String estado
    );

    Optional<CidadeAtendida> findByIdAndEmpresaId(
            Integer id,
            Integer empresaId
    );

    boolean existsByCidadeIgnoreCaseAndEstadoIgnoreCase(
            String cidade,
            String estado
    );
}
