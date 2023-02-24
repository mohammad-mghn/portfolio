export const generateRandomNum = (maxLimit = 8000, minLimit = 3000) => {
  // generate a floating number which is in range of 1 to 0
  // to so to make it between zero to our maximum limit multiply it to our maximum number.
  let randomNum = Math.random() * maxLimit;

  // but still it's floating, so floor method makes it integer number which is needed
  // however floating is cool but to for css processing.
  randomNum = Math.floor(randomNum);

  if (randomNum < minLimit) {
    return minLimit;
  }

  return randomNum;
};
