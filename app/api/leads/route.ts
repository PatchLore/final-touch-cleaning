import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET() {
  try {
    const subs = store.getSubcontractors()
    return NextResponse.json(subs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch subcontractors' }, { status: 500 })
  }
}
