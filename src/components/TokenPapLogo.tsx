// src/components/TokenPapLogo.tsx
import React from "react";
import { motion } from "framer-motion";

interface TokenPapLogoProps {
  className?: string;
  isScrolled?: boolean;
}

const TokenPapLogo: React.FC<TokenPapLogoProps> = ({ className = "" }) => {
  return (
    <motion.svg
      viewBox="0 0 450 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-full w-auto transition-all duration-300 ${className}`}
      initial="initial"
      whileHover="hover"
    >
      <defs>
        <radialGradient id="tokenGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      Electricity Pylon
      {/* Circular Smart Meter Icon */}
<g className="text-gray-900 dark:text-white transition-colors duration-300">

  {/* Outer circle */}
  <circle
    cx="45"
    cy="55"
    r="35"
    stroke="currentColor"
    strokeWidth="3"
    fill="none"
  />

  {/* Inner blue segment */}
  <path
    d="M45 55 L75 55 A30 30 0 0 1 30 80 Z"
    fill="currentColor"
    opacity="0.2"
  />

  {/* Digital display */}
  <rect
    x="30"
    y="35"
    width="30"
    height="12"
    rx="2"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
  />

  {/* Digits */}
  <text
    x="45"
    y="44"
    textAnchor="middle"
    fontSize="8"
    fill="currentColor"
    fontWeight="bold"
  >
    09882
  </text>

  {/* Barcode base */}
  <rect
    x="28"
    y="50"
    width="34"
    height="10"
    fill="fill-amber-500 dark:fill-blue-400"
    stroke="fill-blue-400 dark:fill-amber-500"
    strokeWidth="1.5"
  />

  {/* Barcode lines */}
  <path
    d="M30 50 V60 M33 50 V60 M36 50 V60 M40 50 V60 M44 50 V60 M48 50 V60 M52 50 V60 M56 50 V60 M59 50 V60"
    stroke="currentColor"
    strokeWidth="1"
  />

</g>

      {/* 2. Main Brand Group */}
      <g transform="translate(90, 75)">
        {/* "T" */}
        <text
          x="0"
          y="0"
          style={{
            fontFamily: "'Inter', 'Outfit', sans-serif",
            fontSize: "65px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
          className="fill-gray-900 dark:fill-white"
        >
          T
        </text>

        {/* The Power orb "o" */}
        <g transform="translate(50, -20)">
          <motion.circle
            cx="0"
            cy="0"
            r="16"
            stroke="url(#tokenGradient)"
            strokeWidth="4"
            variants={{
              initial: { scale: 1, opacity: 0.8 },
              hover: { scale: 1.15, opacity: 1 }
            }}
            filter="url(#glow)"
          />
          <circle
            cx="0"
            cy="0"
            r="8"
            fill="url(#tokenGradient)"
            className="animate-pulse"
          />
        </g>

        {/* "ken" */}
        <text
          x="66"
          y="0"
          style={{
            fontFamily: "'Inter', 'Outfit', sans-serif",
            fontSize: "65px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
          className="fill-gray-900 dark:fill-white"
        >
          ken
        </text>

        {/* "Pap" */}
        <text
          x="170"
          y="0"
          style={{
            fontFamily: "'Inter', 'Outfit', sans-serif",
            fontSize: "65px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
          className="fill-amber-500 dark:fill-blue-400"
        >
          Pap
        </text>
      </g>

      {/* 3. Floating Chevrons (Arrows) - Positioned above tagline */}
      <g className="text-amber-500 dark:text-blue-400" transform="translate(365, -15)">
        <motion.path
          d="M5 65L20 50L35 65"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            initial: { y: 0 },
            hover: { y: -6, transition: { repeat: Infinity, duration: 0.6, repeatType: "mirror" } }
          }}
        />
        <motion.path
          d="M5 80L20 65L35 80"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            initial: { opacity: 0.6 },
            hover: { opacity: 1, y: -6, transition: { repeat: Infinity, duration: 0.6, delay: 0.1, repeatType: "mirror" } }
          }}
        />
        <motion.path
          d="M5 95L20 80L35 95"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            initial: { opacity: 0.3 },
            hover: { opacity: 1, y: -6, transition: { repeat: Infinity, duration: 0.6, delay: 0.2, repeatType: "mirror" } }
          }}
        />
      </g>

      {/* 4. Separator Line */}
      <rect
        x="90"
        y="88"
        width="310"
        height="2.5"
        rx="1.25"
        className="fill-gray-500 dark:fill-white/10"
      />

      {/* 5. Tagline */}
      <text
        x="90"
        y="105"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase"
        }}
        className="fill-gray-500 dark:fill-gray-400"
      >
        Smart Metering & Vending Solution
      </text>
    </motion.svg>
  );
};

export default TokenPapLogo;
