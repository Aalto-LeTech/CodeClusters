CREATE TABLE review_flow (
	review_flow_id SERIAL PRIMARY KEY,
	course_id INTEGER REFERENCES course ON DELETE CASCADE DEFAULT NULL,
	exercise_id INTEGER REFERENCES exercise ON DELETE CASCADE DEFAULT NULL,
	user_id INTEGER REFERENCES app_user ON DELETE CASCADE DEFAULT NULL,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	tags TEXT[] NOT NULL DEFAULT array[]::TEXT[]
);

CREATE TYPE review_flow_step_action AS ENUM ('Search', 'Model', 'Review');

CREATE TABLE review_flow_step (
	review_flow_id INTEGER NOT NULL REFERENCES review_flow ON DELETE CASCADE,
	index INTEGER NOT NULL,
	action review_flow_step_action NOT NULL,
	data JSONB NOT NULL,
	PRIMARY KEY(review_flow_id, index)
);
