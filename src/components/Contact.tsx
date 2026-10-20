'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) el.querySelectorAll('.reveal').forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Contact() {
  const sectionRef = useReveal();
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Message sent! We will get back to you soon.');
        setFormData({ client_name: '', client_phone: '', client_email: '', message: '' });
      } else {
        toast.error('Failed to send. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  const contactItems = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 98430 55281',
      href: 'tel:+919843055281',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: 'Chat with us instantly',
      href: 'https://wa.me/919843055281?text=Hi%20Moorthy%20Arts!%20I%27m%20interested%20in%20billboard%20advertising.',
      color: 'from-green-500 to-emerald-500',
      external: true,
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'moorthyooh@gmail.com',
      href: 'mailto:moorthyooh@gmail.com',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'Salem, Tamil Nadu, India',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 7:00 PM',
      color: 'from-yellow-500 to-amber-500',
    },
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden" ref={sectionRef}>
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-50 rounded-full blur-3xl opacity-30 -translate-y-1/2" />
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Get In Touch
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mt-2 mb-6">
            Contact <span className="gradient-text">Us</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Ready to boost your brand visibility? Get in touch with us for billboard bookings, 
            pricing inquiries, or any questions.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 reveal">
            <h3 className="text-2xl font-black text-gray-900 mb-3">Let&apos;s Talk Billboard Advertising</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Whether you&apos;re a local business or a national brand, we have the perfect billboard 
              location for your campaign. Reach out and let&apos;s make your brand unmissable!
            </p>

            <div className="space-y-4">
              {contactItems.map((item, i) => (
                <div key={i} className="group">
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-transparent hover:shadow-lg transition-all duration-300 hover:-translate-x-1"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.title}</p>
                        <p className="text-gray-800 font-semibold group-hover:text-red-600 transition-colors">{item.content}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100">
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.title}</p>
                        <p className="text-gray-800 font-semibold">{item.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 reveal">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-red-100 via-yellow-50 to-red-50 rounded-3xl rotate-1 opacity-60" />
              <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Send us a message</h3>
                <p className="text-sm text-gray-400 mb-6">We&apos;ll get back to you within 24 hours</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.client_phone}
                        onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors resize-none"
                      placeholder="Tell us about your advertising needs..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Send className="w-5 h-5" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
