import * as React from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import styled from '../../theme/styled'

interface IItem {
  cluster: number
  name: string
  count: number
}
interface IProps {
  className?: string
  data: IItem[]
  onClickBar: (item: any) => void
}

function ClustersHistogramEl(props: IProps) {
  const { className, data, onClickBar } = props
  function handleClickBar(e: any) {
    console.log(e)
    onClickBar(e)
  }
  return (
    <BarChart
      className={className}
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="cluster" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" onClick={handleClickBar}/>
    </BarChart>
  )
}

export const ClustersHistogram = styled(ClustersHistogramEl)``
