import * as React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import styled from '../../theme/styled'

interface IItem {
  cluster: string
  name: string
  count: number
}
interface IProps {
  className?: string
  data: IItem[]
  activeCluster: string
  onClickBar: (item: any) => void
}

function ClustersHistogramEl(props: IProps) {
  const { className, data, activeCluster, onClickBar } = props
  function handleClickBar(e: any) {
    onClickBar(e)
  }
  return (
    <BarChart
      className={className}
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" onClick={handleClickBar}>
        {data.map((entry, index) => (
          <Cell
            cursor="pointer"
            fill={entry.cluster === activeCluster ? '#82ca9d' : '#8884d8'}
            key={`cell-${index}`}
          />
        ))}
      </Bar>
    </BarChart>
  )
}

export const ClustersHistogram = styled(ClustersHistogramEl)``
