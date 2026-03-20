'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, Plus, Sparkles } from 'lucide-react'

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  source: string
  message: string
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost'
  createdAt: string
  followUp?: string
}

const MOCK_LEADS: Lead[] = [
  { id: 'L-001', name: 'Sophie Turner', email: 'sophie@example.com', phone: '+44 7700 200001', source: 'Website form', message: '3 bed flat in SE1, need clean by 15th April. Moving to Manchester.', status: 'new', createdAt: '2026-03-19T10:22:00Z' },
  { id: 'L-002', name: 'Marcus Webb', email: 'marcus@example.com', phone: '+44 7700 200002', source: 'WhatsApp', message: 'Hi do you do end of tenancy? 2 bed house N7, need it done urgently', status: 'new', createdAt: '2026-03-19T14:05:00Z' },
  { id: 'L-003', name: 'Priya Patel', email: 'priya@example.com', phone: '+44 7700 200003', source: 'Referral', message: 'Studio flat, very clean already, just needs a quick once over for inventory check', status: 'contacted', createdAt: '2026-03-18T09:30:00Z', followUp: 'Sent quote for £130. Waiting for confirmation.' },
]

const STATUS_STYLES: Record<Lead['status'], string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-purple-100 text-purple-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-600',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [aiReply, setAiReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const generateReply = async (lead: Lead) => {
    setLoading(true)
    setAiReply('')
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a friendly, professional reply to this lead enquiry. Keep it short (3-4 sentences), invite them to get an instant quote at our website, and end with your name "Final Touch Team".

Lead name: ${lead.name}
Their message: "${lead.message}"
Source: ${lead.source}

Write the reply only, no subject line needed.`
        }),
      })
      const data = await res.json()
      setAiReply(data.response || 'Unable to generate reply — check NemoClaw is running.')
    } catch {
      setAiReply('Agent unavailable. Check NemoClaw is running in WSL2.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = (id: string, status: Lead['status']) => {
    setLeads(l => l.map(lead => lead.id === id ? { ...lead, status } : lead))
    if (selected?.id === id) setSelected(l => l ? { ...l, status } : l)
  }

  const saveNotes = (id: string) => {
    setLeads(l => l.map(lead => lead.id === id ? { ...lead, followUp: notes } : lead))
    if (selected?.id === id) setSelected(l => l ? { ...l, followUp: notes } : l)
    setNotes('')
  }

  const newCount = leads.filter(l => l.status === 'new').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-4 h-4" /></Link>
            <Sparkles className="w-5 h-5 text-[#2F5CFF]" />
            <span className="font-bold text-gray-900">Final Touch</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Leads & CRM</span>
            {newCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">{newCount} new</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-[#2F5CFF] hover:underline">View site ↗</Link>
            <Link href="/book" target="_blank"
              className="flex items-center gap-1.5 bg-brand-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-brand-700 transition-colors">
              <Plus className="w-4 h-4" /> Add lead
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">All leads ({leads.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {leads.map(lead => (
                <button key={lead.id} onClick={() => { setSelected(lead); setAiReply(''); setNotes(lead.followUp || '') }}
                  className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${selected?.id === lead.id ? 'bg-brand-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">{lead.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[lead.status]}`}>{lead.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{lead.message}</p>
                      <p className="text-xs text-gray-400 mt-1">via {lead.source}</p>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0">
                      {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            {selected ? (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{selected.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    {[
                      ['Email', selected.email],
                      ['Phone', selected.phone],
                      ['Source', selected.source],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-gray-400 w-16 shrink-0">{k}</span>
                        <span className="text-gray-900 text-xs">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-xs text-gray-600 leading-relaxed">{selected.message}</p>
                  </div>

                  {/* Status actions */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(['new','contacted','quoted','converted','lost'] as Lead['status'][]).map(s => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        disabled={selected.status === s}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-40 ${selected.status === s ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1.5">Follow-up notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                      rows={2} placeholder="Add notes..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-400 resize-none" />
                    <button onClick={() => saveNotes(selected.id)}
                      className="mt-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                      Save notes
                    </button>
                  </div>
                </div>

                {/* AI Reply Generator */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                    <h3 className="font-semibold text-gray-900 text-sm">AI reply generator</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Generate a personalised reply to this lead using Nemotron via NemoClaw.</p>
                  <button onClick={() => generateReply(selected)} disabled={loading}
                    className="w-full bg-brand-600 text-white text-sm py-2.5 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 mb-3">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Send className="w-4 h-4" />Generate reply</>}
                  </button>
                  {aiReply && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{aiReply}</p>
                      <button onClick={() => navigator.clipboard.writeText(aiReply)}
                        className="mt-2 text-xs text-brand-600 hover:underline">Copy to clipboard</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-sm text-gray-400">Select a lead to view details and generate AI replies</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
