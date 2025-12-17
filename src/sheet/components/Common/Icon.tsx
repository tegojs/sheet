import type React from 'react';
import { cssPrefix } from '../../configs';

interface IconProps {
  name: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  onClick,
  style,
}) => {
  return (
    <div
      className={`${cssPrefix}-icon ${className}`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`${cssPrefix}-icon-img ${name}`} />
    </div>
  );
};
