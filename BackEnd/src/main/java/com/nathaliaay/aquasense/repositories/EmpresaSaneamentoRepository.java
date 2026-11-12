package com.nathaliaay.aquasense.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.EmpresaSaneamento;
import com.nathaliaay.aquasense.enums.StatusAprovacao;

public interface EmpresaSaneamentoRepository
        extends JpaRepository<EmpresaSaneamento, Integer> {

    boolean existsByCnpj(String cnpj);

    List<EmpresaSaneamento> findByStatusAprovacao(
            StatusAprovacao statusAprovacao
    );
}