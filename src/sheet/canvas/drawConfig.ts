/**
 * Configuration constants for canvas drawing
 */

export const DrawConfig = {
  /** Default colors used in drawing */
  colors: {
    defaultBackground: '#ffffff',
    dropdownIndicator: 'rgba(0, 0, 0, 0.45)',
    errorIndicator: 'rgba(255, 0, 0, 0.65)',
    frozenIndicator: 'rgba(0, 255, 0, 0.85)',
  },

  /** Indicator triangle dimensions */
  indicators: {
    /** Triangle base width */
    triangleSize: 8,
    /** Triangle height */
    triangleHeight: 6,
    /** Offset from cell edge */
    offset: 15,
    /** Error/frozen indicator height */
    cornerHeight: 8,
  },

  /** Text rendering settings */
  text: {
    /** Line spacing between wrapped text lines */
    lineSpacing: 2,
    /** Character spacing adjustment during measurement */
    charSpacingAdjustment: 1,
  },

  /** Border style line widths */
  borders: {
    mediumWidth: 2,
    thickWidth: 3,
    dashedPattern: [3, 2],
    dottedPattern: [1, 1],
    doublePattern: [2, 0],
  },
} as const;

/** Type for DrawConfig */
export type DrawConfigType = typeof DrawConfig;
