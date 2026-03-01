import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCategories } from '../services/Jobservice';
import designIcon from '../assets/design.png';
import salesIcon from '../assets/sales.png';
import marketingIcon from '../assets/marketign.png';
import financeIcon from '../assets/Finance.png';
import technologyIcon from '../assets/Technology.png';
import engineeringIcon from '../assets/Engineering.png';
import businessIcon from '../assets/Business.png';
import hrIcon from '../assets/Human-Resource.png';

const CATEGORY_META = {
    'Design': { icon: designIcon, highlighted: false },
    'Sales': { icon: salesIcon, highlighted: false },
    'Marketing': { icon: marketingIcon, highlighted: true },
    'Finance': { icon: financeIcon, highlighted: false },
    'Technology': { icon: technologyIcon, highlighted: false },
    'Engineering': { icon: engineeringIcon, highlighted: false },
    'Business': { icon: businessIcon, highlighted: false },
    'Human Resources': { icon: hrIcon, highlighted: false },
    'Human Resource': { icon: hrIcon, highlighted: false },
};

const DISPLAY_ORDER = [
    'Design', 'Sales', 'Marketing', 'Finance',
    'Technology', 'Engineering', 'Business', 'Human Resources',
];

const CategoryCard = ({ name, job_count, icon, highlighted, onClick }) => {
    const base = 'flex flex-col p-6 border transition-all duration-200 cursor-pointer group';
    const variant = highlighted
        ? 'bg-[#4640DE] border-[#4640DE]'
        : 'bg-white border-[#D6DDEB] hover:border-[#4640DE] hover:shadow-md';

    return (
        <div className={`${base} ${variant}`} onClick={onClick}>
            <div className="mb-6">
                <img src={icon} alt={name} className={`w-10 h-10 object-contain ${highlighted ? 'brightness-0 invert' : ''}`} />
            </div>

            <h3 className={`text-sm font-bold mb-2 ${highlighted ? 'text-white' : 'text-[#25324B]'}`}>
                {name === 'Human Resources' ? 'Human Resource' : name}
            </h3>

            <div className="flex items-center gap-2">
                <span className={`text-xs ${highlighted ? 'text-white/80' : 'text-[#7C8493]'}`}>
                    {job_count} jobs available
                </span>
                <svg className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${highlighted ? 'text-white' : 'text-[#25324B]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="flex flex-col p-6 border border-[#D6DDEB] bg-white animate-pulse">
        <div className="w-10 h-10 bg-[#F0F0F0] mb-6" />
        <div className="h-4 bg-[#F0F0F0] w-1/2 mb-2" />
        <div className="h-3 bg-[#F0F0F0] w-2/3" />
    </div>
);

const Category = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(data => {
                const raw = Array.isArray(data.data) ? data.data : [];

                const sorted = DISPLAY_ORDER
                    .map(name => {
                        const found = raw.find(c =>
                            c.name?.toLowerCase() === name.toLowerCase()
                        );
                        const meta = CATEGORY_META[name] || {};
                        return {
                            name,
                            job_count: found?.job_count ?? 0,
                            icon: meta.icon,
                            highlighted: meta.highlighted ?? false,
                        };
                    })
                    .filter(c => c.icon);

                setCategories(sorted);
            })
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, []);

    const handleClick = (name) => {
        navigate(`/jobs?category=${encodeURIComponent(name)}`);
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[28px] font-bold text-[#25324B] font-clash">
                        Explore by <span className="text-[#26A4FF]">category</span>
                    </h2>
                    <NavLink to="/jobs" className="flex items-center gap-1.5 text-sm font-semibold text-[#4640DE] hover:gap-2.5 transition-all">
                        Show all jobs
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </NavLink>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : categories.map(cat => (
                            <CategoryCard key={cat.name} {...cat} onClick={() => handleClick(cat.name)} />
                        ))
                    }
                </div>

            </div>
        </section>
    );
};

export default Category;