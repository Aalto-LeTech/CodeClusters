import { action, computed, runInAction, observable } from 'mobx'
import * as courseApi from '../api/course.api'

import { ICourse, IExercise } from 'shared'
import { ToastStore } from './ToastStore'
import { SearchStore } from './SearchStore'

export class CourseStore {
  @observable courses: ICourse[] = []
  @observable selectedCourse?: ICourse = undefined
  @observable selectedExercise?: IExercise = undefined
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @action reset() {
    this.courses = []
  }

  @action setSelectedCourse(name: string) {
    this.selectedCourse = this.courses.find(c => c.name === name)
  }

  @action getCourses = async () => {
    const result = await courseApi.getCourses()
    runInAction(() => {
      if (result) {
        this.courses = result.courses
      }
    })
    return result?.courses
  }
}
