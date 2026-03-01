import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getJobs } from '../services/Jobservice';

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
    Sales: 'text-[#FFB836] bg-[#FFF6E6]',
};

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="flex flex-col p-5 bg-white border border-[#D6DDEB] hover:border-[#4640DE] hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-4">
                {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company} className="w-10 h-10 object-contain" />
                ) : (
                    <div className="w-10 h-10 bg-[#F8F8FD] border border-[#D6DDEB] flex items-center justify-center text-sm font-bold text-[#4640DE]">
                        {job.company?.charAt(0)}
                    </div>
                )}
                <span className="border border-[#4640DE] text-[#4640DE] text-xs font-medium px-3 py-1">
                    {JOB_TYPE_LABEL[job.job_type] || job.job_type}
                </span>
            </div>

            <h3 className="text-[15px] font-semibold text-[#25324B] group-hover:text-[#4640DE] transition-colors mb-1 line-clamp-1">
                {job.title}
            </h3>

            <p className="text-xs text-[#7C8493] mb-3">
                {job.company}
                <span className="mx-1.5 text-[#D6DDEB]">·</span>
                {job.location}
            </p>

            <p className="text-xs text-[#7C8493] leading-relaxed line-clamp-2 mb-4 flex-1">
                {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${TAG_STYLE[job.category] || 'text-[#7C8493] bg-[#F8F8FD]'}`}>
                    {job.category}
                </span>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="p-5 bg-white border border-[#D6DDEB] animate-pulse">
        <div className="flex justify-between mb-4">
            <div className="w-10 h-10 bg-[#F0F0F0]" />
            <div className="w-20 h-6 bg-[#F0F0F0]" />
        </div>
        <div className="h-4 bg-[#F0F0F0] mb-2 w-3/4" />
        <div className="h-3 bg-[#F0F0F0] mb-3 w-1/2" />
        <div className="h-3 bg-[#F0F0F0] mb-1 w-full" />
        <div className="h-3 bg-[#F0F0F0] mb-4 w-4/5" />
        <div className="h-6 bg-[#F0F0F0] rounded-full w-20" />
    </div>
);

const FeaturedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobs({ per_page: 8 })
            .then(data => setJobs(data.data?.jobs || []))
            .catch(() => setJobs([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[28px] font-bold text-[#25324B] font-clash">
                        Featured <span className="text-[#26A4FF]">jobs</span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : jobs.map(job => <JobCard key={job.id} job={job} />)
                    }
                </div>

            </div>
        </section>
    );
};

export default FeaturedJobs;