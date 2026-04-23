"use client";

import { useId } from "react";

type LogoMarkProps = {
  className?: string;
};

/** Inline SVG so the mark always renders (no separate /public fetch). */
export function LogoMark({ className }: LogoMarkProps) {
  const raw = useId();
  const gradId = `tm-logo-grad-${raw.replace(/:/g, "")}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      width={32}
      height={32}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366f1" />
          <stop offset="0.5" stopColor="#c026d3" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gradId})`} />
      <path
        d="M8 10h7M8 16h7M8 22h5"
        stroke="#fff"
        strokeOpacity={0.92}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M18.5 15.5l2.8 2.8 6.2-6.2"
        stroke="#fff"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
