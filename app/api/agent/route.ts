import { NextRequest, NextResponse } from 'next/server'
import { askAgent } from '@/lib/agent'
import { store } from '@/lib/store'

export async function POST(req: NextRequest) {
  try {
    const { message, bookingId } = await req.json()

    if (!message) return NextResponse.json({ error: 'No message provided' }, { status: 400 })

    let context = `You are an AI assistant for an end-of-tenancy cleaning company called Final Touch.
You help manage bookings, answer questions, and coordinate cleaners.
Be helpful, professional, and concise.`

    // If a booking ID is provided, inject context about that booking
    if (bookingId) {
      const booking = store.getBooking(bookingId)
      if (booking) {
        context += `\n\nCurrent booking context:
- Booking ID: ${booking.id}
- Customer: ${booking.name} (${booking.email})
- Property: ${booking.bedrooms} bed ${booking.propertyType} at ${booking.address}
- Date: ${booking.moveOutDate}
- Status: ${booking.status}
- Price: £${booking.price}
- Assigned to: ${booking.assignedName || 'Not yet assigned'}`
      }
    }

    const response = await askAgent(message, context)

    return NextResponse.json({ response })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Agent error' },
      { status: 500 }
    )
  }
}
