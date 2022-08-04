import { dbService } from '../../db/db.service'

import { ICourse } from '@codeclusters/types'

export const courseService = {
  getCourses: async () : Promise<ICourse[] | undefined> => {
    return await dbService.queryMany<ICourse>(`
      SELECT *
      FROM (
        SELECT course.course_id, course.name, default_programming_language, organization, array_agg(course_students.student_id) as student_ids
        FROM course LEFT JOIN course_students ON course.course_id = course_students.course_id
        GROUP BY (course.course_id, course.name, organization, default_programming_language)
      ) c
      LEFT JOIN (
        SELECT course_id, json_agg(json_build_object(
          'exercise_id', exercise.exercise_id,
          'name', exercise.name,
          'programming_language', exercise.programming_language
        )) AS exercises FROM exercise
        GROUP BY(exercise.course_id)
      ) e
      ON c.course_id = e.course_id
    `)
  },
}
