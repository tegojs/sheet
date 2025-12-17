import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { cssPrefix } from '../../configs';

interface DropdownProps {
  title: React.ReactNode;
  showArrow?: boolean;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  width?: string | number;
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  showArrow = true,
  placement = 'bottom-left',
  width = 'auto',
  children,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState && onOpen) {
      onOpen();
    } else if (!newState && onClose) {
      onClose();
    }
  };

  return (
    <div ref={dropdownRef} className={`${cssPrefix}-dropdown ${placement}`}>
      <button
        type="button"
        className={`${cssPrefix}-dropdown-header`}
        onClick={handleToggle}
      >
        {typeof title === 'string' ? (
          <div
            className={`${cssPrefix}-dropdown-title ${showArrow ? 'arrow-left' : ''}`}
          >
            {title}
          </div>
        ) : (
          title
        )}
        {showArrow && (
          <div className={`${cssPrefix}-icon arrow-right`}>
            <div className={`${cssPrefix}-icon-img arrow-down`} />
          </div>
        )}
      </button>
      {isOpen && (
        <div
          className={`${cssPrefix}-dropdown-content`}
          role="menu"
          style={{ width: typeof width === 'number' ? `${width}px` : width }}
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(false);
              if (onClose) onClose();
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
