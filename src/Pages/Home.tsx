import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import your separated transparent logo assets
// e.g., import logo1 from './assets/logo-flat.png';
//       import logo2 from './assets/logo-neon-b.png';
//       import logo3 from './assets/logo-neon-bdc.png';

function HeroSection() {
  // Replace these URLs with your actual imported assets
  const logos = [
    '/images/BDevC-Resume-Builder-Design-Logo.png',
    '/images/BDevC-Resume-Builder-Design-Logo11.PNG',
    '/images/BDevC-Resume-Builder-Design-Logo12.PNG'
  ];

  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  // Cycle through the logos every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [logos.length]);

  return (
    // Main container - using flex to put logo on left, text on right
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#1a1a1a] p-8 gap-8 md:gap-16">
      
      {/* LEFT SIDE: Transitioning Logos Container */}
      <div className="relative w-62.5 h-62.5 md:w-87.5 md:h-87.5 flex shrink-0">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo variant ${index + 1}`}
            // The magic happens here: absolute positioning stacks them, opacity fades them in/out
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
              index === currentLogoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
      </div>

      {/* RIGHT SIDE: Static Text Container */}
      <div className="flex flex-col text-left">
        {/* Recreating your right-side design in pure Tailwind text */}
        <p className="text-[#b65ef3] font-medium tracking-widest text-sm md:text-base ml-2 mb-[-5%] [text-shadow:1px_1px_0_#8c18de,2px_2px_0_#6e12ad,3px_3px_4px_rgba(0,0,0,0.8)]">
          BDevC
        </p>
        <h1 className="text-[#2DD4BF] text-7xl md:text-8xl font-light tracking-wide leading-none [text-shadow:1px_1px_0_#1f9c8c,2px_2px_0_#17786c,3px_3px_0_#0f5850,4px_4px_0_#083731,5px_5px_10px_rgba(0,0,0,0.9)]">
          RESUME
        </h1>
        <h1 className="text-white text-6xl md:text-7xl font-bold tracking-tight leading-none [text-shadow:1px_1px_0_#d9d9d9,2px_2px_0_#a3a3a3,3px_3px_0_#737373,4px_4px_0_#404040,5px_5px_0_#1f1f1f,6px_6px_12px_rgba(140,24,222,0.6)]">
          BUILDER 
        </h1>

        <Link 
          to="/aboutbdevc"  
          className="inline-flex items-center justify-center w-56 px-6 py-3
                     bg-gray-700 text-white rounded-md text-lg hover:bg-gray-600 
                     transition dark:bg-gray-700 dark:text-white">
          About Developer
        </Link>
      </div>

      <img src="/images/ResumeDesign.svg" alt="Resume Sample" className='w-36 h-40 ml-[-4%] bg-white hover:translate-x-5' />
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div>
        <HeroSection />
    </div>
  );
};

export default Home;