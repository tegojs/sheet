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
      style={style}
    >
      <div className={`${cssPrefix}-icon-img ${name}`} />
    </div>
  );
};
