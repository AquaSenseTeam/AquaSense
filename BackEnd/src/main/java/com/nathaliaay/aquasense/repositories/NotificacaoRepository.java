package com.nathaliaay.aquasense.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.Notificacao;

public interface NotificacaoRepository
        extends JpaRepository<Notificacao, Integer> {

    List<Notificacao> findByUsuarioIdOrderByDataHoraDesc(
            Integer usuarioId);

    List<Notificacao> findByUsuarioIdAndLidaFalseOrderByDataHoraDesc(
            Integer usuarioId);

    Optional<Notificacao> findByIdAndUsuarioId(
            Integer id, Integer usuarioId);
}