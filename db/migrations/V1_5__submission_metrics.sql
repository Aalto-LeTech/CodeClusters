CREATE TABLE available_programming_language_facets (
	programming_language programming_language NOT NULL,
	tokens TEXT[] NOT NULL DEFAULT array[]::TEXT[],
	metrics TEXT[] NOT NULL DEFAULT array[]::TEXT[]
);
