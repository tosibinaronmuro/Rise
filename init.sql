-- Create the risecloud database
-- CREATE DATABASE risecloudd;

-- Switch to the new database
\c risecloudd;

-- Create users table
CREATE TABLE users (
    id bigserial PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    publicKey VARCHAR(255)
);

-- Create admin table
CREATE TABLE admin (
    id bigserial PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    publicKey VARCHAR(255)
);

-- Create the uploads table
CREATE TABLE uploads (
    id bigserial PRIMARY KEY,
    userid VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filelink VARCHAR(255) NOT NULL
);

-- Create a history table
CREATE TABLE history (
    email character varying(255) NOT NULL,
    id bigserial NOT NULL,
    fullname character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    date date,
    "timestamp" character varying,
    filelink character varying,
    PRIMARY KEY (id)
);
