export const throttle = (func: Function, threshold: number, scope: any) => {
  threshold || (threshold = 250)
  let last, deferTimer
  return function () {
    let context = scope || this
    let now = +new Date()
    let args = arguments
    if (last && now < last + threshold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        func.apply(context, args)
      }, threshold)
    } else {
      last = now
      func.apply(context, args)
    }
  }
}

export const sortByDate = (array: Array<any>, key: string, order: string) => {
  return array.sort((a, b) => {
    const x = new Date(a[key]).getTime();
    const y = new Date(b[key]).getTime();
    // desc = older to newest from top to bottom
    const val = order === 'desc' ? y - x : x - y;
    return val;
  });
}
