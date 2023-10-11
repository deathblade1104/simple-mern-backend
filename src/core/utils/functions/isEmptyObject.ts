import isTypeObject from './isTypeObject';

const isEmptyObject = (obj: any): boolean => {
  if (isTypeObject(obj)) {
    if (Object.keys(obj).length > 0) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export default isEmptyObject;
