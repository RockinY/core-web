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