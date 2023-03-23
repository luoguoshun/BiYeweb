/*
 * @LastEditTime: 2023-03-23 15:42:38
 * @Descripttion: 
 */
//  // 非立即执行版(触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间)
function debounce1(func, wait) {
  var timer = null;
  // 返回函数对debounce作用域形成闭包
  return function () {
    var context = this;
    var args = arguments;
    if (timer) {
      // 事件被触发，清除timer并重新开始计时
      clearTimeout(timer);
    }
    //
    timer = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}
 // 立即执行版(触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。用法同上，效果如下：)
 function debounce2(func, wait) {
  let timer;
  return function () {
    let context = this; // 这边的 this 指向谁?
    let args = arguments; // arguments中存着e
    if (timer) clearTimeout(timer);
    let callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, wait);
    if (callNow) func.apply(context, args);
  };
}
var fn = function () {
  console.log('boom');
};
setInterval(debounce1(fn, 999), 1000); // 第一次在1500ms后触发，之后每1000ms触发一次

setInterval(debounce(fn, 2000), 1000); // 不会触发一次（把函数防抖看出技能读条，如果读条没完成就用技能，便会失败而且重新读条）
// 1、第一次调用函数的时候创建了一个定时器，在指定的时间之后运行代码

// 2、当第二次调用该函数的时候，会清除前一次的定时器并设置另一个

// 3、如果前一个定时器已经执行过了，这个操作就没有任何意义

// 4、当前一个定时器没有执行的时候，就是将他替换成一个新的定时器

// 5、目的是只有在执行函数的请求停止了wait时间之后才执行