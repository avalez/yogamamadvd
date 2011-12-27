# --- First database schema

# --- !Ups

create table user (
  email varchar(64) not null primary key,
  password varchar(64) not null
);

create table gateway (
  name varchar(32) not null primary key,
  categories varchar(64) not null
);

create table product (
  id bigint not null primary key auto_increment,
  name varchar(64) not null,
  thumb varchar(64) not null,
  description varchar(1024) not null,
  price double not null
);

create sequence product_seq start with 1000;

# --- !Downs

drop table if exists product;
drop sequence if exists product_seq;
drop table if exists user;