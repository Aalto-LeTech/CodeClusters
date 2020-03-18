CREATE TABLE submission (
	submission_id SERIAL PRIMARY KEY,
	course_id INTEGER NOT NULL REFERENCES course,
	exercise_id INTEGER NOT NULL REFERENCES exercise,
	student_id INTEGER NOT NULL REFERENCES student,
	code TEXT NOT NULL,
	timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE review (
	review_id SERIAL PRIMARY KEY,
	message TEXT NOT NULL,
	metadata TEXT NOT NULL,
	timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE review_submissions (
	review_id INTEGER NOT NULL REFERENCES review ON DELETE CASCADE,
	submission_id INTEGER NOT NULL REFERENCES submission ON DELETE CASCADE,
	selection INTEGER[3] DEFAULT NULL,
	PRIMARY KEY(review_id, submission_id)
);
