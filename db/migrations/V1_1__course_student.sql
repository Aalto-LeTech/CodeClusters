
CREATE TABLE course (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	organization TEXT NOT NULL DEFAULT 'Aalto University'
);

CREATE TABLE exercise (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE student (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	username TEXT NOT NULL UNIQUE
);

CREATE TABLE course_students (
	course_id INTEGER NOT NULL REFERENCES course ON DELETE CASCADE,
	student_id INTEGER NOT NULL REFERENCES student ON DELETE CASCADE,
	PRIMARY KEY(course_id, student_id)
);
