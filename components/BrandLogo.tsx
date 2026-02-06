import React from 'react';

export const BrandLogo = ({
  className = "h-20 w-auto",
}: {
  className?: string;
}) => {
  return (
    <svg
      viewBox="0 0 165 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Carelink Logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d9488" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="40" height="40" rx="12" fill="url(#logoGradient)" />
      <path 
        d="M20 13.5C17 13.5 15 15.5 15 18C15 22.5 20 27 20 27C20 27 25 22.5 25 18C25 15.5 23 13.5 20 13.5Z" 
        fill="white" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="29"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="24"
        fill="currentColor"
        style={{ letterSpacing: '-0.02em' }}
      >
        Carelink
      </text>
    </svg>
  );
};