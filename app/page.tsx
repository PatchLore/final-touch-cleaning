'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Shield, 
  Users, 
  Sparkles, 
  CheckCircle, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Menu,
  X,
  MessageCircle,
  Calendar,
  Home as HomeIcon,
  Bath,
  Sofa,
  Building,
  Hammer,
  ArrowRight,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quoteResult, setQuoteResult] = useState<{ price: number; duration: string; breakdown: string } | null>(null)
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'confirmed'>('idle')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    postcode: '',
    moveOutDate: '',
    extras: [] as string[]
  })

  const heroRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const qualityRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo('.hero-eyebrow', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2 }
      )
      gsap.fromTo('.hero-headline', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, delay: 0.35 }
      )
      gsap.fromTo('.hero-body', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, delay: 0.55 }
      )
      gsap.fromTo('.hero-ctas', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, delay: 0.7 }
      )
      gsap.fromTo('.hero-image-card', 
        { x: 100, opacity: 0, scale: 0.98 }, 
        { x: 0, opacity: 1, scale: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
      )
      gsap.fromTo('.hero-arc', 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.5 }
      )

      // How It Works section
      gsap.fromTo('.hiw-header', 
        { y: -30, opacity: 0 }, 
        { 
          y: 0, opacity: 1, 
          scrollTrigger: { trigger: howItWorksRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.hiw-card', 
        { y: 80, opacity: 0, scale: 0.96 }, 
        { 
          y: 0, opacity: 1, scale: 1, stagger: 0.15,
          scrollTrigger: { trigger: howItWorksRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      )

      // About section
      gsap.fromTo('.about-image', 
        { x: -80, opacity: 0, scale: 0.98 }, 
        { 
          x: 0, opacity: 1, scale: 1, duration: 0.8,
          scrollTrigger: { trigger: aboutRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.about-content', 
        { x: 50, opacity: 0 }, 
        { 
          x: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: aboutRef.current, start: 'top 60%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.about-bullet', 
        { x: -30, opacity: 0 }, 
        { 
          x: 0, opacity: 1, stagger: 0.1,
          scrollTrigger: { trigger: aboutRef.current, start: 'top 50%', toggleActions: 'play none none reverse' }
        }
      )

      // Services section
      gsap.fromTo('.services-header', 
        { y: 30, opacity: 0 }, 
        { 
          y: 0, opacity: 1,
          scrollTrigger: { trigger: servicesRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.service-card', 
        { y: 60, opacity: 0, scale: 0.98 }, 
        { 
          y: 0, opacity: 1, scale: 1, stagger: 0.08,
          scrollTrigger: { trigger: servicesRef.current, start: 'top 60%', toggleActions: 'play none none reverse' }
        }
      )

      // Pricing section
      gsap.fromTo('.pricing-image', 
        { x: -80, opacity: 0 }, 
        { 
          x: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: pricingRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.pricing-content', 
        { x: 50, opacity: 0 }, 
        { 
          x: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: pricingRef.current, start: 'top 60%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.pricing-card', 
        { x: 40, opacity: 0 }, 
        { 
          x: 0, opacity: 1, stagger: 0.1,
          scrollTrigger: { trigger: pricingRef.current, start: 'top 50%', toggleActions: 'play none none reverse' }
        }
      )

      // Testimonials section
      gsap.fromTo('.testimonials-header', 
        { y: -20, opacity: 0 }, 
        { 
          y: 0, opacity: 1,
          scrollTrigger: { trigger: testimonialsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.testimonial-card', 
        { y: 60, opacity: 0, scale: 0.98 }, 
        { 
          y: 0, opacity: 1, scale: 1, stagger: 0.12,
          scrollTrigger: { trigger: testimonialsRef.current, start: 'top 65%', toggleActions: 'play none none reverse' }
        }
      )

      // Quality section
      gsap.fromTo('.quality-bg', 
        { scale: 1.08, opacity: 0.6 }, 
        { 
          scale: 1, opacity: 1, duration: 1.2,
          scrollTrigger: { trigger: qualityRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.quality-card', 
        { y: 60, opacity: 0, scale: 0.98 }, 
        { 
          y: 0, opacity: 1, scale: 1, duration: 0.8,
          scrollTrigger: { trigger: qualityRef.current, start: 'top 60%', toggleActions: 'play none none reverse' }
        }
      )

      // CTA section
      gsap.fromTo('.cta-headline', 
        { y: 30, opacity: 0 }, 
        { 
          y: 0, opacity: 1,
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.cta-body', 
        { y: 20, opacity: 0 }, 
        { 
          y: 0, opacity: 1,
          scrollTrigger: { trigger: ctaRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      )
      gsap.fromTo('.cta-button', 
        { scale: 0.96, opacity: 0 }, 
        { 
          scale: 1, opacity: 1,
          scrollTrigger: { trigger: ctaRef.current, start: 'top 60%', toggleActions: 'play none none reverse' }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setQuoteResult(null)
    
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!res.ok) throw new Error('Failed to get quote')
      const data = await res.json()
      setQuoteResult(data)
    } catch (err) {
      console.error(err)
      alert('Failed to get quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = async () => {
    setBookingStatus('booking')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quote: quoteResult
        }),
      })
      
      if (!res.ok) throw new Error('Failed to book')
      setBookingStatus('confirmed')
    } catch (err) {
      console.error(err)
      alert('Failed to book. Please try again.')
      setBookingStatus('idle')
    }
  }

  const QuoteForm = ({ compact = false }: { compact?: boolean }) => (
    <div className={`bg-white rounded-[28px] card-shadow p-6 ${compact ? '' : 'lg:p-8'}`}>
      <h3 className={`font-bold text-[#111C2B] mb-4 ${compact ? 'text-lg' : 'text-xl'}`}>
        {quoteResult ? 'Your Instant Quote' : 'Get Your Instant Quote'}
      </h3>
      
      {quoteResult ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#2F5CFF]/5 p-6 rounded-2xl border border-[#2F5CFF]/10 text-center">
            <p className="text-sm text-[#2F5CFF] font-semibold uppercase tracking-wider mb-1">Estimated Price</p>
            <div className="text-4xl font-bold text-[#111C2B]">£{quoteResult.price}</div>
            <p className="text-xs text-gray-500 mt-2">Estimated duration: {quoteResult.duration}</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#111C2B]">What's included:</h4>
            <div className="text-xs text-gray-600 space-y-2 whitespace-pre-line leading-relaxed">
              {quoteResult.breakdown}
            </div>
          </div>

          {bookingStatus === 'confirmed' ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 font-bold">Booking Confirmed!</AlertTitle>
              <AlertDescription className="text-green-700">
                We've sent a confirmation email to {formData.email}.
              </AlertDescription>
            </Alert>
          ) : (
            <Button 
              onClick={handleBookNow} 
              disabled={bookingStatus === 'booking'}
              className="w-full rounded-full bg-[#111C2B] hover:bg-[#1a2a3d] text-white font-semibold h-12"
            >
              {bookingStatus === 'booking' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : 'Book a Clean Now'}
            </Button>
          )}
          
          <button 
            onClick={() => { setQuoteResult(null); setBookingStatus('idle'); }} 
            className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back to details
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleGetQuote}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Name</Label>
              <Input 
                required
                placeholder="Your name" 
                className="rounded-xl h-10 text-sm" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Phone</Label>
              <Input 
                required
                placeholder="Phone number" 
                className="rounded-xl h-10 text-sm" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Email</Label>
            <Input 
              required
              type="email" 
              placeholder="your@email.com" 
              className="rounded-xl h-10 text-sm" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Property Type</Label>
              <Select onValueChange={(v) => setFormData({...formData, propertyType: v})} value={formData.propertyType}>
                <SelectTrigger className="rounded-xl h-10 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Flat">Flat</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Bedrooms</Label>
              <Select onValueChange={(v) => setFormData({...formData, bedrooms: v})} value={formData.bedrooms}>
                <SelectTrigger className="rounded-xl h-10 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4+">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Bathrooms</Label>
              <Select onValueChange={(v) => setFormData({...formData, bathrooms: v})} value={formData.bathrooms}>
                <SelectTrigger className="rounded-xl h-10 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4+">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Postcode</Label>
              <Input 
                required
                placeholder="e.g. M1 1AA" 
                className="rounded-xl h-10 text-sm" 
                value={formData.postcode}
                onChange={(e) => setFormData({...formData, postcode: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Add-ons</Label>
            <div className="flex flex-wrap gap-2">
              {['Carpet cleaning', 'Oven cleaning', 'Deep cleaning'].map((addon) => (
                <label key={addon} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                  <Checkbox 
                    className="w-3.5 h-3.5 rounded" 
                    checked={formData.extras.includes(addon)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({...formData, extras: [...formData.extras, addon]})
                      } else {
                        setFormData({...formData, extras: formData.extras.filter(e => e !== addon)})
                      }
                    }}
                  />
                  <span className="text-xs text-gray-700">{addon}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Preferred Date</Label>
            <Input 
              required
              type="date" 
              className="rounded-xl h-10 text-sm" 
              value={formData.moveOutDate}
              onChange={(e) => setFormData({...formData, moveOutDate: e.target.value})}
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-full bg-[#2F5CFF] hover:bg-[#1e4ce6] text-white font-semibold h-11"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : 'Get Instant Quote'}
          </Button>
          <p className="text-[10px] text-gray-400 text-center">Final quote provided instantly after form submission</p>
        </form>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F6F7F6] relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="px-4 sm:px-6 lg:px-[4vw] py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#2F5CFF]" />
            <span className="font-bold text-lg text-[#111C2B]">Final Touch</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection(servicesRef)} className="text-sm font-medium text-[#111C2B] hover:text-[#2F5CFF] transition-colors">Services</button>
            <button onClick={() => scrollToSection(pricingRef)} className="text-sm font-medium text-[#111C2B] hover:text-[#2F5CFF] transition-colors">Pricing</button>
            <button onClick={() => scrollToSection(aboutRef)} className="text-sm font-medium text-[#111C2B] hover:text-[#2F5CFF] transition-colors">About</button>
            <button onClick={() => scrollToSection(ctaRef)} className="text-sm font-medium text-[#111C2B] hover:text-[#2F5CFF] transition-colors">Contact</button>
          </nav>

          <div className="hidden lg:block">
            <Button onClick={() => setShowQuoteForm(true)} className="rounded-full bg-[#111C2B] hover:bg-[#1a2a3d] text-white px-6">
              Get a quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t px-4 py-6 space-y-4">
            <button onClick={() => scrollToSection(servicesRef)} className="block w-full text-left py-2 text-[#111C2B]">Services</button>
            <button onClick={() => scrollToSection(pricingRef)} className="block w-full text-left py-2 text-[#111C2B]">Pricing</button>
            <button onClick={() => scrollToSection(aboutRef)} className="block w-full text-left py-2 text-[#111C2B]">About</button>
            <button onClick={() => scrollToSection(ctaRef)} className="block w-full text-left py-2 text-[#111C2B]">Contact</button>
            <Button onClick={() => { setShowQuoteForm(true); setIsMenuOpen(false); }} className="w-full rounded-full bg-[#111C2B] text-white mt-4">
              Get a quote
            </Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen pt-24 lg:pt-0 px-4 sm:px-6 lg:px-[7vw] flex items-center relative overflow-hidden">
        <div className="w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-0">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <p className="hero-eyebrow text-xs font-semibold tracking-[0.16em] uppercase text-[#6B7280] mb-4">
              End of Tenancy & Domestic Cleaning
            </p>
            <h1 className="hero-headline text-4xl sm:text-5xl lg:text-[clamp(44px,5vw,72px)] font-bold text-[#111C2B] leading-[0.95] mb-6">
              End of Tenancy Cleaning That Gets Your Deposit Back
            </h1>
            <p className="hero-body text-base lg:text-lg text-[#6B7280] max-w-lg mb-8 leading-relaxed">
              Professional, reliable, and agent-approved cleaning across London. We help tenants, landlords, and homeowners keep properties immaculate—without the hassle.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full card-shadow">
                <Shield className="w-4 h-4 text-[#2F5CFF]" />
                <span className="text-xs font-medium text-[#111C2B]">Fully Insured</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full card-shadow">
                <Users className="w-4 h-4 text-[#2F5CFF]" />
                <span className="text-xs font-medium text-[#111C2B]">Experienced Cleaners</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full card-shadow">
                <CheckCircle className="w-4 h-4 text-[#2F5CFF]" />
                <span className="text-xs font-medium text-[#111C2B]">Deposit Back Guarantee</span>
              </div>
            </div>

            <div className="hero-ctas flex flex-wrap gap-4">
              <Button onClick={() => setShowQuoteForm(true)} className="rounded-full bg-[#2F5CFF] hover:bg-[#1e4ce6] text-white px-8 h-12 font-semibold">
                Get Instant Quote
              </Button>
              <Button onClick={() => scrollToSection(servicesRef)} variant="outline" className="rounded-full border-[#111C2B] text-[#111C2B] px-8 h-12 font-semibold hover:bg-[#111C2B] hover:text-white">
                Book a Clean
              </Button>
            </div>
          </div>

          {/* Right Content - Quote Form */}
          <div className="order-1 lg:order-2 relative">
            <div className="hero-arc absolute -top-8 -right-8 w-full h-full border-2 border-[#111C2B]/10 rounded-[40px] pointer-events-none" />
            <div className="hero-image-card hidden lg:block">
              <QuoteForm />
            </div>
            <div className="lg:hidden hero-image-card rounded-[28px] overflow-hidden card-shadow">
              <img src="/hero_cleaner.jpg" alt="Professional cleaner" className="w-full h-64 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Quote Form */}
      <section className="lg:hidden px-4 sm:px-6 pb-12">
        <QuoteForm />
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-[7vw]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <h2 className="hiw-header text-3xl sm:text-4xl lg:text-[clamp(34px,3.6vw,52px)] font-bold text-[#111C2B]">How it works</h2>
          <p className="hiw-header text-base text-[#6B7280] max-w-md lg:text-right">
            A simple process designed to save time and deliver consistency. Get your property inspection-ready in three easy steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { icon: Calendar, step: '01', title: 'Book in 60 seconds', desc: 'Choose your service, pick a date, and tell us what matters most. Our online booking is quick and hassle-free.' },
            { icon: Users, step: '02', title: 'We assign a professional cleaner', desc: 'Our trained team arrives on time, fully equipped with eco-friendly products, and gets straight to work.' },
            { icon: Sparkles, step: '03', title: 'Get a spotless, inspection-ready property', desc: 'We walk through with you to make sure every detail is spotless. Your deposit back, guaranteed.' },
          ].map((item, i) => (
            <div key={i} className="hiw-card bg-white rounded-[28px] card-shadow p-6 lg:p-8 hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-[#111C2B] flex items-center justify-center mb-6 animate-breathe">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold tracking-wider text-[#2F5CFF] mb-2 block">STEP {item.step}</span>
              <h3 className="text-xl font-bold text-[#111C2B] mb-3">{item.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-[7vw]">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="about-image relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#111C2B]/10 rounded-[28px]" />
            <img src="/about_cleaner.jpg" alt="Cleaner in living room" className="relative rounded-[28px] card-shadow w-full h-[400px] lg:h-[500px] object-cover" />
          </div>
          
          <div className="about-content">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#2F5CFF] mb-4">About Final Touch</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[clamp(34px,3.6vw,52px)] font-bold text-[#111C2B] mb-6">
              A local team that treats your home like its own
            </h2>
            <p className="text-base text-[#6B7280] mb-8 leading-relaxed">
              We're obsessive about the details—corners, edges, finishes—because that's what makes a space feel brand new. Our end of tenancy cleaning service is designed to meet the highest standards of letting agents and landlords.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                'Background-checked cleaners',
                'Eco-conscious products available',
                '48-hour satisfaction follow-up',
                'Same/next day availability',
              ].map((item, i) => (
                <div key={i} className="about-bullet flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#2F5CFF]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-[#2F5CFF]" />
                  </div>
                  <span className="text-sm text-[#111C2B] font-medium">{item}</span>
                </div>
              ))}
            </div>

            <button onClick={() => scrollToSection(ctaRef)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#2F5CFF] hover:gap-3 transition-all">
              Meet the team <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-[7vw]">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <p className="services-header text-xs font-semibold tracking-[0.16em] uppercase text-[#2F5CFF] mb-4">Our Services</p>
          <h2 className="services-header text-3xl sm:text-4xl lg:text-[clamp(34px,3.6vw,52px)] font-bold text-[#111C2B] mb-4">
            Services built around your schedule
          </h2>
          <p className="services-header text-base text-[#6B7280]">
            From deep cleans to regular upkeep, we keep your space feeling fresh. All our services come with our satisfaction guarantee.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: HomeIcon, title: 'End of Tenancy Cleaning', desc: 'Inspection-ready cleans that help protect your deposit. Our most popular service.', featured: true },
            { icon: Sparkles, title: 'Domestic Cleaning', desc: 'Weekly or fortnightly visits to keep your home tidy and fresh.' },
            { icon: Bath, title: 'Deep Cleaning', desc: 'One-off intensive cleans for kitchens, bathrooms, and living spaces.' },
            { icon: Sofa, title: 'Carpet & Upholstery', desc: 'Hot water extraction and stain treatment for fabrics and carpets.' },
            { icon: Building, title: 'Office & Commercial', desc: 'Reliable cleaning that keeps workspaces professional.' },
            { icon: Hammer, title: 'After Builders Cleaning', desc: 'Remove dust, paint spots, and debris fast after renovations.' },
          ].map((service, i) => (
            <div key={i} className={`service-card bg-white rounded-[28px] p-6 lg:p-8 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1.5 ${service.featured ? 'ring-2 ring-[#2F5CFF]' : ''}`}>
              {service.featured && (
                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase bg-[#2F5CFF] text-white px-3 py-1 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <div className="w-10 h-10 rounded-full bg-[#111C2B]/5 flex items-center justify-center mb-4">
                <service.icon className="w-5 h-5 text-[#111C2B]" />
              </div>
              <h3 className="text-lg font-bold text-[#111C2B] mb-2">{service.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{service.desc}</p>
              <button onClick={() => setShowQuoteForm(true)} className="inline-flex items-center gap-1 text-sm font-medium text-[#2F5CFF] hover:gap-2 transition-all">
                Get quote <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-[7vw]">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="pricing-image relative order-2 lg:order-1">
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#111C2B]/10 rounded-[28px]" />
            <img src="/pricing_cleaner.jpg" alt="Cleaner with supplies" className="relative rounded-[28px] card-shadow w-full h-[400px] lg:h-[500px] object-cover" />
          </div>
          
          <div className="pricing-content order-1 lg:order-2">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#2F5CFF] mb-4">Transparent Pricing</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[clamp(34px,3.6vw,52px)] font-bold text-[#111C2B] mb-4">
              Simple rates. No hidden fees.
            </h2>
            <p className="text-base text-[#6B7280] mb-8 leading-relaxed">
              Choose a plan that fits your space. Extras are always optional. Final quote confirmed after a quick walkthrough.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { name: 'Studio / 1 Bed', price: 'From £120', features: 'Kitchen, bathroom, living area, floors' },
                { name: '2 Bed / 1 Bath', price: 'From £180', features: '+ extra bedrooms and hallway detailing' },
                { name: '3 Bed / 2 Bath', price: 'From £260', features: 'Full home deep clean with finish checklist' },
              ].map((plan, i) => (
                <div key={i} className="pricing-card bg-white rounded-[28px] p-5 card-shadow hover:card-shadow-hover transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-[#111C2B]">{plan.name}</h4>
                    <span className="text-lg font-bold text-[#2F5CFF]">{plan.price}</span>
                  </div>
                  <p className="text-sm text-[#6B7280]">{plan.features}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setShowQuoteForm(true)} className="rounded-full bg-[#111C2B] hover:bg-[#1a2a3d] text-white px-8 h-12 font-semibold">
                Get a quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-[7vw]">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <p className="testimonials-header text-xs font-semibold tracking-[0.16em] uppercase text-[#2F5CFF] mb-4">Testimonials</p>
          <h2 className="testimonials-header text-3xl sm:text-4xl lg:text-[clamp(34px,3.6vw,52px)] font-bold text-[#111C2B]">
            Rated 5 stars by tenants and landlords
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { quote: "They saved my deposit. The landlord commented on how clean the oven was. Worth every penny!", name: 'Alex R.', role: 'Tenant', rating: 5 },
            { quote: "Reliable, polite, and thorough. I book them for all my properties. Never had a complaint.", name: 'Priya M.', role: 'Landlord', rating: 5 },
            { quote: "Our office has never smelled this fresh. The team is consistent every week. Highly recommend.", name: 'Sam T.', role: 'Office Manager', rating: 5 },
          ].map((testimonial, i) => (
            <div key={i} className="testimonial-card bg-white rounded-[28px] p-6 lg:p-8 card-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#2F5CFF] text-[#2F5CFF]" />
                ))}
              </div>
              <p className="text-sm text-[#111C2B] leading-relaxed mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111C2B]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#111C2B]">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111C2B]">{testimonial.name}</p>
                  <p className="text-xs text-[#6B7280]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Promise Section */}
      <section ref={qualityRef} className="relative h-[80vh] lg:h-screen flex items-center justify-center overflow-hidden">
        <div className="quality-bg absolute inset-0">
          <img src="/quality_room.jpg" alt="Clean living room" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111C2B]/80 via-[#111C2B]/30 to-transparent" />
        </div>
        
        <div className="quality-card relative bg-white rounded-[28px] p-8 lg:p-12 max-w-2xl mx-4 text-center card-shadow">
          <div className="w-14 h-14 rounded-full bg-[#2F5CFF]/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-[#2F5CFF]" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111C2B] mb-4">
            If something's missed, we'll come back and fix it—free.
          </h2>
          <p className="text-base text-[#6B7280] mb-8">
            Your satisfaction is the standard, not a bonus. Our deposit-back guarantee means peace of mind with every clean.
          </p>
          <Button onClick={() => setShowQuoteForm(true)} className="rounded-full bg-[#2F5CFF] hover:bg-[#1e4ce6] text-white px-8 h-12 font-semibold">
            Book a clean
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={ctaRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-[7vw] bg-[#111C2B]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="cta-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready for a spotless space?
          </h2>
          <p className="cta-body text-base lg:text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Get a free quote in minutes. We'll confirm availability and walk you through the plan. Same and next-day slots available.
          </p>
          <Button onClick={() => setShowQuoteForm(true)} className="cta-button rounded-full bg-[#2F5CFF] hover:bg-[#1e4ce6] text-white px-10 h-14 font-semibold text-lg animate-pulse-subtle">
            Get your instant quote now
          </Button>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>020 7946 0958</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>hello@finaltouch.co.uk</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111C2B] pt-16 pb-8 px-4 sm:px-6 lg:px-[7vw] border-t border-white/10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#2F5CFF]" />
              <span className="font-bold text-lg text-white">Final Touch</span>
            </div>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Professional cleaning. Spotless results. Every time. Trusted by tenants, landlords, and homeowners across London.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@finaltouch.co.uk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>020 7946 0958</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>12B King Street, London M1 1AA</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {['End of Tenancy', 'Domestic Cleaning', 'Deep Cleaning', 'Carpet & Upholstery', 'Office Cleaning', 'After Builders'].map((item) => (
                <li key={item}>
                  <button onClick={() => scrollToSection(servicesRef)} className="text-sm text-white/60 hover:text-white transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Reviews', 'Contact', 'Blog', 'FAQs'].map((item) => (
                <li key={item}>
                  <button onClick={() => scrollToSection(aboutRef)} className="text-sm text-white/60 hover:text-white transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Cancellation Policy'].map((item) => (
                <li key={item}>
                  <button className="text-sm text-white/60 hover:text-white transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 Final Touch Cleaning. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Instagram', 'Facebook', 'LinkedIn'].map((social) => (
              <button key={social} className="text-xs text-white/40 hover:text-white transition-colors">
                {social}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/447946095800" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center card-shadow hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>

      {/* Quote Form Dialog */}
      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#111C2B]">Get Your Free Quote</DialogTitle>
          </DialogHeader>
          <QuoteForm compact />
        </DialogContent>
      </Dialog>
    </div>
  )
}
