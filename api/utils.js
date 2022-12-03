const deepFreeze = (obj) => {
  const propKeys = Object.getOwnPropertyNames(obj);

  propKeys.forEach((key) => {
    const propValue = obj[key];

    if (propValue && typeof propValue === 'object') {
      deepFreeze(propValue);
      console.log(propValue, typeof propValue);
    }
  });

  return Object.freeze(obj);
};

export { deepFreeze };
