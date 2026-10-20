'use client';

import { useEffect, useRef } from 'react';
import { Award, Eye, Target, Users, Zap, Shield, TrendingUp, Building2 } from 'lucide-react';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) {
      el.querySelectorAll('.reveal').forEach((child) => observer.observe(child));
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function About() {
  const sectionRef = useReveal();

  const features = [
    {
      icon: Eye,
      title: 'Maximum Visibility',
      description: 'Strategically placed billboards at high-traffic junctions, highways, and commercial areas for maximum brand exposure.',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: Target,
      title: 'Prime Locations',
      description: 'Handpicked locations across Salem, Chennai, and Dharmapuri targeting diverse demographics and audiences.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Massive Reach',
      description: 'Our billboards reach lakhs of commuters, shoppers, and travelers daily across Tamil Nadu.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'From booking to installation, we ensure your campaign goes live within the shortest turnaround time.',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Premium quality printing, durable materials, and regular maintenance to keep your ads looking fresh.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Award,
      title: '50+ Years Experience',
      description: 'Over five decades of expertise in outdoor advertising, trusted by hundreds of businesses across Tamil Nadu.',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden" ref={sectionRef}>
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20 reveal">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Building2 className="w-4 h-4" />
            About Us
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mt-2 mb-6">
            Why Choose{' '}
            <span className="gradient-text">Moorthy Arts</span>?
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Moorthy Arts has been a trusted name in outdoor advertising across Tamil Nadu for over 50 years. 
            We specialize in billboard and hoarding advertising, helping businesses of all sizes amplify their 
            brand presence through strategically placed outdoor media.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              Our Journey
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
              From Salem to <span className="text-red-600">Tamil Nadu</span>
            </h3>
            <p className="text-gray-500 mb-5 leading-relaxed">
              Founded with a vision to transform outdoor advertising in Tamil Nadu, Moorthy Arts started 
              its journey in Salem and has since expanded to Chennai and Dharmapuri. What began as a small 
              signage business has grown into one of the most reliable billboard advertising companies in the region.
            </p>
            <p className="text-gray-500 mb-5 leading-relaxed">
              We understand that every location tells a different story. That&apos;s why we carefully select our 
              billboard sites based on traffic patterns, visibility angles, and audience demographics to ensure 
              your advertising investment delivers maximum returns.
            </p>
            <p className="text-gray-500 leading-relaxed">
              From local businesses to national brands, we&apos;ve helped hundreds of clients make their mark 
              in the outdoor advertising space. Our commitment to quality, transparency, and customer satisfaction 
              sets us apart.
            </p>
          </div>
          <div className="reveal">
            <div className="relative">
              {/* Decorative elements behind stats */}
              <div className="absolute -inset-4 bg-gradient-to-br from-red-100 via-yellow-50 to-red-50 rounded-3xl rotate-2" />
              <div className="absolute -inset-4 bg-gradient-to-br from-red-50 via-white to-yellow-50 rounded-3xl -rotate-1" />
              
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '3', label: 'Cities Covered', color: 'text-red-600', bg: 'bg-red-50' },
                    { value: '15+', label: 'Billboard Sites', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { value: '500+', label: 'Happy Clients', color: 'text-green-600', bg: 'bg-green-50' },
                    { value: '50+', label: 'Years Experience', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                  ].map((stat, i) => (
                    <div key={i} className={`text-center p-5 ${stat.bg} rounded-2xl hover-lift`}>
                      <div className={`text-4xl sm:text-5xl font-black ${stat.color}`}>{stat.value}</div>
                      <div className="text-gray-500 text-sm mt-2 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="reveal group relative p-7 rounded-2xl bg-white border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
              
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              
              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
