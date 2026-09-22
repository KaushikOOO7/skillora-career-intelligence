import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Search, 
  Building2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Code, 
  BookOpen,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Company, Opportunity, ResearchItem } from '../types';
import { OpportunityService } from '../services/opportunityService';
import { getResearchForCompany } from '../services/researchService';

interface TargetCompanyRadarProps {
  companies: Company[];
  onSelectCompanyDossier: (company: Company) => void;
  onTrackOpportunity: (opp: Opportunity) => void;
}

export const TargetCompanyRadar: React.FC<TargetCompanyRadarProps> = ({
  companies,
  onSelectCompanyDossier,
  onTrackOpportunity
}) => {
  const [searchTarget, setSearchTarget] = useState('Microsoft');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(companies[0] || null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);

  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, selectedCompany]);

  useEffect(() => {
    if (!selectedCompany) return;
    OpportunityService.getOpportunitiesForCompany(selectedCompany.placeId, selectedCompany.name).then(setOpportunities);
    const research = getResearchForCompany(selectedCompany.name, 5);
    setResearchItems(research);
  }, [selectedCompany]);

  const handleSearchCompany = (name: string) => {
    setSearchTarget(name);
    const found = companies.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));
    if (found) {
      setSelectedCompany(found);
    }
  };

  const skillAnalysis = OpportunityService.extractSkillsFromOpportunities(opportunities);

  return (
    <div id="target-company-radar-view" className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Top Search & Banner */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] mb-2">
            <Radar className="w-4 h-4" />
            <span>CAREER RADAR INTELLIGENCE</span>
          </div>
          <h2 className="font-display font-bold text-white text-xl sm:text-2xl">
            Which company are you targeting?
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Analyze nearby physical campuses, verified openings, required tech stacks, and deep-tech research publications for your target employer.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
              <input
                id="target-company-search-input"
                type="text"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                placeholder="Type company name (e.g., Microsoft, Google, NVIDIA, Bosch)..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-lg text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
            <button
              onClick={() => handleSearchCompany(searchTarget)}
              className="px-5 py-2.5 rounded-lg bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-semibold text-xs transition-all shadow-md"
            >
              Analyze Radar
            </button>
          </div>

          {/* Quick suggestions pills */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[#64748B]">Popular targets:</span>
            {['Microsoft', 'Google', 'Amazon', 'NVIDIA', 'Bosch', 'Infosys', 'Zerodha'].map((name) => (
              <button
                key={name}
                onClick={() => handleSearchCompany(name)}
                className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#334155]"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCompany && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Campus & Quick Facts */}
          <div className="space-y-4">
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#00F0FF]">
                    {selectedCompany.businessType}
                  </span>
                  <h3 className="font-display font-bold text-white text-lg mt-2">
                    {selectedCompany.name}
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCompanyDossier(selectedCompany)}
                  className="p-1.5 rounded bg-[#1E293B] text-[#94A3B8] hover:text-white"
                  title="View full dossier"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-[#94A3B8]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                  <span>{selectedCompany.address}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] font-mono text-[11px]">
                  <span>Distance:</span>
                  <span className="text-[#38BDF8]">{selectedCompany.distanceKm} km away</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Workforce:</span>
                  <span className="text-white">{selectedCompany.employeeCount || 'Verified Campus'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E293B]">
                <button
                  onClick={() => onSelectCompanyDossier(selectedCompany)}
                  className="w-full py-2 rounded bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-medium transition-colors text-center"
                >
                  Open Full Company Dossier
                </button>
              </div>
            </div>

            {/* Skill Requirements Breakdown */}
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                <Code className="w-4 h-4" />
                <span>COMMONLY REQUESTED SKILLS</span>
              </div>
              <div className="text-[11px] text-[#64748B]">
                Extracted from {skillAnalysis.totalAnalyzed} verified roles
              </div>

              <div className="space-y-2">
                {skillAnalysis.commonRequirements.slice(0, 5).map((req) => (
                  <div key={req.name} className="flex items-center justify-between text-xs py-1 border-b border-[#1E293B]">
                    <span className="text-white">{req.name}</span>
                    <span className="font-mono text-[11px] text-[#38BDF8]">{req.count} postings</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center & Right Column: Opportunities & Research */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunities section */}
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-display font-bold text-white text-base">
                    Active Roles & Internships
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#64748B]">
                  {opportunities.length} found
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-display font-bold text-white text-xs line-clamp-1">{opp.title}</h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1E293B] text-emerald-400">
                          {opp.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-1">{opp.location}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {opp.skills.slice(0, 3).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-[#1E293B] text-[9px] text-[#94A3B8]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
                      <button
                        onClick={() => onTrackOpportunity(opp)}
                        className="text-[11px] text-[#00F0FF] hover:underline"
                      >
                        + Track Role
                      </button>
                      <a
                        href={opp.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#94A3B8] hover:text-white flex items-center gap-1"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corporate Technology & Research Timeline */}
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-display font-bold text-white text-base">
                  Technology & Research Milestones
                </h3>
              </div>

              <div className="space-y-3">
                {researchItems.map((res) => (
                  <div key={res.id} className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-lg space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                      <span className="text-[#38BDF8] font-semibold">{res.year}</span>
                      <span>{res.date}</span>
                    </div>
                    <h4 className="font-display font-semibold text-white text-xs">{res.title}</h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{res.description}</p>
                    <div className="pt-1 text-[10px] text-[#64748B]">
                      Source: {res.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
