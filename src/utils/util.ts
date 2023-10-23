export const formatEmptyRecord = (
  obj: Record<string, string | number>,
): Record<string, string | number> => {
  const res: Record<string, string | number> = {};
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] === 0 || obj[key]) {
      res[key] = obj[key];
    }
  });
  return res;
};

export const throttle = (func, delay = 500) => {
  let time = 0;
  return function (...args) {
    const nowT = new Date().getTime();
    if (!time || nowT - time > delay) {
      func.apply(this, args);
      time = nowT;
    }
  };
};
