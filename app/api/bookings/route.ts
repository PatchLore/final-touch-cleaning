import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { assignSubcontractor } from '@/lib/agent'
import { sendBookingConfirmation, sendSubcontractorNotification } from '@/lib/email'

export async function GET() {
  try {
    const bookings = store.getAllBookings()
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { quote, ...formData } = body

    if (!formData.name || !formData.email || !formData.phone) {
      return NextResponse.json({ error: 'Missing contact details' }, { status: 400 })
    }

    const booking = store.createBooking({
      ...formData,
      price: quote?.price || 0,
      duration: quote?.duration || '',
      breakdown: quote?.breakdown || '',
    })

    // Send customer confirmation email (non-blocking)
    sendBookingConfirmation({
      id: booking.id, name: booking.name, email: booking.email,
      address: booking.address, moveOutDate: booking.moveOutDate,
      price: booking.price, duration: booking.duration,
      breakdown: booking.breakdown, extras: booking.extras,
    }).catch(err => console.error('Confirmation email failed:', err))

    // AI assigns subcontractor then notifies them (non-blocking)
    const subs = store.getSubcontractors()
    assignSubcontractor({
      postcode: booking.postcode, date: booking.moveOutDate,
      duration: booking.duration, subcontractors: subs,
    }).then(async (assignment) => {
      store.updateBooking(booking.id, {
        status: 'assigned', assignedTo: assignment.id,
        assignedName: assignment.name, notes: assignment.reason,
      })
      const sub = subs.find(s => s.id === assignment.id)
      if (sub) {
        await sendSubcontractorNotification({
          cleanerName: sub.name, cleanerEmail: sub.email,
          bookingId: booking.id, customerName: booking.name,
          address: booking.address, date: booking.moveOutDate,
          duration: booking.duration, accessNotes: booking.accessNotes,
          extras: booking.extras,
        }).catch(e => console.error('Sub email failed:', e))
      }
      console.log(`Booking ${booking.id} assigned to ${assignment.name}`)
    }).catch(err => console.error('Assignment failed:', err))

    return NextResponse.json({ id: booking.id, status: 'booked' })
  } catch (err: unknown) {
    console.error('Booking error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    const updated = store.updateBooking(id, updates)
    if (!updated) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
