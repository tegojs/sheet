import type React from 'react';
import { useMemo } from 'react';
import { cssPrefix } from '../../configs';
import { t } from '../../locale/locale';
import { useActiveSheet, useSheetStore } from '../../store/useSheetStore';
import { Dropdown } from '../Common/Dropdown';
import { Icon } from '../Common/Icon';
import { ToolbarButton } from './ToolbarButton';

// 辅助函数：为可点击元素添加键盘事件
const makeClickable = (onClick: () => void) => ({
  onClick,
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  },
  role: 'button' as const,
  tabIndex: 0,
});

export const Toolbar: React.FC = () => {
  const data = useActiveSheet();
  const { undo, redo, setCellStyle } = useSheetStore();

  // 获取当前选中单元格的样式
  const cellStyle = useMemo(() => {
    if (!data) return null;
    return data.getSelectedCellStyle();
  }, [data]);

  const canUndo = data?.canUndo() || false;
  const canRedo = data?.canRedo() || false;
  const canUnmerge = data?.canUnmerge() || false;
  const canAutofilter = data?.canAutofilter() || false;

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const handleBold = () => {
    if (cellStyle) {
      setCellStyle('font-bold', !cellStyle.font?.bold);
    }
  };

  const handleItalic = () => {
    if (cellStyle) {
      setCellStyle('font-italic', !cellStyle.font?.italic);
    }
  };

  const handleUnderline = () => {
    if (cellStyle) {
      setCellStyle('underline', !cellStyle?.underline);
    }
  };

  const handleStrike = () => {
    if (cellStyle) {
      setCellStyle('strike', !cellStyle?.strike);
    }
  };

  const handleMerge = () => {
    setCellStyle('merge', !canUnmerge);
  };

  const handleTextwrap = () => {
    if (cellStyle) {
      setCellStyle('textwrap', !cellStyle?.textwrap);
    }
  };

  const handleFreeze = () => {
    if (data) {
      const { ri, ci } = data.selector;
      if (data.freezeIsActive()) {
        data.setFreeze(0, 0);
      } else {
        data.setFreeze(ri, ci);
      }
    }
  };

  const handleAutofilter = () => {
    if (data) {
      data.autofilter();
    }
  };

  if (!data) return null;

  return (
    <div className={`${cssPrefix}-toolbar`}>
      <div className={`${cssPrefix}-toolbar-btns`}>
        {/* 撤销/重做 */}
        <ToolbarButton
          icon="undo"
          tooltip={`${t('toolbar.undo')} (Ctrl+Z)`}
          disabled={!canUndo}
          onClick={handleUndo}
        />
        <ToolbarButton
          icon="redo"
          tooltip={`${t('toolbar.redo')} (Ctrl+Y)`}
          disabled={!canRedo}
          onClick={handleRedo}
        />

        <div className={`${cssPrefix}-toolbar-divider`} />

        {/* 格式刷和清除格式 */}
        <ToolbarButton
          icon="paintformat"
          tooltip={t('toolbar.paintformat')}
          onClick={() => {
            copy();
            // TODO: 实现格式刷逻辑
          }}
        />
        <ToolbarButton
          icon="clearformat"
          tooltip={t('toolbar.clearformat')}
          onClick={() => setCellStyle('clearformat', true)}
        />

        <div className={`${cssPrefix}-toolbar-divider`} />

        {/* 字体格式 */}
        <Dropdown title={t('toolbar.font')} width={120}>
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() => setCellStyle('font-name', 'Arial'))}
          >
            Arial
          </div>
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() => setCellStyle('font-name', 'Helvetica'))}
          >
            Helvetica
          </div>
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() =>
              setCellStyle('font-name', 'Times New Roman'),
            )}
          >
            Times New Roman
          </div>
        </Dropdown>

        <Dropdown title={cellStyle?.font?.size || '10'} width={80}>
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
            <div
              key={size}
              className={`${cssPrefix}-item`}
              {...makeClickable(() => setCellStyle('font-size', size))}
            >
              {size}
            </div>
          ))}
        </Dropdown>

        <div className={`${cssPrefix}-toolbar-divider`} />

        {/* 文本样式 */}
        <ToolbarButton
          icon="font-bold"
          tooltip={`${t('toolbar.fontBold')} (Ctrl+B)`}
          active={cellStyle?.font?.bold}
          onClick={handleBold}
        />
        <ToolbarButton
          icon="font-italic"
          tooltip={`${t('toolbar.fontItalic')} (Ctrl+I)`}
          active={cellStyle?.font?.italic}
          onClick={handleItalic}
        />
        <ToolbarButton
          icon="underline"
          tooltip={`${t('toolbar.underline')} (Ctrl+U)`}
          active={cellStyle?.underline}
          onClick={handleUnderline}
        />
        <ToolbarButton
          icon="strike"
          tooltip={t('toolbar.strike')}
          active={cellStyle?.strike}
          onClick={handleStrike}
        />

        <div className={`${cssPrefix}-toolbar-divider`} />

        {/* 颜色 */}
        <Dropdown
          title={
            <Icon
              name="text-color"
              style={{
                borderBottom: `3px solid ${cellStyle?.color || '#000000'}`,
              }}
            />
          }
          width={200}
          showArrow={false}
        >
          <div style={{ padding: '10px' }}>
            <input
              type="color"
              value={cellStyle?.color || '#000000'}
              onChange={(e) => setCellStyle('color', e.target.value)}
              style={{ width: '100%', height: '30px' }}
            />
          </div>
        </Dropdown>

        <Dropdown
          title={
            <Icon
              name="fill-color"
              style={{
                borderBottom: `3px solid ${cellStyle?.bgcolor || '#ffffff'}`,
              }}
            />
          }
          width={200}
          showArrow={false}
        >
          <div style={{ padding: '10px' }}>
            <input
              type="color"
              value={cellStyle?.bgcolor || '#ffffff'}
              onChange={(e) => setCellStyle('bgcolor', e.target.value)}
              style={{ width: '100%', height: '30px' }}
            />
          </div>
        </Dropdown>

        <div className={`${cssPrefix}-toolbar-divider`} />

        {/* 对齐 */}
        <Dropdown
          title={<Icon name={`align-${cellStyle?.align || 'left'}`} />}
          width={120}
          showArrow={false}
        >
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() => setCellStyle('align', 'left'))}
          >
            <Icon name="align-left" />
          </div>
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() => setCellStyle('align', 'center'))}
          >
            <Icon name="align-center" />
          </div>
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() => setCellStyle('align', 'right'))}
          >
            <Icon name="align-right" />
          </div>
        </Dropdown>

        <Dropdown
          title={<Icon name={`valign-${cellStyle?.valign || 'middle'}`} />}
          width={120}
          showArrow={false}
        >
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() => setCellStyle('valign', 'top'))}
          >
            <Icon name="valign-top" />
          </div>
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() => setCellStyle('valign', 'middle'))}
          >
            <Icon name="valign-middle" />
          </div>
          <div
            className={`${cssPrefix}-item`}
            {...makeClickable(() => setCellStyle('valign', 'bottom'))}
          >
            <Icon name="valign-bottom" />
          </div>
        </Dropdown>

        <div className={`${cssPrefix}-toolbar-divider`} />

        {/* 合并和换行 */}
        <ToolbarButton
          icon="merge"
          tooltip={t('toolbar.merge')}
          active={canUnmerge}
          onClick={handleMerge}
        />
        <ToolbarButton
          icon="textwrap"
          tooltip={t('toolbar.textwrap')}
          active={cellStyle?.textwrap}
          onClick={handleTextwrap}
        />

        <div className={`${cssPrefix}-toolbar-divider`} />

        {/* 冻结和筛选 */}
        <ToolbarButton
          icon="freeze"
          tooltip={t('toolbar.freeze')}
          active={data.freezeIsActive()}
          onClick={handleFreeze}
        />
        <ToolbarButton
          icon="autofilter"
          tooltip={t('toolbar.autofilter')}
          active={canAutofilter}
          onClick={handleAutofilter}
        />
      </div>
    </div>
  );
};
