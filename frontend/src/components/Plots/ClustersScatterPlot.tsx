import React, { useEffect, useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Cell
} from 'recharts'
import { scaleSequential } from 'd3-scale'
import { interpolateRdYlBu } from 'd3-scale-chromatic'
import styled from '../../theme/styled'

interface IItem {
  x: number
  y: number
  cluster: number
  id: string
}
interface IProps {
  className?: string
  data: IItem[]
  clusters: number
}

function CustomTooltip(props: TooltipProps) {
  const { active, payload } = props
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload
    return (
      <div style={{
        backgroundColor: '#fff', border: '1px solid #999', margin: 0, padding: 10,
      }}
      >
        <p>Cluster: {data.cluster}</p>
      </div>
    )
  }
  return null
}

function ClustersScatterPlotEl(props: IProps) {
  const { className, data, clusters } = props
  const [colors, setColors] = useState([] as string[])
  useEffect(() => {
    const scale = scaleSequential(interpolateRdYlBu).domain([-1, clusters])
    setColors(data.map((d, i) => scale(d.cluster)))
  }, [data])

  // function renderTooltip(props: TooltipProps) {
  //   const { active, payload } = props
  //   if (active && payload && payload.length) {
  //     const data = payload[0] && payload[0].payload
  //     return (
  //       <div style={{
  //         backgroundColor: '#fff', border: '1px solid #999', margin: 0, padding: 10,
  //       }}
  //       >
  //         <p>Cluster: {data.cluster}</p>
  //       </div>
  //     )
  //   }
  //   return null
  // }
  return (
    <ScatterChart
      className={className}
      width={400}
      height={400}
      margin={{
        top: 20, right: 20, bottom: 20, left: 20,
      }}
    >
      <CartesianGrid />
      <XAxis type="number" dataKey="x" name="x" />
      <YAxis type="number" dataKey="y" name="y" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={CustomTooltip}/>
      <Scatter name="Clusters" data={data} fill="#8884d8">
      {
        data.map((item, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)
      }
      </Scatter>
    </ScatterChart>
  )
}

export const ClustersScatterPlot = styled(ClustersScatterPlotEl)``
