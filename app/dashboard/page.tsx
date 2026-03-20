'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, Send, Loader2, CheckCircle, Clock, Users, PoundSterling, Sparkles } from 'lucide-react'
import type { Booking } from '@/lib/store'

const STATUS_COLOURS: Record<string, string> = {
  new: 'status-new', quoted: 'status-quoted', booked: 'status-booked',
  assigned: 'status-assigned', completed: 'status-completed', cancelled: 'status-cancelled',
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState({ total: 0, new: 0, assigned: 0, completed: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [chat, setChat] = useState<{ role: string; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings')
      const data: Booking[] = await res.json()
      setBookings(Array.isArray(data) ? data : [])
      // Compute stats client-side
      if (Array.isArray(data)) {
        setStats({
          total: data.length,
          new: data.filter(b => ['new','booked'].includes(b.status)).length,
          assigned: data.filter(b => b.status === 'assigned').length,
          completed: data.filter(b => b.status === 'completed').length,
          revenue: data.filter(b => b.status !== 'cancelled').reduce((s, b) => s + (b.price || 0), 0),
        })
      }
    } catch (e) {
      console.error('Failed to load bookings', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    load()
    if (selected?.id === id) setSelected(b => b ? { ...b, status: status as Booking['status'] } : b)
  }

  const sendChat = async () => {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    setChatInput('')
    setChat(c => [...c, { role: 'user', text: msg }])
    setChatLoading(true)
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, bookingId: selected?.id }),
      })
      const data = await res.json()
      setChat(c => [...c, { role: 'assistant', text: data.response || 'No response' }])
    } catch {
      setChat(c => [...c, { role: 'assistant', text: 'Agent unavailable — check NemoClaw is running.' }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#2F5CFF]" />
            <span className="font-bold text-gray-900">Final Touch</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-[#2F5CFF] hover:underline">View site ↗</Link>
            <button onClick={load} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total bookings', value: stats.total, icon: CheckCircle, color: 'text-blue-600' },
            { label: 'Needs attention', value: stats.new, icon: Clock, color: 'text-amber-600' },
            { label: 'Assigned', value: stats.assigned, icon: Users, color: 'text-purple-600' },
            { label: 'Revenue', value: `£${stats.revenue.toLocaleString()}`, icon: PoundSterling, color: 'text-brand-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className={`${color} mb-2`}><Icon className="w-5 h-5" /></div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Bookings</h2>
              </div>
              {loading ? (
                <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
              ) : bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-sm mb-3">No bookings yet.</p>
                  <Link href="/book" className="text-brand-600 text-sm hover:underline">Create a test booking →</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <button key={b.id} onClick={() => { setSelected(b); setChat([]) }}
                      className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${selected?.id === b.id ? 'bg-brand-50' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">{b.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[b.status]}`}>{b.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{b.bedrooms}bed {b.propertyType} · {b.postcode} · {b.moveOutDate}</p>
                          {b.assignedName && <p className="text-xs text-brand-600 mt-0.5">→ {b.assignedName}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-semibold text-gray-900 text-sm">£{b.price}</span>
                          <p className="text-xs text-gray-400 mt-0.5">{b.id}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel — detail + agent chat */}
          <div className="space-y-4">
            {selected ? (
              <>
                {/* Booking detail */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{selected.id}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[selected.status]}`}>{selected.status}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Customer', selected.name],
                      ['Email', selected.email],
                      ['Phone', selected.phone],
                      ['Property', `${selected.bedrooms}bed ${selected.propertyType}`],
                      ['Address', selected.address],
                      ['Date', selected.moveOutDate],
                      ['Price', `£${selected.price}`],
                      ['Duration', selected.duration],
                      ['Cleaner', selected.assignedName || 'Unassigned'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-gray-400 w-20 shrink-0">{k}</span>
                        <span className="text-gray-900 font-medium truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                  {/* Status actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    {['booked','assigned','completed','cancelled'].map(s => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        disabled={selected.status === s}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 ${selected.status === s ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        → {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Agent chat */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                    <span className="text-sm font-medium text-gray-900">AI Agent</span>
                    <span className="text-xs text-gray-400">Nemotron via NemoClaw</span>
                  </div>
                  <div className="h-48 overflow-y-auto p-4 space-y-3">
                    {chat.length === 0 && (
                      <p className="text-xs text-gray-400 text-center mt-8">Ask the agent anything about this booking...</p>
                    )}
                    {chat.map((m, i) => (
                      <div key={i} className={`text-xs rounded-lg p-2.5 ${m.role === 'user' ? 'bg-brand-50 text-brand-800 ml-4' : 'bg-gray-50 text-gray-700 mr-4'}`}>
                        <span className="font-medium">{m.role === 'user' ? 'You' : 'Agent'}: </span>{m.text}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="bg-gray-50 rounded-lg p-2.5 mr-4 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                        <span className="text-xs text-gray-400">Thinking...</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 p-3 flex gap-2">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChat()}
                      placeholder="e.g. Reassign to another cleaner..."
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-400" />
                    <button onClick={sendChat} disabled={!chatInput.trim() || chatLoading}
                      className="bg-brand-600 text-white p-2 rounded-lg hover:bg-brand-700 disabled:opacity-40 transition-colors">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-sm text-gray-400">Select a booking to view details and chat with the AI agent</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
