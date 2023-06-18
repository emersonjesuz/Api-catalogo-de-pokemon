
create database catalogo_pokemons

create table usuarios ( 
    id serial primary key,
    nome text not null, 
    email text unique not null ,
    senha text not null
    )

create table pokemons (
  id integer primary key, 
  usuario_id integer references usuarios(id),
  nome text not null,
  habilidades text not null,
  imagem text,
  apelido text
  )
