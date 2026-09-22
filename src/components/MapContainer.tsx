import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow,
  useMap 
} from '@vis.gl/react-google-maps';
import { Company, UserLocation } from '../types';
import { 
  Navigation, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  ExternalLink,
  Flame,
  Layers,
  MapPin,
  Compass
} from 'lucide-react';

interface MapContainerProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
  currentLocation: UserLocation;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  savedCompanyIds: string[];
}

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyAk0bIDfq-Xwvp8AAXtdo9M1gIyVM6we8E';

// Subcomponent to animate camera when company selection or location changes
function MapController({ center, selectedCompany }: { center: { lat: number; lng: number }; selectedCompany: Company | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedCompany) {
      map.panTo({ lat: selectedCompany.latitude, lng: selectedCompany.longitude });
      map.setZoom(14);
    } else {
      map.panTo(center);
    }
  }, [map, center, selectedCompany]);

  return null;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  companies,
  selectedCompany,
  onSelectCompany,
  currentLocation,
  showHeatmap,
  onToggleHeatmap,
  savedCompanyIds
}) => {
  const [mapError, setMapError] = useState(false);
  const [hoveredCompany, setHoveredCompany] = useState<Company | null>(null);

  // Fallback 2D interactive canvas if Google Maps fails or is blocked
  if (mapError || !GOOGLE_MAPS_API_KEY) {
    return (
      <div id="fallback-2d-map-viewport" className="relative w-full h-full min-h-[480px] bg-[#0A0E17] overflow-hidden rounded-lg border border-[#1E293B] flex flex-col">
        {/* Radar Map Overlay Controls */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0B0F17]/90 px-3 py-1.5 rounded-lg border border-[#1E293B] text-xs shadow-lg backdrop-blur-md">
          <Compass className="w-4 h-4 text-[#00F0FF] animate-spin-slow" />
          <span className="font-mono text-white font-medium">Interactive Career Grid</span>
          <span className="text-[10px] text-[#64748B]">({companies.length} verified companies)</span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            id="fallback-heatmap-toggle"
            onClick={onToggleHeatmap}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md ${
              showHeatmap
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-[#0B0F17]/90 border-[#1E293B] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Opportunity Heatmap</span>
          </button>
        </div>

        {/* 2D Canvas Radar Grid */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center p-8">
          {/* Radial radar grid circles */}
          <div className="absolute w-[600px] h-[600px] rounded-full border border-[#1E293B]/60 pointer-events-none" />
          <div className="absolute w-[420px] h-[420px] rounded-full border border-[#1E293B]/80 pointer-events-none" />
          <div className="absolute w-[240px] h-[240px] rounded-full border border-[#1E293B] pointer-events-none" />
          <div className="absolute w-full h-px bg-[#1E293B]/60 pointer-events-none" />
          <div className="absolute h-full w-px bg-[#1E293B]/60 pointer-events-none" />

          {/* Current location center pin */}
          <div className="absolute z-20 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#00F0FF] opacity-40" />
              <div className="relative w-4 h-4 rounded-full bg-[#00F0FF] border-2 border-white shadow-[0_0_15px_#00F0FF]" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded bg-[#0F172A] border border-[#1E293B] text-[10px] font-mono text-[#38BDF8] shadow">
              You Are Here
            </span>
          </div>

          {/* Company Nodes Placed Geographically Relative to Center */}
          {companies.map((company, index) => {
            const dx = (company.longitude - currentLocation.longitude) * 2400;
            const dy = -(company.latitude - currentLocation.latitude) * 2400;
            const clampedX = Math.max(-280, Math.min(280, dx));
            const clampedY = Math.max(-200, Math.min(200, dy));
            const isSelected = selectedCompany?.placeId === company.placeId;

            return (
              <div
                key={company.placeId || index}
                onClick={() => onSelectCompany(company)}
                onMouseEnter={() => setHoveredCompany(company)}
                onMouseLeave={() => setHoveredCompany(null)}
                style={{ transform: `translate(${clampedX}px, ${clampedY}px)` }}
                className="absolute z-10 cursor-pointer group transition-all duration-300"
              >
                {/* Heatmap aura if active */}
                {showHeatmap && (
                  <div className="absolute -inset-3 rounded-full bg-amber-500/20 blur-md pointer-events-none animate-pulse" />
                )}

                <div
                  className={`relative flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs shadow-lg transition-all ${
                    isSelected
                      ? 'bg-[#1E293B] border-[#00F0FF] text-white ring-2 ring-[#00F0FF]/30 scale-105'
                      : company.hiringStatus === 'hiring'
                      ? 'bg-[#0B0F17]/90 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                      : company.hiringStatus === 'internship'
                      ? 'bg-[#0B0F17]/90 border-[#38BDF8]/40 text-[#38BDF8] hover:border-[#38BDF8]'
                      : 'bg-[#0B0F17]/90 border-[#334155] text-[#94A3B8] hover:border-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      company.hiringStatus === 'hiring'
                        ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                        : company.hiringStatus === 'internship'
                        ? 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]'
                        : 'bg-[#64748B]'
                    }`}
                  />
                  <span className="font-medium max-w-[110px] truncate">{company.name}</span>
                  {company.distanceKm !== undefined && (
                    <span className="font-mono text-[9px] text-[#64748B]">{company.distanceKm}km</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Legend */}
        <div className="bg-[#0B0F17] border-t border-[#1E293B] px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-[#94A3B8]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
              Verified Hiring
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
              Verified Internship
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#64748B]" />
              Company Hub
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#64748B]">
            Data Source: Google Places & Verified Company Records
          </span>
        </div>
      </div>
    );
  }

  return (
    <div id="google-maps-container" className="relative w-full h-full min-h-[480px] rounded-lg overflow-hidden border border-[#1E293B] shadow-xl">
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        onLoad={() => setMapError(false)}
        onError={() => setMapError(true)}
      >
        <Map
          defaultCenter={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
          defaultZoom={12}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full min-h-[480px]"
        >
          <MapController
            center={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
            selectedCompany={selectedCompany}
          />

          {/* User Location Marker */}
          <AdvancedMarker
            position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
            title="You are here"
          >
            <div className="relative flex flex-col items-center group">
              <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-[#00F0FF] opacity-50" />
              <div className="relative w-4 h-4 rounded-full bg-[#00F0FF] border-2 border-white shadow-[0_0_12px_#00F0FF] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-[#0B0F17]/95 border border-[#1E293B] text-[10px] font-mono text-[#38BDF8] shadow pointer-events-none whitespace-nowrap">
                You are here
              </div>
            </div>
          </AdvancedMarker>

          {/* Company Location Markers */}
          {companies.map((company) => {
            const isSelected = selectedCompany?.placeId === company.placeId;
            const isHiring = company.hiringStatus === 'hiring';
            const isInternship = company.hiringStatus === 'internship';

            return (
              <AdvancedMarker
                key={company.placeId}
                position={{ lat: company.latitude, lng: company.longitude }}
                title={company.name}
                onClick={() => onSelectCompany(company)}
              >
                <div className="relative cursor-pointer transition-transform hover:scale-110">
                  {/* Heatmap Pulse Overlay */}
                  {showHeatmap && (
                    <div
                      className={`absolute -inset-4 rounded-full blur-md opacity-75 pointer-events-none ${
                        isHiring ? 'bg-emerald-500/30' : isInternship ? 'bg-sky-500/30' : 'bg-slate-500/20'
                      }`}
                    />
                  )}

                  {/* Marker Pin Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs shadow-xl transition-all ${
                      isSelected
                        ? 'bg-[#0B0F17] border-[#00F0FF] text-white ring-2 ring-[#00F0FF]/40 scale-110 z-30'
                        : isHiring
                        ? 'bg-[#0B0F17]/95 border-emerald-500/50 text-emerald-300 hover:border-emerald-400'
                        : isInternship
                        ? 'bg-[#0B0F17]/95 border-[#38BDF8]/50 text-[#38BDF8] hover:border-[#38BDF8]'
                        : 'bg-[#0B0F17]/95 border-[#334155] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isHiring
                          ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                          : isInternship
                          ? 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]'
                          : 'bg-[#64748B]'
                      }`}
                    />
                    <span className="font-medium max-w-[120px] truncate">{company.name}</span>
                    {company.distanceKm !== undefined && (
                      <span className="font-mono text-[9px] text-[#64748B]">{company.distanceKm}km</span>
                    )}
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Selected Company InfoWindow */}
          {selectedCompany && (
            <InfoWindow
              position={{ lat: selectedCompany.latitude, lng: selectedCompany.longitude }}
              onCloseClick={() => onSelectCompany(null)}
            >
              <div className="p-1 max-w-xs text-slate-900">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display font-bold text-sm text-slate-900 leading-tight">
                    {selectedCompany.name}
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedCompany.businessType}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{selectedCompany.address}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] border-t border-slate-200 pt-1.5">
                  <span className="font-semibold text-emerald-700">
                    {selectedCompany.hiringStatus === 'hiring'
                      ? '● Verified Hiring'
                      : selectedCompany.hiringStatus === 'internship'
                      ? '● Verified Internship'
                      : '○ Company Location'}
                  </span>
                  <span className="font-mono text-slate-500">{selectedCompany.distanceKm} km away</span>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Control Overlay */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          id="map-toggle-heatmap-btn"
          onClick={onToggleHeatmap}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md ${
            showHeatmap
              ? 'bg-amber-500/25 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
              : 'bg-[#0B0F17]/90 border-[#1E293B] text-[#94A3B8] hover:text-white'
          }`}
          title="Toggle Opportunity Heatmap overlay"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Opportunity Heatmap</span>
        </button>
      </div>

      {/* Bottom Map Legend Bar */}
      <div className="absolute bottom-2 left-3 right-3 z-10 bg-[#0B0F17]/90 border border-[#1E293B] px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg flex flex-wrap items-center justify-between text-[11px] text-[#94A3B8]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
            Verified Hiring
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
            Verified Internship
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#64748B]" />
            Company Location
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#64748B] hidden sm:inline">
          Google Maps Platform + Places API (New)
        </span>
      </div>
    </div>
  );
};
