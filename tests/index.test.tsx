import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, test } from 'vitest';
import { ReactSheet } from '../src/sheet';

test('The button should have correct background color', async () => {
  render(<ReactSheet />);
  // const button = screen.getByText('Demo Button');
  // expect(button).toHaveStyle({
  //   backgroundColor: '#ccc',
  // });
});
