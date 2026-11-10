
package com.nathaliaay.aquasense.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.Consumo;

public interface ConsumoRepository
        extends JpaRepository<Consumo, Integer> {

    List<Consumo> findByUsuarioIdOrderByMesReferenciaDesc(
            Integer usuarioId);

    Optional<Consumo> findByIdAndUsuarioId(
            Integer id,
            Integer usuarioId);
}
