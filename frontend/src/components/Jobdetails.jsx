import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob } from '../services/Jobservice';

const JOB_TYPE_LABEL = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'remote': 'Remote',
    'contract': 'Contract',
    'internship': 'Internship',
};

const InfoBadge = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-4 bg-[#F8F8FD] border border-[#D6DDEB]">
        <div className="w-9 h-9 bg-white border border-[#D6DDEB] flex items-center justify-center shrink-0 text-[#4640DE]">
            {icon}
        </div>
        <div>
            <p className="text-[10px] text-[#7C8493] uppercase tracking-wide">{label}</p>
            <p className="text-[13px] font-semibold text-[#25324B]">{value}</p>
        </div>
    </div>
);

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        getJob(id)
            .then(data => setJob(data.data))
            .catch(() => setError('Job not found or no longer available.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F8FD] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#4640DE] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-[#F8F8FD] flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-[#25324B] font-semibold">{error}</p>
                <button onClick={() => navigate('/jobs')} className="text-sm text-[#4640DE] hover:underline">
                    ← Back to Jobs
                </button>
            </div>
        );
    }

    const salary = job.salary_min && job.salary_max
        ? `$${job.salary_min.toLocaleString()} – $${job.salary_max.toLocaleString()}`
        : 'Not specified';

    return (
        <div className="min-h-screen bg-[#F8F8FD]">

            <div className="bg-white border-b border-[#D6DDEB]">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    <Link to="/jobs" className="flex items-center gap-1.5 text-xs text-[#7C8493] hover:text-[#4640DE] mb-6 transition-colors w-fit">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Jobs
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        {job.company_logo ? (
                            <img src={job.company_logo} alt={job.company} className="w-16 h-16 object-contain border border-[#D6DDEB] p-2 bg-white" />
                        ) : (
                            <div className="w-16 h-16 bg-[#F8F8FD] border border-[#D6DDEB] flex items-center justify-center text-xl font-bold text-[#4640DE]">
                                {job.company?.charAt(0)}
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <h1 className="text-[22px] font-bold text-[#25324B] font-clash mb-1">{job.title}</h1>
                            <p className="text-sm text-[#7C8493]">
                                {job.company}
                                <span className="mx-2 text-[#D6DDEB]">·</span>
                                {job.location}
                                <span className="mx-2 text-[#D6DDEB]">·</span>
                                <span className="text-[#56CDAD]">{job.applications_count || 0} applicants</span>
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(`/jobs/${id}/apply`)}
                            className="
                                px-8 py-3 text-sm font-bold text-white
                                bg-[#4640DE] hover:bg-[#3d37c9]
                                transition-colors duration-150 active:scale-[0.98]
                                whitespace-nowrap shrink-0
                            "
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 flex flex-col gap-8">

                        <div className="bg-white border border-[#D6DDEB] p-6">
                            <h2 className="text-[16px] font-bold text-[#25324B] mb-4">Job Description</h2>
                            <p className="text-sm text-[#515B6F] leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>

                        {job.requirements && (
                            <div className="bg-white border border-[#D6DDEB] p-6">
                                <h2 className="text-[16px] font-bold text-[#25324B] mb-4">Requirements</h2>
                                <p className="text-sm text-[#515B6F] leading-relaxed whitespace-pre-line">
                                    {job.requirements}
                                </p>
                            </div>
                        )}

                        {job.benefits && (
                            <div className="bg-white border border-[#D6DDEB] p-6">
                                <h2 className="text-[16px] font-bold text-[#25324B] mb-4">Benefits</h2>
                                <p className="text-sm text-[#515B6F] leading-relaxed whitespace-pre-line">
                                    {job.benefits}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">

                        <div className="bg-white border border-[#D6DDEB] p-6">
                            <h2 className="text-[14px] font-bold text-[#25324B] mb-4">Job Overview</h2>
                            <div className="flex flex-col gap-3">
                                <InfoBadge
                                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                    label="Job Type"
                                    value={JOB_TYPE_LABEL[job.job_type] || job.job_type}
                                />
                                <InfoBadge
                                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                    label="Location"
                                    value={job.location}
                                />
                                <InfoBadge
                                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                                    label="Category"
                                    value={job.category}
                                />
                                <InfoBadge
                                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                    label="Salary"
                                    value={salary}
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(`/jobs/${id}/apply`)}
                            className="
                                w-full py-3 text-sm font-bold text-white
                                bg-[#4640DE] hover:bg-[#3d37c9]
                                transition-colors duration-150 active:scale-[0.98]
                            "
                        >
                            Apply Now →
                        </button>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default JobDetails;