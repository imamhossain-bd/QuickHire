import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Logo 2.png';


const navLinks = [
    { label: 'Find Jobs', to: '/jobs' },
    { label: 'Browse Companies', to: '/companies' },
];


const HamburgerIcon = ({ open }) => (
    <div className="flex flex-col justify-center items-center w-5 h-5 gap-[5px]">
        <span className={`block h-0.5 bg-[#25324B] transition-all duration-300 origin-center
            ${open ? 'w-5 rotate-45 translate-y-[7px]' : 'w-5'}`}
        />
        <span className={`block h-0.5 bg-[#25324B] transition-all duration-300
            ${open ? 'w-0 opacity-0' : 'w-5'}`}
        />
        <span className={`block h-0.5 bg-[#25324B] transition-all duration-300 origin-center
            ${open ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-5'}`}
        />
    </div>
);


const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
        navigate('/');
    };

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);


    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const linkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-150
        ${isActive ? 'text-[#4640DE]' : 'text-[#25324B] hover:text-[#4640DE]'}`;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#D6DDEB]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-[5rem]">

                    <div className="flex items-center gap-14">
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img src={logo} alt="QuickHire" className="h-[36px] w-[40px]" />
                            <span className="text-[20px] font-bold text-[#25324B] font-clash">
                                QuickHire
                            </span>
                        </Link>

                        <ul className="hidden md:flex items-center gap-8">
                            {navLinks.map(({ label, to }) => (
                                <li key={to}>
                                    <NavLink to={to} className={linkClass}>
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 bg-[#4640DE] flex items-center justify-center text-white text-xs font-bold select-none shrink-0">
                                        {user.full_name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-[#25324B]">
                                        {user.full_name}
                                    </span>
                                </Link>
                                <div className="h-5 w-px bg-[#D6DDEB]" />
                                <button onClick={handleLogout} className="text-sm font-bold text-[#FF6550] hover:underline transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-bold text-[#4640DE] hover:text-[#3d37c9] transition-colors">
                                    Login
                                </Link>
                                <div className="h-5 w-px bg-[#D6DDEB]" />
                                <Link to="/signup" className="h-9 px-6 flex items-center text-sm font-bold text-white bg-[#4640DE] hover:bg-[#3d37c9] transition-colors duration-150 active:scale-[0.98]">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 -mr-2 text-[#25324B]"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}>
                        <HamburgerIcon open={menuOpen} />
                    </button>

                </div>
            </div>

            <div className={`md:hidden bg-white border-t border-[#D6DDEB] overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4">

                    {/* Nav Links */}
                    {navLinks.map(({ label, to }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `text-sm font-medium py-1 transition-colors duration-150
                                ${isActive ? 'text-[#4640DE]' : 'text-[#25324B] hover:text-[#4640DE]'}`
                            }>
                            {label}
                        </NavLink>
                    ))}

                    <div className="h-px bg-[#D6DDEB] my-1" />

                    <div className="flex flex-col gap-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 py-2">
                                    <div className="w-9 h-9 bg-[#4640DE] flex items-center justify-center text-white text-sm font-bold select-none shrink-0">
                                        {user.full_name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#25324B]">{user.full_name}</span>
                                        <Link to="/dashboard" className="text-xs text-[#4640DE] font-medium">View Dashboard</Link>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="h-10 flex items-center justify-center text-sm font-bold text-white bg-[#FF6550] hover:bg-[#ef5d4a] transition-colors duration-150">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="h-10 flex items-center justify-center text-sm font-bold text-[#4640DE] border border-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-colors duration-150">
                                    Login
                                </Link>
                                <Link to="/signup" className="h-10 flex items-center justify-center text-sm font-bold text-white bg-[#4640DE] hover:bg-[#3d37c9] transition-colors duration-150">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>

        </nav>
    );
};

export default Navbar;