'use client';

import { MapPin, Phone, ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/video_ma.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay on top of video for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-slate-950/70 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      
      {/* Animated orbs (subtle, on top of video) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] bg-red-400/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Decorative rotating ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] opacity-[0.07]">
        <div className="w-full h-full border-2 border-white rounded-full animate-rotate-slow" />
        <div className="absolute inset-8 border border-white/50 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        <div className="absolute inset-16 border border-white/30 rounded-full animate-rotate-slow" style={{ animationDuration: '40s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8 animate-fade-in hover-scale cursor-default">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-white/90 text-sm font-medium tracking-wide">Salem • Chennai • Dharmapuri</span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>

        {/* Main heading */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-6 animate-slide-up tracking-tight">
          <span className="block drop-shadow-2xl">Moorthy</span>
          <span className="block gradient-text text-7xl sm:text-8xl md:text-9xl lg:text-[10rem]">
            Arts
          </span>
        </h1>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500" />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-glow" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500" />
        </div>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-3 max-w-3xl mx-auto animate-slide-up font-light tracking-wide" style={{ animationDelay: '0.2s' }}>
          Premium Billboard & Hoarding Advertising
        </p>
        <p className="text-base sm:text-lg text-white/50 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Dominate the outdoor advertising space across Tamil Nadu with strategically placed billboards in high-traffic locations
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto mb-14 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {[
            { value: '3', label: 'Cities', delay: '0.5s' },
            { value: '15+', label: 'Sites', delay: '0.6s' },
            { value: '50+', label: 'Years', delay: '0.7s' },
          ].map((stat, i) => (
            <div key={i} className="text-center glass rounded-2xl p-4 sm:p-6 hover-lift animate-count-up" style={{ animationDelay: stat.delay }}>
              <div className="text-3xl sm:text-5xl font-black text-white animate-text-glow">{stat.value}</div>
              <div className="text-white/50 text-xs sm:text-sm mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <a
            href="#locations"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40 hover:scale-105 active:scale-95"
          >
            <MapPin className="w-5 h-5 group-hover:animate-bounce" />
            Explore Locations
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 glass hover:bg-white/20 text-white px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 active:scale-95 animate-border-dance border-2"
          >
            <Phone className="w-5 h-5" />
            Contact Us
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#about" className="flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
