CREATE TABLE submission (
	id SERIAL PRIMARY KEY,
	course_id INTEGER NOT NULL REFERENCES course,
	exercise_id INTEGER NOT NULL REFERENCES exercise,
	student_id INTEGER NOT NULL REFERENCES student,
	code TEXT NOT NULL,
	timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE report (
	id SERIAL PRIMARY KEY,
	submission_id INTEGER NOT NULL REFERENCES submission,
	message TEXT NOT NULL
);