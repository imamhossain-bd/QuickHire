import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetStats } from '../services/adminService';
import api from '../services/api';

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || 'quickhire-admin-secret-2024';
const adminCfg = () => ({ headers: { 'X-Admin-Token': ADMIN_TOKEN } });

const fetchJobApplications = (jobId) =>
    api.get(`/admin/jobs/${jobId}/applications`, adminCfg()).then(r => r.data);

const updateApplicationStatus = (appId, status) =>
    api.patch(`/admin/applications/${appId}/status`, { status }, adminCfg()).then(r => r.data);

const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-400' },
    reviewed: { label: 'Reviewed', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-400' },
    shortlisted: { label: 'Shortlisted', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200', dot: 'bg-red-400' },
};

const StatusBadge = ({ status }) => {
    const c = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

const StatusDropdown = ({ appId, current, onChange }) => {
    const [loading, setLoading] = useState(false);

    const handleChange = async (e) => {
        const newStatus = e.target.value;
        setLoading(true);
        try {
            await updateApplicationStatus(appId, newStatus);
            onChange(appId, newStatus);
        } catch {
            alert('Failed to update status.');
        } finally { setLoading(false); }
    };

    const c = STATUS_CONFIG[current] || STATUS_CONFIG.pending;

    return (
        <select value={current} onChange={handleChange} disabled={loading} className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-colors disabled:opacity-60
                ${c.bg} ${c.text} ${c.border}`}>
            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                <option key={val} value={val}>{cfg.label}</option>
            ))}
        </select>
    );
};

const AdminJobApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        setLoading(true);
        fetchJobApplications(id)
            .then(res => setData(res.data))
            .catch(() => showToast('Failed to load applications.', 'error'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusChange = (appId, newStatus) => {
        setData(prev => ({
            ...prev,
            applications: prev.applications.map(a =>
                a.id === appId ? { ...a, status: newStatus } : a
            ),
        }));
        showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label}.`);
    };

    const applications = data?.applications || [];
    const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

    const counts = applications.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {});

    const FILTERS = [
        { key: 'all', label: 'All', count: applications.length },
        { key: 'pending', label: 'Pending', count: counts.pending || 0 },
        { key: 'reviewed', label: 'Reviewed', count: counts.reviewed || 0 },
        { key: 'shortlisted', label: 'Shortlisted', count: counts.shortlisted || 0 },
        { key: 'rejected', label: 'Rejected', count: counts.rejected || 0 },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const job = data?.job;

    return (
        <div className="min-h-screen bg-[#F7F8FC]">

            {toast && (
                <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-medium
                    ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                        {toast.type === 'error' ? '✕' : '✓'}
                    </span>
                    {toast.msg}
                </div>
            )}

            <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 h-14">
                <div className="max-w-6xl mx-auto px-6 h-full flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to Admin
                    </button>
                    <span className="w-px h-4 bg-slate-200" />
                    <span className="text-sm font-semibold text-slate-700 truncate">{job?.title || 'Job Applications'}</span>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">

                {job && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-7 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                            {job.company_logo
                                ? <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain p-1.5" />
                                : <span className="text-lg font-bold text-indigo-600">{job.company?.charAt(0)}</span>
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-[18px] font-bold text-slate-900 truncate">{job.title}</h1>
                            <p className="text-sm text-slate-400">{job.company}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-2xl font-bold text-indigo-600">{applications.length}</p>
                            <p className="text-xs text-slate-400">total applicants</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-5 flex-wrap">
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-xl border transition-colors
                                ${filter === f.key
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}>
                            {f.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {f.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-sm text-slate-400">No applications in this category.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {filtered.map((app, idx) => (
                                <div key={app.id} className="px-6 py-4 flex items-center gap-5 hover:bg-slate-50/50 transition-colors">

                                    <span className="text-[11px] font-bold text-slate-300 w-6 shrink-0 text-right">
                                        {idx + 1}
                                    </span>

                                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-indigo-600">{app.name?.charAt(0)?.toUpperCase()}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-semibold text-slate-800">{app.name}</p>
                                        <p className="text-[11px] text-slate-400">{app.email}</p>
                                        {app.cover_note && (
                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">"{app.cover_note}"</p>
                                        )}
                                    </div>

                                    <div className="hidden sm:flex flex-col gap-1 shrink-0">
                                        {app.resume_link && (
                                            <a href={app.resume_link} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                Resume
                                            </a>
                                        )}
                                        {app.cv_url && (
                                            <a href={app.cv_url} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                CV
                                            </a>
                                        )}
                                    </div>

                                    <span className="hidden md:block text-[11px] text-slate-400 shrink-0">
                                        {app.created_at ? new Date(app.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                    </span>

                                    <StatusDropdown appId={app.id} current={app.status} onChange={handleStatusChange} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminJobApplications;