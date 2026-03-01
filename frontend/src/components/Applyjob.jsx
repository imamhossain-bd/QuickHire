import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, submitApplication } from '../services/Jobservice';
import { useAuth } from '../context/AuthContext';

const Field = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[#25324B]">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
);

const inputCls = (error) => `
    h-11 px-4 text-sm border outline-none bg-white
    text-[#25324B] placeholder-[#A8ADB7] transition-colors duration-150
    ${error ? 'border-red-400 focus:border-red-500' : 'border-[#D6DDEB] focus:border-[#4640DE]'}
`;

const ApplyJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileRef = useRef(null);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        resume_link: '',
        cover_note: '',
    });
    const [cvFile, setCvFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) {
            setForm(p => ({
                ...p,
                name: user.full_name || '',
                email: user.email || '',
            }));
        }
        getJob(id)
            .then(data => setJob(data.data))
            .catch(() => navigate('/jobs'))
            .finally(() => setLoading(false));
    }, [id, user]);

    const set = (key) => (e) => {
        setForm(p => ({ ...p, [key]: e.target.value }));
        setErrors(p => ({ ...p, [key]: '' }));
        setApiError('');
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setErrors(p => ({ ...p, cv_file: 'File must be less than 5MB.' }));
            return;
        }
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowed.includes(file.type)) {
            setErrors(p => ({ ...p, cv_file: 'Only PDF, DOC, or DOCX files allowed.' }));
            return;
        }
        setCvFile(file);
        setErrors(p => ({ ...p, cv_file: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Full name is required.';
        if (!form.email) e.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email.';
        if (!cvFile && !form.resume_link.trim()) e.cv_file = 'Please upload your CV or provide a resume link.';
        if (form.resume_link && !/^https?:\/\//.test(form.resume_link))
            e.resume_link = 'Please enter a valid URL.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        setApiError('');

        const fd = new FormData();
        fd.append('job_id', id);
        fd.append('name', form.name);
        fd.append('email', form.email);
        fd.append('cover_note', form.cover_note);
        if (form.resume_link) fd.append('resume_link', form.resume_link);
        if (cvFile) fd.append('cv_file', cvFile);

        try {
            await submitApplication(fd);
            setSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                const mapped = {};
                if (serverErrors.name) mapped.name = serverErrors.name[0];
                if (serverErrors.email) mapped.email = serverErrors.email[0];
                if (serverErrors.resume_link) mapped.resume_link = serverErrors.resume_link[0];
                if (serverErrors.cv_file) mapped.cv_file = serverErrors.cv_file[0];
                if (serverErrors.cover_note) mapped.cover_note = serverErrors.cover_note[0];
                setErrors(mapped);
            } else {
                setApiError(err.response?.data?.message || 'Submission failed. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F8FD] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#4640DE] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#F8F8FD] flex items-center justify-center px-4">
                <div className="bg-white border border-[#D6DDEB] p-10 max-w-md w-full text-center">
                    <div className="w-14 h-14 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
                        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-[20px] font-bold text-[#25324B] font-clash mb-2">Application Submitted!</h2>
                    <p className="text-sm text-[#7C8493] mb-6">
                        Your application for <strong>{job?.title}</strong> at <strong>{job?.company}</strong> has been received.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => navigate('/dashboard')} className="w-full py-2.5 text-sm font-bold text-white bg-[#4640DE] hover:bg-[#3d37c9] transition-colors">
                            View My Applications
                        </button>
                        <button onClick={() => navigate('/jobs')} className="w-full py-2.5 text-sm font-semibold text-[#4640DE] border border-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-colors">
                            Browse More Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F8FD]">

            <div className="bg-white border-b border-[#D6DDEB]">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <Link to={`/jobs/${id}`} className="flex items-center gap-1.5 text-xs text-[#7C8493] hover:text-[#4640DE] mb-5 transition-colors w-fit">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Job Details
                    </Link>
                    <h1 className="text-[22px] font-bold text-[#25324B] font-clash mb-0.5">
                        Apply for: {job?.title}
                    </h1>
                    <p className="text-sm text-[#7C8493]">{job?.company} · {job?.location}</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-10">

                {!user && (
                    <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 text-sm text-blue-700">
                        <Link to="/login" className="font-semibold underline">Log in</Link> to track your applications in your dashboard.
                    </div>
                )}

                {apiError && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-600">
                        {apiError}
                    </div>
                )}

                <div className="bg-white border border-[#D6DDEB] p-8">
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                        <Field label="Full Name" required error={errors.name}>
                            <input type="text" placeholder="Enter your full name" value={form.name} onChange={set('name')} className={inputCls(errors.name)} />
                        </Field>

                        <Field label="Email Address" required error={errors.email}>
                            <input type="email" placeholder="Enter your email address" value={form.email} onChange={set('email')} className={inputCls(errors.email)} />
                        </Field>

                        <Field label="Upload CV" required error={errors.cv_file}>
                            <div onClick={() => fileRef.current?.click()}
                                className={`
                                    border-2 border-dashed p-6 flex flex-col items-center justify-center
                                    cursor-pointer transition-colors duration-150
                                    ${errors.cv_file
                                        ? 'border-red-300 bg-red-50'
                                        : cvFile
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-[#D6DDEB] bg-[#F8F8FD] hover:border-[#4640DE]'
                                    }
                                `}>
                                {cvFile ? (
                                    <>
                                        <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm font-medium text-green-700">{cvFile.name}</p>
                                        <p className="text-xs text-[#7C8493] mt-0.5">Click to change</p>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-8 h-8 text-[#7C8493] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm font-medium text-[#25324B]">Click to upload CV</p>
                                        <p className="text-xs text-[#7C8493] mt-0.5">PDF, DOC, DOCX — max 5MB</p>
                                    </>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
                        </Field>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-[#D6DDEB]" />
                            <span className="text-xs text-[#7C8493]">or</span>
                            <div className="flex-1 h-px bg-[#D6DDEB]" />
                        </div>

                        <Field label="Resume / LinkedIn URL" error={errors.resume_link}>
                            <input type="url" placeholder="https://linkedin.com/in/yourprofile" value={form.resume_link} onChange={set('resume_link')} className={inputCls(errors.resume_link)} />
                        </Field>

                        <Field label="Cover Note" error={errors.cover_note}>
                            <textarea rows={5} placeholder="Tell the employer why you're a great fit for this role..." value={form.cover_note} onChange={set('cover_note')} className={`
                                    px-4 py-3 text-sm border outline-none bg-white resize-none
                                    text-[#25324B] placeholder-[#A8ADB7] transition-colors duration-150
                                    ${errors.cover_note ? 'border-red-400 focus:border-red-500' : 'border-[#D6DDEB] focus:border-[#4640DE]'}
                                `} />
                            <div className="flex justify-end">
                                <span className="text-[10px] text-[#7C8493]">{form.cover_note.length}/2000</span>
                            </div>
                        </Field>

                        <button type="submit" disabled={submitting} className="h-11 w-full text-sm font-bold text-white bg-[#4640DE] hover:bg-[#3d37c9] transition-colors duration-150 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                            {submitting ? 'Submitting…' : 'Submit Application'}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default ApplyJob;