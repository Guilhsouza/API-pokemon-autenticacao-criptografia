create database catalogo_pokemon
 
create table usuarios (
  id serial primary key,
  nome varchar(100) not null,
  email text not null unique,
  senha text not null
	);
  
create table pokemons (
  	id serial primary key,
    usuario_id integer references usuarios(id),
    nome varchar(100) not null,
    habilidades varchar(50) not null,
    imagem bytea,
    apelido text
  );

alter table pokemons 
alter column imagem type text;