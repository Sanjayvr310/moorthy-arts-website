'use client';

import { useState } from 'react';
import { X, MapPin, Ruler, Compass, Sun, Car, IndianRupee, MessageCircle, Phone, Send } from 'lucide-react';
import { Site } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface SiteDetailModalProps {
  site: Site;
  onClose: () => void;
}

export default function SiteDetailModal({ site, onClose }: SiteDetailModalProps) {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const statusColor = site.status === 'available' ? 'bg-green-100 text-green-700' : site.status === 'booked' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
  const typeLabel = site.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Hoarding';

  const whatsappMessage = encodeURIComponent(
    `Hi Moorthy Arts! I'm interested in booking the billboard:\n\n📍 Site: ${site.name}\n📌 Location: ${site.address}\n📐 Size: ${site.size}\n💰 Rate: ₹${site.rate_monthly?.toLocaleString('en-IN')}/month\n\nPlease share availability and booking details. Thank you!`
  );
  const whatsappLink = `https://wa.me/919843055281?text=${whatsappMessage}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, site_id: site.id }),
      });
      if (res.ok) {
        toast.success('Inquiry submitted! We will contact you soon.');
        setShowInquiryForm(false);
        setFormData({ client_name: '', client_phone: '', client_email: '', message: '' });
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-t-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{site.name}</h2>
              <p className="text-white/80 text-sm mt-1">{site.address}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
              {site.status?.charAt(0).toUpperCase() + site.status?.slice(1)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
              {typeLabel}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          {/* Price */}
          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Rate</p>
                <p className="text-2xl font-bold text-red-600 flex items-center">
                  <IndianRupee className="w-5 h-5" />
                  {site.rate_monthly?.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Yearly Rate</p>
                <p className="text-lg font-semibold text-gray-700 flex items-center justify-end">
                  <IndianRupee className="w-4 h-4" />
                  {site.rate_yearly?.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Ruler className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Size</p>
                <p className="text-sm font-semibold text-gray-800">{site.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Compass className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Facing</p>
                <p className="text-sm font-semibold text-gray-800">{site.facing}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Sun className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Illumination</p>
                <p className="text-sm font-semibold text-gray-800">{site.illumination ? 'Yes (Lit)' : 'No (Non-lit)'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Car className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Traffic</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{site.traffic_info?.split(' - ')[0]}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {site.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">About this site</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{site.description}</p>
            </div>
          )}

          {/* Booking Actions */}
          {site.status === 'available' ? (
            <>
              {!showInquiryForm ? (
                <div className="space-y-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Book via WhatsApp
                  </a>
                  <button
                    onClick={() => setShowInquiryForm(true)}
                    className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    Send Inquiry
                  </button>
                  <a
                    href="tel:+919843055281"
                    className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-red-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us Directly
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Send Inquiry</h3>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Message (optional)"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowInquiryForm(false)}
                      className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                    >
                      {submitting ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-sm mb-3">
                This site is currently booked
                {site.booked_until ? ` until ${new Date(site.booked_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}.
                Contact us to reserve it for after this date.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Ask on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
