'use client';

import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600" />
      
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black">Moorthy Arts</h3>
                <p className="text-[9px] uppercase tracking-[0.2em] text-red-400">Billboard Advertising</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium outdoor advertising solutions across Tamil Nadu. Making your brand visible to millions.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/919843055281" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 rounded-xl flex items-center justify-center transition-all">
                <svg className="w-5 h-5 fill-current text-gray-400 hover:text-green-400" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="tel:+919843055281" 
                className="w-10 h-10 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-xl flex items-center justify-center transition-all">
                <Phone className="w-4 h-4 text-gray-400" />
              </a>
              <a href="mailto:moorthyooh@gmail.com" 
                className="w-10 h-10 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 rounded-xl flex items-center justify-center transition-all">
                <Mail className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Locations', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-red-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-red-400 transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <a href="/admin" className="text-gray-400 hover:text-red-400 text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-red-400 transition-colors" />
                  Admin
                </a>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Our Cities</h4>
            <ul className="space-y-3">
              {[
                { name: 'Salem', desc: '5+ billboard sites' },
                { name: 'Chennai', desc: '6+ billboard sites' },
                { name: 'Dharmapuri', desc: '4+ billboard sites' },
              ].map((city) => (
                <li key={city.name}>
                  <a href="#locations" className="group">
                    <p className="text-gray-400 hover:text-red-400 text-sm transition-colors flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-600 group-hover:text-red-400 transition-colors" />
                      {city.name}
                    </p>
                    <p className="text-gray-600 text-xs ml-5.5">{city.desc}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Contact Us</h4>
            <div className="space-y-4">
              <a href="tel:+919843055281" className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors group">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:border-red-500/30 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-sm">+91 98430 55281</p>
                </div>
              </a>
              <a href="mailto:moorthyooh@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors group">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:border-red-500/30 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm">moorthyooh@gmail.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Office</p>
                  <p className="text-sm">Salem, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Moorthy Arts. All rights reserved.
          </p>
          <a
            href="#home"
            className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm transition-colors group"
          >
            Back to top
            <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:border-red-500/30 group-hover:-translate-y-1 transition-all">
              <ArrowUp className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
