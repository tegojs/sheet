/**
 * Excel-like tag, e.g. "A1", "BC23"
 * 字母 + 数字 组合
 */
export type TagA1 = `${Uppercase<string>}${number}`;

/**
 * Excel-like range tag, e.g. "A1:B10"
 */
export type TagA1Range = `${Uppercase<string>}${number}:${Uppercase<string>}${number}`;

/**
 * XY 坐标对，例如 [0, 0]
 */
export type TagXY = [x: number, y: number];

const alphabets = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

/** index number 2 letters
 * @example stringAt(26) ==> 'AA'
 * @date 2019-10-10
 * @export
 * @param {number} index
 * @returns {string}
 */
export function stringAt(index: number): Uppercase<string> {
  let str = '';
  let cindex = index;
  while (cindex >= alphabets.length) {
    cindex = Math.floor(cindex / alphabets.length);
    cindex -= 1;
    str += alphabets[Math.floor(cindex % alphabets.length)];
  }
  const last = index % alphabets.length;
  str += alphabets[last];
  return str as Uppercase<string>;
}

/** translate letter in A1-tag to number
 * @date 2019-10-10
 * @export
 * @param {string} str "AA" in A1-tag "AA1"
 * @returns {number}
 */
export function indexAt(str: string): number {
  let ret = 0;
  for (let i = 0; i !== str.length; ++i)
    ret = 26 * ret + str.charCodeAt(i) - 64;
  return ret - 1;
}

// B10 => x,y
/** translate A1-tag to XY-tag
 * @date 2019-10-10
 * @export
 * @param {tagA1} src
 * @returns {tagXY}
 */
export function expr2xy(src: TagA1): TagXY {
  let x = '';
  let y = '';
  for (let i = 0; i < src.length; i += 1) {
    if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
      y += src.charAt(i);
    } else {
      x += src.charAt(i);
    }
  }
  return [indexAt(x), Number.parseInt(y, 10) - 1];
}

/** translate XY-tag to A1-tag
 * @example x,y => B10
 * @date 2019-10-10
 * @export
 * @param {number} x
 * @param {number} y
 * @returns {tagA1}
 */
export function xy2expr(x: number, y: number): TagA1 {
  return `${stringAt(x)}${y + 1}`;
}

/** translate A1-tag src by (xn, yn)
 * @date 2019-10-10
 * @export
 * @param {tagA1} src
 * @param {number} xn
 * @param {number} yn
 * @returns {tagA1}
 */
export function expr2expr(
  src: TagA1,
  xn: number,
  yn: number,
  condition: (x: number, y: number) => boolean = () => true,
): TagA1 {
  if (xn === 0 && yn === 0) return src;
  const [x, y] = expr2xy(src);
  if (!condition(x, y)) return src;
  return xy2expr(x + xn, y + yn);
}

export default {
  stringAt,
  indexAt,
  expr2xy,
  xy2expr,
  expr2expr,
};
