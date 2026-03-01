import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    adminGetJobs, adminCreateJob, adminUpdateJob,
    adminDeleteJob, adminToggleJob, adminGetStats,
    adminGetUsers, adminUpdateRole, adminDeleteUser,
} from '../services/adminService';

const CATEGORIES = [
    'Engineering', 'Design', 'Marketing', 'Finance', 'Human Resources',
    'Product', 'Sales', 'Customer Support', 'Data Science', 'DevOps',
];
const JOB_TYPES = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'remote', label: 'Remote' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
];
const JOB_TYPE_LABEL = Object.fromEntries(JOB_TYPES.map(t => [t.value, t.label]));
const EMPTY_FORM = {
    title: '', company: '', company_logo: '', location: '',
    category: '', job_type: '', salary_min: '', salary_max: '',
    description: '', requirements: '', benefits: '', is_active: true,
};

const iCls = (e) =>
    `w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg outline-none transition-colors text-slate-800 placeholder-slate-300
    ${e ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-indigo-500'}`;

const Field = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
);

const Toast = ({ toast }) => !toast ? null : (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-fade-in
        ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
        {toast.type === 'error'
            ? <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✕</span>
            : <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
        }
        {toast.message}
    </div>
);

const ConfirmModal = ({ title, message, confirmLabel = 'Delete', danger = true, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl">
            <h3 className="text-[15px] font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6">{message}</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={onConfirm} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl text-white transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{confirmLabel}</button>
            </div>
        </div>
    </div>
);

const JobFormModal = ({ job, onClose, onSaved }) => {
    const isEdit = !!job;
    const [form, setForm] = useState(isEdit ? { ...job, salary_min: job.salary_min ?? '', salary_max: job.salary_max ?? '' } : EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState('');

    const set = (key) => (e) => {
        setForm(p => ({ ...p, [key]: e.target.value }));
        setErrors(p => ({ ...p, [key]: '' }));
        setApiError('');
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Required';
        if (!form.company.trim()) e.company = 'Required';
        if (!form.location.trim()) e.location = 'Required';
        if (!form.category) e.category = 'Required';
        if (!form.job_type) e.job_type = 'Required';
        if (!form.description.trim()) e.description = 'Required';
        if (form.salary_min && form.salary_max && Number(form.salary_min) > Number(form.salary_max))
            e.salary_min = 'Min cannot exceed max';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSaving(true);
        const payload = { ...form, salary_min: form.salary_min !== '' ? Number(form.salary_min) : null, salary_max: form.salary_max !== '' ? Number(form.salary_max) : null };
        try {
            const res = isEdit ? await adminUpdateJob(job.id, payload) : await adminCreateJob(payload);
            onSaved(res.data);
        } catch (err) {
            const se = err.response?.data?.errors;
            if (se) { const m = {}; Object.entries(se).forEach(([k, v]) => { m[k] = v[0]; }); setErrors(m); }
            else setApiError(err.response?.data?.message || 'Something went wrong.');
        } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 overflow-y-auto">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-[15px] font-bold text-slate-800">{isEdit ? 'Edit Job' : 'Post New Job'}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">✕</button>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="p-6 flex flex-col gap-4">
                        {apiError && <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">{apiError}</div>}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Job Title" required error={errors.title}>
                                <input type="text" placeholder="Senior React Developer" value={form.title} onChange={set('title')} className={iCls(errors.title)} />
                            </Field>
                            <Field label="Company" required error={errors.company}>
                                <input type="text" placeholder="Brain Station 23" value={form.company} onChange={set('company')} className={iCls(errors.company)} />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Location" required error={errors.location}>
                                <input type="text" placeholder="Dhaka, Bangladesh" value={form.location} onChange={set('location')} className={iCls(errors.location)} />
                            </Field>
                            <Field label="Logo URL" error={errors.company_logo}>
                                <input type="url" placeholder="https://logo.clearbit.com/..." value={form.company_logo} onChange={set('company_logo')} className={iCls(errors.company_logo)} />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Category" required error={errors.category}>
                                <select value={form.category} onChange={set('category')} className={iCls(errors.category)}>
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </Field>
                            <Field label="Job Type" required error={errors.job_type}>
                                <select value={form.job_type} onChange={set('job_type')} className={iCls(errors.job_type)}>
                                    <option value="">Select type</option>
                                    {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Min Salary (৳)" error={errors.salary_min}>
                                <input type="number" placeholder="50000" value={form.salary_min} onChange={set('salary_min')} className={iCls(errors.salary_min)} />
                            </Field>
                            <Field label="Max Salary (৳)" error={errors.salary_max}>
                                <input type="number" placeholder="100000" value={form.salary_max} onChange={set('salary_max')} className={iCls(errors.salary_max)} />
                            </Field>
                        </div>
                        <Field label="Description" required error={errors.description}>
                            <textarea rows={4} placeholder="Describe the role..." value={form.description} onChange={set('description')} className={`${iCls(errors.description)} resize-none`} />
                        </Field>
                        <Field label="Requirements" error={errors.requirements}>
                            <textarea rows={3} placeholder={"• 3+ years experience\n• Strong skills"} value={form.requirements} onChange={set('requirements')} className={`${iCls(errors.requirements)} resize-none`} />
                        </Field>
                        <Field label="Benefits" error={errors.benefits}>
                            <textarea rows={3} placeholder={"• Health insurance\n• Flexible hours"} value={form.benefits} onChange={set('benefits')} className={`${iCls(errors.benefits)} resize-none`} />
                        </Field>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <div onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))} className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </div>
                            <span className="text-sm text-slate-600">{form.is_active ? 'Active — visible to seekers' : 'Inactive — hidden'}</span>
                        </label>
                    </div>
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-60 flex items-center gap-2 transition-colors">
                            {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{value ?? <span className="text-slate-300">—</span>}</p>
            <p className="text-xs font-medium text-slate-400">{label}</p>
        </div>
    </div>
);

const JobsTab = ({ showToast, onJobClick }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchJobs = useCallback(() => {
        setLoading(true);
        const params = { per_page: 15, page };
        if (search.trim()) params.search = search.trim();
        adminGetJobs(params)
            .then(d => { setJobs(d.data?.jobs || []); setPagination(d.data?.pagination || {}); })
            .catch(() => showToast('Failed to load jobs.', 'error'))
            .finally(() => setLoading(false));
    }, [page, search]);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const handleSaved = () => { setShowForm(false); setEditJob(null); fetchJobs(); showToast(editJob ? 'Job updated.' : 'Job posted.'); };

    const handleDelete = async () => {
        try { await adminDeleteJob(deleteTarget.id); setDeleteTarget(null); fetchJobs(); showToast('Job deleted.'); }
        catch { showToast('Failed to delete.', 'error'); }
    };

    const handleToggle = async (job, e) => {
        e.stopPropagation();
        try {
            const res = await adminToggleJob(job.id);
            setJobs(p => p.map(j => j.id === job.id ? { ...j, is_active: res.data.is_active } : j));
            showToast(`Job ${res.data.is_active ? 'activated' : 'deactivated'}.`);
        } catch { showToast('Failed to update.', 'error'); }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 w-72">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Search jobs…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="flex-1 text-sm text-slate-700 placeholder-slate-300 bg-transparent outline-none" />
                </div>
                <button onClick={() => { setEditJob(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Post Job
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Listings</span>
                    <span className="text-xs text-slate-400">{pagination.total || 0} total</span>
                </div>

                {loading ? (
                    <div className="divide-y divide-slate-50">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2"><div className="h-3.5 bg-slate-100 rounded w-1/3" /><div className="h-3 bg-slate-100 rounded w-1/4" /></div>
                            </div>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-sm font-semibold text-slate-400 mb-1">No jobs found</p>
                        <p className="text-xs text-slate-300">Post your first job listing.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {jobs.map(job => (
                            <div key={job.id} onClick={() => onJobClick(job.id)} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50/70 cursor-pointer transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                    {job.company_logo
                                        ? <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain p-1" />
                                        : <span className="text-sm font-bold text-indigo-600">{job.company?.charAt(0)}</span>
                                    }
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{job.title}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{job.company} · {job.location}</p>
                                </div>

                                <span className="hidden lg:block text-[11px] text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full shrink-0">
                                    {JOB_TYPE_LABEL[job.job_type] || job.job_type}
                                </span>

                                <div className="hidden md:flex items-center gap-1 shrink-0">
                                    <span className="text-[11px] font-semibold text-slate-700">{job.applications_count ?? 0}</span>
                                    <span className="text-[11px] text-slate-400">applied</span>
                                </div>

                                <button onClick={e => handleToggle(job, e)} className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all shrink-0 flex items-center gap-1.5
                                        ${job.is_active ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${job.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                    {job.is_active ? 'Active' : 'Inactive'}
                                </button>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button onClick={e => { e.stopPropagation(); setEditJob(job); setShowForm(true); }} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={e => { e.stopPropagation(); setDeleteTarget(job); }} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {pagination.last_page > 1 && (
                    <div className="px-5 py-3.5 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Page {pagination.current_page} of {pagination.last_page}</span>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Prev</button>
                            <button disabled={page >= pagination.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {showForm && <JobFormModal job={editJob} onClose={() => { setShowForm(false); setEditJob(null); }} onSaved={handleSaved} />}
            {deleteTarget && <ConfirmModal title="Delete this job?" message={`"${deleteTarget.title}" and all its applications will be permanently removed.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
        </>
    );
};

const UsersTab = ({ showToast }) => {
    const { user: me } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [changingRole, setChangingRole] = useState(null);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        const p = { per_page: 20, page };
        if (search.trim()) p.search = search.trim();
        if (roleFilter) p.role = roleFilter;
        adminGetUsers(p)
            .then(d => { setUsers(d.data?.users || []); setPagination(d.data?.pagination || {}); })
            .catch(() => showToast('Failed to load users.', 'error'))
            .finally(() => setLoading(false));
    }, [page, search, roleFilter]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleRoleChange = async (userId, role) => {
        setChangingRole(userId);
        try {
            const res = await adminUpdateRole(userId, role);
            setUsers(p => p.map(u => u.id === userId ? { ...u, role: res.data.role, is_admin: res.data.is_admin } : u));
            showToast(`Role updated to ${role}.`);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed.', 'error');
        } finally { setChangingRole(null); }
    };

    const handleDelete = async () => {
        try { await adminDeleteUser(deleteTarget.id); setDeleteTarget(null); fetchUsers(); showToast('User deleted.'); }
        catch (err) { showToast(err.response?.data?.message || 'Failed.', 'error'); }
    };

    return (
        <>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 flex-1 min-w-[200px] max-w-xs">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Search users…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder-slate-300" />
                </div>
                <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-600 outline-none cursor-pointer">
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Users</span>
                    <span className="text-xs text-slate-400">{pagination.total || 0} total</span>
                </div>

                {loading ? (
                    <div className="divide-y divide-slate-50">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                                <div className="w-9 h-9 bg-slate-100 rounded-full shrink-0" />
                                <div className="flex-1 space-y-2"><div className="h-3.5 bg-slate-100 rounded w-1/3" /><div className="h-3 bg-slate-100 rounded w-1/4" /></div>
                            </div>
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-14 text-center"><p className="text-sm text-slate-400">No users found</p></div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {users.map(u => (
                            <div key={u.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group">
                                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-indigo-600">{u.full_name?.charAt(0)?.toUpperCase()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-slate-800 truncate">
                                        {u.full_name}
                                        {u.id === me?.id && <span className="ml-1.5 text-[10px] font-normal text-slate-400">(you)</span>}
                                    </p>
                                    <p className="text-[11px] text-slate-400">{u.email}</p>
                                </div>
                                <span className="hidden sm:block text-[11px] text-slate-400 shrink-0">{u.created_at}</span>
                                <span className="hidden md:block text-[11px] text-slate-400 shrink-0">{u.applications_count} apps</span>

                                <select value={u.role} disabled={changingRole === u.id || u.id === me?.id} onChange={e => handleRoleChange(u.id, e.target.value)} className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border outline-none cursor-pointer shrink-0 transition-colors
                                        ${u.is_admin ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-slate-500 bg-slate-50 border-slate-100'}
                                        disabled:opacity-50 disabled:cursor-not-allowed`}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>

                                {u.id !== me?.id && (
                                    <button onClick={() => setDeleteTarget(u)} className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all shrink-0">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {pagination.last_page > 1 && (
                    <div className="px-5 py-3.5 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Page {pagination.current_page} of {pagination.last_page}</span>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Prev</button>
                            <button disabled={page >= pagination.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {deleteTarget && <ConfirmModal title="Delete user?" message={`"${deleteTarget.full_name}" will be permanently deleted.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
        </>
    );
};

const AdminPanel = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [tab, setTab] = useState('jobs');
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadStats = () =>
        adminGetStats()
            .then(d => setStats(d.data?.overview || d.data || null))
            .catch(() => { });

    useEffect(() => { loadStats(); }, [tab]);

    const handleLogout = async () => { await logout(); navigate('/login'); };

    const TABS = [
        { key: 'jobs', label: 'Jobs' },
        { key: 'users', label: 'Users' },
    ];

    const STATS = [
        { label: 'Total Jobs', value: stats?.total_jobs, icon: '💼', color: 'bg-blue-50' },
        { label: 'Active Jobs', value: stats?.active_jobs, icon: '✅', color: 'bg-green-50' },
        { label: 'Applications', value: stats?.total_applications, icon: '📋', color: 'bg-purple-50' },
        { label: 'Pending Review', value: stats?.pending_applications, icon: '⏳', color: 'bg-amber-50' },
    ];

    return (
        <div className="min-h-screen bg-[#F7F8FC] font-sans">
            <Toast toast={toast} />

            <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 h-14">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-bold">Q</span>
                        </div>
                        <span className="text-[14px] font-bold text-slate-800 tracking-tight">QuickHire</span>
                        <span className="w-px h-4 bg-slate-200" />
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">Admin</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <span className="hidden sm:block text-xs text-slate-400">{user?.full_name}</span>
                        <a href="/" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-slate-700 transition-colors">View Site ↗</a>
                        <button onClick={handleLogout} className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Manage your jobs and team.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {STATS.map(s => <StatCard key={s.label} {...s} />)}
                </div>

                <div className="flex gap-1 p-1 bg-white border border-slate-100 rounded-xl w-fit mb-6">
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === t.key ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'jobs' && <JobsTab showToast={showToast} onJobClick={id => navigate(`/admin/jobs/${id}`)} />}
                {tab === 'users' && <UsersTab showToast={showToast} />}
            </div>
        </div>
    );
};

export default AdminPanel;