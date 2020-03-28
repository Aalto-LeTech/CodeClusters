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

  @computed get courseId() {
    return this.selectedCourse?.course_id
  }

  @computed get exerciseId() {
    return this.selectedExercise?.exercise_id
  }

  @action reset() {
    this.courses = []
  }

  @action setSelectedCourse(name?: string) {
    if (name === undefined || this.selectedCourse?.name !== name) {
      this.selectedCourse = this.courses.find(c => c.name === name)
      this.selectedExercise = undefined
    }
  }

  @action setSelectedExercise(name?: string) {
    this.selectedExercise = this.selectedCourse?.exercises.find(e => e.name === name)
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