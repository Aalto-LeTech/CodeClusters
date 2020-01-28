INSERT INTO app_user (name, email, password, role) VALUES ('Admin', 'admin@asdf.fi', 'qwertyui', 'ADMIN');
INSERT INTO app_user (name, email, password, role) VALUES ('Mestari Tikku', 'tikku@asdf.fi', 'asdfasdf', 'TEACHER');
INSERT INTO app_user (name, email, password, role) VALUES ('Morty', 'morty@asdf.fi', 'asdfasdf', 'STUDENT');

INSERT INTO course (name) VALUES ('Ohjelmoinnin Perusteet');
INSERT INTO exercise (name) VALUES ('1. Hello World');
INSERT INTO exercise (name) VALUES ('2. Joulukuusi');
INSERT INTO exercise (name) VALUES ('3. Matopeli');

INSERT INTO student (name, username) VALUES ('Linus Torvals', 'linus');
INSERT INTO student (name, username) VALUES ('Esko Ukkonen', 'e_ukkonen');

INSERT INTO course_students (course_id, student_id) VALUES (1, 1);
INSERT INTO course_students (course_id, student_id) VALUES (1, 2);

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

INSERT INTO review (submission_id, message, metadata) VALUES (1, 'Tarkista funktion tyyppi. Tarkista tulostus!',
  'Hah');
INSERT INTO review (submission_id, message, metadata) VALUES (2, 'Tarkista tulostus!', 'Höh');
