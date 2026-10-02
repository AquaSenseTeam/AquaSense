create database if not exists aquasense_db;
use aquasense_db;

create table usuarios (
	id integer auto_increment primary key,
	nome_completo varchar(150) not null,
	cpf varchar(11) not null,
	email varchar(255) not null,
	telefone varchar(20),
	senha_hash varchar(255),
	data_cadastro timestamp
);

create table enderecos (
	id integer auto_increment primary key,
    usuario_id integer not null,
    cep varchar(8) not null,
    logradouro varchar(150) not null,
    numero varchar(10) not null,
    complemento varchar(100),
    cidade varchar(100) not null,
    estado varchar(2) not null,
    foreign key(usuario_id) references usuarios(id)
);

create table consumos (
	id integer auto_increment primary key,
    usuario_id integer not null,
    endereco_id integer,
    mes_referencia date,
    volume_m3 decimal(10,2) not null
);

create table empresas_saneamento (
	id integer auto_increment primary key,
    nome varchar(150) not null,
    email varchar(150)
);

create table ocorrencias (
	id integer auto_increment primary key,
    usuario_id integer not null,
    endereco_id integer not null, 
    empresa_id integer,
    tipo varchar(30) not null,
    descricao text,
    status varchar(20) not null,
    data_registro timestamp,
    data_resolucao timestamp,
    foreign key (usuario_id) references usuarios(id),
    foreign key (endereco_id) references enderecos(id),
    foreign key (empresa_id) references empresas_saneamento(id)
);

create table notificacoes (
	id integer auto_increment primary key,
    usuario_id integer not null,
    ocorrencia_id integer, 
    tipo varchar(20) not null,
    titulo varchar(100) not null,
    mensagem text,
    data_hora timestamp,
    lida boolean
);

create table preferencia_notificacoes (
	id integer auto_increment primary key,
    usuario_id integer not null,
    receber_ocorrencia boolean,
    receber_sistema boolean,
    receber_dicas boolean,
    receber_alerta_consumo boolean
);

create table dicas (
	id integer auto_increment primary key,
    titulo varchar(100) not null,
    descricao text
);