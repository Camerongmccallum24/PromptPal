import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

export function Tooltip({ 
  children,
  content, 
  position = 'top',
  delay = 300 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const showTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;
    
    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const childCenterX = childRect.left + childRect.width / 2;
    const childCenterY = childRect.top + childRect.height / 2;
    
    let x = 0;
    let y = 0;
    
    switch (position) {
      case 'top':
        x = childCenterX - tooltipRect.width / 2;
        y = childRect.top - tooltipRect.height - 8;
        break;
      case 'right':
        x = childRect.right + 8;
        y = childCenterY - tooltipRect.height / 2;
        break;
      case 'bottom':
        x = childCenterX - tooltipRect.width / 2;
        y = childRect.bottom + 8;
        break;
      case 'left':
        x = childRect.left - tooltipRect.width - 8;
        y = childCenterY - tooltipRect.height / 2;
        break;
    }
    
    // Boundary checking to prevent tooltip from going off-screen
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + tooltipRect.width > window.innerWidth) {
      x = window.innerWidth - tooltipRect.width;
    }
    if (y + tooltipRect.height > window.innerHeight) {
      y = window.innerHeight - tooltipRect.height;
    }
    
    setCoords({ x, y });
  };

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={childRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: `${coords.y}px`,
            left: `${coords.x}px`,
            zIndex: 1000,
          }}
          className="px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap max-w-xs"
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
              position === 'top' ? 'bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2' :
              position === 'right' ? 'left-0 -translate-x-1/2 top-1/2 -translate-y-1/2' :
              position === 'bottom' ? 'top-0 -translate-y-1/2 left-1/2 -translate-x-1/2' :
              'right-0 translate-x-1/2 top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      )}
    </>
  );
}
