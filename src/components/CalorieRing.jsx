import { useEffect, useState } from 'react';

/**
 * Calorie Ring Component - Apple Health Style
 * SVG circular progress ring with gradient stroke
 */
export default function CalorieRing({ current, goal }) {
  const [animateRing, setAnimateRing] = useState(false);

  // Calculate progress percentage
  const percentage = Math.min((current / goal) * 100, 100);

  // SVG circle parameters
  const size = 220;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash offset based on percentage
  const offset = circumference - (percentage / 100) * circumference;

  // Determine color based on progress
  const getGradientId = () => {
    if (percentage >= 90 && percentage <= 110) return 'gradient-green';
    if (percentage > 110) return 'gradient-red';
    return 'gradient-calorie'; // Red to pink gradient
  };

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateRing(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Define gradients */}
          <defs>
            {/* Calorie gradient: Red to Pink */}
            <linearGradient id="gradient-calorie" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            {/* Green gradient for on-track */}
            <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Red gradient for over goal */}
            <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle with gradient */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${getGradientId()})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animateRing ? offset : circumference}
            className="transition-all duration-1500 ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))',
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-br from-red-500 to-pink-500 bg-clip-text text-transparent mb-1">
              {Math.round(current)}
            </div>
            <div className="text-sm text-gray-300 font-medium">
              of {goal}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              calories
            </div>
          </div>
        </div>
      </div>

      {/* Progress percentage */}
      <div className="mt-4 text-center">
        <div className="text-lg font-semibold text-gray-200">
          {Math.round(percentage)}%
        </div>
        <div className="text-xs text-gray-400">
          of daily goal
        </div>
      </div>
    </div>
  );
}
