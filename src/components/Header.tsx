import React from 'react';
import { 
  Compass, 
  MapPin, 
  Crosshair, 
  Radar, 
  Flame, 
  Briefcase, 
  Bell, 
  User, 
  Search,
  Layers,
  ChevronRight
} from 'lucide-react';
import { UserLocation, UserAuth } from '../types';

interface HeaderProps {
  currentLocation: UserLocation;
  onUseMyLocation?: () => void;
  onOpenLocationModal: () => void;
  activeView: 'map' | 'radar' | 'heatmap' | 'tracker' | 'alerts' | 'profile';
  setActiveView?: (view: 'map' | 'radar' | 'heatmap' | 'tracker' | 'alerts' | 'profile') => void;
  onSelectView?: (view: 'map' | 'radar' | 'heatmap' | 'tracker' | 'alerts' | 'profile') => void;
  auth: UserAuth;
  onOpenAuthModal: () => void;
  savedCompaniesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onUseMyLocation,
  onOpenLocationModal,
  activeView,
  setActiveView,
  onSelectView,
  auth,
  onOpenAuthModal,
  savedCompaniesCount = 0
}) => {
  const handleSelectView = (view: 'map' | 'radar' | 'heatmap' | 'tracker' | 'alerts' | 'profile') => {
    if (onSelectView) onSelectView(view);
    else if (setActiveView) setActiveView(view);
  };
  return (
    <header
      id="skillora-main-header"
      className="bg-[#0B0F17]/95 border-b border-[#1E293B] sticky top-0 z-40 backdrop-blur-md px-4 py-2.5 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleSelectView('map')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0F172A] to-[#1E293B] border border-[#334155] flex items-center justify-center shadow-inner">
              <Compass className="w-4 h-4 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base tracking-tight text-white">Skillora</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
                  LIVE MVP
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] hidden sm:block">A live map for your career</p>
            </div>
          </div>

          {/* Mobile Profile Trigger */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              id="mobile-use-my-location-btn"
              onClick={onUseMyLocation}
              className="p-1.5 rounded bg-[#111827] border border-[#1F2937] text-[#9CA3AF] hover:text-white"
              title="Use current location"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
            <button
              id="mobile-auth-btn"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-xs text-[#E5E7EB]"
            >
              <User className="w-3 h-3 text-[#00F0FF]" />
              <span>{auth.isLoggedIn ? (auth.displayName?.split(' ')[0] || 'User') : 'Guest'}</span>
            </button>
          </div>
        </div>

        {/* Location & Navigation Cluster */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 text-xs">
          {/* Geolocation Bar */}
          <div
            id="header-location-badge"
            className="flex items-center gap-1.5 bg-[#0F172A] border border-[#1E293B] px-2.5 py-1 rounded-md text-[#94A3B8]"
          >
            <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="text-[#E2E8F0] font-medium max-w-[140px] sm:max-w-[200px] truncate">
              {currentLocation.city}
            </span>
            <span className="text-[10px] font-mono text-[#64748B] hidden sm:inline">
              {currentLocation.latitude.toFixed(3)}°, {currentLocation.longitude.toFixed(3)}°
            </span>
            <div className="h-3 w-px bg-[#334155] mx-0.5" />
            <button
              id="header-locate-me-btn"
              onClick={onUseMyLocation}
              className="text-[11px] text-[#38BDF8] hover:text-white flex items-center gap-0.5 transition-colors"
              title="Detect device GPS location"
            >
              <Crosshair className="w-3 h-3" />
              <span className="hidden sm:inline">Locate</span>
            </button>
            <button
              id="header-change-location-btn"
              onClick={onOpenLocationModal}
              className="text-[11px] text-[#94A3B8] hover:text-white transition-colors"
              title="Select another city or coordinates"
            >
              Change
            </button>
          </div>

          {/* Primary View Switcher */}
          <nav id="header-nav-views" className="flex items-center gap-1 bg-[#0F172A] p-0.5 rounded-lg border border-[#1E293B]">
            <button
              id="nav-tab-map"
              onClick={() => handleSelectView('map')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                activeView === 'map'
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Map</span>
            </button>

            <button
              id="nav-tab-radar"
              onClick={() => handleSelectView('radar')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                activeView === 'radar'
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Radar className="w-3 h-3 text-[#38BDF8]" />
              <span>Career Radar</span>
            </button>

            <button
              id="nav-tab-heatmap"
              onClick={() => handleSelectView('heatmap')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                activeView === 'heatmap'
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Heatmap</span>
            </button>

            <button
              id="nav-tab-tracker"
              onClick={() => handleSelectView('tracker')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                activeView === 'tracker'
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Briefcase className="w-3 h-3 text-emerald-400" />
              <span>Tracker</span>
            </button>

            <button
              id="nav-tab-alerts"
              onClick={() => handleSelectView('alerts')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                activeView === 'alerts'
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Bell className="w-3 h-3 text-indigo-400" />
              <span>Alerts</span>
            </button>
          </nav>

          {/* Profile & Auth Menu */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="header-profile-btn"
              onClick={() => handleSelectView('profile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors ${
                activeView === 'profile'
                  ? 'bg-[#1E293B] border-[#38BDF8] text-white'
                  : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="font-medium">My Profile</span>
              {savedCompaniesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#1E293B] text-[10px] font-mono text-[#38BDF8]">
                  {savedCompaniesCount}
                </span>
              )}
            </button>

            <button
              id="header-auth-pill"
              onClick={onOpenAuthModal}
              className="text-[11px] font-mono px-2 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white transition-colors"
            >
              {auth.isLoggedIn ? (
                <span className="text-emerald-400">● {auth.displayName?.split(' ')[0] || 'User'}</span>
              ) : (
                <span className="text-[#94A3B8]">Guest Mode</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
