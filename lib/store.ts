// lib/store.ts
// Simple in-memory store for development.
// Replace with Prisma + SQLite/Postgres for production.

export type BookingStatus = 'new' | 'quoted' | 'booked' | 'assigned' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  createdAt: string
  status: BookingStatus
  // Property
  propertyType: string
  bedrooms: string
  bathrooms: string
  hasGarden: boolean
  hasPets: boolean
  extras: string[]
  // Location & date
  moveOutDate: string
  address: string
  postcode: string
  accessNotes: string
  // Customer
  name: string
  email: string
  phone: string
  whatsapp: boolean
  // Quote
  price: number
  duration: string
  breakdown: string
  // Assignment
  assignedTo?: string
  assignedName?: string
  notes?: string
}

export interface Subcontractor {
  id: string
  name: string
  email: string
  phone: string
  postcode: string
  rating: number
  available: boolean
  completedJobs: number
}

// In-memory storage
const bookings: Map<string, Booking> = new Map()

const subcontractors: Subcontractor[] = [
  { id: 'sub-001', name: 'Maria Santos', email: 'maria@example.com', phone: '+44 7700 100001', postcode: 'SW1A', rating: 4.9, available: true, completedJobs: 87 },
  { id: 'sub-002', name: 'David Okonkwo', email: 'david@example.com', phone: '+44 7700 100002', postcode: 'E1', rating: 4.7, available: true, completedJobs: 54 },
  { id: 'sub-003', name: 'Anna Kowalski', email: 'anna@example.com', phone: '+44 7700 100003', postcode: 'N1', rating: 4.8, available: false, completedJobs: 112 },
  { id: 'sub-004', name: 'James Fletcher', email: 'james@example.com', phone: '+44 7700 100004', postcode: 'SE1', rating: 4.6, available: true, completedJobs: 39 },
]

function generateId(): string {
  return 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const store = {
  // Bookings
  createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const booking: Booking = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'booked',
    }
    bookings.set(booking.id, booking)
    return booking
  },

  getBooking(id: string): Booking | undefined {
    return bookings.get(id)
  },

  getAllBookings(): Booking[] {
    return Array.from(bookings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const booking = bookings.get(id)
    if (!booking) return null
    const updated = { ...booking, ...updates }
    bookings.set(id, updated)
    return updated
  },

  // Subcontractors
  getSubcontractors(): Subcontractor[] {
    return subcontractors
  },

  getSubcontractor(id: string): Subcontractor | undefined {
    return subcontractors.find(s => s.id === id)
  },

  // Stats for dashboard
  getStats() {
    const all = this.getAllBookings()
    const revenue = all.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.price || 0), 0)
    return {
      total: all.length,
      new: all.filter(b => b.status === 'new' || b.status === 'booked').length,
      assigned: all.filter(b => b.status === 'assigned').length,
      completed: all.filter(b => b.status === 'completed').length,
      revenue,
    }
  }
}
