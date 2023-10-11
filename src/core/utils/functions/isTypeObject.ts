const isTypeObject = (val: any): boolean => {
  return toString.call(val) === '[object Object]' ? true : false;
};

export default isTypeObject;
