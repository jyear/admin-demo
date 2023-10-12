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
