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

INSERT INTO review (message, metadata) VALUES ('Tarkista funktion tyyppi. Tarkista tulostus!', 'Hah');
INSERT INTO review (message, metadata) VALUES ('Tarkista tulostus!', 'Höh');

INSERT INTO review_submissions (review_id, submission_id, selection) VALUES (1, 1, array[1, 10, 14]);
INSERT INTO review_submissions (review_id, submission_id, selection) VALUES (2, 1, array[2, 20, 40]);
INSERT INTO review_submissions (review_id, submission_id, selection) VALUES (2, 2, array[2, 20, 40]);