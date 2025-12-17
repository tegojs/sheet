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
  const iconImg = <div className={`${cssPrefix}-icon-img ${name}`} />;

  if (onClick) {
    return (
      <button
        type="button"
        className={`${cssPrefix}-icon ${className}`}
        onClick={onClick}
        style={{
          ...style,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        {iconImg}
      </button>
    );
  }

  return (
    <div className={`${cssPrefix}-icon ${className}`} style={style}>
      {iconImg}
    </div>
  );
};
