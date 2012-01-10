# --- First database schema

# --- !Ups

create table user (
  firstname varchar(64) not null,
  lastname varchar(64) not null,
  email varchar(64) not null primary key,
  password varchar(64) not null
);

create table address (
  id bigint not null primary key auto_increment,
  user_email varchar(64) not null,
  company varchar(64),
  address_1 varchar(64) not null,
  address_2 varchar(64),
  city varchar(64) not null,
  postcode varchar(64) not null,
  zone varchar(64) not null,
  country varchar(64) not null,
  country_code varchar(64) not null,

  foreign key(user_email) references user(email) on delete cascade
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
drop table if exists gateway;
drop table if exists address;
drop table if exists user;