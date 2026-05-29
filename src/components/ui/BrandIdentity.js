import React from 'react';

export const Logo = ({ className = "h-12 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto fill-none" xmlns="http://www.w3.org/2000/svg">
        {/* The 'E' part (Navy Blue) */}
        <path 
          d="M5 15 H50 V28 H20 V44 H45 V56 H20 V72 H50 V85 H5 Z" 
          fill="#1B1B5E" 
        />
        {/* The 'K' part - Asymmetrical open tag '<' (Bright Blue) */}
        <path 
          d="M98 28 L52 55 L85 78 L75 86 L40 55 L85 20 Z" 
          fill="#00AEEF" 
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tighter text-[#1B1B5E]">EKESON GADGET</span>
          <div className="flex items-center gap-1">
            <div className="h-[1px] w-4 bg-[#1B1B5E]/30" />
            <span className="text-[7px] font-bold tracking-[0.2em] text-[#00AEEF] uppercase">Building Wealth Through Technology</span>
            <div className="h-[1px] w-4 bg-[#1B1B5E]/30" />
          </div>
        </div>
      )}
    </div>
  );
};

export const SealBadge = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Circular Rotating Text Area */}
      <div className="absolute inset-0 animate-[spin_30s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
          <text className="text-[7px] font-black fill-[#1B1B5E] uppercase tracking-[0.3em]">
            <textPath href="#circlePath">
              • GENUINE TECHNOLOGY • EKESON GADGET • NIGERIA • QUALITY •
            </textPath>
          </text>
        </svg>
      </div>
      
      {/* Central Logo Seal */}
      <div className="h-16 w-16 rounded-full bg-[#FFFDF5] shadow-2xl border-2 border-[#00AEEF]/20 flex items-center justify-center p-3 z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M10 18 H52 V30 H25 V44 H48 V56 H25 V70 H52 V82 H10 Z" fill="#1B1B5E" />
          <path d="M95 32 L58 55 L85 75 L76 83 L48 55 L85 24 Z" fill="#00AEEF" />
        </svg>
      </div>
    </div>
  );
};
