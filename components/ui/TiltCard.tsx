'use client';

import { useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active: boolean;
  tiltMax?: number;
}

export function TiltCard({ children, className = '', onClick, active, tiltMax = 10 }: TiltCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Normalize coordinates to rotate between -tiltMax and +tiltMax degrees
    const rotateY = (x / (box.width / 2)) * tiltMax;
    const rotateX = -(y / (box.height / 2)) * tiltMax;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className={`preserve-3d transition-all duration-300 ease-out select-none ${active ? 'cursor-pointer' : ''} ${className}`}
      style={{
        transform: active && isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025) translateY(-5px)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => active && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
export default TiltCard;
