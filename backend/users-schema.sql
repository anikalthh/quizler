drop database if exists quizler;

create database quizler;

use quizler;

create table users (

    userid varchar(128),
    username varchar(128),
    firstname varchar(128),
    lastname varchar(128),
    email varchar(128),
    password varchar(128),

    primary key(userid)
);