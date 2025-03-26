
import React from 'react';

const WolfLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 16C3.5 19.5 2.5 22 1.5 22C1.5 22 5.5 22 6 22C7.37318 22 11.8545 22 13.5 22C15.5 22 19.5 22 19.5 22C19.5 22 17 19.5 16 16" />
      <path d="M11.25 16C11.5 20 12 22 12 22C12 22 12.5 20 12.75 16" />
      <path d="M5 9.5C5 9.5 5 7 8.5 7C12 7 13.5 9.5 13.5 9.5" />
      <path d="M9.5 9.5V11.5" />
      <path d="M11.5 9.5V11.5" />
      <path d="M7.25 10L6 12.5" />
      <path d="M14 10L15.5 12.5" />
      <path d="M7 7.5L3.5 5.5" />
      <path d="M12 7.5L15.5 5.5" />
      <path d="M8.5 6C8.5 6 8 4 10.5 3C13 2 16 3 16 5C16 7 15 9 15 9" />
    </svg>
  );
};

export default WolfLogo;
