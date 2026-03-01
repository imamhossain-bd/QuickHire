import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Logo 2.png';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const justRegistered = location.state?.registered;

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => {
        setForm(p => ({ ...p, [key]: e.target.value }));
        setErrors(p => ({ ...p, [key]: '' }));
        setApiError('');
    };

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Email address is required.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email.';
        if (!form.password) e.password = 'Password is required.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            const userData = await login({ email: form.email, password: form.password });
            if (userData.role === 'admin' || userData.is_admin) {
                navigate('/admin', { replace: true });
            } else {
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                const mapped = {};
                if (serverErrors.email) mapped.email = serverErrors.email[0];
                if (serverErrors.password) mapped.password = serverErrors.password[0];
                setErrors(mapped);
            } else {
                setApiError(err.response?.data?.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F8FD] flex flex-col">


            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-[460px]">

                    <div className="mb-8">
                        <h1 className="text-[26px] font-bold text-[#25324B] font-clash mb-1.5">Welcome Back</h1>
                        <p className="text-sm text-[#7C8493]">Log in to your QuickHire account to continue.</p>
                    </div>

                    {justRegistered && (
                        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-sm text-green-700">
                            ✓ Account created successfully! Please log in.
                        </div>
                    )}

                    {apiError && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-600">
                            {apiError}
                        </div>
                    )}

                    <div className="bg-white border border-[#D6DDEB] p-8">
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-[#25324B]">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={form.email}
                                    onChange={set('email')}
                                    className={`h-11 px-4 text-sm border outline-none bg-white text-[#25324B] placeholder-[#A8ADB7] transition-colors duration-150
                                        ${errors.email ? 'border-red-400' : 'border-[#D6DDEB] focus:border-[#4640DE]'}`}
                                />
                                {errors.email && <span className="text-[11px] text-red-500">{errors.email}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[13px] font-semibold text-[#25324B]">Password</label>
                                    <Link to="/forgot-password" className="text-[11px] text-[#4640DE] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={set('password')}
                                    className={`h-11 px-4 text-sm border outline-none bg-white text-[#25324B] placeholder-[#A8ADB7] transition-colors duration-150
                                        ${errors.password ? 'border-red-400' : 'border-[#D6DDEB] focus:border-[#4640DE]'}`}
                                />
                                {errors.password && <span className="text-[11px] text-red-500">{errors.password}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full text-sm font-bold text-white bg-[#4640DE] hover:bg-[#3d37c9] transition-colors duration-150 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                            >
                                {loading ? 'Signing in…' : 'Login'}
                            </button>

                        </form>
                    </div>

                    <p className="text-center text-[13px] text-[#7C8493] mt-5">
                        New to QuickHire?{' '}
                        <Link to="/signup" className="text-[#4640DE] font-semibold hover:underline">Create a free account</Link>
                    </p>

                </div>
            </main>

        </div>
    );
};

export default Login;