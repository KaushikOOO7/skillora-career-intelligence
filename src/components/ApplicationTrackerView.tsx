import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { ApplicationItem, ApplicationStage, OpportunityType } from '../types';

interface ApplicationTrackerViewProps {
  applications: ApplicationItem[];
  onAddApplication: (app: Omit<ApplicationItem, 'id' | 'updatedAt'>) => void;
  onUpdateStage: (id: string, stage: ApplicationStage) => void;
  onDeleteApplication: (id: string) => void;
}

const STAGES: ApplicationStage[] = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer'];

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onAddApplication,
  onUpdateStage,
  onDeleteApplication
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [type, setType] = useState<OpportunityType>('Full-time');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;
    onAddApplication({
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      type,
      stage: 'Saved',
      notes: notes.trim()
    });
    setCompanyName('');
    setRoleTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div id="application-tracker-view" className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Briefcase className="w-4 h-4" />
            <span>CAREER PIPELINE MANAGEMENT</span>
          </div>
          <h2 className="font-display font-bold text-white text-xl">
            Job Application Tracker
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage your recruitment progression from discovery to offer stages with local and cloud sync.
          </p>
        </div>

        <button
          id="add-application-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-lg bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-semibold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Role</span>
        </button>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = applications.filter((app) => app.stage === stage);

          return (
            <div
              key={stage}
              className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-3 flex flex-col min-w-[220px] shadow-md"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E293B]">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  {stage}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#00F0FF]">
                  {items.length}
                </span>
              </div>

              {/* Items in stage */}
              <div className="flex-1 space-y-2.5">
                {items.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-[#64748B] border border-dashed border-[#1E293B] rounded-lg">
                    No applications
                  </div>
                ) : (
                  items.map((app) => (
                    <div
                      key={app.id}
                      className="bg-[#0F172A] border border-[#1E293B] hover:border-[#334155] rounded-lg p-3 space-y-2 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1E293B] text-emerald-400">
                            {app.type}
                          </span>
                          <button
                            onClick={() => onDeleteApplication(app.id)}
                            className="text-[#64748B] hover:text-rose-400"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <h4 className="font-display font-semibold text-white text-xs mt-1 leading-snug">
                          {app.roleTitle}
                        </h4>
                        <div className="text-[11px] text-[#94A3B8]">{app.companyName}</div>
                      </div>

                      {app.notes && (
                        <p className="text-[10px] text-[#64748B] bg-[#0B0F17] p-1.5 rounded border border-[#1E293B] line-clamp-2">
                          {app.notes}
                        </p>
                      )}

                      <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[9px] text-[#64748B]">
                        <span>Updated: {app.updatedAt}</span>
                        {/* Quick stage advance */}
                        {stage !== 'Offer' && (
                          <button
                            onClick={() => {
                              const nextIdx = STAGES.indexOf(stage) + 1;
                              if (nextIdx < STAGES.length) {
                                onUpdateStage(app.id, STAGES[nextIdx]);
                              }
                            }}
                            className="text-[#00F0FF] hover:underline flex items-center gap-0.5"
                          >
                            <span>Advance</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-white text-base">Track Application</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Microsoft, Google, Zerodha"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Opportunity Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as OpportunityType)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Notes / Resume Variant</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Submitted custom resume highlighting distributed systems..."
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded border border-[#1E293B] text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#00F0FF] text-black font-semibold hover:bg-[#00F0FF]/90"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
