import React from 'react';
import { Link } from 'react-router-dom';
import dashboardPic from '../assets/3.1 Dashboard Company.png';

const Posting = () => {
    return (
        <section className="bg-white py-16 px-4 sm:px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto">

                <div className="relative bg-[#4640DE] flex flex-col lg:flex-row items-center overflow-hidden">

                    <div className="absolute top-0 left-0 w-0 h-0"
                        style={{
                            borderLeft: '50px solid white',
                            borderTop: '50px solid white',
                            borderRight: '50px solid transparent',
                            borderBottom: '50px solid transparent',
                        }} />

                    <div className="absolute bottom-0 right-0 w-0 h-0" style={{
                        borderRight: '50px solid white',
                        borderBottom: '50px solid white',
                        borderLeft: '50px solid transparent',
                        borderTop: '50px solid transparent',
                    }} />

                    <div className="relative z-10 w-full lg:w-1/2 px-8 sm:px-12 lg:pl-20 lg:pr-10 py-12 lg:py-20 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold text-white leading-[1.1] mb-4 font-clash">
                            Start posting <br className="hidden sm:block" /> jobs today
                        </h2>
                        <p className="text-white text-sm sm:text-base lg:text-lg mb-8 opacity-90">
                            Start posting jobs for only $10.
                        </p>
                        <Link to="/signup" className="inline-block bg-white text-[#4640DE] px-7 py-3 text-sm sm:text-base font-semibold hover:bg-gray-50 transition-all active:scale-95 shadow-lg">
                            Sign Up For Free
                        </Link>
                    </div>

                    <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center lg:justify-end px-6 sm:px-10 lg:pr-16 pb-10 lg:pb-0">
                        <div className="w-full max-w-sm sm:max-w-md lg:w-[580px] lg:translate-x-6 lg:translate-y-6">
                            <img
                                src={dashboardPic}
                                alt="QuickHire Dashboard Preview"
                                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.35)] rounded-lg"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Posting;