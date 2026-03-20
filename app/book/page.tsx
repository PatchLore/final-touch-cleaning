'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Clock, CreditCard, Home, Loader2, Mail, MapPin, Phone, Sparkles, User } from 'lucide-react'

type FormData = {
  // Step 1 — Property
  propertyType: string
  bedrooms: string
  bathrooms: string
  hasGarden: boolean
  hasPets: boolean
  extras: string[]
  // Step 2 — Date & Address
  moveOutDate: string
  address: string
  postcode: string
  accessNotes: string
  // Step 3 — Contact
  name: string
  email: string
  phone: string
  whatsapp: boolean
}

const EXTRAS = [
  'Oven clean', 'Fridge clean', 'Window cleaning (inside)',
  'Carpet steam clean', 'Wall marks removed', 'Garage/storage',
]

const initialForm: FormData = {
  propertyType: '', bedrooms: '1', bathrooms: '1',
  hasGarden: false, hasPets: false, extras: [],
  moveOutDate: '', address: '', postcode: '', accessNotes: '',
  name: '', email: '', phone: '', whatsapp: true,
}

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<{ price: number; duration: string; breakdown: string } | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const update = (k: keyof FormData, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const toggleExtra = (e: string) =>
    update('extras', form.extras.includes(e) ? form.extras.filter(x => x !== e) : [...form.extras, e])

  const getQuote = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get quote')
      setQuote(data)
      setStep(3)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const submitBooking = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quote }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit booking')
      setSubmitted(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking confirmed!</h2>
        <p className="text-gray-500 mb-2">We've sent your confirmation and checklist to <strong>{form.email}</strong>.</p>
        <p className="text-gray-500 mb-8 text-sm">Your cleaner will be in touch 24hrs before the clean.</p>
        <Link href="/" className="text-brand-600 hover:underline text-sm">← Back to home</Link>
      </div>
    </div>
  )

  const stepLabel = ['Property details', 'Date & address', 'Your quote', 'Contact details']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2F5CFF]" />
            <span className="font-bold text-gray-900 text-sm">Final Touch</span>
          </div>
        </div>
        {/* Progress */}
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="flex gap-2 mb-2">
            {[1,2,3,4].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-brand-500' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400">Step {step} of 4 — {stepLabel[step-1]}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Step 1 — Property */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your property</h1>
              <p className="text-gray-500 text-sm">We'll use this to calculate your quote.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property type</label>
              <div className="grid grid-cols-3 gap-3">
                {['Studio', 'Flat', 'House'].map(t => (
                  <button key={t} onClick={() => update('propertyType', t)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-colors ${form.propertyType === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400">
                  {['Studio','1','2','3','4','5+'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <select value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400">
                  {['1','2','3','4+'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'hasGarden', label: 'Includes garden / outdoor area' },
                { key: 'hasPets', label: 'Pets have lived in the property' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form[key as keyof FormData] as boolean}
                    onChange={e => update(key as keyof FormData, e.target.checked)}
                    className="w-4 h-4 accent-brand-600" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extras (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                {EXTRAS.map(e => (
                  <button key={e} onClick={() => toggleExtra(e)}
                    className={`py-2.5 px-3 rounded-lg border text-xs text-left transition-colors ${form.extras.includes(e) ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {form.extras.includes(e) ? '✓ ' : '+ '}{e}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!form.propertyType}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              Next: Date & address <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2 — Date & Address */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">When and where?</h1>
              <p className="text-gray-500 text-sm">We'll check availability and get your quote.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Move-out date</label>
              <input type="date" value={form.moveOutDate} onChange={e => update('moveOutDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property address</label>
              <input type="text" value={form.address} onChange={e => update('address', e.target.value)}
                placeholder="123 Example Street, London"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 mb-3" />
              <input type="text" value={form.postcode} onChange={e => update('postcode', e.target.value.toUpperCase())}
                placeholder="Postcode (e.g. SW1A 1AA)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access notes (optional)</label>
              <textarea value={form.accessNotes} onChange={e => update('accessNotes', e.target.value)}
                rows={3} placeholder="e.g. Key left with neighbour, parking on street, building entry code..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 resize-none" />
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-600 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={getQuote}
                disabled={!form.moveOutDate || !form.address || !form.postcode || loading}
                className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting quote...</> : <>Get my quote <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Quote */}
        {step === 3 && quote && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Your instant quote</h1>
              <p className="text-gray-500 text-sm">Generated by our AI based on your property details.</p>
            </div>

            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 text-center">
              <p className="text-sm text-brand-600 mb-1">Total price (inc. VAT)</p>
              <p className="text-5xl font-bold text-brand-700 mb-2">£{quote.price}</p>
              <p className="text-sm text-brand-600">Estimated duration: {quote.duration}</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">What's included</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{quote.breakdown}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              🔒 <strong>Deposit-back guarantee:</strong> If your landlord is unsatisfied, we re-clean for free.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 text-gray-600 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(4)}
                className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                Book this clean <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Contact */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Your contact details</h1>
              <p className="text-gray-500 text-sm">So we can confirm your booking and send updates.</p>
            </div>

            {[
              { key: 'name', label: 'Full name', placeholder: 'Jane Smith', type: 'text' },
              { key: 'email', label: 'Email address', placeholder: 'jane@example.com', type: 'email' },
              { key: 'phone', label: 'Phone number', placeholder: '+44 7700 000000', type: 'tel' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <input type={type} value={form[key as keyof FormData] as string}
                  onChange={e => update(key as keyof FormData, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400" />
              </div>
            ))}

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.whatsapp} onChange={e => update('whatsapp', e.target.checked)}
                className="w-4 h-4 accent-brand-600" />
              <span className="text-sm text-gray-700">Send me updates via WhatsApp</span>
            </label>

            {quote && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-gray-900">£{quote.price}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Due today (25% deposit)</span>
                  <span className="font-medium text-gray-700">£{Math.round(quote.price * 0.25)}</span>
                </div>
              </div>
            )}

            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep(3)}
                className="flex-1 border border-gray-200 text-gray-600 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={submitBooking}
                disabled={!form.name || !form.email || !form.phone || loading}
                className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</> : <>Confirm booking ✓</>}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">By confirming you agree to our terms. Deposit refundable up to 48hrs before clean.</p>
          </div>
        )}
      </div>
    </div>
  )
}
