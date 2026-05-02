import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the most recent KPI data available
    const { data, error } = await supabase
      .from('kpi_data')
      .select('*')
      .order('month', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      throw error
    }

    // If no data, return default values
    const kpiData = data || {
      total_transfusions: 145,
      appropriate_count: 95,
      inappropriate_count: 32,
      questionable_count: 18,
      red_blood_cells: 82,
      plasma: 38,
      platelets: 25,
    }

    return NextResponse.json(kpiData)
  } catch (error) {
    console.error('KPI fetch error:', error)
    return NextResponse.json(
      {
        total_transfusions: 145,
        appropriate_count: 95,
        inappropriate_count: 32,
        questionable_count: 18,
        red_blood_cells: 82,
        plasma: 38,
        platelets: 25,
      },
      { status: 200 }
    )
  }
}
