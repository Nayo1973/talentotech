import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get URL search params for filtering
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const appropriateness = searchParams.get('appropriateness')

    let query = supabase
      .from('audit_records')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('transfusion_date', { ascending: false })

    if (appropriateness && appropriateness !== 'all') {
      query = query.eq('appropriateness_rating', appropriateness)
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      records: data || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Audits fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('audit_records')
      .insert([
        {
          ...body,
          user_id: user.id,
        },
      ])
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json(data?.[0], { status: 201 })
  } catch (error) {
    console.error('Audit creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create audit record' },
      { status: 500 }
    )
  }
}
