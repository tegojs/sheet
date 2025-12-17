/**
 * Validation Types
 */

/**
 * Validation type
 */
export type ValidationType =
  | 'number'
  | 'email'
  | 'phone'
  | 'list'
  | 'date'
  | 'custom';

/**
 * Validation operator
 */
export type ValidationOperator =
  | 'be' // between
  | 'nbe' // not between
  | 'eq' // equal
  | 'neq' // not equal
  | 'lt' // less than
  | 'lte' // less than or equal
  | 'gt' // greater than
  | 'gte'; // greater than or equal

/**
 * Validation rule
 */
export interface ValidationRule {
  type: ValidationType;
  required: boolean;
  value: string | string[];
  operator: ValidationOperator;
}

/**
 * Validation mode
 */
export type ValidationMode = 'stop' | 'alert' | 'hint';

/**
 * Validation data
 */
export interface ValidationData {
  refs: string[]; // Cell references, e.g., ['A1', 'B2:C3']
  mode: ValidationMode;
  type: ValidationType;
  required: boolean;
  operator: ValidationOperator;
  value: string | string[];
}

/**
 * Validation error info
 */
export interface ValidationError {
  ri: number;
  ci: number;
  message: string;
}
