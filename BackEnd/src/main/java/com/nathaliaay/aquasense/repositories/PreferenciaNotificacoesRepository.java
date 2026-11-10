
package com.nathaliaay.aquasense.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.PreferenciaNotificacoes;

public interface PreferenciaNotificacoesRepository
        extends JpaRepository<PreferenciaNotificacoes, Integer> {

    Optional<PreferenciaNotificacoes> findByUsuarioId(Integer usuarioId);
}
