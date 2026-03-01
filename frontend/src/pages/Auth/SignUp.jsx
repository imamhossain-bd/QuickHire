import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Logo 2.png';

const Field = ({ label, type = 'text', placeholder, value, onChange, error }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[#25324B]">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`
                h-11 px-4 text-sm border outline-none bg-white
                text-[#25324B] placeholder-[#A8ADB7] transition-colors duration-150
                ${error ? 'border-red-400 focus:border-red-500' : 'border-[#D6DDEB] focus:border-[#4640DE]'}
            `} />
        {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
);

const strengthLevel = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Weak', bar: 'w-1/4', color: 'bg-red-400' };
    if (pw.length < 10) return { label: 'Fair', bar: 'w-2/4', color: 'bg-yellow-400' };
    if (pw.length < 14) return { label: 'Good', bar: 'w-3/4', color: 'bg-blue-400' };
    return { label: 'Strong', bar: 'w-full', color: 'bg-green-400' };
};

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        fullName: '', email: '', password: '', confirmPassword: '', agreed: false,
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm(p => ({ ...p, [key]: val }));
        setErrors(p => ({ ...p, [key]: '' }));
        setApiError('');
    };

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = 'Full name is required.';
        if (!form.email) e.email = 'Email address is required.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email.';
        if (!form.password) e.password = 'Password is required.';
        else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
        if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
        else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
        if (!form.agreed) e.agreed = 'You must accept the terms to continue.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            await register({ fullName: form.fullName, email: form.email, password: form.password });
            navigate('/login', { state: { registered: true } });
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                const mapped = {};
                if (serverErrors.full_name) mapped.fullName = serverErrors.full_name[0];
                if (serverErrors.email) mapped.email = serverErrors.email[0];
                if (serverErrors.password) mapped.password = serverErrors.password[0];
                setErrors(mapped);
            } else {
                setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const strength = strengthLevel(form.password);

    return (
        <div className="min-h-screen bg-[#F8F8FD] flex flex-col">

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[460px]">

                    <div className="mb-8">
                        <h1 className="text-[26px] font-bold text-[#25324B] font-clash mb-1.5">Create Account</h1>
                        <p className="text-sm text-[#7C8493]">Join QuickHire and find your next opportunity.</p>
                    </div>

                    {apiError && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-600">
                            {apiError}
                        </div>
                    )}

                    <div className="bg-white border border-[#D6DDEB] p-8">
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                            <Field
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={form.fullName}
                                onChange={set('fullName')}
                                error={errors.fullName}
                            />

                            <Field
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email address"
                                value={form.email}
                                onChange={set('email')}
                                error={errors.email}
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#25324B]">Password</label>
                                <input
                                    type="password"
                                    placeholder="Minimum 8 characters"
                                    value={form.password}
                                    onChange={set('password')}
                                    className={`
                                        h-11 px-4 text-sm border outline-none bg-white
                                        text-[#25324B] placeholder-[#A8ADB7] transition-colors duration-150
                                        ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-[#D6DDEB] focus:border-[#4640DE]'}
                                    `}
                                />
                                {strength && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex-1 h-1 bg-[#D6DDEB] overflow-hidden">
                                            <div className={`h-full transition-all duration-300 ${strength.color} ${strength.bar}`} />
                                        </div>
                                        <span className="text-[10px] text-[#7C8493] w-9 text-right shrink-0">{strength.label}</span>
                                    </div>
                                )}
                                {errors.password && <span className="text-[11px] text-red-500">{errors.password}</span>}
                            </div>

                            <Field
                                label="Confirm Password"
                                type="password"
                                placeholder="Re-enter your password"
                                value={form.confirmPassword}
                                onChange={set('confirmPassword')}
                                error={errors.confirmPassword}
                            />

                            <div className="flex flex-col gap-1">
                                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={form.agreed}
                                        onChange={set('agreed')}
                                        className="w-4 h-4 mt-0.5 accent-[#4640DE] cursor-pointer shrink-0"
                                    />
                                    <span className="text-[13px] text-[#7C8493] leading-relaxed">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-[#4640DE] font-medium hover:underline">Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link to="/privacy" className="text-[#4640DE] font-medium hover:underline">Privacy Policy</Link>
                                    </span>
                                </label>
                                {errors.agreed && <span className="text-[11px] text-red-500 ml-[26px]">{errors.agreed}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    h-11 w-full text-sm font-bold text-white
                                    bg-[#4640DE] hover:bg-[#3d37c9]
                                    transition-colors duration-150 active:scale-[0.99]
                                    disabled:opacity-60 disabled:cursor-not-allowed mt-1
                                "
                            >
                                {loading ? 'Creating account…' : 'Create Account'}
                            </button>

                        </form>
                    </div>

                    <p className="text-center text-[13px] text-[#7C8493] mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#4640DE] font-semibold hover:underline">Log in here</Link>
                    </p>

                </div>
            </main>

        </div>
    );
};

export default Signup;