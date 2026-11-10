package com.nathaliaay.aquasense.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nathaliaay.aquasense.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

	boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    Optional<Usuario> findByEmail(String email);
}
