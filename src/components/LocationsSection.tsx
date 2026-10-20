'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, X, Loader2, Navigation } from 'lucide-react';
import { supabase, City, Site } from '@/lib/supabase';
import SiteDetailModal from './SiteDetailModal';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <Loader2 className="w-8 h-8 animate-spin text-red-500" />
    </div>
  ),
});

const cityImages: Record<string, string> = {
  Salem: '🏛️',
  Chennai: '🌊',
  Dharmapuri: '🏔️',
};

const cityDescriptions: Record<string, string> = {
  Salem: 'Steel city of Tamil Nadu with bustling commercial hubs and major highway junctions',
  Chennai: 'Capital city with massive IT corridors, shopping districts, and premium advertising spots',
  Dharmapuri: 'Growing district with strategic highway locations and expanding commercial areas',
};

export default function LocationsSection() {
  const [cities, setCities] = useState<City[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [citiesRes, sitesRes] = await Promise.all([
        supabase.from('cities').select('*').order('name'),
        supabase.from('sites').select('*, cities(*)').order('name'),
      ]);
      if (citiesRes.data) setCities(citiesRes.data);
      if (sitesRes.data) setSites(sitesRes.data as Site[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    setShowMap(true);
  };

  const handleSiteClick = useCallback((site: Site) => {
    setSelectedSite(site);
  }, []);

  const citySites = selectedCity
    ? sites.filter((s) => s.city_id === selectedCity.id)
    : [];

  const availableCount = (cityId: string) =>
    sites.filter((s) => s.city_id === cityId && s.status === 'available').length;
  const totalCount = (cityId: string) =>
    sites.filter((s) => s.city_id === cityId).length;

  return (
    <section id="locations" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-50 rounded-full blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2" />
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Navigation className="w-4 h-4" />
            Our Locations
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mt-2 mb-6">
            Explore <span className="gradient-text">Billboard Sites</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Click on a city to explore available billboard locations on an interactive map. 
            Green pins are available, red pins are booked.
          </p>
        </div>

        {/* City Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCityClick(city)}
                className={`group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  selectedCity?.id === city.id
                    ? 'bg-red-600 text-white shadow-xl ring-4 ring-red-300'
                    : 'bg-white text-gray-900 shadow-md hover:shadow-xl'
                }`}
              >
                <div className="text-5xl mb-4">{cityImages[city.name] || '📍'}</div>
                <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                <p className={`text-sm mb-4 ${selectedCity?.id === city.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {cityDescriptions[city.name] || 'Billboard advertising locations'}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className={`text-sm font-medium ${selectedCity?.id === city.id ? 'text-white/90' : 'text-gray-600'}`}>
                      {availableCount(city.id)} Available
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className={`w-4 h-4 ${selectedCity?.id === city.id ? 'text-white/70' : 'text-gray-400'}`} />
                    <span className={`text-sm ${selectedCity?.id === city.id ? 'text-white/70' : 'text-gray-400'}`}>
                      {totalCount(city.id)} Total
                    </span>
                  </div>
                </div>
                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full ${
                  selectedCity?.id === city.id ? 'bg-white/10' : 'bg-red-50 group-hover:bg-red-100'
                } transition-colors`} />
              </button>
            ))}
          </div>
        )}

        {/* Map Modal */}
        {showMap && selectedCity && (
          <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowMap(false)}>
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col animate-slide-up overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Map Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{cityImages[selectedCity.name] || '📍'}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedCity.name} Billboard Sites</h3>
                    <p className="text-sm text-gray-500">
                      {availableCount(selectedCity.id)} available out of {totalCount(selectedCity.id)} sites
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Legend */}
                  <div className="hidden sm:flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-gray-600">Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-gray-600">Maintenance</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMap(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 relative">
                <MapView
                  center={[selectedCity.lat, selectedCity.lng]}
                  zoom={selectedCity.zoom_level}
                  sites={citySites}
                  onSiteClick={handleSiteClick}
                />
              </div>

              {/* Sites list at bottom */}
              <div className="border-t bg-gray-50 p-3 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {citySites.map((site) => (
                    <button
                      key={site.id}
                      onClick={() => handleSiteClick(site)}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all text-left whitespace-nowrap"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        site.status === 'available' ? 'bg-green-500' : site.status === 'booked' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{site.name}</p>
                        <p className="text-[10px] text-gray-500">₹{site.rate_monthly?.toLocaleString('en-IN')}/mo • {site.size}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Site Detail Modal */}
        {selectedSite && (
          <SiteDetailModal site={selectedSite} onClose={() => setSelectedSite(null)} />
        )}
      </div>
    </section>
  );
}
