import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyApplications } from '../services/Jobservice';
import logo from '../assets/Logo 2.png';

const STATUS_STYLE = {
    pending: { label: 'Pending', cls: 'text-[#FFB836] bg-[#FFF6E6] border-[#FFB836]' },
    reviewed: { label: 'Reviewed', cls: 'text-[#26A4FF] bg-[#E8F3FF] border-[#26A4FF]' },
    shortlisted: { label: 'Shortlisted', cls: 'text-[#56CDAD] bg-[#E7F9F4] border-[#56CDAD]' },
    rejected: { label: 'Rejected', cls: 'text-[#FF6550] bg-[#FFF0EE] border-[#FF6550]' },
};

const StatCard = ({ label, value, color }) => (
    <div className="bg-white border border-[#D6DDEB] p-5">
        <p className="text-[13px] text-[#7C8493] mb-1">{label}</p>
        <p className={`text-[28px] font-bold font-clash ${color}`}>{value}</p>
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 bg-[#F8F8FD] border border-[#D6DDEB] flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#7C8493]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <p className="text-sm font-semibold text-[#25324B] mb-1">No applications yet</p>
        <p className="text-xs text-[#7C8493] mb-5">Start applying to jobs and track them here.</p>
        <Link to="/jobs" className="px-6 py-2.5 text-sm font-bold text-white bg-[#4640DE] hover:bg-[#3d37c9] transition-colors">
            Browse Jobs
        </Link>
    </div>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');

    useEffect(() => {
        getMyApplications()
            .then(data => setApplications(data.data?.applications || []))
            .catch(() => setError('Failed to load applications. Please try again.'))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const counts = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    };

    const filtered = filter === 'all'
        ? applications
        : applications.filter(a => a.status === filter);

    const tabs = [
        { key: 'all', label: 'All', count: counts.total },
        { key: 'pending', label: 'Pending', count: counts.pending },
        { key: 'reviewed', label: 'Reviewed', count: counts.reviewed },
        { key: 'shortlisted', label: 'Shortlisted', count: counts.shortlisted },
    ];

    return (
        <div className="min-h-screen bg-[#F8F8FD] flex flex-col">

            <nav className="bg-white border-b border-[#D6DDEB] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="QuickHire" className="w-7 h-7" />
                        <span className="text-[15px] font-bold text-[#25324B] font-clash">QuickHire</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/jobs" className="hidden sm:block text-sm font-medium text-[#25324B] hover:text-[#4640DE] transition-colors">
                            Browse Jobs
                        </Link>
                        <div className="hidden sm:block h-5 w-px bg-[#D6DDEB]" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-[#4640DE] flex items-center justify-center text-white text-xs font-bold select-none shrink-0">
                                {user?.full_name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-[#25324B]">
                                {user?.full_name}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-semibold text-[#FF6550] hover:underline"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-[22px] font-bold text-[#25324B] font-clash mb-1">
                        Welcome back, {user?.full_name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-sm text-[#7C8493]">
                        Here's an overview of all your job applications.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Applied" value={counts.total} color="text-[#25324B]" />
                    <StatCard label="Pending" value={counts.pending} color="text-[#FFB836]" />
                    <StatCard label="Reviewed" value={counts.reviewed} color="text-[#26A4FF]" />
                    <StatCard label="Shortlisted" value={counts.shortlisted} color="text-[#56CDAD]" />
                </div>

                <div className="bg-white border border-[#D6DDEB]">

                    <div className="flex flex-wrap items-center justify-between border-b border-[#D6DDEB] px-6 pt-5 pb-0 gap-2">
                        <h2 className="text-[15px] font-bold text-[#25324B]">My Applications</h2>
                        <div className="flex items-center gap-1 overflow-x-auto">
                            {tabs.map(({ key, label, count }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={`
                                        px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap
                                        ${filter === key
                                            ? 'text-[#4640DE] border-[#4640DE]'
                                            : 'text-[#7C8493] border-transparent hover:text-[#25324B]'
                                        }
                                    `}
                                >
                                    {label}
                                    <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full
                                        ${filter === key ? 'bg-[#4640DE]/10 text-[#4640DE]' : 'bg-[#F8F8FD] text-[#7C8493]'}`}>
                                        {count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col divide-y divide-[#D6DDEB]">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                                    <div className="w-10 h-10 bg-[#F0F0F0] shrink-0" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-[#F0F0F0] w-1/3 mb-2" />
                                        <div className="h-3 bg-[#F0F0F0] w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="px-6 py-8 text-sm text-red-500 text-center">{error}</div>
                    ) : filtered.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="divide-y divide-[#D6DDEB]">
                            {filtered.map((app) => {
                                const st = STATUS_STYLE[app.status] ?? STATUS_STYLE.pending;
                                const jobData = app.job;

                                return (
                                    <div key={app.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-[#F8F8FD] transition-colors">
                                        <div className="w-10 h-10 bg-[#F8F8FD] border border-[#D6DDEB] flex items-center justify-center shrink-0 overflow-hidden">
                                            {jobData?.company_logo ? (
                                                <img src={jobData.company_logo} alt={jobData.company} className="w-6 h-6 object-contain" />
                                            ) : (
                                                <span className="text-xs font-bold text-[#4640DE]">
                                                    {jobData?.company?.charAt(0)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-semibold text-[#25324B] truncate">
                                                {jobData?.title || 'Job Title'}
                                            </p>
                                            <p className="text-xs text-[#7C8493]">
                                                {jobData?.company}
                                                {jobData?.location && (
                                                    <><span className="mx-1.5 text-[#D6DDEB]">·</span>{jobData.location}</>
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                                            <span className={`text-[11px] font-semibold px-3 py-1 border rounded-full ${st.cls}`}>
                                                {st.label}
                                            </span>
                                            <span className="text-[11px] text-[#7C8493] whitespace-nowrap">
                                                {new Date(app.created_at).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                })}
                                            </span>
                                            <Link to={`/jobs/${app.job_id}`} className="text-[11px] text-[#4640DE] hover:underline whitespace-nowrap">
                                                View Job
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

            </main>

        </div>
    );
};

export default Dashboard;