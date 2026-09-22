import React, { useState, useEffect } from 'react';
import { User, Sparkles, CheckCircle2, AlertCircle, Plus, X, Bookmark, ExternalLink } from 'lucide-react';
import { UserProfile, Company, Opportunity } from '../types';
import { OpportunityService } from '../services/opportunityService';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  savedCompanies: Company[];
  onSelectCompany: (company: Company) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  savedCompanies,
  onSelectCompany
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [coverageData, setCoverageData] = useState<{
    matchScore: number;
    matched: string[];
    missing: string[];
    recommendation: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Compute coverage against target company requirements
  const runCoverageAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Get target company opportunities to extract required skills
      const opps = await OpportunityService.getOpportunitiesForCompany('', formData.targetCompany || 'Microsoft');
      const analysis = OpportunityService.extractSkillsFromOpportunities(opps);
      const targetRequiredSkills = analysis.commonRequirements.map((r) => r.name);

      const res = await fetch('/api/gemini/coverage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSkills: formData.skills,
          targetRole: formData.targetRole,
          requiredSkills: targetRequiredSkills
        })
      });
      const data = await res.json();
      setCoverageData(data);
    } catch {
      // Local deterministic fallback
      const targetRequiredSkills = ['Data Structures & Algorithms', 'System Design', 'TypeScript', 'SQL', 'Git'];
      const userSet = new Set(formData.skills.map((s) => s.toLowerCase()));
      const matched = targetRequiredSkills.filter((s) => userSet.has(s.toLowerCase()));
      const missing = targetRequiredSkills.filter((s) => !userSet.has(s.toLowerCase()));
      const score = Math.round((matched.length / targetRequiredSkills.length) * 100);

      setCoverageData({
        matchScore: score,
        matched,
        missing,
        recommendation: `You demonstrate ${matched.length} of ${targetRequiredSkills.length} commonly requested skills for ${formData.targetCompany || 'your target company'}. Focus on ${missing.slice(0, 2).join(' and ')}.`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runCoverageAnalysis();
  }, [formData.targetCompany, formData.skills]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) return;
    const updated = { ...formData, skills: [...formData.skills, newSkill.trim()] };
    setFormData(updated);
    onSaveProfile(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = { ...formData, skills: formData.skills.filter((s) => s !== skill) };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div id="user-profile-view" className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Top Banner */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] mb-1">
            <User className="w-4 h-4" />
            <span>CAREER PORTFOLIO & READINESS</span>
          </div>
          <h2 className="font-display font-bold text-white text-xl">
            My Career Profile & Skill Match
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Compare your acquired competencies with real company job requirements and get actionable gap analysis.
          </p>
        </div>

        {isSavedNotice && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile saved successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile Form & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleFormSubmit} className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-6 shadow-lg space-y-4 text-xs">
            <h3 className="font-display font-bold text-white text-base">Candidate Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#94A3B8] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1">Education / University</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#94A3B8] block mb-1">Target Role</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g. Software Engineer (Cloud / Distributed Systems)"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Target Employer</label>
                <input
                  type="text"
                  value={formData.targetCompany}
                  onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                  placeholder="e.g. Microsoft, Google, NVIDIA"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1">Technical Skills & Stacks</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-white flex items-center gap-1.5 text-xs"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="text-[#64748B] hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add skill (e.g., PyTorch, Kubernetes, Golang)..."
                  className="flex-1 px-3 py-1.5 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded bg-[#1E293B] text-white hover:bg-[#334155] border border-[#334155]"
                >
                  Add Skill
                </button>
              </div>
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1">Key Engineering Projects</label>
              <textarea
                rows={2}
                value={formData.projects}
                onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#94A3B8] block mb-1">Certifications</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E293B] flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-semibold text-xs transition-all shadow-md"
              >
                Save Career Profile
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Requirement Coverage Matcher & Saved Companies */}
        <div className="space-y-6">
          {/* Requirement Coverage Box */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>REQUIREMENT COVERAGE MATCH</span>
            </div>

            <div>
              <div className="text-white font-display font-bold text-sm">
                Targeting: {formData.targetCompany || 'General Tech'}
              </div>
              <div className="text-xs text-[#94A3B8]">
                Role: {formData.targetRole || 'Software Engineer'}
              </div>
            </div>

            {coverageData && (
              <div className="space-y-3">
                {/* Score Dial */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3 text-center">
                  <div className="font-mono text-2xl font-bold text-[#00F0FF]">
                    {coverageData.matchScore}%
                  </div>
                  <div className="text-[11px] text-[#64748B]">Skills Alignment Index</div>
                </div>

                {/* Match Summary Sentence */}
                <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-lg text-xs text-[#E2E8F0] leading-relaxed">
                  {coverageData.recommendation}
                </div>

                {/* Matched Skills */}
                <div>
                  <div className="text-[10px] font-mono uppercase text-emerald-400 mb-1">
                    Demonstrated Competencies ({coverageData.matched.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {coverageData.matched.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                {coverageData.missing.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-amber-400 mb-1">
                      Recommended Focus Areas ({coverageData.missing.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {coverageData.missing.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px]">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Saved Companies Shelf */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8]">
              <Bookmark className="w-4 h-4" />
              <span>MY SAVED COMPANIES ({savedCompanies.length})</span>
            </div>

            {savedCompanies.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#64748B]">
                No companies saved yet. Browse the map and click the bookmark icon to save.
              </div>
            ) : (
              <div className="space-y-2">
                {savedCompanies.map((c) => (
                  <div
                    key={c.placeId}
                    onClick={() => onSelectCompany(c)}
                    className="p-2.5 bg-[#0F172A] border border-[#1E293B] hover:border-[#334155] rounded-lg cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-[10px] text-[#64748B]">{c.businessType} • {c.distanceKm} km</div>
                    </div>
                    <span className="text-[#00F0FF] text-[11px]">View →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
