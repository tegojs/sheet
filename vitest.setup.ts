import '@testing-library/jest-dom/vitest';

// Mock canvas for jsdom
class MockCanvasRenderingContext2D {
  canvas = { width: 100, height: 100 };
  fillStyle = '';
  strokeStyle = '';
  lineWidth = 1;
  font = '12px Arial';
  textAlign = 'left' as CanvasTextAlign;
  textBaseline = 'top' as CanvasTextBaseline;

  save() {}
  restore() {}
  clearRect() {}
  fillRect() {}
  strokeRect() {}
  fillText() {}
  strokeText() {}
  measureText() { return { width: 50 } as TextMetrics; }
  beginPath() {}
  moveTo() {}
  lineTo() {}
  stroke() {}
  fill() {}
  setLineDash() {}
  translate() {}
  scale() {}
  arc() {}
  rect() {}
  clip() {}
  closePath() {}
  createLinearGradient() { return { addColorStop: () => {} } as unknown as CanvasGradient; }
  drawImage() {}
  getImageData() { return { data: new Uint8ClampedArray() } as ImageData; }
  putImageData() {}
}

HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === '2d') {
    return new MockCanvasRenderingContext2D() as unknown as CanvasRenderingContext2D;
  }
  return null;
} as typeof HTMLCanvasElement.prototype.getContext;
