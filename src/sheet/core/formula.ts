import { tf } from '../locale/locale';
import { numberCalc } from './helper';

export interface Formula {
  key: string;
  title: () => string;
  render: (ary: (string | number | boolean)[]) => number | string | boolean;
}

export const baseFormulas: Formula[] = [
  {
    key: 'SUM',
    title: tf('formula.sum'),
    render: (ary) => ary.reduce((a, b) => numberCalc('+', a, b), 0),
  },
  {
    key: 'AVERAGE',
    title: tf('formula.average'),
    render: (ary) =>
      (ary.reduce((a, b) => Number(a) + Number(b), 0) as number) / ary.length,
  },
  {
    key: 'MAX',
    title: tf('formula.max'),
    render: (ary) => Math.max(...ary.map((v) => Number(v))),
  },
  {
    key: 'MIN',
    title: tf('formula.min'),
    render: (ary) => Math.min(...ary.map((v) => Number(v))),
  },
  {
    key: 'IF',
    title: tf('formula._if'),
    render: ([b, t, f]) => (b ? t : f),
  },
  {
    key: 'AND',
    title: tf('formula.and'),
    render: (ary) => ary.every((it) => it),
  },
  {
    key: 'OR',
    title: tf('formula.or'),
    render: (ary) => ary.some((it) => it),
  },
  {
    key: 'CONCAT',
    title: tf('formula.concat'),
    render: (ary) => ary.join(''),
  },
  /* support:  1 + A1 + B2 * 3
  {
    key: 'DIVIDE',
    title: tf('formula.divide'),
    render: ary => ary.reduce((a, b) => Number(a) / Number(b)),
  },
  {
    key: 'PRODUCT',
    title: tf('formula.product'),
    render: ary => ary.reduce((a, b) => Number(a) * Number(b),1),
  },
  {
    key: 'SUBTRACT',
    title: tf('formula.subtract'),
    render: ary => ary.reduce((a, b) => Number(a) - Number(b)),
  },
  */
];

export const formulas = baseFormulas;

export const formulam: Record<string, Formula> = {};
for (const f of baseFormulas) {
  formulam[f.key] = f;
}
