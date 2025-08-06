export function cloneDeep(obj: object) {
  return JSON.parse(JSON.stringify(obj));
}

const mergeDeep = (
  object: Record<string, unknown> = {},
  ...sources: Record<string, unknown>[]
) => {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const v = source[key];
      if (
        typeof v === 'string' ||
        typeof v === 'number' ||
        typeof v === 'boolean'
      ) {
        object[key] = v;
      } else if (
        typeof v !== 'function' &&
        !Array.isArray(v) &&
        v instanceof Object
      ) {
        object[key] = object[key] || {};
        mergeDeep(object[key] as Record<string, unknown>, v);
      } else {
        object[key] = v;
      }
    }
  }
  return object;
};

export function equals(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
) {
  const keys = Object.keys(obj1);
  if (keys.length !== Object.keys(obj2).length) return false;
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const v1 = obj1[k];
    const v2 = obj2[k];
    if (v2 === undefined) return false;
    if (
      typeof v1 === 'string' ||
      typeof v1 === 'number' ||
      typeof v1 === 'boolean'
    ) {
      if (v1 !== v2) return false;
    } else if (Array.isArray(v1) && Array.isArray(v2)) {
      if (v1.length !== v2.length) return false;
      for (let ai = 0; ai < v1.length; ai += 1) {
        if (!equals(v1[ai], v2[ai])) return false;
      }
    } else if (
      typeof v1 !== 'function' &&
      !Array.isArray(v1) &&
      v1 instanceof Object
    ) {
      if (!equals(v1 as Record<string, unknown>, v2 as Record<string, unknown>))
        return false;
    }
  }
  return true;
}

/*
  objOrAry: obejct or Array
  cb: (value, index | key) => { return value }
*/
export const sum = (objOrAry, cb = (value) => value) => {
  let total = 0;
  let size = 0;
  for (const key of Object.keys(objOrAry)) {
    total += cb(objOrAry[key], key);
    size += 1;
  }
  return [total, size];
};

export function deleteProperty(obj: Record<string, unknown>, property: string) {
  const oldv = obj[`${property}`];
  delete obj[`${property}`];
  return oldv;
}

export function rangeReduceIf(
  min: number,
  max: number,
  inits: number,
  initv: number,
  ifv: number,
  getv: (i: number) => number,
) {
  let s = inits;
  let v = initv;
  let i = min;
  for (; i < max; i += 1) {
    if (s > ifv) break;
    v = getv(i);
    s += v;
  }
  return [i, s - v, v];
}

export function rangeSum(
  min: number,
  max: number,
  getv: (i: number) => number,
) {
  let s = 0;
  for (let i = min; i < max; i += 1) {
    s += getv(i);
  }
  return s;
}

export function rangeEach(min: number, max: number, cb: (i: number) => void) {
  for (let i = min; i < max; i += 1) {
    cb(i);
  }
}

export function arrayEquals(a1: unknown[], a2: unknown[]) {
  if (a1.length === a2.length) {
    for (let i = 0; i < a1.length; i += 1) {
      if (a1[i] !== a2[i]) return false;
    }
  } else return false;
  return true;
}

function digits(a: number) {
  const v = `${a}`;
  let ret = 0;
  let flag = false;
  for (let i = 0; i < v.length; i += 1) {
    if (flag === true) ret += 1;
    if (v.charAt(i) === '.') flag = true;
  }
  return ret;
}

export function numberCalc(type: string, a1: unknown, a2: unknown) {
  if (Number.isNaN(a1) || Number.isNaN(a2)) {
    return a1 + type + a2;
  }
  const al1 = digits(a1 as number);
  const al2 = digits(a2 as number);
  const num1 = Number(a1);
  const num2 = Number(a2);
  let ret = 0;
  if (type === '-') {
    ret = num1 - num2;
  } else if (type === '+') {
    ret = num1 + num2;
  } else if (type === '*') {
    ret = num1 * num2;
  } else if (type === '/') {
    ret = num1 / num2;
    if (digits(ret) > 5) return ret.toFixed(2);
    return ret;
  }
  return ret.toFixed(Math.max(al1, al2));
}

export const merge = (...sources: Record<string, unknown>[]) =>
  mergeDeep({}, ...sources);
