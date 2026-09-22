import React, { useState } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { StoredAlert } from '../types';

interface AlertsViewProps {
  alerts: StoredAlert[];
  onAddAlert: (alert: Omit<StoredAlert, 'id' | 'createdAt' | 'active'>) => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(25);
  const [roleType, setRoleType] = useState('Internship');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddAlert({
      title: title.trim(),
      query: query.trim() || title.trim(),
      radiusKm,
      roleType
    });
    setTitle('');
    setQuery('');
    setShowAddModal(false);
    setBannerNotice('Alert created. Automatic monitoring requires a connected job data source.');
    setTimeout(() => setBannerNotice(null), 6000);
  };

  return (
    <div id="alerts-management-view" className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Notice Banner */}
      {bannerNotice && (
        <div className="bg-amber-950/60 border border-amber-600/40 text-amber-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{bannerNotice}</span>
          </div>
          <button onClick={() => setBannerNotice(null)} className="text-amber-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Bell className="w-4 h-4" />
            <span>OPPORTUNITY NOTIFICATION PREFERENCES</span>
          </div>
          <h2 className="font-display font-bold text-white text-xl">
            Opportunity Alerts
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Configure automated search watchers for local internship openings and target tech employers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-lg bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-semibold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Alert Watcher</span>
        </button>
      </div>

      {/* Active Watchers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#38BDF8]">
                  Within {alert.radiusKm} km
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAlert(alert.id)}
                    className={`text-xs px-2 py-0.5 rounded font-mono ${
                      alert.active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#1E293B] text-[#64748B]'
                    }`}
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="text-[#64748B] hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-display font-bold text-white text-sm mt-2">{alert.title}</h4>
              <p className="text-xs text-[#94A3B8] mt-1">Keywords: {alert.query}</p>
            </div>

            <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B]">
              <span>Role: {alert.roleType || 'Any'}</span>
              <span>Created: {alert.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to add Alert */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-white text-base">Create Opportunity Alert</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Internships at NVIDIA, Microsoft, Google"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Keywords / Company Filters</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Software, Cloud, AI, Embedded"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Radius (km)</label>
                  <select
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value={10}>10 km</option>
                    <option value={20}>20 km</option>
                    <option value={50}>50 km</option>
                    <option value={100}>100 km</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Role Type</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-md text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
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
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
