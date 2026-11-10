package com.nathaliaay.aquasense.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.nathaliaay.aquasense.dtos.DicaCadastroDTO;
import com.nathaliaay.aquasense.entities.Dica;
import com.nathaliaay.aquasense.repositories.DicaRepository;

@Service
public class DicaService {

    private final DicaRepository dicaRepository;

    public DicaService(DicaRepository dicaRepository) {
        this.dicaRepository = dicaRepository;
    }

    public List<Dica> listarTodas() {
        return dicaRepository.findAll();
    }

    public Dica buscarPorId(Integer id) {
        return dicaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Dica não encontrada"
                ));
    }

    public Dica cadastrar(DicaCadastroDTO dto) {
        Dica dica = new Dica();
        dica.setTitulo(dto.titulo());
        dica.setDescricao(dto.descricao());

        return dicaRepository.save(dica);
    }
}