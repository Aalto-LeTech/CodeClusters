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
'Generic N-gram model, which could be used in plagiarism detection. Here instead of returning just a few of the most
similar submissions, returns all of the similarity scores for every submissions clustered by chosen algorithm.

The submissions can be parsed into two different token sets, both derived from the AST. The "modified" set is a customized
collection of different tokens, with control flow structure embedded in them eg separate "IF {" and "} IF" tokens.
The "keyword" set is the default language keywords with all of the non-descriptive tokens eg whitespace or brackets omitted. Full description
can be found from the modeling Github repository''s source code.

From these tokens n-grams are generated. With a lower n, more of the lower-level features are captured, 
with a higher n the higher level structures. A range of 3-6 is preferable, 1 will
be suspectible to noise, and higher than 6 won''t really find much meaningful clusters.

The n-grams are turned into TF-IDF matrix, after which cosine similarity is used to calculate the similarity scores.
SVD is used to reduce the dimensionality for the clustering with user-inputted n_components.
Then they are clusterd using one of the unsupervised clustering algorithms.
For the 2d representation a dimensionality reduction is done, by either TSNE or UMAP. Due to the low size of the data,
there can be very high variance between the dimension reductions.

Parameters:
- token_set [string]: Used token set, either "modified" or "keywords". Default "modified".
- ngrams [int, int]: The n of n-grams. Default [5,5].
- svd_n_components int: The amount of dimensions the SVD reduces the features. A lower bound for how many submissions can be used. Default 50
');
INSERT INTO model (model_id, title, description)
VALUES ('keyword_metrics', 'Keyword metrics',
'Returns the AST keywords for every submission, omits the non-descriptive tokens eg whitespace, brackets.
For histograms, distribution plots.
');
