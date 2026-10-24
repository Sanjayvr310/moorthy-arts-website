'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Site } from '@/lib/supabase';

interface MapViewProps {
  center: [number, number];
  zoom: number;
  sites: Site[];
  onSiteClick: (site: Site) => void;
  readOnly?: boolean;
}

function getMarkerIcon(status: string) {
  const color = status === 'available' ? '#38a169' : status === 'booked' ? '#e53e3e' : '#d69e2e';
  const borderColor = status === 'available' ? '#276749' : status === 'booked' ? '#c53030' : '#b7791f';
  
  return L.divIcon({
    className: 'billboard-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid ${borderColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        position: relative;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export default function MapView({ center, zoom, sites, onSiteClick, readOnly = false }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Update view
    mapRef.current.setView(center, zoom, { animate: true, duration: 1 });

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add site markers
    sites.forEach((site) => {
      if (!mapRef.current) return;
      
      const marker = L.marker([site.lat, site.lng], {
        icon: getMarkerIcon(site.status),
      }).addTo(mapRef.current);

      // Create popup content
      const statusColor = site.status === 'available' ? 'green' : site.status === 'booked' ? 'red' : 'orange';
      const statusText = site.status.charAt(0).toUpperCase() + site.status.slice(1);
      
      marker.bindPopup(`
        <div style="padding: 12px; min-width: 200px; font-family: system-ui, sans-serif;">
          <h3 style="font-size: 14px; font-weight: 700; margin: 0 0 4px 0; color: #1a202c;">${site.name}</h3>
          <p style="font-size: 12px; color: #718096; margin: 0 0 8px 0;">${site.address}</p>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColor};"></span>
            <span style="font-size: 12px; font-weight: 600; color: ${statusColor};">${statusText}</span>
            <span style="font-size: 12px; color: #a0aec0;">•</span>
            <span style="font-size: 12px; color: #718096;">${site.size}</span>
          </div>
          <p style="font-size: 16px; font-weight: 700; color: #e53e3e; margin: 0 0 8px 0;">₹${site.rate_monthly?.toLocaleString('en-IN')}/month</p>
          <button 
            id="site-detail-${site.id}" 
            style="
              width: 100%;
              padding: 8px 16px;
              background: #e53e3e;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#c53030'"
            onmouseout="this.style.background='#e53e3e'"
          >
            View Details & Book
          </button>
        </div>
      `, { closeButton: true, maxWidth: 280 });

      if (!readOnly) {
        marker.on('popupopen', () => {
          setTimeout(() => {
            const btn = document.getElementById(`site-detail-${site.id}`);
            if (btn) {
              btn.addEventListener('click', () => {
                onSiteClick(site);
                marker.closePopup();
              });
            }
          }, 100);
        });
      }
    });

    return () => {
      // Don't destroy map on cleanup, just remove markers
    };
  }, [center, zoom, sites, onSiteClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full rounded-xl" />;
}
