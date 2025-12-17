import type React from 'react';
import { useState } from 'react';
import { cssPrefix } from '../../configs';
import { Icon } from '../Common/Icon';

interface ToolbarButtonProps {
  icon?: string;
  tooltip?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  tooltip,
  active = false,
  disabled = false,
  onClick,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      className={`${cssPrefix}-toolbar-btn ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      style={{ position: 'relative' }}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      disabled={disabled}
    >
      {icon && <Icon name={icon} />}
      {children}
      {showTooltip && tooltip && (
        <div
          className={`${cssPrefix}-tooltip`}
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '5px',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip}
        </div>
      )}
    </button>
  );
};
