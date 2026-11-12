package com.nathaliaay.aquasense.entities;

import java.time.LocalDateTime;

import com.nathaliaay.aquasense.enums.TipoUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome_completo", nullable = false, length = 150)
    private String nomeCompleto;

    @Column(length = 11)
    private String cpf;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(name = "senha_hash", length = 255)
    private String senhaHash;

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;
    
    @Column(name = "foto_perfil", length = 500)
    private String fotoPerfil;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoUsuario tipo;

    @OneToOne(mappedBy = "usuario")
    private EmpresaSaneamento empresa;
    
    public Usuario() {
    }

    public Integer getId() {
        return id;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

	public String getFotoPerfil() {
		return fotoPerfil;
	}

	public void setFotoPerfil(String fotoPerfil) {
		this.fotoPerfil = fotoPerfil;
	}
    
	public TipoUsuario getTipo() {
	    return tipo;
	}

	public void setTipo(TipoUsuario tipo) {
	    this.tipo = tipo;
	}
    
	public EmpresaSaneamento getEmpresa() {
	    return empresa;
	}

	public void setEmpresa(EmpresaSaneamento empresa) {
	    this.empresa = empresa;
	}
}