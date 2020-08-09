CREATE TABLE programming_language_facets (
	programming_language programming_language NOT NULL,
	tokens TEXT[] NOT NULL DEFAULT array[]::TEXT[],
	metrics TEXT[] NOT NULL DEFAULT array[]::TEXT[]
);

INSERT INTO programming_language_facets(programming_language, tokens, metrics)
VALUES ('JAVA', array['Symbolic names', 'Rare symbolic names'],
  array['LinesOfCode', 'JavaNCSS_file', 'JavaNCSS_class', 'JavaNCSS_method', 'CyclomaticComplexity', 'NPathComplexity',
    'ClassDataAbstractionCoupling', 'ClassFanOutComplexity', 'BooleanExpressionComplexity']
);
