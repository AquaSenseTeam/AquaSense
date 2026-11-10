
package com.nathaliaay.aquasense.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.Endereco;

public interface EnderecoRepository extends JpaRepository<Endereco, Integer> {

    List<Endereco> findByUsuarioId(Integer usuarioId);

    Optional<Endereco> findByIdAndUsuarioId(Integer enderecoId, Integer usuarioId);
}
