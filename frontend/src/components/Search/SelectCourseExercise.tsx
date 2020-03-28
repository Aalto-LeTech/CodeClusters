import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { MdKeyboardArrowRight } from 'react-icons/md'
import { FiTrash } from 'react-icons/fi'

import { Icon } from '../../elements/Icon'
import { GenericDropdown } from '../../elements/Dropdown'

import { CourseStore } from '../../stores/CourseStore'

interface IProps {
  className?: string
  courseStore?: CourseStore
}

const SelectCourseExerciseEl = inject('courseStore')(observer((props: IProps) => {
  const {
    className, courseStore
  } = props
  const [loading, setLoading] = useState(false)
  const courseOptions = courseStore!.courses.map(c => ({ key: c.course_id, value: c.name }))
  const exerciseOptions = courseStore!.selectedCourse?.exercises.map(e => ({ key: e.exercise_id, value: e.name })) || []

  useEffect(() => {
    setLoading(true)
    courseStore!.getCourses().then((courses) => {
      setLoading(false)
    })
  }, [])

  function handleSelectCourse(option: { key: number, value: string }) {
    courseStore!.setSelectedCourse(option.value)
  }
  function handleSelectExercise(option: { key: number, value: string }) {
    courseStore!.setSelectedExercise(option.value)
  }
  function handleCourseTrashClick() {
    courseStore!.setSelectedCourse()
  }
  function handleExerciseTrashClick() {
    courseStore!.setSelectedExercise()
  }
  function renderDropdownMenu(content: React.ReactNode) {
    return (
      <>
        <Icon><MdKeyboardArrowRight size={24}/></Icon>
        <DropdownText>{content}</DropdownText>
      </>
    )
  }

  return (
    <Container className={className}>
      <InfoText>
        Note: both Course and Exercise fields are optional.
        <br />
        Although running models on the whole indexed data is not advised.
      </InfoText>
      <DropdownField>
        <CustomDropdown
          selected={courseStore!.selectedCourse?.course_id}
          options={courseOptions}
          placeholder="Select course"
          fullWidth
          renderMenu={renderDropdownMenu}
          onSelect={handleSelectCourse}
        />
        <Icon button onClick={handleCourseTrashClick}><FiTrash size={18}/></Icon>
      </DropdownField>
      <DropdownField>
        <CustomDropdown
          selected={courseStore!.selectedExercise?.exercise_id}
          options={exerciseOptions}
          placeholder="Select exercise"
          fullWidth
          renderMenu={renderDropdownMenu}
          onSelect={handleSelectExercise}
        />
        <Icon button onClick={handleExerciseTrashClick}><FiTrash size={18}/></Icon>
      </DropdownField>
    </Container>
  )
}))

const DropdownText = styled.span`
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0 1rem;
`
const CustomDropdown = styled(GenericDropdown<number, string>())`
  & > button {
    background: ${({ theme }) => theme.color.green};
    border: 1px solid #222;
    border-radius: 4px;
    &:hover {
      background-color: #00c364; // rgba(0, 0, 0, 0.08);
    }
  }
`
const Container = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: 1rem 1rem 0 1rem;
`
const InfoText = styled.p`
  margin: 0 0 1rem 1rem;
`
const DropdownField = styled.div`
  display: flex;
  margin: 0.75rem 0 0 0;
  max-width: 700px;
  width: 100%;
  & > ${Icon} {
    margin-left: 1rem;
  }
`

export const SelectCourseExercise = styled(SelectCourseExerciseEl)``
