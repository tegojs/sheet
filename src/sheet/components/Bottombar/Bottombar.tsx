import type React from 'react';
import { useState } from 'react';
import { cssPrefix } from '../../configs';
import { useSheetStore } from '../../store/useSheetStore';
import { Icon } from '../common/Icon';

export const Bottombar: React.FC = () => {
  const {
    sheets,
    activeSheetIndex,
    addSheet,
    deleteSheet,
    switchSheet,
    renameSheet,
  } = useSheetStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddSheet = () => {
    addSheet();
  };

  const handleSheetClick = (index: number) => {
    if (editingIndex === null) {
      switchSheet(index);
    }
  };

  const handleSheetDoubleClick = (index: number) => {
    setEditingIndex(index);
    setEditingName(sheets[index].name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const handleNameBlur = () => {
    if (editingIndex !== null && editingName.trim()) {
      renameSheet(editingIndex, editingName.trim());
    }
    setEditingIndex(null);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
    }
  };

  const handleDeleteSheet = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sheets.length > 1) {
      deleteSheet(index);
    }
  };

  return (
    <div
      className={`${cssPrefix}-bottombar`}
      style={{
        height: 40,
        padding: '0 30px',
        textAlign: 'left',
        background: '#f5f6f7',
        display: 'flex',
        borderTop: '1px solid #e0e2e4',
        position: 'relative',
      }}
    >
      <ul
        className={`${cssPrefix}-menu`}
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          userSelect: 'none',
        }}
      >
        {sheets.map((sheet, index) => (
          <li
            key={index}
            className={activeSheetIndex === index ? 'active' : ''}
            onClick={() => handleSheetClick(index)}
            onDoubleClick={() => handleSheetDoubleClick(index)}
            style={{
              float: 'left',
              lineHeight: '40px',
              height: 40,
              paddingTop: 0,
              paddingBottom: 0,
              padding: '0 1em',
              margin: 0,
              verticalAlign: 'middle',
              textAlign: 'left',
              fontWeight: 'bold',
              color:
                activeSheetIndex === index ? 'rgba(0, 0, 0, 0.65)' : '#80868b',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: activeSheetIndex === index ? '#fff' : 'transparent',
              borderRight: '1px solid #e8eaed',
            }}
          >
            {editingIndex === index ? (
              <input
                type="text"
                value={editingName}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                autoFocus
                style={{
                  border: '1px solid #4b89ff',
                  padding: '2px 5px',
                  outline: 'none',
                  width: '100px',
                }}
              />
            ) : (
              <>
                {sheet.name}
                {sheets.length > 1 && (
                  <span
                    onClick={(e) => handleDeleteSheet(index, e)}
                    style={{
                      marginLeft: '8px',
                      opacity: 0.6,
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </span>
                )}
              </>
            )}
          </li>
        ))}
        <li
          style={{
            float: 'left',
            lineHeight: '1.25em',
            padding: '0.785em 1em',
            margin: 0,
            verticalAlign: 'middle',
            textAlign: 'left',
            fontWeight: 400,
            color: '#80868b',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontWeight: 'bold',
            borderRight: '1px solid #e8eaed',
          }}
        >
          <Icon name="add" onClick={handleAddSheet} />
        </li>
      </ul>
    </div>
  );
};
