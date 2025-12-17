import type DataProxy from '../dataProxy';

/**
 * Toolbar Command Interface
 *
 * Command pattern for toolbar operations.
 * Each command encapsulates a single action that can be executed and potentially undone.
 */
export interface ToolbarCommand {
  /**
   * Execute the command
   */
  execute(): void;

  /**
   * Check if the command can be executed
   */
  canExecute(): boolean;

  /**
   * Get the command name for debugging/logging
   */
  getName(): string;
}

/**
 * Base class for toolbar commands that operate on DataProxy
 */
export abstract class BaseToolbarCommand implements ToolbarCommand {
  protected data: DataProxy;

  constructor(data: DataProxy) {
    this.data = data;
  }

  abstract execute(): void;

  canExecute(): boolean {
    return true;
  }

  abstract getName(): string;
}

/**
 * Undo command
 */
export class UndoCommand extends BaseToolbarCommand {
  execute(): void {
    this.data.undo();
  }

  canExecute(): boolean {
    return this.data.canUndo();
  }

  getName(): string {
    return 'Undo';
  }
}

/**
 * Redo command
 */
export class RedoCommand extends BaseToolbarCommand {
  execute(): void {
    this.data.redo();
  }

  canExecute(): boolean {
    return this.data.canRedo();
  }

  getName(): string {
    return 'Redo';
  }
}

/**
 * Bold command
 */
export class BoldCommand extends BaseToolbarCommand {
  private value: boolean;

  constructor(data: DataProxy, value: boolean) {
    super(data);
    this.value = value;
  }

  execute(): void {
    this.data.setSelectedCellAttr('font-bold', this.value);
  }

  getName(): string {
    return 'Bold';
  }
}

/**
 * Italic command
 */
export class ItalicCommand extends BaseToolbarCommand {
  private value: boolean;

  constructor(data: DataProxy, value: boolean) {
    super(data);
    this.value = value;
  }

  execute(): void {
    this.data.setSelectedCellAttr('font-italic', this.value);
  }

  getName(): string {
    return 'Italic';
  }
}

/**
 * Underline command
 */
export class UnderlineCommand extends BaseToolbarCommand {
  private value: boolean;

  constructor(data: DataProxy, value: boolean) {
    super(data);
    this.value = value;
  }

  execute(): void {
    this.data.setSelectedCellAttr('underline', this.value);
  }

  getName(): string {
    return 'Underline';
  }
}

/**
 * Strikethrough command
 */
export class StrikeCommand extends BaseToolbarCommand {
  private value: boolean;

  constructor(data: DataProxy, value: boolean) {
    super(data);
    this.value = value;
  }

  execute(): void {
    this.data.setSelectedCellAttr('strike', this.value);
  }

  getName(): string {
    return 'Strike';
  }
}

/**
 * Text wrap command
 */
export class TextWrapCommand extends BaseToolbarCommand {
  private value: boolean;

  constructor(data: DataProxy, value: boolean) {
    super(data);
    this.value = value;
  }

  execute(): void {
    this.data.setSelectedCellAttr('textwrap', this.value);
  }

  getName(): string {
    return 'TextWrap';
  }
}

/**
 * Merge cells command
 */
export class MergeCommand extends BaseToolbarCommand {
  private value: boolean;

  constructor(data: DataProxy, value: boolean) {
    super(data);
    this.value = value;
  }

  execute(): void {
    this.data.setSelectedCellAttr('merge', this.value);
  }

  canExecute(): boolean {
    if (this.value) {
      return !this.data.isSingleSelected();
    }
    return this.data.canUnmerge();
  }

  getName(): string {
    return this.value ? 'Merge' : 'Unmerge';
  }
}

/**
 * Align command
 */
export class AlignCommand extends BaseToolbarCommand {
  private align: 'left' | 'center' | 'right';

  constructor(data: DataProxy, align: 'left' | 'center' | 'right') {
    super(data);
    this.align = align;
  }

  execute(): void {
    this.data.setSelectedCellAttr('align', this.align);
  }

  getName(): string {
    return `Align-${this.align}`;
  }
}

/**
 * Vertical align command
 */
export class VAlignCommand extends BaseToolbarCommand {
  private valign: 'top' | 'middle' | 'bottom';

  constructor(data: DataProxy, valign: 'top' | 'middle' | 'bottom') {
    super(data);
    this.valign = valign;
  }

  execute(): void {
    this.data.setSelectedCellAttr('valign', this.valign);
  }

  getName(): string {
    return `VAlign-${this.valign}`;
  }
}

/**
 * Font name command
 */
export class FontNameCommand extends BaseToolbarCommand {
  private fontName: string;

  constructor(data: DataProxy, fontName: string) {
    super(data);
    this.fontName = fontName;
  }

  execute(): void {
    this.data.setSelectedCellAttr('font-name', this.fontName);
  }

  getName(): string {
    return `FontName-${this.fontName}`;
  }
}

/**
 * Font size command
 */
export class FontSizeCommand extends BaseToolbarCommand {
  private fontSize: number;

  constructor(data: DataProxy, fontSize: number) {
    super(data);
    this.fontSize = fontSize;
  }

  execute(): void {
    this.data.setSelectedCellAttr('font-size', this.fontSize);
  }

  getName(): string {
    return `FontSize-${this.fontSize}`;
  }
}

/**
 * Text color command
 */
export class TextColorCommand extends BaseToolbarCommand {
  private color: string;

  constructor(data: DataProxy, color: string) {
    super(data);
    this.color = color;
  }

  execute(): void {
    this.data.setSelectedCellAttr('color', this.color);
  }

  getName(): string {
    return `TextColor-${this.color}`;
  }
}

/**
 * Background color command
 */
export class BgColorCommand extends BaseToolbarCommand {
  private color: string;

  constructor(data: DataProxy, color: string) {
    super(data);
    this.color = color;
  }

  execute(): void {
    this.data.setSelectedCellAttr('bgcolor', this.color);
  }

  getName(): string {
    return `BgColor-${this.color}`;
  }
}

/**
 * Border style command
 */
export class BorderCommand extends BaseToolbarCommand {
  private mode: string;
  private style: string;
  private color: string;

  constructor(data: DataProxy, mode: string, style: string, color: string) {
    super(data);
    this.mode = mode;
    this.style = style;
    this.color = color;
  }

  execute(): void {
    this.data.setSelectedCellAttr('border', {
      mode: this.mode,
      style: this.style,
      color: this.color,
    });
  }

  getName(): string {
    return `Border-${this.mode}`;
  }
}

/**
 * Format command
 */
export class FormatCommand extends BaseToolbarCommand {
  private format: string;

  constructor(data: DataProxy, format: string) {
    super(data);
    this.format = format;
  }

  execute(): void {
    this.data.setSelectedCellAttr('format', this.format);
  }

  getName(): string {
    return `Format-${this.format}`;
  }
}

/**
 * Formula command
 */
export class FormulaCommand extends BaseToolbarCommand {
  private formula: string;

  constructor(data: DataProxy, formula: string) {
    super(data);
    this.formula = formula;
  }

  execute(): void {
    this.data.setSelectedCellAttr('formula', this.formula);
  }

  getName(): string {
    return `Formula-${this.formula}`;
  }
}

/**
 * Autofilter command
 */
export class AutofilterCommand extends BaseToolbarCommand {
  execute(): void {
    this.data.autofilter();
  }

  canExecute(): boolean {
    return this.data.canAutofilter() || this.data.autoFilter?.active?.();
  }

  getName(): string {
    return 'Autofilter';
  }
}

/**
 * Freeze command
 */
export class FreezeCommand extends BaseToolbarCommand {
  execute(): void {
    const { ri, ci } = this.data.selector;
    if (this.data.freezeIsActive()) {
      this.data.setFreeze(0, 0);
    } else {
      this.data.setFreeze(ri, ci);
    }
  }

  getName(): string {
    return 'Freeze';
  }
}

/**
 * Delete cells command
 */
export class DeleteCellsCommand extends BaseToolbarCommand {
  private what: string;

  constructor(data: DataProxy, what = 'all') {
    super(data);
    this.what = what;
  }

  execute(): void {
    this.data.deleteCell(this.what);
  }

  getName(): string {
    return `DeleteCells-${this.what}`;
  }
}

/**
 * Insert row command
 */
export class InsertRowCommand extends BaseToolbarCommand {
  private count: number;

  constructor(data: DataProxy, count = 1) {
    super(data);
    this.count = count;
  }

  execute(): void {
    this.data.insert('row', this.count);
  }

  getName(): string {
    return `InsertRow-${this.count}`;
  }
}

/**
 * Insert column command
 */
export class InsertColumnCommand extends BaseToolbarCommand {
  private count: number;

  constructor(data: DataProxy, count = 1) {
    super(data);
    this.count = count;
  }

  execute(): void {
    this.data.insert('column', this.count);
  }

  getName(): string {
    return `InsertColumn-${this.count}`;
  }
}

/**
 * Delete row command
 */
export class DeleteRowCommand extends BaseToolbarCommand {
  execute(): void {
    this.data.delete('row');
  }

  getName(): string {
    return 'DeleteRow';
  }
}

/**
 * Delete column command
 */
export class DeleteColumnCommand extends BaseToolbarCommand {
  execute(): void {
    this.data.delete('column');
  }

  getName(): string {
    return 'DeleteColumn';
  }
}

/**
 * Command Invoker
 *
 * Manages command execution and maintains command history for potential undo/redo
 */
export class CommandInvoker {
  private commandHistory: ToolbarCommand[] = [];
  private maxHistorySize: number;

  constructor(maxHistorySize = 100) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Execute a command and add it to history
   */
  execute(command: ToolbarCommand): boolean {
    if (!command.canExecute()) {
      return false;
    }

    command.execute();

    // Add to history for potential undo
    this.commandHistory.push(command);
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
    }

    return true;
  }

  /**
   * Get command history
   */
  getHistory(): ToolbarCommand[] {
    return [...this.commandHistory];
  }

  /**
   * Clear command history
   */
  clearHistory(): void {
    this.commandHistory = [];
  }
}
