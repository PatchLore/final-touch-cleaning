// lib/agent.ts
// Connects to your NemoClaw sandbox running locally
// The agent uses Nemotron 3 Super via NVIDIA cloud (routed through NemoClaw)

const NEMOCLAW_URL = process.env.NEMOCLAW_API_URL || 'http://localhost:3284'
const SESSION_ID   = process.env.NEMOCLAW_SESSION_ID || 'tenancy-agent'

export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Send a message to the OpenClaw agent running inside NemoClaw sandbox.
 * Returns the agent's text response.
 */
export async function askAgent(prompt: string, context?: string): Promise<string> {
  const message = context ? `${context}\n\n${prompt}` : prompt

  try {
    const res = await fetch(`${NEMOCLAW_URL}/v1/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: SESSION_ID,
        message,
        stream: false,
      }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Agent error ${res.status}: ${err}`)
    }

    const data = await res.json()
    // NemoClaw returns { content: string } or { message: { content: string } }
    return data.content ?? data.message?.content ?? data.response ?? JSON.stringify(data)

  } catch (err) {
    // Fallback: if NemoClaw isn't running, use rule-based pricing
    // Remove this fallback once NemoClaw is set up
    console.warn('NemoClaw not available, using fallback:', err)
    return '__FALLBACK__'
  }
}

/**
 * Generate a quote using the AI agent.
 * Falls back to rule-based pricing if agent is unavailable.
 */
export async function generateQuote(params: {
  propertyType: string
  bedrooms: string
  bathrooms: string
  hasGarden: boolean
  hasPets: boolean
  extras: string[]
  postcode: string
  moveOutDate: string
}): Promise<{ price: number; duration: string; breakdown: string }> {

  const prompt = `
You are a pricing AI for an end-of-tenancy cleaning company in the UK.
Generate a quote for this property:

Property type: ${params.propertyType}
Bedrooms: ${params.bedrooms}
Bathrooms: ${params.bathrooms}
Has garden: ${params.hasGarden}
Has pets: ${params.hasPets}
Extras requested: ${params.extras.join(', ') || 'None'}
Postcode: ${params.postcode}
Date: ${params.moveOutDate}

Respond ONLY with valid JSON in this exact format:
{
  "price": <number in GBP, no pence>,
  "duration": "<e.g. 4-5 hours>",
  "breakdown": "<bullet-point list of what is included, one item per line starting with •>"
}

UK market rates: studio £120-150, 1bed £150-200, 2bed £200-260, 3bed £260-340, 4bed £340-420.
Add £30 for garden, £40 for pets, extras cost £20-80 each.
`

  const response = await askAgent(prompt)

  if (response === '__FALLBACK__') {
    return fallbackQuote(params)
  }

  try {
    const clean = response.replace(/```json|```/g, '').trim()
    const json = JSON.parse(clean)
    return {
      price: Number(json.price),
      duration: json.duration,
      breakdown: json.breakdown,
    }
  } catch {
    return fallbackQuote(params)
  }
}

/**
 * Rule-based fallback pricing (used when NemoClaw isn't running yet)
 */
function fallbackQuote(params: {
  propertyType: string
  bedrooms: string
  bathrooms: string
  hasGarden: boolean
  hasPets: boolean
  extras: string[]
}): { price: number; duration: string; breakdown: string } {
  const base: Record<string, number> = {
    Studio: 130, Flat: 170, House: 240,
  }
  let price = base[params.propertyType] || 180
  const beds = parseInt(params.bedrooms) || 1
  price += Math.max(0, beds - 1) * 50
  if (params.hasGarden) price += 30
  if (params.hasPets) price += 40
  price += params.extras.length * 30

  const hours = Math.round(price / 40)

  const breakdown = [
    '• Full kitchen clean (all surfaces, appliances outside)',
    '• All bathrooms scrubbed and sanitised',
    '• All rooms hoovered and mopped',
    '• Inside all cupboards and drawers',
    '• Skirting boards, light switches, door frames',
    ...(params.hasGarden ? ['• Garden tidy and sweep'] : []),
    ...(params.hasPets ? ['• Pet hair removal treatment'] : []),
    ...params.extras.map(e => `• ${e}`),
    '• End-of-tenancy checklist completed',
    '• Deposit-back guarantee included',
  ].join('\n')

  return {
    price,
    duration: `${hours}-${hours + 1} hours`,
    breakdown,
  }
}

/**
 * Use the agent to assign the best available subcontractor
 */
export async function assignSubcontractor(booking: {
  postcode: string
  date: string
  duration: string
  subcontractors: Array<{ id: string; name: string; postcode: string; rating: number; available: boolean }>
}): Promise<{ id: string; name: string; reason: string }> {

  const available = booking.subcontractors.filter(s => s.available)

  if (available.length === 0) {
    return { id: 'unassigned', name: 'TBD', reason: 'No subcontractors available' }
  }

  const prompt = `
You are assigning a cleaning job to the best available subcontractor.

Job postcode: ${booking.postcode}
Job date: ${booking.date}
Estimated duration: ${booking.duration}

Available subcontractors:
${available.map(s => `- ID: ${s.id}, Name: ${s.name}, Based: ${s.postcode}, Rating: ${s.rating}/5`).join('\n')}

Pick the best match considering proximity and rating.
Respond ONLY with JSON: { "id": "<id>", "name": "<name>", "reason": "<one sentence why>" }
`

  const response = await askAgent(prompt)

  if (response === '__FALLBACK__') {
    const best = available.sort((a, b) => b.rating - a.rating)[0]
    return { id: best.id, name: best.name, reason: 'Highest rated available cleaner' }
  }

  try {
    const clean = response.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    const best = available.sort((a, b) => b.rating - a.rating)[0]
    return { id: best.id, name: best.name, reason: 'Highest rated available cleaner' }
  }
}
