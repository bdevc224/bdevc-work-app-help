// src/components/DirectionAwareLink.tsx
import React, { useState, type ReactNode, type MouseEvent } from "react";
import { Link, type LinkProps } from "react-router-dom";

interface DirectionAwareLinkProps extends Omit<LinkProps, "className"> {
  children: ReactNode;
  color?: string; // must be one of the keys in COLOR_MAP below
  border?: string; // must be one of the keys in COLOR_MAP below
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

// Tailwind needs full literal class strings to detect them at build time —
// dynamic template strings like `bg-${color}` get silently dropped.
// Extend this map with any colors you actually use.
const COLOR_MAP: Record<string, { text: string; border: string; bg: string }> = {
  "cyan-500": { text: "text-cyan-500", border: "border-cyan-500", bg: "bg-cyan-500" },
  "red-500": { text: "text-red-500", border: "border-red-500", bg: "bg-red-500" },
  "green-500": { text: "text-green-500", border: "border-green-500", bg: "bg-green-500" },
  "purple-500": { text: "text-purple-500", border: "border-purple-500", bg: "bg-purple-500" },
  "white": { text: "text-white", border: "border-white", bg: "bg-white" },
  "black": { text: "text-black", border: "border-black", bg: "bg-black" },
};

const DirectionAwareLink: React.FC<DirectionAwareLinkProps> = ({
  to = "/",
  children,
  color = "cyan-500",
  border,
  className = "",
  onClick,
}) => {
  const [direction, setDirection] = useState<"top" | "bottom" | "left" | "right">("left");
  const [exitDirection, setExitDirection] = useState<"top" | "bottom" | "left" | "right">("left");

  const colorKey = COLOR_MAP[color] ? color : "cyan-500";
  const borderKey = border && COLOR_MAP[border] ? border : colorKey;
  const colorClasses = COLOR_MAP[colorKey];
  const borderClasses = COLOR_MAP[borderKey];

  const getDirection = (e: MouseEvent<HTMLAnchorElement>) => {
    // Use currentTarget's own bounding box, not e.nativeEvent.offsetX/Y —
    // those are relative to whatever child element (e.g. the inner span)
    // actually triggered the event, not the Link itself.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const topEdge = y;
    const bottomEdge = rect.height - y;
    const leftEdge = x;
    const rightEdge = rect.width - x;

    const min = Math.min(topEdge, bottomEdge, leftEdge, rightEdge);

    if (min === topEdge) return "top";
    if (min === bottomEdge) return "bottom";
    if (min === leftEdge) return "left";
    return "right";
  };

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => setDirection(getDirection(e));
  const handleMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => setExitDirection(getDirection(e));

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden inline-block px-6 py-3 rounded-lg border font-semibold
        transition-all duration-300 group
        ${borderClasses.border} ${colorClasses.text}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>

      <span
        className={`
          absolute inset-0 ${colorClasses.bg}
          transform scale-0 group-hover:scale-100
          transition-transform duration-500 ease-out
          ${direction === "left"
            ? "origin-left"
            : direction === "right"
            ? "origin-right"
            : direction === "top"
            ? "origin-top"
            : "origin-bottom"}
          ${exitDirection === "left"
            ? "group-hover:origin-left"
            : exitDirection === "right"
            ? "group-hover:origin-right"
            : exitDirection === "top"
            ? "group-hover:origin-top"
            : "group-hover:origin-bottom"}
        `}
      ></span>
    </Link>
  );
};

export default DirectionAwareLink;