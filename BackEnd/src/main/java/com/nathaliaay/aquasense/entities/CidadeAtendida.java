
package com.nathaliaay.aquasense.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "cidades_atendidas",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_cidade_estado",
            columnNames = {"cidade", "estado"}
        )
    }
)
public class CidadeAtendida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String cidade;

    @Column(nullable = false, length = 2)
    private String estado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaSaneamento empresa;

    public CidadeAtendida() {
    }

    public Integer getId() {
        return id;
    }

    public String getCidade() {
        return cidade;
    }

    public String getEstado() {
        return estado;
    }

    public EmpresaSaneamento getEmpresa() {
        return empresa;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setEmpresa(EmpresaSaneamento empresa) {
        this.empresa = empresa;
    }
}
