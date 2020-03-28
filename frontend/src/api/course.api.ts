import { ICourse } from 'shared'

import {
  authenticatedHeaders,
  get,
} from './methods'

export const getCourses = () =>
  get<{ courses: ICourse[]}>('courses', authenticatedHeaders())
