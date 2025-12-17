import type { Meta, StoryObj } from '@storybook/react';
import { ReactSheet } from '../src/sheet';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/ReactSheet',
  component: ReactSheet,
  parameters: {
    // 电子表格需要全屏布局
    layout: 'fullscreen',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    options: { control: 'object' },
  },
} satisfies Meta<typeof ReactSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};

export const ReadOnly: Story = {
  args: {
    options: { mode: 'read' },
  },
};

export const WithToolbarAndBottomBar: Story = {
  args: {
    options: {
      showToolbar: true,
      showBottomBar: true,
    },
  },
};

export const WithoutToolbar: Story = {
  args: {
    options: {
      showToolbar: false,
      showBottomBar: true,
    },
  },
};

export const MinimalView: Story = {
  args: {
    options: {
      showToolbar: false,
      showBottomBar: false,
      showGrid: true,
    },
  },
};
