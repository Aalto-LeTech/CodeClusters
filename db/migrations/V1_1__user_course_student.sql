CREATE TYPE role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE programming_language AS ENUM ('JAVA');

CREATE TABLE student (
	student_id SERIAL PRIMARY KEY,
	name TEXT NOT NULL CHECK (char_length(name) < 256),
	username TEXT NOT NULL UNIQUE CHECK (char_length(username) < 256)
);

CREATE TABLE app_user (
	user_id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password TEXT NOT NULL CHECK (char_length(password) < 256),
	student_id INTEGER REFERENCES student DEFAULT NULL,
	role role NOT NULL
);

CREATE TABLE course (
	course_id SERIAL PRIMARY KEY,
	name TEXT NOT NULL CHECK (char_length(name) < 256),
	organization TEXT NOT NULL DEFAULT 'Aalto University',
	default_programming_language programming_language NOT NULL
);

CREATE TABLE exercise (
	exercise_id SERIAL PRIMARY KEY,
	course_id INTEGER NOT NULL REFERENCES course ON DELETE CASCADE,
	name TEXT NOT NULL CHECK (char_length(name) < 256),
	programming_language programming_language NOT NULL
);

CREATE TABLE course_students (
	course_id INTEGER NOT NULL REFERENCES course ON DELETE CASCADE,
	student_id INTEGER NOT NULL REFERENCES student ON DELETE CASCADE,
	PRIMARY KEY(course_id, student_id)
);
