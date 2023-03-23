/*
 * @LastEditTime: 2023-03-23 15:43:10
 * @Descripttion: mixin
 */
//#region 防抖和节流
/**
防抖（debounce）和节流（throttle）都是用来控制某个函数在一定时间内执行多少次的技巧，两者相似不相同，基本思想都是某些代码不可以在没有间断的情况下连续重复执行
函数防抖
如果一个事件被频繁执行多次，并且触发的时间间隔过短，则防抖函数可以使得对应的事件处理函数，只执行最后触发的一次。函数防抖可以把多个顺序的调用合并成一次。
应用：
1、搜索框输入（只需要最后一次输入完成后再放松Ajax请求）
2、滚动事件scroll（只需要执行触发后的最后一次滚动事件的处理程序）
3、文本输入的验证（连续输入文字后发送Ajax请求进行验证，停止输入后验证一次）
函数节流
如果一个事件被频繁触发多次，节流函数可以按照固定的频率去执行相应的事件处理方法。函数节流保证一个事件一定时间内只能执行一次。
应用：
1、DOM元素的拖拽功能实现（mousemove）
2、游戏中的刷新率
3、Canvas画笔功能
*/
//#endregion
export default {
  data() {
    return {
      debounceTimer: null,
    };
  },

  methods: {
    /**
     *  防抖函数
     */
    debounceMethods(func, ...args) {
      const context = this;
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      const callNow = !this.debounceTimer; // 是否立即执行
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null;
      }, 1000);
      if (callNow) func.apply(context, args);
    },
  },
};

