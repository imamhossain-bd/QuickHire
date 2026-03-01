import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getJobs } from '../services/Jobservice';
import pattern from '../assets/Pattern2.png';

const TAG_STYLE = {
    'full-time': 'text-[#56CDAD] border-[#56CDAD] bg-[#56CDAD]/10',
    'part-time': 'text-[#FFB836] border-[#FFB836] bg-[#FFB836]/10',
    'remote': 'text-[#4640DE] border-[#4640DE] bg-[#4640DE]/10',
    'contract': 'text-[#FF6550] border-[#FF6550] bg-[#FF6550]/10',
    'internship': 'text-[#26A4FF] border-[#26A4FF] bg-[#26A4FF]/10',
};

const JOB_TYPE_LABEL = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'remote': 'Remote',
    'contract': 'Contract',
    'internship': 'Internship',
};

const CATEGORY_STYLE = {
    Engineering: 'text-[#4640DE] border-[#4640DE] bg-[#4640DE]/10',
    Design: 'text-[#26A4FF] border-[#26A4FF] bg-[#26A4FF]/10',
    Marketing: 'text-[#FFB836] border-[#FFB836] bg-[#FFB836]/10',
    Finance: 'text-[#56CDAD] border-[#56CDAD] bg-[#56CDAD]/10',
    Technology: 'text-[#FF6550] border-[#FF6550] bg-[#FF6550]/10',
    Business: 'text-[#4640DE] border-[#4640DE] bg-[#4640DE]/10',
    Sales: 'text-[#FFB836] border-[#FFB836] bg-[#FFB836]/10',
};

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="flex items-center gap-4 p-5 bg-white border border-[#D6DDEB] hover:border-[#4640DE] hover:shadow-sm transition-all duration-200 cursor-pointer group"
        >
            <div className="w-12 h-12 shrink-0 border border-[#D6DDEB] bg-[#F8F8FD] flex items-center justify-center overflow-hidden">
                {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain p-1" />
                ) : (
                    <span className="text-sm font-bold text-[#4640DE]">{job.company?.charAt(0)}</span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-[#25324B] group-hover:text-[#4640DE] transition-colors mb-0.5 truncate">
                    {job.title}
                </h3>

                <p className="text-xs text-[#7C8493] mb-3">
                    {job.company}
                    <span className="mx-1.5 text-[#D6DDEB]">•</span>
                    {job.location}
                </p>

                <div className="flex flex-wrap gap-2">
                    <span className={`text-xs font-medium px-3 py-0.5 rounded-full border ${TAG_STYLE[job.job_type] ?? 'text-[#7C8493] border-[#D6DDEB]'}`}>
                        {JOB_TYPE_LABEL[job.job_type] || job.job_type}
                    </span>
                    {job.category && (
                        <span className={`text-xs font-medium px-3 py-0.5 rounded-full border ${CATEGORY_STYLE[job.category] ?? 'text-[#7C8493] border-[#D6DDEB]'}`}>
                            {job.category}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="flex items-center gap-4 p-5 bg-white border border-[#D6DDEB] animate-pulse">
        <div className="w-12 h-12 bg-[#F0F0F0] shrink-0" />
        <div className="flex-1">
            <div className="h-4 bg-[#F0F0F0] w-2/3 mb-2" />
            <div className="h-3 bg-[#F0F0F0] w-1/3 mb-3" />
            <div className="flex gap-2">
                <div className="h-5 bg-[#F0F0F0] rounded-full w-16" />
                <div className="h-5 bg-[#F0F0F0] rounded-full w-20" />
            </div>
        </div>
    </div>
);

const LatestJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobs({ per_page: 8 })
            .then(data => setJobs(data.data?.jobs || []))
            .catch(() => setJobs([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-16 bg-[#F8F9FF] relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none z-0">
                <img
                    src={pattern}
                    alt=""
                    className="w-[860px] h-[795px] ml-[710px] object-cover opacity-40"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[28px] font-bold text-[#25324B] font-clash">
                        Latest <span className="text-[#26A4FF]">jobs open</span>
                    </h2>
                    <NavLink
                        to="/jobs"
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#4640DE] hover:gap-2.5 transition-all"
                    >
                        Show all jobs
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </NavLink>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : jobs.map(job => <JobCard key={job.id} job={job} />)
                    }
                </div>

            </div>
        </section>
    );
};

export default LatestJobs;