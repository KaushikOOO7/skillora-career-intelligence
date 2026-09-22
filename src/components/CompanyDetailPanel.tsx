import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  ExternalLink, 
  Bookmark, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  BookOpen, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { Company, Opportunity, ResearchItem, CommonRequirement, SkillStat } from '../types';
import { OpportunityService } from '../services/opportunityService';
import { getResearchForCompany } from '../services/researchService';

interface CompanyDetailPanelProps {
  company: Company | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onTrackOpportunity: (opp: Opportunity) => void;
}

export const CompanyDetailPanel: React.FC<CompanyDetailPanelProps> = ({
  company,
  onClose,
  isSaved,
  onToggleSave,
  onTrackOpportunity
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'skills' | 'research' | 'contact'>('overview');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const [researchRangeYears, setResearchRangeYears] = useState<number>(5);
  const [skillAnalysis, setSkillAnalysis] = useState<{
    skillStats: SkillStat[];
    commonRequirements: CommonRequirement[];
    totalAnalyzed: number;
  }>({ skillStats: [], commonRequirements: [], totalAnalyzed: 0 });

  useEffect(() => {
    if (!company) return;

    // Load opportunities for this company from OpportunityService
    OpportunityService.getOpportunitiesForCompany(company.placeId, company.name).then((opps) => {
      setOpportunities(opps);
      const analysis = OpportunityService.extractSkillsFromOpportunities(opps);
      setSkillAnalysis(analysis);
    });

    // Load verified research intelligence
    const research = getResearchForCompany(company.name, researchRangeYears);
    setResearchItems(research);
  }, [company, researchRangeYears]);

  if (!company) return null;

  return (
    <div
      id="company-detail-panel"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0B0F17] border-l border-[#1E293B] shadow-2xl flex flex-col transform transition-transform duration-300"
    >
      {/* Panel Top Header */}
      <div className="p-4 border-b border-[#1E293B] bg-[#0F172A]/80 backdrop-blur-md flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#00F0FF] border border-[#334155]">
              {company.businessType}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111827] text-[#94A3B8] border border-[#1E293B]">
              {company.companyType}
            </span>
            {company.distanceKm !== undefined && (
              <span className="text-[10px] font-mono text-[#38BDF8]">
                {company.distanceKm} km away
              </span>
            )}
          </div>
          <h2 className="font-display font-bold text-white text-lg mt-1.5 leading-snug">
            {company.name}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="panel-save-toggle-btn"
            onClick={onToggleSave}
            className={`p-2 rounded border transition-colors ${
              isSaved
                ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF]'
                : 'bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:text-white'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Company'}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            id="panel-close-btn"
            onClick={onClose}
            className="p-2 rounded bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-[#1E293B] bg-[#07090E] px-4 overflow-x-auto text-xs">
        <button
          id="tab-btn-overview"
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#00F0FF] text-white'
              : 'border-transparent text-[#64748B] hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          id="tab-btn-opportunities"
          onClick={() => setActiveTab('opportunities')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'opportunities'
              ? 'border-[#00F0FF] text-white'
              : 'border-transparent text-[#64748B] hover:text-white'
          }`}
        >
          <span>Opportunities</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1E293B] text-[#38BDF8]">
            {opportunities.length}
          </span>
        </button>
        <button
          id="tab-btn-skills"
          onClick={() => setActiveTab('skills')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'skills'
              ? 'border-[#00F0FF] text-white'
              : 'border-transparent text-[#64748B] hover:text-white'
          }`}
        >
          Skills ({skillAnalysis.skillStats.length})
        </button>
        <button
          id="tab-btn-research"
          onClick={() => setActiveTab('research')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'research'
              ? 'border-[#00F0FF] text-white'
              : 'border-transparent text-[#64748B] hover:text-white'
          }`}
        >
          Research ({researchItems.length})
        </button>
        <button
          id="tab-btn-contact"
          onClick={() => setActiveTab('contact')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'contact'
              ? 'border-[#00F0FF] text-white'
              : 'border-transparent text-[#64748B] hover:text-white'
          }`}
        >
          Recruitment
        </button>
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 text-xs text-[#94A3B8] space-y-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {company.overview && (
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3.5">
                <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider mb-1">Corporate Profile</div>
                <p className="text-white text-xs leading-relaxed">{company.overview}</p>
              </div>
            )}

            {/* Address & Verified Coordinates */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">{company.address}</div>
                  <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                    Lat: {company.latitude.toFixed(4)}, Lng: {company.longitude.toFixed(4)}
                  </div>
                </div>
              </div>

              {company.website && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#1E293B]">
                  <Globe className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38BDF8] hover:underline truncate flex items-center gap-1"
                  >
                    <span>{company.website}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#1E293B]">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[#E2E8F0] font-mono">{company.phone}</span>
                </div>
              )}
            </div>

            {/* Verified Employee Range & Source Attribution */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3.5 space-y-1.5">
              <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                Workforce Footprint
              </div>
              <div className="text-white font-medium text-sm">
                {company.employeeCount || 'Verified Enterprise Facility'}
              </div>
              <div className="text-[10px] text-[#64748B]">
                Source: {company.employeeCountSource || company.source} (Verified: {company.lastVerified})
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-3 rounded-lg bg-[#07090E] border border-[#1E293B] text-[11px] text-[#64748B] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
              <span>
                Personal employee information is protected by data privacy regulations and is never collected.
                Only official corporate contacts and public careers portals are displayed.
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: OPPORTUNITIES */}
        {activeTab === 'opportunities' && (
          <div className="space-y-3">
            {opportunities.length === 0 ? (
              <div className="p-6 text-center text-[#64748B] bg-[#0F172A] rounded-lg border border-[#1E293B]">
                No verified job postings currently recorded for this campus.
              </div>
            ) : (
              opportunities.map((opp) => (
                <div
                  key={opp.id}
                  id={`panel-opportunity-${opp.id}`}
                  className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3.5 space-y-2.5 hover:border-[#334155] transition-colors"
                >
                  {/* Demo Data Notice if applicable */}
                  {opp.isDemoData && (
                    <div className="px-2 py-1 rounded bg-amber-950/40 border border-amber-600/30 text-amber-300 text-[10px] font-mono flex items-center justify-between">
                      <span>DEMO DATA</span>
                      <span className="text-[9px] text-amber-400/80">Connect jobs provider for live stream</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display font-bold text-white text-sm">{opp.title}</h4>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">{opp.location}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-emerald-400 border border-emerald-500/30">
                      {opp.type}
                    </span>
                  </div>

                  {opp.description && (
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{opp.description}</p>
                  )}

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1">
                    {opp.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-[#1E293B] text-[10px] text-[#E2E8F0] border border-[#334155]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] text-[10px] text-[#64748B]">
                    <span>Exp: {opp.experience}</span>
                    <span>Posted: {opp.postedDate}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => onTrackOpportunity(opp)}
                      className="px-2.5 py-1.5 rounded bg-[#1E293B] text-[#E2E8F0] hover:bg-[#334155] border border-[#334155] text-xs flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-[#00F0FF]" />
                      <span>Track in Application Pipeline</span>
                    </button>

                    <a
                      href={opp.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] hover:bg-[#00F0FF]/25 border border-[#00F0FF]/30 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                Skill Intelligence Analytics
              </div>
              <div className="text-white font-medium text-sm mt-0.5">
                Based on {skillAnalysis.totalAnalyzed} analyzed postings
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Frequencies are calculated strictly from retrieved job descriptions for this employer.
              </p>
            </div>

            {/* Common Requirements Section */}
            <div className="space-y-2">
              <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider text-[#94A3B8]">
                Common Requirements Frequency
              </h4>
              <div className="space-y-2">
                {skillAnalysis.commonRequirements.map((req) => {
                  const percent = Math.round((req.count / Math.max(req.totalAnalyzed, 1)) * 100);
                  return (
                    <div key={req.name} className="bg-[#0F172A] border border-[#1E293B] rounded p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white font-medium">{req.name}</span>
                        <span className="font-mono text-[10px] text-[#38BDF8]">
                          {req.count} of {req.totalAnalyzed} roles ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#00F0FF] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categorized Skills Breakdown */}
            <div className="space-y-2">
              <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider text-[#94A3B8]">
                All Identified Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillAnalysis.skillStats.map((s) => (
                  <span
                    key={s.skill}
                    className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-xs text-[#E2E8F0] flex items-center gap-1.5"
                  >
                    <span>{s.skill}</span>
                    <span className="text-[10px] font-mono text-[#38BDF8]">×{s.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESEARCH */}
        {activeTab === 'research' && (
          <div className="space-y-3">
            {/* Timeline Filter */}
            <div className="flex items-center justify-between bg-[#0F172A] border border-[#1E293B] p-2 rounded-lg text-xs">
              <span className="text-[#94A3B8]">Timeline Horizon:</span>
              <div className="flex items-center gap-1">
                {[1, 3, 5, 10].map((y) => (
                  <button
                    key={y}
                    onClick={() => setResearchRangeYears(y)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] border transition-all ${
                      researchRangeYears === y
                        ? 'bg-[#1E293B] border-[#00F0FF] text-white font-semibold'
                        : 'border-[#1E293B] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {y}y
                  </button>
                ))}
              </div>
            </div>

            {researchItems.length === 0 ? (
              <div className="p-6 text-center text-[#64748B] bg-[#0F172A] rounded-lg border border-[#1E293B]">
                No public research milestones recorded for this company within the selected {researchRangeYears}-year window.
              </div>
            ) : (
              <div className="space-y-3 border-l-2 border-[#1E293B] ml-2 pl-4">
                {researchItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3.5 space-y-1.5 relative"
                  >
                    <div className="absolute -left-[23px] top-4 w-3 h-3 rounded-full bg-[#00F0FF] border-2 border-[#0B0F17]" />
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                      <span className="text-[#38BDF8] font-semibold">{item.year}</span>
                      <span>{item.date}</span>
                    </div>
                    <h4 className="font-display font-bold text-white text-xs leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{item.description}</p>
                    <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px]">
                      <span className="text-[#64748B]">Source: {item.source}</span>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00F0FF] hover:underline flex items-center gap-0.5"
                      >
                        <span>Citations</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CONTACT / RECRUITMENT */}
        {activeTab === 'contact' && (
          <div className="space-y-3">
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 space-y-3">
              <h4 className="font-display font-semibold text-white text-sm">
                Official Recruitment Channels
              </h4>

              {company.publicRecruitmentContact?.careersUrl ? (
                <div>
                  <div className="text-[10px] font-mono text-[#64748B]">Careers System</div>
                  <a
                    href={company.publicRecruitmentContact.careersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00F0FF] hover:underline text-xs flex items-center gap-1 mt-0.5"
                  >
                    <span>{company.publicRecruitmentContact.careersUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="text-xs text-[#64748B]">
                  Official careers URL not indexed in public records.
                </div>
              )}

              {company.publicRecruitmentContact?.email && (
                <div className="pt-2 border-t border-[#1E293B]">
                  <div className="text-[10px] font-mono text-[#64748B]">Public University Relations Inbox</div>
                  <a
                    href={`mailto:${company.publicRecruitmentContact.email}`}
                    className="text-white hover:text-[#00F0FF] text-xs flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{company.publicRecruitmentContact.email}</span>
                  </a>
                </div>
              )}

              {company.publicRecruitmentContact?.notes && (
                <p className="text-[11px] text-[#64748B] pt-2 border-t border-[#1E293B]">
                  {company.publicRecruitmentContact.notes}
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-lg bg-[#07090E] border border-[#1E293B] text-xs text-[#64748B]">
              <span className="font-semibold text-white block mb-1">Privacy & Compliance Guard:</span>
              Individual recruiter phone numbers and personal emails are omitted to prevent unsolicited contact and honor data privacy laws.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
