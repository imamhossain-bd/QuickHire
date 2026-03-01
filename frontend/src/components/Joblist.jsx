import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getJobs, getCategories } from '../services/Jobservice';

const JOB_TYPE_LABEL = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'remote': 'Remote',
    'contract': 'Contract',
    'internship': 'Internship',
};

const TAG_STYLE = {
    Engineering: 'text-[#4640DE] bg-[#EFEFFD]',
    Design: 'text-[#26A4FF] bg-[#E8F3FF]',
    Marketing: 'text-[#FFB836] bg-[#FFF6E6]',
    Finance: 'text-[#56CDAD] bg-[#E7F9F4]',
    Technology: 'text-[#FF6550] bg-[#FFF0EE]',
    Business: 'text-[#4640DE] bg-[#EFEFFD]',
    'Human Resources': 'text-[#FFB836] bg-[#FFF6E6]',
    Sales: 'text-[#56CDAD] bg-[#E7F9F4]',
    'Data Science': 'text-[#FF6550] bg-[#FFF0EE]',
    DevOps: 'text-[#26A4FF] bg-[#E8F3FF]',
};

const JobCard = ({ job, onClick }) => (
    <div
        onClick={() => onClick(job.id)}
        className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white border border-[#D6DDEB] hover:border-[#4640DE] hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
        {job.company_logo ? (
            <img src={job.company_logo} alt={job.company} className="w-12 h-12 object-contain shrink-0" />
        ) : (
            <div className="w-12 h-12 bg-[#F8F8FD] border border-[#D6DDEB] flex items-center justify-center text-base font-bold text-[#4640DE] shrink-0">
                {job.company?.charAt(0)}
            </div>
        )}

        <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-[#25324B] group-hover:text-[#4640DE] transition-colors mb-0.5">
                {job.title}
            </h3>
            <p className="text-xs text-[#7C8493] mb-2">
                {job.company}
                <span className="mx-1.5 text-[#D6DDEB]">·</span>
                {job.location}
            </p>
            <div className="flex flex-wrap gap-2">
                <span className={`text-xs font-medium px-3 py-0.5 rounded-full ${TAG_STYLE[job.category] || 'text-[#7C8493] bg-[#F8F8FD]'}`}>
                    {job.category}
                </span>
                <span className="text-xs font-medium px-3 py-0.5 rounded-full border border-[#D6DDEB] text-[#7C8493]">
                    {JOB_TYPE_LABEL[job.job_type] || job.job_type}
                </span>
            </div>
        </div>

        {(job.salary_min || job.salary_max) && (
            <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-[#25324B]">
                    ${job.salary_min?.toLocaleString()} – ${job.salary_max?.toLocaleString()}
                </p>
                <p className="text-xs text-[#7C8493]">per year</p>
            </div>
        )}
    </div>
);

const JobList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const debounceRef = useRef(null);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        job_type: searchParams.get('job_type') || '',
        page: Number(searchParams.get('page')) || 1,
    });

    useEffect(() => {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.job_type) params.job_type = filters.job_type;
        if (filters.page > 1) params.page = String(filters.page);
        setSearchParams(params, { replace: true });
    }, [filters]);

    const fetchJobs = useCallback(() => {
        setLoading(true);
        const params = { per_page: 10, page: filters.page };
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.job_type) params.job_type = filters.job_type;

        getJobs(params)
            .then(data => {
                setJobs(data.data?.jobs || []);
                setPagination(data.data?.pagination || {});
            })
            .catch(() => setJobs([]))
            .finally(() => setLoading(false));
    }, [filters]);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    useEffect(() => {
        getCategories()
            .then(data => {
                const raw = Array.isArray(data.data) ? data.data : [];
                const names = raw.map(c => (typeof c === 'string' ? c : c.name)).filter(Boolean);
                setCategories(names);
            })
            .catch(() => setCategories([]));
    }, []);

    const handleSearchChange = (value) => {
        setSearchInput(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setFilters(p => ({ ...p, search: value.trim(), page: 1 }));
        }, 400);
    };

    const setFilter = (key, value) =>
        setFilters(p => ({ ...p, [key]: value, page: 1 }));

    const clearFilters = () => {
        setSearchInput('');
        setFilters({ search: '', category: '', job_type: '', page: 1 });
    };

    const hasActiveFilters = filters.search || filters.category || filters.job_type;

    return (
        <div className="min-h-screen bg-[#F8F8FD]">

            <div className="bg-[#25324B] py-14">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-[28px] font-bold text-white font-clash mb-1">
                        Find your <span className="text-[#26A4FF]">dream job</span>
                    </h1>
                    <p className="text-sm text-white/60 mb-6">
                        {pagination.total || 0} jobs available
                        {filters.category && (
                            <span className="ml-1">
                                {' '}in <span className="text-white font-semibold">{filters.category}</span>
                            </span>
                        )}
                    </p>

                    <div className="flex flex-col md:flex-row bg-white">
                        <div className="flex items-center px-4 py-3 flex-1 border-b md:border-b-0 md:border-r border-[#D6DDEB]">
                            <svg className="w-5 h-5 text-[#7C8493] shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Job title or keyword"
                                value={searchInput}
                                onChange={e => handleSearchChange(e.target.value)}
                                className="w-full outline-none text-sm text-[#25324B] placeholder-[#A8ADB7] bg-transparent"
                            />
                            {searchInput && (
                                <button onClick={() => handleSearchChange('')} className="text-[#7C8493] hover:text-[#25324B] ml-2 shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="flex items-center px-4 py-3 flex-1 border-b md:border-b-0 md:border-r border-[#D6DDEB]">
                            <svg className="w-5 h-5 text-[#7C8493] shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                            <select
                                value={filters.category}
                                onChange={e => setFilter('category', e.target.value)}
                                className="w-full outline-none text-sm text-[#25324B] bg-transparent cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center px-4 py-3 flex-1">
                            <svg className="w-5 h-5 text-[#7C8493] shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <select
                                value={filters.job_type}
                                onChange={e => setFilter('job_type', e.target.value)}
                                className="w-full outline-none text-sm text-[#25324B] bg-transparent cursor-pointer"
                            >
                                <option value="">All Types</option>
                                {Object.entries(JOB_TYPE_LABEL).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">

                {hasActiveFilters && (
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <span className="text-xs text-[#7C8493]">Active filters:</span>
                        {filters.search && (
                            <span className="flex items-center gap-1.5 text-xs bg-[#EFEFFD] text-[#4640DE] px-3 py-1 rounded-full">
                                "{filters.search}"
                                <button onClick={() => { handleSearchChange(''); }} className="hover:opacity-70 font-bold">×</button>
                            </span>
                        )}
                        {filters.category && (
                            <span className="flex items-center gap-1.5 text-xs bg-[#EFEFFD] text-[#4640DE] px-3 py-1 rounded-full">
                                {filters.category}
                                <button onClick={() => setFilter('category', '')} className="hover:opacity-70 font-bold">×</button>
                            </span>
                        )}
                        {filters.job_type && (
                            <span className="flex items-center gap-1.5 text-xs bg-[#EFEFFD] text-[#4640DE] px-3 py-1 rounded-full">
                                {JOB_TYPE_LABEL[filters.job_type]}
                                <button onClick={() => setFilter('job_type', '')} className="hover:opacity-70 font-bold">×</button>
                            </span>
                        )}
                        <button onClick={clearFilters} className="text-xs text-[#FF6550] hover:underline ml-1">
                            Clear all
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-24 bg-white border border-[#D6DDEB] animate-pulse" />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-sm font-semibold text-[#25324B] mb-2">No jobs found</p>
                        <p className="text-xs text-[#7C8493] mb-4">Try adjusting your search or filters.</p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-sm font-semibold text-[#4640DE] hover:underline">
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4 mb-8">
                            {jobs.map(job => (
                                <JobCard key={job.id} job={job} onClick={id => navigate(`/jobs/${id}`)} />
                            ))}
                        </div>

                        {pagination.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    disabled={filters.page <= 1}
                                    onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                                    className="px-4 py-2 text-sm border border-[#D6DDEB] text-[#25324B] hover:border-[#4640DE] hover:text-[#4640DE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-[#7C8493] px-2">
                                    {filters.page} of {pagination.last_page}
                                </span>
                                <button disabled={filters.page >= pagination.last_page}
                                    onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                                    className="px-4 py-2 text-sm border border-[#D6DDEB] text-[#25324B] hover:border-[#4640DE] hover:text-[#4640DE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default JobList;