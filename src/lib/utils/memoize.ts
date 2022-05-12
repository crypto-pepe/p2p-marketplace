export const memoize = (fn: (...args: any[]) => any) => {
  let cache: any = {};
  return (...args: any[]): any => {
    let n = args[0];
    if (n in cache) {
      return cache[n];
    }
    else {
      let result = fn(n);
      cache[n] = result;
      return result;
    }
  }
}
