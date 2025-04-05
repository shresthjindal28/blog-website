import React, { useState, useEffect, useRef } from 'react';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const HoverCard: React.FC<HoverCardProps> = ({ children, className = '', delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Delay the appearance for a staggered effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the card
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Calculate the rotation and shadow based on mouse position
  const calculateStyles = () => {
    const baseStyle = {
      transform: isVisible 
        ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)' 
        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(0.95)',
      opacity: isVisible ? 1 : 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
    };

    if (!cardRef.current || !isHovered || !isVisible) {
      return baseStyle;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation angle (limited to small range for subtle effect)
    const rotateY = ((mousePosition.x - centerX) / centerX) * 4; // -4 to 4 degrees
    const rotateX = ((centerY - mousePosition.y) / centerY) * 4; // -4 to 4 degrees

    // Calculate shadow position
    const shadowX = (mousePosition.x - centerX) / 20;
    const shadowY = (mousePosition.y - centerY) / 20;
    
    return {
      ...baseStyle,
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      boxShadow: `
        ${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.2),
        0 4px 6px -1px rgba(0, 0, 0, 0.1), 
        0 2px 4px -1px rgba(0, 0, 0, 0.06)
      `,
      transition: 'opacity 0.6s ease, transform 0.1s ease'
    };
  };

  // Calculate highlight effect
  const calculateHighlight = () => {
    if (!cardRef.current || !isHovered || !isVisible) return { background: 'transparent' };
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = mousePosition.x;
    const y = mousePosition.y;

    return {
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)`,
      mixBlendMode: 'overlay' as const
    };
  };

  const style = calculateStyles();
  const highlightStyle = calculateHighlight();

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div 
        className="absolute inset-0 pointer-events-none rounded-xl z-10" 
        style={highlightStyle}
      />
    </div>
  );
};

export default HoverCard; 