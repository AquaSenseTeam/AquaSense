package com.nathaliaay.aquasense.entities;

import java.util.ArrayList;

import com.nathaliaay.aquasense.enums.StatusAprovacao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import jakarta.persistence.CascadeType;

@Entity
@Table(name = "empresas_saneamento")
public class EmpresaSaneamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "nome_fantasia", length = 150)
    private String nomeFantasia;

    @Column(nullable = false, unique = true, length = 14)
    private String cnpj;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(length = 100)
    private String cidade;

    @Column(length = 2)
    private String estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_aprovacao", nullable = false, length = 20)
    private StatusAprovacao statusAprovacao = StatusAprovacao.PENDENTE;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @OneToMany(
            mappedBy = "empresa",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CidadeAtendida> cidadesAtendidas = new ArrayList<>();

    public EmpresaSaneamento() {
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public String getCnpj() {
        return cnpj;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getCidade() {
        return cidade;
    }

    public String getEstado() {
        return estado;
    }

    public StatusAprovacao getStatusAprovacao() {
        return statusAprovacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setStatusAprovacao(StatusAprovacao statusAprovacao) {
        this.statusAprovacao = statusAprovacao;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<CidadeAtendida> getCidadesAtendidas() {
        return cidadesAtendidas;
    }

    public void setCidadesAtendidas(List<CidadeAtendida> cidadesAtendidas) {
        this.cidadesAtendidas = cidadesAtendidas;
    }
}
