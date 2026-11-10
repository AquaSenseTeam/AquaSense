
package com.nathaliaay.aquasense.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "preferencia_notificacoes")
public class PreferenciaNotificacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "receber_ocorrencia")
    private Boolean receberOcorrencia;

    @Column(name = "receber_sistema")
    private Boolean receberSistema;

    @Column(name = "receber_dicas")
    private Boolean receberDicas;

    @Column(name = "receber_alerta_consumo")
    private Boolean receberAlertaConsumo;

    public PreferenciaNotificacoes() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Boolean getReceberOcorrencia() {
        return receberOcorrencia;
    }

    public void setReceberOcorrencia(Boolean receberOcorrencia) {
        this.receberOcorrencia = receberOcorrencia;
    }

    public Boolean getReceberSistema() {
        return receberSistema;
    }

    public void setReceberSistema(Boolean receberSistema) {
        this.receberSistema = receberSistema;
    }

    public Boolean getReceberDicas() {
        return receberDicas;
    }

    public void setReceberDicas(Boolean receberDicas) {
        this.receberDicas = receberDicas;
    }

    public Boolean getReceberAlertaConsumo() {
        return receberAlertaConsumo;
    }

    public void setReceberAlertaConsumo(Boolean receberAlertaConsumo) {
        this.receberAlertaConsumo = receberAlertaConsumo;
    }
}
