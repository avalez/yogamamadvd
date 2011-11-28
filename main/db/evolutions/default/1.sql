# --- First database schema

# --- !Ups

create table user (
  email varchar(255) not null primary key,
  password varchar(255) not null
);

create table product (
  id bigint not null primary key,
  name varchar(255) not null,
);

create sequence product_seq start with 1000;

# --- !Downs

drop table if exists product;
drop sequence if exists product_seq;
drop table if exists user;