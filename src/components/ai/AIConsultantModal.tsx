import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  RotateCcw,
  ArrowUpRight,
  Terminal,
  Layers,
  Zap,
  Globe,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { api } from '../../lib/api';
import { AIChatMessage } from '../../types';

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferToContact: (scopeText: string) => void;
}

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({
  isOpen,
  onClose,
  onTransferToContact
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: "Welcome to Velora Labs. I'm your **AI Systems Architect & Technical Consultant**.\n\nI can help you evaluate tech stacks, estimate MVP timelines, design autonomous n8n workflows, plan headless e-commerce migrations, or structure growth acquisition funnels.\n\nWhat digital system or architecture would you like to explore today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: 'SaaS MVP Timeline & Stack', text: 'What is the recommended tech stack, database, and timeline for building a scalable B2B SaaS MVP with multi-tenant auth and Stripe billing?' },
    { label: 'Shopify Plus vs Headless Next.js', text: 'How do I decide between standard Shopify Plus and a Headless Next.js storefront for an international brand?' },
    { label: 'AI Lead Automation with n8n', text: 'How can we build an autonomous AI lead enrichment and CRM triage pipeline using n8n and GoHighLevel?' },
    { label: 'Growth & Paid Ads Strategy', text: 'What is the ideal growth testing strategy for scaling a B2B SaaS or E-commerce brand using Google & Meta Ads?' },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: prompt.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await api.consultAI(updatedMessages);
      const botMessage: AIChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'model',
        text: response.text,
        timestamp: response.timestamp
      };
      setMessages([...updatedMessages, botMessage]);
    } catch (err: any) {
      console.warn("AI consult request fallback handling:", err);
      // Even if network drops, fetch an instant architectural response
      setMessages([
        ...updatedMessages,
        {
          id: 'bot-fb-' + Date.now(),
          role: 'model',
          text: `### **Velora Labs Architecture Scoping**\n\nThank you for sharing your project specifications regarding: **"${prompt.trim()}"**.\n\nOur multidisciplinary team specializes in high-scale SaaS architectures, autonomous n8n/CRM automation pipelines, headless commerce, and performance marketing.\n\n**Next Steps:** Click **"Transfer Scope to RFP Form"** below to route your specifications directly to our senior engineering partners for a tailored sprint proposal.`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-msg-' + Date.now(),
        role: 'model',
        text: "Conversation reset. What system or architectural challenge can I help you scope today?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl h-[85vh] max-h-[800px] rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-white">
                  Velora AI Architecture Advisor
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Multidisciplinary Engineering & Scoping Consultant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-neutral-800 text-white'
                    : 'bg-indigo-950 border border-indigo-500/40 text-indigo-300'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-800 text-white rounded-tr-none whitespace-pre-wrap'
                    : 'bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-tl-none'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <div className="space-y-2 [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-sm [&_h3]:text-indigo-300 [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_p]:leading-relaxed [&_code]:bg-neutral-950 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-indigo-300 [&_code]:font-mono [&_code]:text-[11px]">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Architecting custom technical blueprint...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-neutral-950/60 border-t border-neutral-900 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-neutral-500 uppercase shrink-0">Prompts:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSend(qp.text)}
              className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <input
              id="ai-scoper-input"
              type="text"
              placeholder="Ask about architecture, tech stacks, or project estimates..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/70"
            />
            <button
              id="ai-scoper-send-btn"
              onClick={() => handleSend()}
              disabled={isLoading || !inputPrompt.trim()}
              className="p-3 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold disabled:opacity-40 transition-colors shadow-md shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="font-mono text-[10px] flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span>Powered by Google Gemini 3.7 Flash</span>
            </span>
            <button
              onClick={() => {
                const userSummary = messages.filter(m => m.role === 'user').map(m => m.text).join('\n');
                onTransferToContact(userSummary);
                onClose();
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Transfer Scope to RFP Form</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
