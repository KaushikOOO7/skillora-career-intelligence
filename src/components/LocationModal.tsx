import React, { useState } from 'react';
import { X, MapPin, Crosshair, Navigation } from 'lucide-react';
import { UserLocation } from '../types';

interface LocationModalProps {
  currentLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
  onClose: () => void;
  onUseGps: () => void;
}

const PRESET_CITIES: { city: string; lat: number; lng: number }[] = [
  { city: 'Bengaluru, India', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad, India', lat: 17.3850, lng: 78.4867 },
  { city: 'Pune, India', lat: 18.5204, lng: 73.8567 },
  { city: 'Chennai, India', lat: 13.0827, lng: 80.2707 },
  { city: 'Delhi NCR, India', lat: 28.6139, lng: 77.2090 },
  { city: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 },
  { city: 'Seattle, USA', lat: 47.6062, lng: -122.3321 },
  { city: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { city: 'Singapore', lat: 1.3521, lng: 103.8198 }
];

export const LocationModal: React.FC<LocationModalProps> = ({
  currentLocation,
  onSelectLocation,
  onClose,
  onUseGps
}) => {
  const [customLat, setCustomLat] = useState(currentLocation.latitude.toString());
  const [customLng, setCustomLng] = useState(currentLocation.longitude.toString());
  const [customCity, setCustomCity] = useState(currentLocation.city);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      onSelectLocation({
        latitude: lat,
        longitude: lng,
        city: customCity.trim() || `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`,
        isUserSpecified: true
      });
      onClose();
    }
  };

  return (
    <div id="location-modal-dialog" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00F0FF]" />
            <h3 className="font-display font-bold text-white text-base">Select Career Map Location</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-[#1E293B] text-[#94A3B8] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Button */}
        <button
          id="modal-detect-gps-btn"
          onClick={() => {
            onUseGps();
            onClose();
          }}
          className="w-full py-2.5 px-4 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:border-[#00F0FF] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Crosshair className="w-4 h-4 text-[#00F0FF]" />
          <span>Use Device Browser Location (GPS)</span>
        </button>

        {/* Preset Tech Hub Cities */}
        <div>
          <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider mb-2">
            Preset Tech Hubs
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {PRESET_CITIES.map((c) => (
              <button
                key={c.city}
                onClick={() => {
                  onSelectLocation({
                    latitude: c.lat,
                    longitude: c.lng,
                    city: c.city,
                    isUserSpecified: true
                  });
                  onClose();
                }}
                className={`p-2 rounded border text-left text-xs transition-colors ${
                  currentLocation.city === c.city
                    ? 'bg-[#1E293B] border-[#00F0FF] text-white font-medium'
                    : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#334155]'
                }`}
              >
                <div className="font-medium truncate">{c.city.split(',')[0]}</div>
                <div className="text-[9px] font-mono text-[#64748B]">{c.lat.toFixed(2)}, {c.lng.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Coordinates Form */}
        <form onSubmit={handleApplyCustom} className="space-y-3 pt-3 border-t border-[#1E293B] text-xs">
          <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
            Custom Coordinates
          </div>
          <div>
            <label className="text-[#94A3B8] block mb-1">City or Area Name</label>
            <input
              type="text"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              placeholder="e.g. Whitefield, Bengaluru"
              className="w-full px-3 py-1.5 bg-[#0F172A] border border-[#1E293B] rounded text-white focus:outline-none focus:border-[#00F0FF]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[#94A3B8] block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0F172A] border border-[#1E293B] rounded text-white focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
            <div>
              <label className="text-[#94A3B8] block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0F172A] border border-[#1E293B] rounded text-white focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-[#1E293B] text-[#94A3B8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#00F0FF] text-black font-semibold hover:bg-[#00F0FF]/90"
            >
              Set Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
