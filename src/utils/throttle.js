export function createThrottle(fn, wait) {
  let previous = 0;
  return function() {
    let now = new Date().getTime();
    if (now - previous > wait) {
      fn.apply(this, arguments);
      previous = now;
    }
  };
}
