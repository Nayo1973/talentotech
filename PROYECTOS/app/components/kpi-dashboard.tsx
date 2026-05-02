'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useEffect, useState } from 'react'

interface KPIData {
  total_transfusions: number
  appropriate_count: number
  inappropriate_count: number
  questionable_count: number
  red_blood_cells: number
  plasma: number
  platelets: number
}

export function KPIDashboard() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const res = await fetch('/api/kpi')
        const data = await res.json()
        setKpiData(data)
      } catch (error) {
        console.error('Error fetching KPI:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchKPI()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading KPI data...</div>
  }

  if (!kpiData) {
    return <div className="text-center py-8">No KPI data available</div>
  }

  const appropriatenessRate =
    kpiData.total_transfusions > 0
      ? ((kpiData.appropriate_count / kpiData.total_transfusions) * 100).toFixed(
          1
        )
      : 0

  const componentData = [
    { name: 'Red Blood Cells', value: kpiData.red_blood_cells },
    { name: 'Plasma', value: kpiData.plasma },
    { name: 'Platelets', value: kpiData.platelets },
  ]

  const appropriatenessData = [
    { name: 'Adecuada', value: kpiData.appropriate_count, fill: '#10b981' },
    { name: 'Inadecuada', value: kpiData.inappropriate_count, fill: '#ef4444' },
    { name: 'Dudosa', value: kpiData.questionable_count, fill: '#f59e0b' },
  ]

  const COLORS = ['#10b981', '#ef4444', '#f59e0b']

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Total Transfusions Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Transfusions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {kpiData.total_transfusions}
          </div>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>

      {/* Appropriateness Rate Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Appropriateness Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{appropriatenessRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {kpiData.appropriate_count} adequate
          </p>
        </CardContent>
      </Card>

      {/* Inappropriate Count Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Inappropriate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {kpiData.inappropriate_count}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {((kpiData.inappropriate_count / kpiData.total_transfusions) * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* Questionable Count Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Questionable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">
            {kpiData.questionable_count}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {((kpiData.questionable_count / kpiData.total_transfusions) * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* Component Distribution Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Component Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={componentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appropriateness Distribution Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Appropriateness Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={appropriatenessData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {appropriatenessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
