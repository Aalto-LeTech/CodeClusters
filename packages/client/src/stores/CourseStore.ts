import { action, computed, runInAction, makeObservable, observable } from 'mobx'
import * as courseApi from '../api/course.api'

import { persist } from './persist'

import { ICourse, IExercise } from '@codeclusters/types'
import { ToastStore } from './ToastStore'

export class CourseStore {
  @observable courses: ICourse[] = []
  @observable selectedCourse?: ICourse = undefined
  @observable selectedExercise?: IExercise = undefined
  toastStore: ToastStore

  constructor(props: ToastStore) {
    makeObservable(this)
    this.toastStore = props
    persist(() => this.courses, (val: any) => this.courses = val, 'course.courses')
    persist(() => this.selectedCourse, (val: any) => this.selectedCourse = val, 'course.selectedCourse')
    persist(() => this.selectedExercise, (val: any) => this.selectedExercise = val, 'course.selectedExercise')
  }

  @computed get courseId() {
    return this.selectedCourse?.course_id
  }

  @computed get exerciseId() {
    return this.selectedExercise?.exercise_id
  }

  @action reset() {
    this.courses = []
    this.selectedCourse = undefined
    this.selectedExercise = undefined
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
