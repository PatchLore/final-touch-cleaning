import { NextRequest, NextResponse } from 'next/server'
import { generateQuote } from '@/lib/agent'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertyType, bedrooms, bathrooms, hasGarden, hasPets, extras, postcode, moveOutDate } = body

    if (!propertyType || !postcode || !moveOutDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const quote = await generateQuote({
      propertyType, bedrooms, bathrooms, hasGarden, hasPets, extras, postcode, moveOutDate
    })

    return NextResponse.json(quote)
  } catch (err: unknown) {
    console.error('Quote error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate quote' },
      { status: 500 }
    )
  }
}
