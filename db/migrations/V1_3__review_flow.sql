CREATE TABLE review_flow (
	review_flow_id SERIAL PRIMARY KEY,
	course_id INTEGER REFERENCES course ON DELETE CASCADE DEFAULT NULL,
	exercise_id INTEGER REFERENCES exercise ON DELETE CASCADE DEFAULT NULL,
	user_id INTEGER REFERENCES app_user ON DELETE CASCADE DEFAULT NULL,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	public BOOLEAN DEFAULT FALSE,
	tags TEXT[] NOT NULL DEFAULT array[]::TEXT[]
);

CREATE TABLE review_flow_step (
	review_flow_step_id SERIAL PRIMARY KEY,
	index INTEGER NOT NULL,
	action TEXT NOT NULL,
	parameters TEXT NOT NULL
);

CREATE TABLE review_flow_steps (
	review_flow_id INTEGER NOT NULL REFERENCES review_flow ON DELETE CASCADE,
	review_flow_step_id INTEGER NOT NULL REFERENCES review_flow_step ON DELETE CASCADE,
	PRIMARY KEY(review_flow_id, review_flow_step_id)
);
