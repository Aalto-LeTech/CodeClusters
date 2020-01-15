CREATE TYPE privileges AS ENUM ('ADMIN', 'USER');

CREATE TABLE app_user (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password TEXT NOT NULL,
	privileges privileges NOT NULL
);
