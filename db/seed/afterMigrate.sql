INSERT INTO student (name, username) VALUES ('Morty', 'morty');
INSERT INTO student (name, username) VALUES ('Linus Torvals', 'linus');

INSERT INTO app_user (name, email, password, role) VALUES ('Admin', 'admin@asdf.fi', 'asdfasdf', 'ADMIN');
INSERT INTO app_user (name, email, password, role) VALUES ('Mestari Tikku', 'tikku@asdf.fi', 'asdfasdf', 'TEACHER');
INSERT INTO app_user (name, email, password, role, student_id)
  VALUES ('Morty', 'morty@asdf.fi', 'asdfasdf', 'STUDENT', 1);
INSERT INTO app_user (name, email, password, role, student_id)
  VALUES ('Linus Torvals', 'linus@asdf.fi', 'asdfasdf', 'STUDENT', 2);

INSERT INTO course (name, default_programming_language) VALUES ('Ohjelmoinnin Perusteet', 'JAVA');
INSERT INTO course (name, default_programming_language) VALUES ('mooc-2017-ohjelmointi', 'JAVA');

INSERT INTO exercise (course_id, name, programming_language) VALUES (1, '1. Hello World', 'JAVA');
INSERT INTO exercise (course_id, name, programming_language) VALUES (1, '2. Joulukuusi', 'JAVA');
INSERT INTO exercise (course_id, name, programming_language) VALUES (1, '3. Matopeli', 'JAVA');
INSERT INTO exercise (course_id, name, programming_language) VALUES (2, 'osa02-Osa02_16.MarsinLampotilanKeskiarvo', 'JAVA');

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
VALUES (1, (SELECT submission_id FROM submission WHERE student_id = 1), array[32, 72]);
INSERT INTO review_submissions (review_id, submission_id, selection)
VALUES (2, (SELECT submission_id FROM submission WHERE student_id = 1), array[72, 136]);
INSERT INTO review_submissions (review_id, submission_id, selection)
VALUES (2, (SELECT submission_id FROM submission WHERE student_id = 2), array[71, 135]);

INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, tags)
VALUES (2, 4, 1, 'Too lengthy code',
'Generic evaluation of code based on its length. In this exercise the optimal solution shouldn''t be much longer than the model answer (150).',
array['complexity', 'metric']);
INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, tags)
VALUES (null, null, 2, 'High cyclomatic complexity',
'Generic evaluation of code cyclomatic complexity. In general score of higher than 20 is regarded as hard to test, and especially in a programming course students should strive for simplistic code.',
array['cyclomatic', 'complexity', 'metric']);
INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, tags)
VALUES (null, null, 2, 'Hurr durr', 'Morty, you are an idiot.', array['performance']);

INSERT INTO review_flow_step (review_flow_id, index, action, data)
VALUES (1, 1, 'Search', '{"q": "*", "custom_filters": ["LOC_metric={35 TO *]"] }');
INSERT INTO review_flow_step (review_flow_id, index, action, data)
VALUES (1, 2, 'Review', '{"message": "Your solution shouldn''t be much longer than the model solution (15)."}');

INSERT INTO review_flow_step (review_flow_id, index, action, data)
VALUES (2, 1, 'Search', '{"q": "*", "custom_filters": ["CYC_metric={10 TO *]"] }');
INSERT INTO review_flow_step (review_flow_id, index, action, data)
VALUES (2, 2, 'Review', '{"message": "Your submission has the cyclomatic complexity of over 10. Please see the material to see how it can be reduced to reasonable level 1-9."}');

INSERT INTO review_flow_step (review_flow_id, index, action, data)
VALUES (3, 1, 'Search', '{"q": "*", "custom_filters": ["student_id=1"], "course_id": 2, "exercise_id": 4 }');
INSERT INTO review_flow_step (review_flow_id, index, action, data)
VALUES (3, 2, 'Model',
'{"model_id":"ngram","token_set":"modified","ngrams":[5,5],"random_seed":-1,
  "clustering_params":{"name":"DBSCAN","min_samples":5,"eps":0.25},
  "dim_visualization_params":{"name":"TSNE","perplexity":30}
}');
INSERT INTO review_flow_step (review_flow_id, index, action, data)
VALUES (3, 3, 'Review', '{"message": "You are a moron Morty. You have the brains of a catfish with a down syndrome."}');
