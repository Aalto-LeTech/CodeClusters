CREATE TABLE submission (
	submission_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	course_id INTEGER NOT NULL REFERENCES course,
	exercise_id INTEGER NOT NULL REFERENCES exercise,
	student_id INTEGER NOT NULL REFERENCES student,
	code TEXT NOT NULL,
	timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE review_status AS ENUM ('PENDING', 'SENT');

CREATE TABLE review (
	review_id SERIAL PRIMARY KEY,
	message TEXT NOT NULL,
	metadata TEXT NOT NULL,
	status review_status NOT NULL DEFAULT 'PENDING',
	tags TEXT[] NOT NULL DEFAULT array[]::TEXT[],
	timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE review_submissions (
	review_id INTEGER NOT NULL REFERENCES review ON DELETE CASCADE,
	submission_id uuid NOT NULL REFERENCES submission ON DELETE CASCADE,
	selection INTEGER[2] DEFAULT NULL,
	PRIMARY KEY(review_id, submission_id)
);
