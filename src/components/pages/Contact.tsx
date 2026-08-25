import React, { useState, useRef } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { api } from '../../lib/api';
import { ServicePillar } from '../../types';

interface ContactProps {
  openAIConsultant: () => void;
}

export const Contact: React.FC<ContactProps> = ({ openAIConsultant }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'saas' as ServicePillar | 'full_systems',
    budget: '$35k - $75k',
    timeline: '1 - 2 months',
    message: '',
  });

  // Anti-spam security controls
  const [honeyToken, setHoneyToken] = useState('');
  const renderedAtRef = useRef<number>(Date.now());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ message: string; emailDelivered?: boolean } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Please provide your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      setErrorMessage('Please provide a brief overview of your project requirements (at least 10 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitInquiry({
        name: trimmedName,
        email: trimmedEmail,
        company: formData.company.trim(),
        service: formData.service,
        budget: formData.budget,
        timeline: formData.timeline,
        message: trimmedMessage,
        honey_token: honeyToken,
        renderedAt: renderedAtRef.current,
      });

      setSuccessResponse({
        message: res.message || 'Inquiry successfully transmitted.',
        emailDelivered: res.emailDelivered,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit RFP. Please check your connection or email info.veloralabss@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSuccessResponse(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      service: 'saas',
      budget: '$35k - $75k',
      timeline: '1 - 2 months',
      message: '',
    });
    setHoneyToken('');
    renderedAtRef.current = Date.now();
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
          // Direct Engagement RFP
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
          Start a Strategic Project
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          Tell us about your digital systems roadmap. Every inquiry is reviewed directly by our managing partners, with response times under 24 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Inquiry Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-neutral-900/40 border border-neutral-800 shadow-2xl">
          {isSuccess ? (
            <div className="py-12 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Strategic Brief Transmitted
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                {successResponse?.message || `Thank you. Our senior solutions architects are reviewing your specifications and will deliver a structured roadmap response to your inbox.`}
              </p>

              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Client Recipient:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Managing Notification:</span>
                  <span className="font-mono text-slate-300">info.veloralabss@gmail.com</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Guaranteed SLA:</span>
                  <span className="text-emerald-400 font-medium">&lt; 24 Business Hours</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Submit Another Scope</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Spam bot honeypot trap field (hidden from legitimate users) */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}>
                <label htmlFor="honey_token">Leave this field blank</label>
                <input
                  type="text"
                  id="honey_token"
                  name="honey_token"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeyToken}
                  onChange={(e) => setHoneyToken(e.target.value)}
                />
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 flex items-start gap-3 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block text-rose-200">Transmission Error</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contact-name-input" className="block text-xs font-mono uppercase text-neutral-300 tracking-wider">
                    Full Name *
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Julian Thorne"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/70 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email-input" className="block text-xs font-mono uppercase text-neutral-300 tracking-wider">
                    Work Email *
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    maxLength={150}
                    placeholder="julian@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/70 transition-colors"
                  />
                </div>
              </div>

              {/* Company & Core Discipline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contact-company-input" className="block text-xs font-mono uppercase text-neutral-300 tracking-wider">
                    Company / Organization
                  </label>
                  <input
                    id="contact-company-input"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Apex Health Technologies"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/70 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-service-select" className="block text-xs font-mono uppercase text-neutral-300 tracking-wider">
                    Primary Service Focus
                  </label>
                  <select
                    id="contact-service-select"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500/70 transition-colors"
                  >
                    <option value="saas">SaaS Product Engineering & MVP</option>
                    <option value="website">Websites & Headless Commerce</option>
                    <option value="automation">AI & Intelligent Automation</option>
                    <option value="marketing">Performance Marketing & CRO</option>
                    <option value="full_systems">Full-Scale Digital Systems (Multi-Pillar)</option>
                  </select>
                </div>
              </div>

              {/* Budget Range & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contact-budget-select" className="block text-xs font-mono uppercase text-neutral-300 tracking-wider">
                    Target Capital Range
                  </label>
                  <select
                    id="contact-budget-select"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500/70 transition-colors"
                  >
                    <option value="$10k - $25k">$10k - $25k (Targeted Module)</option>
                    <option value="$25k - $50k">$25k - $50k (Core Build / MVP)</option>
                    <option value="$50k - $100k">$50k - $100k (Full-Scale System)</option>
                    <option value="$100k+">$100k+ (Enterprise Overhaul)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-timeline-select" className="block text-xs font-mono uppercase text-neutral-300 tracking-wider">
                    Execution Timeline
                  </label>
                  <select
                    id="contact-timeline-select"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500/70 transition-colors"
                  >
                    <option value="Immediate (< 2 weeks)">Immediate (&lt; 2 weeks)</option>
                    <option value="1 - 2 months">1 - 2 months (Standard Sprint)</option>
                    <option value="Q3/Q4 Roadmap">Q3/Q4 Roadmap Planning</option>
                  </select>
                </div>
              </div>

              {/* Project Message */}
              <div className="space-y-2">
                <label htmlFor="contact-message-input" className="block text-xs font-mono uppercase text-neutral-300 tracking-wider">
                  Project Scope & Technical Goals *
                </label>
                <textarea
                  id="contact-message-input"
                  required
                  rows={4}
                  maxLength={5000}
                  placeholder="Describe your current tech stack, operational bottlenecks, or conversion targets..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/70 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                id="contact-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Encrypted RFP...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Strategic RFP</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected by server-side SMTP encryption & anti-spam validation.</span>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Direct Info & AI Advisor Pitch */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Scoping Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-neutral-900 to-indigo-950/40 border border-indigo-500/30 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Not sure about architecture or stack?</span>
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Consult the Velora AI Systems Advisor
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Get an instant conversational breakdown of recommended tech stacks, sprint milestones, and estimated budgets based on our real production case studies.
            </p>
            <button
              onClick={openAIConsultant}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Instant AI Scoper</span>
            </button>
          </div>

          {/* Direct Partner Contacts */}
          <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-5">
            <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
              Direct Contact Lines
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">General & Lead Inquiries</div>
                  <a href="mailto:info.veloralabss@gmail.com" className="text-cyan-400 hover:underline font-mono transition-colors">
                    info.veloralabss@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Guaranteed Response SLA</div>
                  <div className="text-neutral-400">Direct response within 24 business hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Global Studio Locations</div>
                  <div className="text-neutral-400">San Francisco · London · Zurich</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
