import { ErrorMsg } from '../typings/error.type';

type TraverseReturn = {
  value: number;
  stopper: string | null;
};

type ObjType = {
  [key: string]: any;
};
const _traverse = (obj: ObjType = {}, path: string[], index: number): TraverseReturn => {
  const value = obj[path[index]];
  // this means we didnt found it or it is the actual value
  if (!value) return { value: -1, stopper: `property not found ${path[index]}` };

  // we check if it is an object to continue
  const isArray = Array.isArray(value);
  if (typeof value === 'object' && !isArray) {
    return _traverse(value, path, index + 1);
  }

  if (isArray) {
    // we are looking for another object
    const nextPath = path[index + 2];
    const newPath = path[index + 1];
    if (nextPath) {
      const comparer = (v: ObjType) => Object.keys(v).includes(newPath) && typeof v[newPath] === 'object';
      const innerObj = value.find(comparer);
      if (!innerObj) return { value: -1, stopper: `property not found ${newPath}` };
      return _traverse(innerObj, path, index + 1);
    } else {
      // we are looking for a plain value
      const comparer = (v: ObjType) => Object.keys(v).includes(newPath) && typeof v[newPath] !== 'object';
      const innerVal = value.find(comparer);
      if (!innerVal) return { value: -1, stopper: `property not found ${newPath}` };
      const numericValue = parseFloat(innerVal[newPath]);
      const nan = isNaN(numericValue);
      return { value: nan ? -1 : numericValue, stopper: nan ? 'The value is not a number' : null };
    }
  }

  const numericValue = parseFloat(value);
  const nan = isNaN(numericValue);
  return { value: nan ? -1 : numericValue, stopper: nan ? 'The value is not a number' : null };
};

export const traverse = (obj: ObjType = {}, path: string = '') => {
  const arrayPath = path.split('.');
  return _traverse(obj, arrayPath, 0);
};

export const isErrorMsg = (object: any): object is ErrorMsg => {
  return 'msg' in object;
};
