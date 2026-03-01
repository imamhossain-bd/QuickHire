import React from 'react';
import vodafone from '../assets/vodafone-2017-logo.png';
import intel from '../assets/intel-3.png';
import tesla from '../assets/tesla-9 1.png';
import amd from '../assets/amd-logo-1.png';
import talkit from '../assets/talkit 1.png';


const companies = [
    { name: 'Vodafone', logo: vodafone },
    { name: 'Intel', logo: intel },
    { name: 'Tesla', logo: tesla },
    { name: 'AMD', logo: amd },
    { name: 'Talkit', logo: talkit },
];


const Companies = () => (
    <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">

            {/* Label */}
            <p className="text-[#A8ADB7] text-lg mb-6">
                Companies we helped grow
            </p>

            {/* Logo strip */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-8">
                {companies.map(({ name, logo }) => (
                    <img key={name} src={logo} alt={name} className="h-7 w-auto object-contain grayscale opacity-40 hover:opacity-60 transition-opacity duration-200" />
                ))}
            </div>

        </div>
    </section>
);

export default Companies;