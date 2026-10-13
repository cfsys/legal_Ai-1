import React, { useState } from 'react';
import { inquiryService } from '../../services/api';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';

const TOPIC_OPTIONS = [
  'General Question',
  'Request a Product Demo',
  'Pricing & Plans',
  'Legal Research & Case Search Help',
  'Document & Contract Review',
  'Partner with Us',
  'Other',
];

export function ContactForm({ source = 'Contact Page', onSuccess, initialSubject = '' }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    organisation: '',
    role: '',
    subject: initialSubject || 'General Question',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = formData.email.trim();
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    if (!fullName) {
      setError('Please tell us your name.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address so we can reply.');
      return;
    }

    if (!formData.message.trim()) {
      setError('Please write a short message.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        kind: 'contact',
        name: fullName,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: trimmedEmail,
        mobile: formData.mobile.trim(),
        organisation: formData.organisation.trim(),
        role: formData.role.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        source,
      };

      const res = await inquiryService.submit(payload);

      const savedItem = res?.data || {
        _id: `MSG-${Date.now().toString(36).toUpperCase()}`,
        name: fullName,
        email: trimmedEmail,
        subject: formData.subject,
      };

      setSubmittedData(savedItem);
      if (onSuccess) onSuccess(savedItem);
    } catch (err) {
      console.error('[ContactForm Error]', err);
      const msg =
        err?.response?.data?.message ||
        'Could not send message right now. Please check your internet connection and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      organisation: '',
      role: '',
      subject: 'General Question',
      message: '',
    });
    setSubmittedData(null);
    setError('');
  };

  // SUCCESS CONFIRMATION STATE - Warm & friendly
  if (submittedData) {
    const ticketId = (submittedData._id || '').slice(-6).toUpperCase() || 'SENT';

    return (
      <div
        className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-sm text-center"
        style={{
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 mb-4">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3">
          Message #{ticketId}
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          Message Sent Successfully!
        </h3>

        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
          Thank you, <span className="font-semibold text-slate-900">{submittedData.name}</span>! We received your message and will email you back at <span className="font-medium text-blue-600">{submittedData.email}</span> as soon as possible.
        </p>

        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 max-w-md mx-auto text-left text-xs text-blue-900 space-y-1.5 mb-6">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span>What happens next:</span>
          </div>
          <p className="pl-6 text-blue-800/90 leading-relaxed">
            • A team member will read your note and get back to you within a few hours.
          </p>
          <p className="pl-6 text-blue-800/90 leading-relaxed">
            • If you provided a phone number, we can also give you a quick friendly call.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  // ACTIVE FORM STATE - Simple, clean, user-friendly
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-5 shadow-sm"
      style={{
        boxShadow: '0 4px 25px -4px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Send Us a Message
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Have a question or need assistance? Fill out the details below and we will get back to you.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Row 1: Name */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            First Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rajesh"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Last Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Verma"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange('email')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Phone Number <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.mobile}
            onChange={handleChange('mobile')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Row 3: Organisation & Role */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Organisation / Law Firm <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Verma Legal Associates"
            value={formData.organisation}
            onChange={handleChange('organisation')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Your Role <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Advocate, Associate, Partner"
            value={formData.role}
            onChange={handleChange('role')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Row 4: Subject Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          What is your message about? <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <select
            value={formData.subject}
            onChange={handleChange('subject')}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
          >
            {TOPIC_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 5: Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Your Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={4}
          required
          placeholder="Type your message or question here..."
          value={formData.message}
          onChange={handleChange('message')}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 leading-relaxed"
        />
      </div>

      {/* Submit Button & User-friendly Privacy Note */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Sending your message…</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="mt-3.5 flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <Lock className="h-3.5 w-3.5 text-emerald-600" />
          <span>Your information is safe and private. We will never spam you.</span>
        </div>
      </div>
    </form>
  );
}

export default ContactForm;
