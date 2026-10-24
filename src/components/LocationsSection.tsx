'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Loader2, Navigation, ChevronRight, ArrowLeft, LayoutGrid } from 'lucide-react';
import { supabase, City, Area, Site } from '@/lib/supabase';
import SiteDetailModal from './SiteDetailModal';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <Loader2 className="w-8 h-8 animate-spin text-red-500" />
    </div>
  ),
});

const cityEmoji: Record<string, string> = {
  Salem: '🏛️',
  Chennai: '🌊',
  Dharmapuri: '🏔️',
};

const cityDescriptions: Record<string, string> = {
  Salem: 'Steel city of Tamil Nadu with bustling commercial hubs and major highway junctions',
  Chennai: 'Capital city with massive IT corridors, shopping districts, and premium advertising spots',
  Dharmapuri: 'Growing district with strategic highway locations and expanding commercial areas',
};

type Step = 'cities' | 'areas' | 'sites';

export default function LocationsSection() {
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('cities');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [citiesRes, areasRes, sitesRes] = await Promise.all([
        supabase.from('cities').select('*').order('name'),
        supabase.from('areas').select('*').order('name'),
        supabase.from('sites').select('*, cities(*), areas(*)').order('name'),
      ]);
      if (citiesRes.data) setCities(citiesRes.data);
      if (areasRes.data) setAreas(areasRes.data as Area[]);
      if (sitesRes.data) setSites(sitesRes.data as Site[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSiteClick = useCallback((site: Site) => setSelectedSite(site), []);
  const cityAreas = selectedCity ? areas.filter((a) => a.city_id === selectedCity.id) : [];
  const areaSites = selectedArea ? sites.filter((s) => s.area_id === selectedArea.id) : [];
  const cityAvailable = (id: string) => sites.filter((s) => s.city_id === id && s.status === 'available').length;
  const cityTotal = (id: string) => sites.filter((s) => s.city_id === id).length;
  const areaAvailable = (id: string) => sites.filter((s) => s.area_id === id && s.status === 'available').length;
  const areaTotal = (id: string) => sites.filter((s) => s.area_id === id).length;
  const goToCities = () => { setStep('cities'); setSelectedCity(null); setSelectedArea(null); };
  const goToAreas = () => { setStep('areas'); setSelectedArea(null); };
  const handleCityClick = (city: City) => { setSelectedCity(city); setSelectedArea(null); setStep('areas'); };
  const handleAreaClick = (area: Area) => { setSelectedArea(area); setStep('sites'); };
  const handleBack = () => step === 'sites' ? goToAreas() : goToCities();
  const mapCenter: [number, number] = selectedArea
    ? [selectedArea.lat, selectedArea.lng]
    : selectedCity ? [selectedCity.lat, selectedCity.lng] : [11.6643, 78.146];
  const mapZoom = selectedArea ? 14 : selectedCity ? (selectedCity.zoom_level ?? 13) : 12;

  return (
    <section id="locations" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-50 rounded-full blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Navigation className="w-4 h-4" /> Our Locations
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mt-2 mb-6">
            Explore <span className="text-red-600">Billboard Sites</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Browse prime billboard locations. Select a city, pick an area, then choose your site.
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-red-500" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm mb-8">
              <button onClick={goToCities} className={`font-medium ${step === 'cities' ? 'text-red-600' : 'text-gray-400 hover:text-gray-700'}`}>All Cities</button>
              {selectedCity && (<><ChevronRight className="w-4 h-4 text-gray-300" /><button onClick={goToAreas} className={`font-medium ${step === 'areas' ? 'text-red-600' : 'text-gray-400 hover:text-gray-700'}`}>{selectedCity.name}</button></>)}
              {selectedArea && (<><ChevronRight className="w-4 h-4 text-gray-300" /><span className="font-medium text-red-600">{selectedArea.name}</span></>)}
            </div>
            {step === 'cities' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city) => (
                  <button key={city.id} onClick={() => handleCityClick(city)}
                    className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300 overflow-hidden">
                    <div className="bg-gradient-to-br from-red-500 to-red-700 h-32 flex items-center justify-center text-6xl">
                      {cityEmoji[city.name] || '📍'}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{city.name}</h3>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 mt-0.5" />
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{cityDescriptions[city.name] || 'Prime billboard locations.'}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />{cityAvailable(city.id)} available
                        </span>
                        <span className="text-gray-400">{cityTotal(city.id)} total</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {step === 'areas' && selectedCity && (
              <div>
                <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to cities
                </button>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCity.name} — Select an Area</h3>
                  <p className="text-gray-500 mt-1">{cityAreas.length} area{cityAreas.length !== 1 ? 's' : ''} available</p>
                </div>
                {cityAreas.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No areas defined yet for {selectedCity.name}</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cityAreas.map((area) => (
                      <button key={area.id} onClick={() => handleAreaClick(area)}
                        className="group text-left bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 p-5 transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{area.name}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">{areaTotal(area.id)} site{areaTotal(area.id) !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 mt-1" />
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />{areaAvailable(area.id)} available
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {step === 'sites' && selectedArea && selectedCity && (
              <div>
                <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to {selectedCity.name} areas
                </button>
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedArea.name}, {selectedCity.name}</h3>
                    <p className="text-gray-500 mt-1">{areaAvailable(selectedArea.id)} available of {areaTotal(selectedArea.id)} sites</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-gray-600">Available</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-gray-600">Booked</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500" /><span className="text-gray-600">Maintenance</span></div>
                  </div>
                </div>
                <div className="h-72 rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-6">
                  <MapView center={mapCenter} zoom={mapZoom} sites={areaSites} onSiteClick={() => {}} readOnly />
                </div>
                {areaSites.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No sites in this area yet</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {areaSites.map((site) => (
                      <button key={site.id} onClick={() => handleSiteClick(site)}
                        className="group text-left bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 p-4 transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${site.status === 'available' ? 'bg-green-500' : site.status === 'booked' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">{site.name}</p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{site.address}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs">
                              <span className="text-red-600 font-semibold">₹{site.rate_monthly?.toLocaleString('en-IN')}/mo</span>
                              <span className="text-gray-300">·</span>
                              <span className="text-gray-500">{site.size}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {selectedSite && <SiteDetailModal site={selectedSite} onClose={() => setSelectedSite(null)} />}
    </section>
  );
}
