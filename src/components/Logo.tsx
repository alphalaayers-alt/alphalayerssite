'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
  showSubtitle?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const LOGO_SRC = '/src/assets/images/lalogo1.png';

const sizeMap = {
  xs: 'h-7 sm:h-8 w-auto shrink-0',
  sm: 'max-h-9 sm:max-h-10 w-auto',
  md: 'max-h-10 sm:max-h-11 lg:max-h-12 w-auto',
  lg: 'max-h-12 sm:max-h-14 lg:max-h-16 w-auto',
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  return (
    <img
      src={LOGO_SRC}
      alt="Alpha Layers IT Services Agency"
      className={`object-contain ${sizeMap[size]} ${className}`}
    />
  );
};
