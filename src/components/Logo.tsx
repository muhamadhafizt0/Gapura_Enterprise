import React from 'react';
import { GAPURA_LOGO_BASE64 } from '../constants/logo';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'horizontal';
  lightBg?: boolean;
}

export const GapuraLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  lightBg = true,
}) => {
  const sizeMap = {
    sm: { height: 38, iconH: 34, fontSize: '9px', phoneSize: '7.5px' },
    md: { height: 56, iconH: 48, fontSize: '12px', phoneSize: '10px' },
    lg: { height: 80, iconH: 68, fontSize: '15px', phoneSize: '12px' },
    xl: { height: 110, iconH: 96, fontSize: '18px', phoneSize: '14px' },
  };

  const { iconH, fontSize, phoneSize } = sizeMap[size];

  const renderLogoImage = (height: number) => (
    <img
      src={GAPURA_LOGO_BASE64}
      alt="Logo Gapura Enterprise"
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
      className="select-none"
    />
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderLogoImage(iconH)}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {renderLogoImage(iconH)}
        <div className="flex flex-col text-left">
          <span
            className="font-black tracking-wider uppercase leading-none"
            style={{
              color: lightBg ? '#4d7c0f' : '#bef264',
              fontSize,
              fontFamily: "'Arial Black', Impact, sans-serif",
            }}
          >
            GAPURA ENTERPRISE
          </span>
          <span
            className="font-bold tracking-widest leading-tight mt-0.5"
            style={{
              color: lightBg ? '#65a30d' : '#84cc16',
              fontSize: phoneSize,
              fontFamily: 'monospace, sans-serif',
            }}
          >
            0821 1887 0862
          </span>
        </div>
      </div>
    );
  }

  // Full Logo matching the user's PNG image
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {renderLogoImage(iconH)}
    </div>
  );
};
