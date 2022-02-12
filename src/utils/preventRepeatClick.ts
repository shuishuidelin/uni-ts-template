// 处理多次点击
export default (function () {
  let onoff = true;
  let targetFn: any;
  return function throttle(fn: any, params: any) {
    if (targetFn != fn) onoff = true;
    if (onoff && fn) {
      onoff = false;
      targetFn = fn;
      if (params) {
        fn(params);
      } else {
        fn()
      }
      setTimeout(function () {
        onoff = true;
        targetFn = null;
      }, 1500)
    } else {
      console.log("请稍后点击")
    }
  }
}())