import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  UndoCommand,
  RedoCommand,
  BoldCommand,
  ItalicCommand,
  AlignCommand,
  MergeCommand,
  CommandInvoker,
} from '../../../src/sheet/core/commands/ToolbarCommand';

// Mock DataProxy
const createMockDataProxy = () => ({
  undo: vi.fn(),
  redo: vi.fn(),
  canUndo: vi.fn().mockReturnValue(true),
  canRedo: vi.fn().mockReturnValue(true),
  setSelectedCellAttr: vi.fn(),
  isSingleSelected: vi.fn().mockReturnValue(false),
  canUnmerge: vi.fn().mockReturnValue(true),
  selector: { ri: 0, ci: 0 },
  autoFilter: { active: vi.fn().mockReturnValue(false) },
  freezeIsActive: vi.fn().mockReturnValue(false),
  setFreeze: vi.fn(),
});

describe('ToolbarCommand', () => {
  describe('UndoCommand', () => {
    it('should execute undo', () => {
      const mockData = createMockDataProxy();
      const command = new UndoCommand(mockData as any);

      command.execute();

      expect(mockData.undo).toHaveBeenCalled();
    });

    it('should check if undo is possible', () => {
      const mockData = createMockDataProxy();
      const command = new UndoCommand(mockData as any);

      mockData.canUndo.mockReturnValue(true);
      expect(command.canExecute()).toBe(true);

      mockData.canUndo.mockReturnValue(false);
      expect(command.canExecute()).toBe(false);
    });

    it('should return correct name', () => {
      const mockData = createMockDataProxy();
      const command = new UndoCommand(mockData as any);
      expect(command.getName()).toBe('Undo');
    });
  });

  describe('RedoCommand', () => {
    it('should execute redo', () => {
      const mockData = createMockDataProxy();
      const command = new RedoCommand(mockData as any);

      command.execute();

      expect(mockData.redo).toHaveBeenCalled();
    });

    it('should check if redo is possible', () => {
      const mockData = createMockDataProxy();
      const command = new RedoCommand(mockData as any);

      mockData.canRedo.mockReturnValue(true);
      expect(command.canExecute()).toBe(true);

      mockData.canRedo.mockReturnValue(false);
      expect(command.canExecute()).toBe(false);
    });

    it('should return correct name', () => {
      const mockData = createMockDataProxy();
      const command = new RedoCommand(mockData as any);
      expect(command.getName()).toBe('Redo');
    });
  });

  describe('BoldCommand', () => {
    it('should execute bold with true', () => {
      const mockData = createMockDataProxy();
      const command = new BoldCommand(mockData as any, true);

      command.execute();

      expect(mockData.setSelectedCellAttr).toHaveBeenCalledWith('font-bold', true);
    });

    it('should execute bold with false', () => {
      const mockData = createMockDataProxy();
      const command = new BoldCommand(mockData as any, false);

      command.execute();

      expect(mockData.setSelectedCellAttr).toHaveBeenCalledWith('font-bold', false);
    });

    it('should return correct name', () => {
      const mockData = createMockDataProxy();
      const command = new BoldCommand(mockData as any, true);
      expect(command.getName()).toBe('Bold');
    });
  });

  describe('ItalicCommand', () => {
    it('should execute italic with true', () => {
      const mockData = createMockDataProxy();
      const command = new ItalicCommand(mockData as any, true);

      command.execute();

      expect(mockData.setSelectedCellAttr).toHaveBeenCalledWith('font-italic', true);
    });

    it('should return correct name', () => {
      const mockData = createMockDataProxy();
      const command = new ItalicCommand(mockData as any, true);
      expect(command.getName()).toBe('Italic');
    });
  });

  describe('AlignCommand', () => {
    it('should execute left align', () => {
      const mockData = createMockDataProxy();
      const command = new AlignCommand(mockData as any, 'left');

      command.execute();

      expect(mockData.setSelectedCellAttr).toHaveBeenCalledWith('align', 'left');
    });

    it('should execute center align', () => {
      const mockData = createMockDataProxy();
      const command = new AlignCommand(mockData as any, 'center');

      command.execute();

      expect(mockData.setSelectedCellAttr).toHaveBeenCalledWith('align', 'center');
    });

    it('should execute right align', () => {
      const mockData = createMockDataProxy();
      const command = new AlignCommand(mockData as any, 'right');

      command.execute();

      expect(mockData.setSelectedCellAttr).toHaveBeenCalledWith('align', 'right');
    });

    it('should return correct name', () => {
      const mockData = createMockDataProxy();
      const command = new AlignCommand(mockData as any, 'center');
      expect(command.getName()).toBe('Align-center');
    });
  });

  describe('MergeCommand', () => {
    it('should execute merge', () => {
      const mockData = createMockDataProxy();
      const command = new MergeCommand(mockData as any, true);

      command.execute();

      expect(mockData.setSelectedCellAttr).toHaveBeenCalledWith('merge', true);
    });

    it('should execute unmerge', () => {
      const mockData = createMockDataProxy();
      const command = new MergeCommand(mockData as any, false);

      command.execute();

      expect(mockData.setSelectedCellAttr).toHaveBeenCalledWith('merge', false);
    });

    it('should check canExecute for merge (multiple cells selected)', () => {
      const mockData = createMockDataProxy();
      mockData.isSingleSelected.mockReturnValue(false);
      const command = new MergeCommand(mockData as any, true);

      expect(command.canExecute()).toBe(true);
    });

    it('should check canExecute for merge (single cell selected)', () => {
      const mockData = createMockDataProxy();
      mockData.isSingleSelected.mockReturnValue(true);
      const command = new MergeCommand(mockData as any, true);

      expect(command.canExecute()).toBe(false);
    });

    it('should check canExecute for unmerge', () => {
      const mockData = createMockDataProxy();
      mockData.canUnmerge.mockReturnValue(true);
      const command = new MergeCommand(mockData as any, false);

      expect(command.canExecute()).toBe(true);
    });

    it('should return correct name for merge', () => {
      const mockData = createMockDataProxy();
      const command = new MergeCommand(mockData as any, true);
      expect(command.getName()).toBe('Merge');
    });

    it('should return correct name for unmerge', () => {
      const mockData = createMockDataProxy();
      const command = new MergeCommand(mockData as any, false);
      expect(command.getName()).toBe('Unmerge');
    });
  });

  describe('CommandInvoker', () => {
    let invoker: CommandInvoker;

    beforeEach(() => {
      invoker = new CommandInvoker();
    });

    it('should execute command successfully', () => {
      const mockData = createMockDataProxy();
      const command = new BoldCommand(mockData as any, true);

      const result = invoker.execute(command);

      expect(result).toBe(true);
      expect(mockData.setSelectedCellAttr).toHaveBeenCalled();
    });

    it('should not execute command when canExecute returns false', () => {
      const mockData = createMockDataProxy();
      mockData.canUndo.mockReturnValue(false);
      const command = new UndoCommand(mockData as any);

      const result = invoker.execute(command);

      expect(result).toBe(false);
      expect(mockData.undo).not.toHaveBeenCalled();
    });

    it('should add commands to history', () => {
      const mockData = createMockDataProxy();
      const command1 = new BoldCommand(mockData as any, true);
      const command2 = new ItalicCommand(mockData as any, true);

      invoker.execute(command1);
      invoker.execute(command2);

      const history = invoker.getHistory();
      expect(history.length).toBe(2);
    });

    it('should clear history', () => {
      const mockData = createMockDataProxy();
      const command = new BoldCommand(mockData as any, true);

      invoker.execute(command);
      invoker.clearHistory();

      const history = invoker.getHistory();
      expect(history.length).toBe(0);
    });

    it('should limit history size', () => {
      const invoker = new CommandInvoker(2);
      const mockData = createMockDataProxy();

      invoker.execute(new BoldCommand(mockData as any, true));
      invoker.execute(new ItalicCommand(mockData as any, true));
      invoker.execute(new AlignCommand(mockData as any, 'center'));

      const history = invoker.getHistory();
      expect(history.length).toBe(2);
      // First command should be removed
      expect(history[0].getName()).toBe('Italic');
      expect(history[1].getName()).toBe('Align-center');
    });
  });
});
