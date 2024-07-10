export const getSafeValueInRange = (
  target: number,
  min: number,
  max: number,
) => {
  let result = target;

  if (target > max) {
    result = max;
  } else if (target < min) {
    result = min;
  }

  return result;
};
