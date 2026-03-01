import React from 'react';
import Navbar from '../Sheard/Navbar';
import pic from '../../assets/Pic.png';
import pattern from '../../assets/Pattern.png';
import Companies from '../../components/Companies';
import Category from '../../components/Category';
import Posting from '../../components/Posting';
import FeaturedJobs from '../../components/FeaturedJobs';
import LatestJobs from '../../components/LatestJobs';

const Home = () => {
    return (
        <div>
            <div className="w-full mx-auto px-6 lg:px-6 relative overflow-hidden bg-white min-h-[600px] lg:h-[730px]">
                <div className="absolute top-0 w-[860px] h-full pointer-events-none z-0">
                    <img src={pattern} alt="" className="w-[860px] h-[794px] mt-[-65px] ml-[700px] object-cover" />
                </div>

                <main className="max-w-7xl mx-auto px-6 lg:px-6 pt-10 lg:pt-16 pb-16 lg:pb-32 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <div className="max-w-2xl py-6 lg:py-12">
                            <h1 className="text-[44px] sm:text-[56px] lg:text-[76px] font-semibold text-[#25324B] leading-[1.1] mb-8">
                                Discover <br />
                                more than <br />
                                <span className="relative inline-block text-[#26A4FF]">
                                    5000+ Jobs
                                    <svg className="absolute -bottom-4 left-0 w-full h-4 text-[#26A4FF]" viewBox="0 0 357 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 12C100.5 4.5 256.5 4.5 354 12" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-[18px] lg:text-[20px] text-[#515B6F] leading-relaxed mb-12 max-w-lg">
                                Great platform for the job seeker that searching for new career heights and passionate about startups.
                            </p>

                            <div className="relative z-[50] bg-white p-2 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] flex flex-col md:flex-row items-stretch w-full lg:w-[852px] gap-0 mb-8 border border-gray-100/50">
                                <div className="flex-1 flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200 w-full">
                                    <svg className="w-6 h-6 text-[#25324B] mr-4 opacity-70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Job title or keyword"
                                        className="w-full focus:outline-none text-[#25324B] placeholder-[#A1A1A1] font-medium text-lg"
                                    />
                                </div>
                                <div className="flex-1 flex items-center px-4 py-4 border-b md:border-b-0 w-full">
                                    <svg className="w-6 h-6 text-[#25324B] mr-4 opacity-70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <select className="w-full bg-transparent focus:outline-none text-[#25324B] font-medium text-lg cursor-pointer appearance-none">
                                        <option>Florence, Italy</option>
                                        <option>Remote</option>
                                        <option>New York, USA</option>
                                    </select>
                                    <svg className="w-5 h-5 text-gray-400 ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <button className="bg-[#4640DE] text-white px-10 py-3 font-bold hover:bg-[#3D37C9] transition-all whitespace-nowrap text-lg active:scale-95">
                                    Search my job
                                </button>
                            </div>

                            <p className="text-[#515B6F] font-medium text-lg">
                                <span className="text-[#25324B] font-bold">Popular : </span>
                                UI Designer, UX Researcher, Android, Admin
                            </p>
                        </div>

                        <div className="relative lg:mt-0 mt-12 justify-center hidden lg:flex">
                            <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-[#4640DE] opacity-5 rounded-full blur-[120px]"></div>
                            <img
                                src={pic}
                                alt="QuickHire Hero"
                                className="w-full max-w-[620px] z-10 relative translate-x-4 h-auto"
                            />
                        </div>
                    </div>
                </main>
            </div>

            <div>
                <Companies />
            </div>
            <div className='max-w-7xl mx-auto px-6 lg:px-6'>
                <Category />
            </div>

            <div>
                <Posting />
            </div>

            <div>
                <FeaturedJobs />
            </div>

            <div>
                <LatestJobs />
            </div>

        </div>
    );
};

export default Home;