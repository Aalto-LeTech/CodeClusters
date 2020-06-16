INSERT INTO student (name, username) VALUES ('Morty', 'morty');
INSERT INTO student (name, username) VALUES ('Linus Torvals', 'linus');

INSERT INTO app_user (name, email, password, role) VALUES ('Admin', 'admin@asdf.fi', 'asdfasdf', 'ADMIN');
INSERT INTO app_user (name, email, password, role) VALUES ('Mestari Tikku', 'tikku@asdf.fi', 'asdfasdf', 'TEACHER');
INSERT INTO app_user (name, email, password, role, student_id)
  VALUES ('Morty', 'morty@asdf.fi', 'asdfasdf', 'STUDENT', 1);
INSERT INTO app_user (name, email, password, role, student_id)
  VALUES ('Linus Torvals', 'linus@asdf.fi', 'asdfasdf', 'STUDENT', 2);

INSERT INTO course (name) VALUES ('Ohjelmoinnin Perusteet');
INSERT INTO course (name) VALUES ('mooc-2017-ohjelmointi');

INSERT INTO exercise (course_id, name) VALUES (1, '1. Hello World');
INSERT INTO exercise (course_id, name) VALUES (1, '2. Joulukuusi');
INSERT INTO exercise (course_id, name) VALUES (1, '3. Matopeli');
INSERT INTO exercise (course_id, name) VALUES (2, 'osa02-Osa02_16.MarsinLampotilanKeskiarvo');

INSERT INTO course_students (course_id, student_id) VALUES (1, 1);
INSERT INTO course_students (course_id, student_id) VALUES (1, 2);
INSERT INTO course_students (course_id, student_id) VALUES (2, 1);
INSERT INTO course_students (course_id, student_id) VALUES (2, 2);

INSERT INTO submission (course_id, exercise_id, student_id, code) VALUES (1, 1, 1,
'#include <stdio.h>
void main() {
  printf(''Hello There'');
}');
INSERT INTO submission (course_id, exercise_id, student_id, code) VALUES (1, 1, 2,
'#include <stdio.h>
int main() {
  printf(''Hello There'');
  return 0;
}');

INSERT INTO review (message, metadata, tags, status)
VALUES ('Tarkista funktion tyyppi.', 'Hah', array['personal'], 'SENT');
INSERT INTO review (message, metadata, tags, status)
VALUES ('Tarkista tulostus!', 'Höh', array['personal'], 'SENT');

INSERT INTO review_submissions (review_id, submission_id, selection)
VALUES (1, (SELECT submission_id FROM submission WHERE student_id = 1), array[1, 32, 72]);
INSERT INTO review_submissions (review_id, submission_id, selection)
VALUES (2, (SELECT submission_id FROM submission WHERE student_id = 1), array[2, 72, 136]);
INSERT INTO review_submissions (review_id, submission_id, selection)
VALUES (2, (SELECT submission_id FROM submission WHERE student_id = 2), array[2, 71, 135]);

INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, public, tags)
VALUES (2, 4, 1, 'Too lengthy code',
'Generic evaluation of code based on its length. In this exercise the optimal solution shouldn''t be much longer than the model answer (150).',
TRUE, array['length', 'static']);
INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, public, tags)
VALUES (null, null, 2, 'High cyclomatic complexity',
'Generic evaluation of code cyclomatic complexity. In general score of higher than 20 is regarded as hard to test, and especially in a programming course students should strive for simplistic code.',
TRUE, array['cyclomatic', 'complexity', 'static']);
INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, public, tags)
VALUES (null, null, 2, 'Hurr durr', 'Morty, you are an idiot.', FALSE, array['morty']);

INSERT INTO review_flow_step (index, action, parameters)
VALUES (1, 'Search', 'q=*&code_length>250');
INSERT INTO review_flow_step (index, action, parameters)
VALUES (2, 'Review', 'Your solution shouldn''t be much longer than the model solution (150).');

INSERT INTO review_flow_step (index, action, parameters)
VALUES (1, 'Search', 'q=*&cyclomatic>20');
INSERT INTO review_flow_step (index, action, parameters)
VALUES (2, 'Review', 'Your submission has the cyclomatic complexity of over 20. Please see the material to see how it can be reduced to reasonable level 1-19.');

INSERT INTO review_flow_step (index, action, parameters)
VALUES (1, 'Search', 'q=*&student_ids=[1]');
INSERT INTO review_flow_step (index, action, parameters)
VALUES (2, 'Model', 'model_id=ngram&ngrams=[6,6]');
INSERT INTO review_flow_step (index, action, parameters)
VALUES (3, 'Review', 'You are a moron Morty. You have the brains of a catfish with a down syndrome.');

INSERT INTO review_flow_steps (review_flow_id, review_flow_step_id) VALUES (1, 1);
INSERT INTO review_flow_steps (review_flow_id, review_flow_step_id) VALUES (1, 2);
INSERT INTO review_flow_steps (review_flow_id, review_flow_step_id) VALUES (2, 3);
INSERT INTO review_flow_steps (review_flow_id, review_flow_step_id) VALUES (2, 4);
INSERT INTO review_flow_steps (review_flow_id, review_flow_step_id) VALUES (3, 5);
INSERT INTO review_flow_steps (review_flow_id, review_flow_step_id) VALUES (3, 6);
INSERT INTO review_flow_steps (review_flow_id, review_flow_step_id) VALUES (3, 7);

INSERT INTO model (model_id, title, description)
VALUES ('ngram', 'N-gram',
'Generic N-gram model, commonly used in NLP. Used also in program code similarity detection.

The submissions are parsed according to the chosen tokenset. The "modified" set are manually chosen keywords and statements, with control flow structure embedded in them with eg separate "IF {" and "} IF" tokens.

The "complete" tokenset is the full available language keywords, statements and expressions, as provided by the parser. The resulting clusters might be somewhat noisy compared to the "modified" set.

The "keyword" set are only the keywords of the language, with the non-descriptive tokens such as whitespace and brackets removed. Examples are "CLASS" or "DECIMAL_LITERAL". Full description of the all the tokensets can be found from the modeling repository''s source code.

From these tokens n-grams are generated. With a lower n, more of the lower-level features are captured, and with a higher n, the higher-level structures. You can select a range of used n-grams eg [1,5] which uses all 5 n-grams from 1 to 5, and combines their features into one. In general, a range of 3-6 is preferable, 1 will be suspectible to noise, and higher than 6 won''t really find many meaningful clusters. N-gram also does not consider the order of the features, unless they are specified by the tokens themselves eg "LOOP {".

After the features have been produced for each document, they are transformed into a TF-IDF matrix. The similarity between the document vectors is calculated by cosine similarity. The resulting distance matrix is then passed to the clustering algorithm of choice, although it might not make much difference which one is chosen if the features are poor. There won''t be any meaningful clusters to be found either way.

For the dimensionality visualization either t-SNE or UMAP can be used. For t-SNE dimensionality reduction can be done with SVD, although with small datasets the results will look a lot alike. The SVD n-components have to be the size of the dataset or the size of the features at maximum. The UMAP should in theory stretch the points between the clusters a bit more, yet with small datasets the difference will not be very noticeable. Due to low size also the scale of the projection might vary highly, thus a random seed can be used to ensure the same result each time for the same features.

Parameters:
- token_set <string>: Used token set, either "modified", "complete" or "keywords". Default "modified".
- ngrams <[int, int]>: The range of used n-grams. Default [5,5].
- random_seed <int>: Used random seed. -1 or empty for no seed.
- clustering_algo_params <Object>: The parameters for the clustering algorithm. 
- dim_visualization_params <Object>: The dimensional reduction for 2d visualization parameters.
');
INSERT INTO model (model_id, title, description)
VALUES ('keyword_metrics', 'Keyword metrics',
'Returns the AST keywords for every submission, omits the non-descriptive tokens eg whitespace, brackets. For histograms, distribution plots.
');
