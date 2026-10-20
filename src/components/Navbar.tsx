'use client';

import { useState, useEffect } from 'react';
import { MapPin, Menu, X, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#locations', label: 'Locations' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              scrolled 
                ? 'bg-gradient-to-br from-red-500 to-red-700' 
                : 'bg-white/10 backdrop-blur-sm border border-white/20'
            }`}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-black tracking-tight transition-colors ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Moorthy Arts
              </h1>
              <p className={`text-[9px] uppercase tracking-[0.2em] font-medium transition-colors ${
                scrolled ? 'text-red-500' : 'text-white/60'
              }`}>
                Billboard Advertising
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                  scrolled
                    ? 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-500 rounded-full group-hover:w-6 transition-all duration-300" />
              </a>
            ))}
            <div className={`w-px h-6 mx-2 ${scrolled ? 'bg-gray-200' : 'bg-white/20'}`} />
            <a
              href="tel:+919876543210"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                scrolled
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300'
                  : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-all ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 mt-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-bold shadow-md"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
