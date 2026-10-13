import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Eyebrow } from '@/components/shared/ui';
import { Reveal } from '@/components/shared/Reveal';
import { usePageMeta } from '@/components/shared/ScrollToTop';
import { ContactForm } from '@/components/marketing/ContactForm';
import {
  Briefcase,
  LifeBuoy,
  Handshake,
  Building2,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const CONTACT_CHANNELS = [
  {
    icon: Briefcase,
    title: 'Sales & Law Firm Plans',
    email: 'sales@legalai.in',
    phone: '+91 (022) 6982 4100',
    desc: 'Speak with our team about pricing, team plans, and custom onboarding.',
    accent: '#2563eb',
  },
  {
    icon: LifeBuoy,
    title: 'Customer & Technical Support',
    email: 'support@legalai.in',
    phone: '+91 (011) 4920 1800',
    desc: 'Need help with your account, search features, or documents? We are here for you.',
    accent: '#059669',
  },
  {
    icon: Handshake,
    title: 'Partnerships & Academic Programs',
    email: 'partners@legalai.in',
    desc: 'Special programs for universities, law schools, and bar associations.',
    accent: '#7c3aed',
  },
  {
    icon: Building2,
    title: 'General & Office Inquiries',
    email: 'hello@legalai.in',
    desc: 'For all other questions, press inquiries, and general feedback.',
    accent: '#0f172a',
  },
];

const LOCATIONS = [
  {
    city: 'New Delhi',
    address: 'Barakhamba Road, Connaught Place, New Delhi - 110001',
    proximity: 'Central location near Supreme Court & High Court',
  },
  {
    city: 'Mumbai',
    address: 'Bandra Kurla Complex (BKC), G Block, Mumbai - 400051',
    proximity: 'Convenient access across Mumbai financial center',
  },
  {
    city: 'Bengaluru',
    address: 'Indiranagar 100ft Road, Bengaluru - 560038',
    proximity: 'Tech & engineering center',
  },
];

export default function Contact() {
  usePageMeta(
    'Contact Us — Legal AI Support & Sales',
    'Get in touch with the Legal AI team for help, questions, demos, and partnerships.'
  );

  return (
    <div className="bg-slate-50/50 min-h-screen py-16 lg:py-24">
      <Container>
        {/* Page Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <Reveal>
            <Eyebrow>We are here to help</Eyebrow>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Get in Touch with Us
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Have a question, need assistance, or want to see a live demo? Send us a message and our team will get back to you shortly.
            </p>
          </Reveal>
        </div>

        {/* 2-Column Grid: Left Form, Right Contact Info */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <Reveal>
              <ContactForm source="Contact Us Page" />
            </Reveal>
          </div>

          {/* Right Column: Contact Channels & Locations (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Response Guarantee Box */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs tracking-wide mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Quick & Friendly Assistance</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  We usually respond within 2 to 4 hours
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  During business hours (Monday to Friday, 9:30 AM – 6:30 PM), our team reviews every incoming message promptly.
                </p>
              </div>
            </Reveal>

            {/* Channels List */}
            <Reveal delay={0.15}>
              <div className="space-y-3">
                {CONTACT_CHANNELS.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <div
                      key={ch.title}
                      className="rounded-xl border border-slate-200/90 bg-white p-4.5 sm:p-5 flex items-start gap-4 shadow-sm hover:border-slate-300 transition-all"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${ch.accent}12`, color: ch.accent }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900">{ch.title}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <a
                            href={`mailto:${ch.email}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {ch.email}
                          </a>
                          {ch.phone && (
                            <span className="text-slate-600 font-medium">{ch.phone}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {ch.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            {/* Locations Card */}
            <Reveal delay={0.2}>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  <span>Our Locations</span>
                </div>
                <div className="space-y-3 divide-y divide-slate-100">
                  {LOCATIONS.map((loc) => (
                    <div key={loc.city} className="pt-2.5 first:pt-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-800">{loc.city}</p>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                          Office
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{loc.address}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{loc.proximity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* FAQ Link */}
            <Reveal delay={0.25}>
              <Link
                to="/resources/help"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                  <span>Looking for answers right away? Visit our Help Center</span>
                </div>
                <span>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}
