import { ICourse } from '@codeclusters/types'

import { authenticatedHeaders, get } from './methods'

export const getCourses = () => get<{ courses: ICourse[] }>('courses', authenticatedHeaders())
