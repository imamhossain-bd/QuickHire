import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/Logo 2.png';
import facebook from '../../assets/Facebook.png';
import instagram from '../../assets/Instagram.png';
import dribbble from '../../assets/Dribbble.png';
import linkedin from '../../assets/LinkedIn.png';
import twitter from '../../assets/Twitter.png';


const aboutLinks = [
    { label: 'Companies', to: '/companies' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Terms', to: '/terms' },
    { label: 'Advice', to: '/advice' },
    { label: 'Privacy Policy', to: '/privacy' },
];

const resourceLinks = [
    { label: 'Help Docs', to: '/docs' },
    { label: 'Guide', to: '/guide' },
    { label: 'Updates', to: '/updates' },
    { label: 'Contact Us', to: '/contact' },
];

const socialLinks = [
    { icon: facebook, alt: 'Facebook' },
    { icon: instagram, alt: 'Instagram' },
    { icon: dribbble, alt: 'Dribbble' },
    { icon: linkedin, alt: 'LinkedIn' },
    { icon: twitter, alt: 'Twitter' },
];


const Footer = () => {
    return (
        <footer className="bg-[#202430] text-white pt-14 pb-8">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-white/10 pb-12">

                    {/* Brand */}
                    <div className="lg:col-span-4">
                        <NavLink to="/" className="flex items-center gap-2 mb-5">
                            <img src={logo} alt="QuickHire" className="w-7 h-7" />
                            <span className="text-base font-bold font-clash tracking-tight">
                                QuickHire
                            </span>
                        </NavLink>
                        <p className="text-[#D6DDEB] text-sm leading-relaxed">
                            Great platform for the job seeker that passionate about
                            startups. Find your dream job easier.
                        </p>
                    </div>

                    {/* About */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-bold mb-5 text-white">About</h4>
                        <ul className="space-y-3">
                            {aboutLinks.map(({ label, to }) => (
                                <li key={label}>
                                    <NavLink
                                        to={to}
                                        className="text-[#D6DDEB] text-sm hover:text-white transition-colors">
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-bold mb-5 text-white">Resources</h4>
                        <ul className="space-y-3">
                            {resourceLinks.map(({ label, to }) => (
                                <li key={label}>
                                    <NavLink
                                        to={to}
                                        className="text-[#D6DDEB] text-sm hover:text-white transition-colors">
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <h4 className="text-sm font-bold mb-3 text-white">
                            Get job notifications
                        </h4>
                        <p className="text-[#D6DDEB] text-sm leading-relaxed mb-5">
                            The latest job news, articles, sent to your inbox weekly.
                        </p>
                        <div className="flex">
                            <input type="email" placeholder="Email Address" className="flex-1 bg-white text-gray-900 text-sm px-4 py-2.5 placeholder-gray-400 focus:outline-none" />
                            <button className="bg-[#4640DE] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#3d37c9] active:scale-95 transition-all whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#D6DDEB] text-xs opacity-60">
                        2021 @ QuickHire. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        {socialLinks.map(({ icon, alt }) => (
                            <a key={alt} href="#" aria-label={alt} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                                <img src={icon} alt={alt} className="w-4 h-4 object-contain" />
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;