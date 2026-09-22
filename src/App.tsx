import React, { useState, useEffect, useMemo } from 'react';
import { 
  Company, 
  Opportunity, 
  FilterState, 
  DEFAULT_FILTERS, 
  UserLocation, 
  ApplicationItem, 
  StoredAlert, 
  UserProfile, 
  UserAuth,
  ApplicationStage 
} from './types';
import { StorageService } from './services/storageService';
import { fetchNearbyCompanies } from './services/companyService';
import { OpportunityService } from './services/opportunityService';

import { Header } from './components/Header';
import { QuotaBanner } from './components/QuotaBanner';
import { MapContainer } from './components/MapContainer';
import { SidebarFilters } from './components/SidebarFilters';
import { CompanyCardList } from './components/CompanyCardList';
import { CompanyDetailPanel } from './components/CompanyDetailPanel';
import { TargetCompanyRadar } from './components/TargetCompanyRadar';
import { OpportunityHeatmapView } from './components/OpportunityHeatmapView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { AlertsView } from './components/AlertsView';
import { ProfileView } from './components/ProfileView';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { CompanyComparisonModal } from './components/CompanyComparisonModal';

import { 
  MapPin, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Compass
} from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [activeView, setActiveView] = useState<'map' | 'radar' | 'heatmap' | 'tracker' | 'alerts' | 'profile'>('map');

  // Location State
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(() => StorageService.getLocation());
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Entities & Data
  const [companies, setCompanies] = useState<Company[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [comparedCompanies, setComparedCompanies] = useState<Company[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Storage synced states
  const [savedCompanyIds, setSavedCompanyIds] = useState<string[]>(() => StorageService.getSavedCompanies());
  const [applications, setApplications] = useState<ApplicationItem[]>(() => StorageService.getApplications());
  const [alerts, setAlerts] = useState<StoredAlert[]>(() => StorageService.getAlerts());
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [auth, setAuth] = useState<UserAuth>(() => StorageService.getAuth());

  // Modal dialogs
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Companies whenever location changes
  useEffect(() => {
    let isCancelled = false;
    setLocationStatus(`Discovering tech campuses near ${currentLocation.city}...`);

    fetchNearbyCompanies(currentLocation.latitude, currentLocation.longitude, 25000)
      .then((data) => {
        if (!isCancelled) {
          setCompanies(data);
          setLocationStatus(null);
        }
      })
      .catch(() => {
        if (!isCancelled) setLocationStatus(null);
      });

    // Also preload opportunities
    OpportunityService.getOpportunitiesForCompany('', '').then((opps) => {
      if (!isCancelled) setOpportunities(opps);
    });

    return () => {
      isCancelled = true;
    };
  }, [currentLocation.latitude, currentLocation.longitude, currentLocation.city]);

  // Save location to persistent storage
  useEffect(() => {
    StorageService.saveLocation(currentLocation);
  }, [currentLocation]);

  // Save applications to storage
  useEffect(() => {
    StorageService.saveApplications(applications);
  }, [applications]);

  // Save alerts to storage
  useEffect(() => {
    StorageService.saveAlerts(alerts);
  }, [alerts]);

  // Save profile to storage
  useEffect(() => {
    StorageService.saveProfile(profile);
  }, [profile]);

  // Save auth to storage
  useEffect(() => {
    StorageService.saveAuth(auth);
  }, [auth]);

  // Handle GPS browser geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by this browser.');
      return;
    }

    setLocationStatus('Acquiring high-accuracy GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc: UserLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: 'My Current Location (GPS)',
          isUserSpecified: true
        };
        setCurrentLocation(newLoc);
        setLocationStatus(null);
        showToast('Map centered on your current location.');
      },
      (err) => {
        setLocationStatus(null);
        showToast('Location permission denied or unavailable. Using default tech hub coordinates.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Toggle saving a company
  const handleToggleSaveCompany = (companyId: string) => {
    const isSaved = savedCompanyIds.includes(companyId);
    let updated: string[];
    if (isSaved) {
      updated = savedCompanyIds.filter((id) => id !== companyId);
      showToast('Company removed from saved list.');
    } else {
      updated = [...savedCompanyIds, companyId];
      showToast('Company saved to your personal portfolio.');
    }
    setSavedCompanyIds(updated);
    StorageService.saveSavedCompanies(updated);
  };

  // Add / remove compared company (up to 3)
  const handleCompareCompany = (company: Company) => {
    const exists = comparedCompanies.some((c) => c.placeId === company.placeId);
    if (exists) {
      setComparedCompanies(comparedCompanies.filter((c) => c.placeId !== company.placeId));
    } else {
      if (comparedCompanies.length >= 3) {
        showToast('You can compare up to 3 companies simultaneously.');
        return;
      }
      setComparedCompanies([...comparedCompanies, company]);
      setShowCompareModal(true);
    }
  };

  // Track opportunity in Kanban
  const handleTrackOpportunity = (opp: Opportunity) => {
    const newItem: ApplicationItem = {
      id: `app-${Date.now()}`,
      companyName: opp.companyName,
      roleTitle: opp.title,
      type: opp.type,
      stage: 'Saved',
      notes: `Discovered on Skillora map (${opp.location})`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setApplications((prev) => [newItem, ...prev]);
    showToast(`Added "${opp.title}" to your Application Pipeline.`);
  };

  // Filtered companies calculation
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      // Distance filter
      if (c.distanceKm !== undefined && c.distanceKm > filters.maxDistanceKm) {
        return false;
      }

      // Search Query filter (matches company name, address, or business type)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesAddr = c.address.toLowerCase().includes(q);
        const matchesType = c.businessType.toLowerCase().includes(q);
        if (!matchesName && !matchesAddr && !matchesType) {
          return false;
        }
      }

      // Opportunity Types filter (if selected)
      if (filters.opportunityTypes.length > 0) {
        if (filters.opportunityTypes.includes('Internship') && c.hiringStatus !== 'internship') {
          return false;
        }
        if (filters.opportunityTypes.includes('Full-time') && c.hiringStatus !== 'hiring') {
          return false;
        }
      }

      // Industry filter
      if (filters.industries.length > 0 && !filters.industries.includes(c.businessType)) {
        return false;
      }

      // Company Type filter
      if (filters.companyTypes.length > 0 && !filters.companyTypes.includes(c.companyType)) {
        return false;
      }

      return true;
    });
  }, [companies, filters]);

  // Saved companies objects for profile
  const savedCompanyObjects = useMemo(() => {
    return companies.filter((c) => savedCompanyIds.includes(c.placeId));
  }, [companies, savedCompanyIds]);

  return (
    <div id="skillora-app-root" className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-[#00F0FF]/20 selection:text-[#00F0FF]">
      {/* Google Maps Quota Handling Banner */}
      <QuotaBanner />

      {/* Global Application Header */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        currentLocation={currentLocation}
        onUseMyLocation={handleUseMyLocation}
        onOpenLocationModal={() => setShowLocationModal(true)}
        auth={auth}
        onOpenAuthModal={() => setShowAuthModal(true)}
        savedCompaniesCount={savedCompanyIds.length}
      />

      {/* Status Notice / Geolocation Feedback */}
      {locationStatus && (
        <div className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-2 text-center text-xs font-mono text-[#00F0FF] flex items-center justify-center gap-2">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Main Content Area Based on Active View */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6">
        {/* VIEW 1: INTERACTIVE MAP & EXPLORATION */}
        {activeView === 'map' && (
          <div className="space-y-6">
            {/* Top Toolbar: Quick Location & Compare Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F17] border border-[#1E293B] p-3 rounded-xl shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <button
                  id="gps-instant-center-btn"
                  onClick={handleUseMyLocation}
                  className="px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:border-[#00F0FF] text-white flex items-center gap-1.5 transition-colors font-medium"
                  title="Detect GPS coordinates"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Use My Location</span>
                </button>

                <button
                  id="search-another-location-btn"
                  onClick={() => setShowLocationModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:border-[#334155] text-[#94A3B8] hover:text-white transition-colors"
                >
                  Search Another City...
                </button>

                <span className="text-[11px] text-[#64748B] hidden sm:inline">
                  Viewing: <strong className="text-white">{currentLocation.city}</strong>
                </span>
              </div>

              {comparedCompanies.length > 0 && (
                <button
                  id="floating-compare-trigger-btn"
                  onClick={() => setShowCompareModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-amber-500 text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>Compare ({comparedCompanies.length} selected)</span>
                </button>
              )}
            </div>

            {/* Map & Filters Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Left Sidebar: Filter Panel */}
              <div className="lg:col-span-1">
                <SidebarFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={() => setFilters(DEFAULT_FILTERS)}
                  companies={companies}
                  opportunities={opportunities}
                  onSelectCompany={(c) => {
                    setSelectedCompany(c);
                  }}
                  onSelectOpportunity={(opp) => {
                    const comp = companies.find((c) => c.name.toLowerCase() === opp.companyName.toLowerCase());
                    if (comp) setSelectedCompany(comp);
                  }}
                />
              </div>

              {/* Main Column: Interactive Map */}
              <div className="lg:col-span-3 min-h-[460px] h-[55vh] max-h-[650px] relative">
                <MapContainer
                  companies={filteredCompanies}
                  selectedCompany={selectedCompany}
                  onSelectCompany={setSelectedCompany}
                  currentLocation={currentLocation}
                  showHeatmap={showHeatmap}
                  onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
                  savedCompanyIds={savedCompanyIds}
                />
              </div>
            </div>

            {/* Company Discovery Shelf Below the Map */}
            <div className="pt-2">
              <CompanyCardList
                companies={filteredCompanies}
                selectedCompany={selectedCompany}
                onSelectCompany={setSelectedCompany}
                savedCompanyIds={savedCompanyIds}
                onToggleSaveCompany={handleToggleSaveCompany}
                onCompareCompany={handleCompareCompany}
                comparedCompanyIds={comparedCompanies.map((c) => c.placeId)}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: TARGET COMPANY CAREER RADAR */}
        {activeView === 'radar' && (
          <TargetCompanyRadar
            companies={companies}
            onSelectCompanyDossier={setSelectedCompany}
            onTrackOpportunity={handleTrackOpportunity}
          />
        )}

        {/* VIEW 3: OPPORTUNITY HEATMAP MATRIX */}
        {activeView === 'heatmap' && (
          <OpportunityHeatmapView
            companies={companies}
            opportunities={opportunities}
            onSelectCompany={setSelectedCompany}
          />
        )}

        {/* VIEW 4: APPLICATION TRACKER */}
        {activeView === 'tracker' && (
          <ApplicationTrackerView
            applications={applications}
            onAddApplication={(app) => {
              const newItem: ApplicationItem = {
                ...app,
                id: `app-${Date.now()}`,
                updatedAt: new Date().toISOString().split('T')[0]
              };
              setApplications([newItem, ...applications]);
              showToast('Role added to pipeline.');
            }}
            onUpdateStage={(id, stage: ApplicationStage) => {
              setApplications(
                applications.map((a) =>
                  a.id === id ? { ...a, stage, updatedAt: new Date().toISOString().split('T')[0] } : a
                )
              );
            }}
            onDeleteApplication={(id) => {
              setApplications(applications.filter((a) => a.id !== id));
              showToast('Entry removed.');
            }}
          />
        )}

        {/* VIEW 5: ALERTS SYSTEM */}
        {activeView === 'alerts' && (
          <AlertsView
            alerts={alerts}
            onAddAlert={(alert) => {
              const newAlert: StoredAlert = {
                ...alert,
                id: `alt-${Date.now()}`,
                createdAt: new Date().toISOString().split('T')[0],
                active: true
              };
              setAlerts([newAlert, ...alerts]);
            }}
            onToggleAlert={(id) => {
              setAlerts(
                alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
              );
            }}
            onDeleteAlert={(id) => {
              setAlerts(alerts.filter((a) => a.id !== id));
            }}
          />
        )}

        {/* VIEW 6: USER PROFILE & REQUIREMENT COVERAGE */}
        {activeView === 'profile' && (
          <ProfileView
            profile={profile}
            onSaveProfile={setProfile}
            savedCompanies={savedCompanyObjects}
            onSelectCompany={setSelectedCompany}
          />
        )}
      </main>

      {/* Slide-Over Company Dossier Panel */}
      {selectedCompany && (
        <CompanyDetailPanel
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          isSaved={savedCompanyIds.includes(selectedCompany.placeId)}
          onToggleSave={() => handleToggleSaveCompany(selectedCompany.placeId)}
          onTrackOpportunity={handleTrackOpportunity}
        />
      )}

      {/* Company Comparison Modal */}
      {showCompareModal && (
        <CompanyComparisonModal
          companies={comparedCompanies}
          onClose={() => setShowCompareModal(false)}
          onRemoveCompany={(placeId) => {
            const updated = comparedCompanies.filter((c) => c.placeId !== placeId);
            setComparedCompanies(updated);
            if (updated.length === 0) setShowCompareModal(false);
          }}
        />
      )}

      {/* Location Selector Modal */}
      {showLocationModal && (
        <LocationModal
          currentLocation={currentLocation}
          onSelectLocation={(loc) => {
            setCurrentLocation(loc);
            showToast(`Location set to ${loc.city}.`);
          }}
          onClose={() => setShowLocationModal(false)}
          onUseGps={handleUseMyLocation}
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          auth={auth}
          onUpdateAuth={(newAuth) => {
            setAuth(newAuth);
            showToast(newAuth.isLoggedIn ? `Signed in as ${newAuth.displayName}` : 'Signed out.');
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Transient Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-4 right-4 z-50 bg-[#0F172A] border border-[#00F0FF]/40 text-white px-4 py-2.5 rounded-lg shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-[#1E293B] bg-[#07090E] px-4 py-3 text-center text-[11px] text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Skillora © 2026 — Career Intelligence & Opportunity Map
          </span>
          <span className="font-mono text-[10px]">
            Google Maps Platform + Places API (New) • Verified Corporate Data
          </span>
        </div>
      </footer>
    </div>
  );
}
