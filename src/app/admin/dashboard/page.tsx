'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Site, City, Area, Inquiry } from '@/lib/supabase';
import {
  MapPin, LogOut, LayoutDashboard, Map, MessageSquare, Plus, Edit2, Trash2,
  CheckCircle, XCircle, Phone as PhoneIcon, Mail, Clock, ChevronDown, X, Loader2, Home
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

type Tab = 'dashboard' | 'sites' | 'areas' | 'inquiries';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sites, setSites] = useState<Site[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [siteFilter, setSiteFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [sitesRes, citiesRes, areasRes, inquiriesRes] = await Promise.all([
      fetch('/api/admin/sites'),
      fetch('/api/admin/cities'),
      fetch('/api/admin/areas'),
      fetch('/api/admin/inquiries'),
    ]);
    const sitesData = await sitesRes.json();
    const citiesData = await citiesRes.json();
    const areasData = await areasRes.json();
    const inquiriesData = await inquiriesRes.json();
    if (Array.isArray(sitesData)) setSites(sitesData);
    if (Array.isArray(citiesData)) setCities(citiesData);
    if (Array.isArray(areasData)) setAreas(areasData);
    if (Array.isArray(inquiriesData)) setInquiries(inquiriesData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const handleDeleteSite = async (id: string) => {
    if (!confirm('Are you sure you want to delete this site?')) return;
    const res = await fetch(`/api/admin/sites?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Site deleted');
      fetchData();
    } else {
      toast.error('Failed to delete site');
    }
  };

  const handleUpdateSiteStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/sites', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success('Status updated');
      fetchData();
    } else {
      toast.error('Failed to update');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/inquiries', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success('Inquiry updated');
      fetchData();
    } else {
      toast.error('Failed to update');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Inquiry deleted');
      fetchData();
    }
  };

  const filteredSites = siteFilter === 'all' ? sites : sites.filter(s => s.status === siteFilter);
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const availableSites = sites.filter(s => s.status === 'available').length;
  const bookedSites = sites.filter(s => s.status === 'booked').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Top Nav */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Moorthy Arts</h1>
                <p className="text-[10px] text-gray-400 -mt-0.5">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <Home className="w-5 h-5" />
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
            { id: 'sites' as Tab, label: 'Sites', icon: Map, badge: sites.length },
            { id: 'areas' as Tab, label: 'Areas', icon: MapPin, badge: areas.length },
            { id: 'inquiries' as Tab, label: 'Inquiries', icon: MessageSquare, badge: newInquiries },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Total Sites</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{sites.length}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{availableSites}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Booked</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{bookedSites}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">New Inquiries</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{newInquiries}</p>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Recent Inquiries</h3>
                <button onClick={() => setActiveTab('inquiries')} className="text-sm text-red-600 hover:text-red-700">View All →</button>
              </div>
              <div className="divide-y">
                {inquiries.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{inq.client_name}</p>
                      <p className="text-xs text-gray-500">{inq.client_phone} • {new Date(inq.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inq.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                      inq.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                      inq.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <p className="p-4 text-sm text-gray-400 text-center">No inquiries yet</p>
                )}
              </div>
            </div>

            {/* Sites by City */}
            <div className="grid sm:grid-cols-3 gap-4">
              {cities.map((city) => {
                const citySites = sites.filter(s => s.city_id === city.id);
                const cityAvailable = citySites.filter(s => s.status === 'available').length;
                return (
                  <div key={city.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-lg">{city.name}</h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Sites</span>
                        <span className="font-medium">{citySites.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Available</span>
                        <span className="font-medium text-green-600">{cityAvailable}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Booked</span>
                        <span className="font-medium text-red-600">{citySites.length - cityAvailable}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sites Tab */}
        {activeTab === 'sites' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex gap-2">
                {['all', 'available', 'booked', 'maintenance'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSiteFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      siteFilter === f ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setEditingSite(null); setShowSiteForm(true); }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Site
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-500">Site Name</th>
                      <th className="text-left p-4 font-medium text-gray-500">City</th>
                      <th className="text-left p-4 font-medium text-gray-500">Size</th>
                      <th className="text-left p-4 font-medium text-gray-500">Rate/Month</th>
                      <th className="text-left p-4 font-medium text-gray-500">Status</th>
                      <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredSites.map((site) => (
                      <tr key={site.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <p className="font-medium text-gray-900">{site.name}</p>
                          <p className="text-xs text-gray-500">{site.address}</p>
                        </td>
                        <td className="p-4 text-gray-600">{(site as any).cities?.name || '-'}</td>
                        <td className="p-4 text-gray-600">{site.size}</td>
                        <td className="p-4 font-medium text-gray-900">₹{site.rate_monthly?.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <select
                            value={site.status}
                            onChange={(e) => handleUpdateSiteStatus(site.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${
                              site.status === 'available' ? 'bg-green-100 text-green-700' :
                              site.status === 'booked' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            <option value="available">Available</option>
                            <option value="booked">Booked</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setEditingSite(site); setShowSiteForm(true); }}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSite(site.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredSites.length === 0 && (
                  <p className="p-8 text-center text-gray-400">No sites found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Areas Tab */}
        {activeTab === 'areas' && (
          <AreaManager areas={areas} cities={cities} onRefresh={fetchData} />
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-500">Client</th>
                      <th className="text-left p-4 font-medium text-gray-500">Contact</th>
                      <th className="text-left p-4 font-medium text-gray-500">Site</th>
                      <th className="text-left p-4 font-medium text-gray-500">Message</th>
                      <th className="text-left p-4 font-medium text-gray-500">Date</th>
                      <th className="text-left p-4 font-medium text-gray-500">Status</th>
                      <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">{inq.client_name}</td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <a href={`tel:${inq.client_phone}`} className="flex items-center gap-1 text-gray-600 hover:text-red-600 text-xs">
                              <PhoneIcon className="w-3 h-3" />{inq.client_phone}
                            </a>
                            {inq.client_email && (
                              <a href={`mailto:${inq.client_email}`} className="flex items-center gap-1 text-gray-600 hover:text-red-600 text-xs">
                                <Mail className="w-3 h-3" />{inq.client_email}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 text-xs">
                          {(inq as any).sites?.name || 'General Inquiry'}
                        </td>
                        <td className="p-4 text-gray-600 text-xs max-w-[200px] truncate">
                          {inq.message || '-'}
                        </td>
                        <td className="p-4 text-gray-500 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(inq.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${
                              inq.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                              inq.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                              inq.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <a
                              href={`https://wa.me/${inq.client_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inq.client_name}, regarding your billboard inquiry with Moorthy Arts...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="WhatsApp"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {inquiries.length === 0 && (
                  <p className="p-8 text-center text-gray-400">No inquiries yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Site Form Modal */}
      {showSiteForm && (
        <SiteFormModal
          site={editingSite}
          cities={cities}
          onClose={() => { setShowSiteForm(false); setEditingSite(null); }}
          onSave={() => { setShowSiteForm(false); setEditingSite(null); fetchData(); }}
        />
      )}
    </div>
  );
}

// Site Form Modal Component
function SiteFormModal({
  site,
  cities,
  onClose,
  onSave,
}: {
  site: Site | null;
  cities: City[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    city_id: site?.city_id || cities[0]?.id || '',
    name: site?.name || '',
    address: site?.address || '',
    lat: site?.lat || 0,
    lng: site?.lng || 0,
    size: site?.size || '',
    type: site?.type || 'hoarding',
    rate_monthly: site?.rate_monthly || 0,
    rate_yearly: site?.rate_yearly || 0,
    status: site?.status || 'available',
    description: site?.description || '',
    facing: site?.facing || '',
    traffic_info: site?.traffic_info || '',
    illumination: site?.illumination || false,
    booked_by: site?.booked_by || '',
    booked_until: site?.booked_until || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const method = site ? 'PUT' : 'POST';
    const body = site ? { ...form, id: site.id } : form;

    const res = await fetch('/api/admin/sites', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(site ? 'Site updated!' : 'Site created!');
      onSave();
    } else {
      const err = await res.json();
      toast.error(err.error || 'Failed to save');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">{site ? 'Edit Site' : 'Add New Site'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <select
                required
                value={form.city_id}
                onChange={(e) => setForm({ ...form, city_id: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Five Roads Junction"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Full address"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
              <input
                type="number"
                step="any"
                required
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
              <input
                type="number"
                step="any"
                required
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <input
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 40ft x 20ft"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="hoarding">Hoarding</option>
                <option value="unipole">Unipole</option>
                <option value="bus_shelter">Bus Shelter</option>
                <option value="gantry">Gantry</option>
                <option value="wall_painting">Wall Painting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate (₹)</label>
              <input
                type="number"
                value={form.rate_monthly}
                onChange={(e) => setForm({ ...form, rate_monthly: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Rate (₹)</label>
              <input
                type="number"
                value={form.rate_yearly}
                onChange={(e) => setForm({ ...form, rate_yearly: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
              <input
                value={form.facing}
                onChange={(e) => setForm({ ...form, facing: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., North-East"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Traffic Info</label>
              <input
                value={form.traffic_info}
                onChange={(e) => setForm({ ...form, traffic_info: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., High traffic - 50,000+ daily"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Describe the site location, visibility, audience..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="illumination"
              checked={form.illumination}
              onChange={(e) => setForm({ ...form, illumination: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <label htmlFor="illumination" className="text-sm text-gray-700">Illuminated (Lit billboard)</label>
          </div>
          {form.status === 'booked' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booked By</label>
                <input
                  value={form.booked_by}
                  onChange={(e) => setForm({ ...form, booked_by: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booked Until</label>
                <input
                  type="date"
                  value={form.booked_until}
                  onChange={(e) => setForm({ ...form, booked_until: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : site ? 'Update Site' : 'Create Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Area Manager ─────────────────────────────────────────────────────────────
function AreaManager({ areas, cities, onRefresh }: { areas: Area[]; cities: City[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState({ city_id: '', name: '', lat: '', lng: '' });
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm({ city_id: cities[0]?.id || '', name: '', lat: '', lng: '' }); setShowForm(true); };
  const openEdit = (a: Area) => { setEditing(a); setForm({ city_id: a.city_id, name: a.name, lat: String(a.lat), lng: String(a.lng) }); setShowForm(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) };
    const res = await fetch('/api/admin/areas', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing ? { id: editing.id, ...body } : body) });
    setSaving(false);
    if (res.ok) { toast.success(editing ? 'Area updated' : 'Area created'); setShowForm(false); onRefresh(); }
    else toast.error('Failed to save area');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this area?')) return;
    const res = await fetch(`/api/admin/areas?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Area deleted'); onRefresh(); } else toast.error('Failed to delete');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Areas ({areas.length})</h2>
        <button onClick={openNew} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> New Area
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Area</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">City</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Lat / Lng</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {areas.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-400">No areas yet.</td></tr>}
            {areas.map((area) => (
              <tr key={area.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{area.name}</td>
                <td className="px-4 py-3 text-gray-500">{cities.find(c => c.id === area.city_id)?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{area.lat.toFixed(4)}, {area.lng.toFixed(4)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => openEdit(area)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => handleDelete(area.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{editing ? 'Edit Area' : 'New Area'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select value={form.city_id} onChange={e => setForm({ ...form, city_id: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Fairlands, Junction" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="11.6643" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="78.1460" required />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
