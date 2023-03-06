/**
 * 对小于 10 的数字进行补零
 * @param n 需要补零的数字
 * @returns 补零后的字符串
 */
const zeroFill = (n) => {
  let num = becomeInteger(n);

  if (num < 10) {
    return '0' + num;
  } else {
    return num.toString();
  }
};
// 共用方法
const timestampToTime = (timestamp) => {
  // 将获取的数字都转为2位数
  let change2 = (n) => {
    if (n < 10) {
      return '0' + n;
    } else {
      return n.toString();
    }
  };
  let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = change2(date.getDate() + 1 < 10 ? 0 : date.getMonth() + 1) + '-';
  let D = change2(date.getDate()) + ' ';
  let h = change2(date.getHours()) + ':';
  let m = change2(date.getMinutes()) + ':';
  let s = change2(date.getSeconds());
  return Y + M + D + h + m + s;
};

/**
 * 判断值是否是空
 * @param {Any} val 需要判断的值
 */
const isUndef = (val) => {
  return val === undefined || val === null;
};

/**
 * 把字符串变成整数
 * @param {String} val 需要转变成整数的字符串
 * @return {Number} 转换的整数数字
 */
const becomeInteger = (val) => {
  if (typeof val === 'number') {
    return val;
  } else {
    let num = parseInt(val, 10);
    return isNaN(num) ? 0 : num;
  }
};

/**
 * 去除字符串空格
 * @param {String} str 要处理的字符串
 * @param {Number} type 1：前后空格 2：所有空格 3：前空格 4：后空格（默认所有空格）
 */
const strTrim = (str, type = 2) => {
  if (isUndef(str) || dataType(str) !== 'String') return str;
  switch (type) {
    // 前后空格
    case 1:
      return str.replace(/(^\s*)|(\s*$)/g, '');
    // 所有空格
    case 2:
      return str.replace(/\s+/g, '');
    // 右边空格
    case 3:
      return str.replace(/(^\s*)/g, '');
    // 左边空格
    case 4:
      return str.replace(/(\s*$)/g, '');
    default:
      return str;
  }
};

/**
 * 判断 val 是否有值
 * @param {any} val
 */
const hasValue = function(val) {
  if (['Object', 'Array'].includes(dataType(val))) {
    return Object.keys(val).length > 0;
  } else if (['String', 'Null', 'Undefined'].includes(dataType(val))) {
    return !isUndef(val) && strTrim(val) !== '';
  } else if (dataType(val) === 'Number') {
    return !isNaN(val);
  }
  return true;
};

/**
 * 图片转base64码
 * @param {*} file
 */
const getBase64Url = (file) => {
  return new Promise((resolve, reject) => {
    let resArr = [];

    for (let i = 0; i < file.length; i++) {
      const f = file[i];
      let reader = new FileReader();
      let imgResult = '';
      reader.readAsDataURL(f);

      reader.onload = function(e) {
        imgResult = e.target.result;
        resArr.push(imgResult);
        if (resArr.length == file.length) {
          resolve(resArr);
        }
      };
      reader.onerror = function(error) {
        reject(error);
      };
      reader.onloadend = function() {};
    }
  });
};

/**
 * 判断数据的数据类型
 * @param {any} val 需要判断数据类型的数据
 * @return  String / Number /  Boolean / Null / Undefined / Function / Date / RegExp / Error / Object / Array
 */
const dataType = (val) => {
  return Object.prototype.toString
    .call(val)
    .replace(/\[|\]/g, '')
    .split(' ')[1];
};

/**
 * 遍历赋值对象值
 * @param {Object} obj 想要被赋值的对象
 * @param {Object} params 赋值的对象
 */
const ergodicAssign = (obj, params) => {
  if (dataType(obj) === 'Object' && dataType(params) === 'Object') {
    Object.keys(obj).forEach((key) => {
      if (params.hasOwnProperty(key)) {
        obj[key] = params[key];
      }
    });
  }
};

/**
 * 遍历把对象的字段变成首字母大写
 * @param {Object} obj 被赋值的对象
 * @return {Object} newObj 应该变成的对象
 */
// const ergodicTitleCase = (obj): Object => {
//   let newObj = {}
//   if (dataType(obj) === "Object") {
//     Object.keys(obj).forEach(key => {
//       let [fitst, ...rest] = key
//       let newKey = fitst.toUpperCase() + rest.join("")
//       console.log();

//       newObj[newKey] = obj[key]
//     })
//     return newObj
//   }
//   else return obj
// }

/**
 * 深度合并对象
 * @param {Object} firstObj  要深度合并的对象
 * @param {Object} secondObj 要深度合并的对象
 * @returns {Object}
 * 例如
 *  deepObjectMerge({
 *    a: {
 *      b: {
 *        c: "ccc"
 *      }
 *    }
 *  }, {
 *    a: {
 *      b: {
 *        d: "ddd"
 *      }
 *    },
 *    e: "eee"
 *  })
 *  会得到
 *  a: {
 *    b: {
 *      c: "ccc",
 *        d: "ddd"
 *    },
 *    e: "eee"
 *  }
 */
const deepObjectMerge = (firstObj, secondObj) => {
  // 如果target(也就是firstObj[key])存在，
  // 且是对象的话再去调用deepObjectMerge，
  // 否则就是firstObj[key]里面没这个对象，需要与secondObj[key]合并
  for (var key in secondObj) {
    firstObj[key] =
      firstObj[key] && firstObj[key].toString() === '[object Object]'
        ? deepObjectMerge(firstObj[key], secondObj[key])
        : (firstObj[key] = secondObj[key]);
  }
  return firstObj;
};

/**
 * 根据想要的格式获取当前时间
 * @param type 转换成的时间格式。例如 milliSecond 就会返回 2020-04-02 15:37:20.15641
 */
const nowTime = (type = 'day') => {
  let date = new Date(),
    currentTime = '';
  // 补零也可以用 date.getFullYear().toString().padStart(2,0)
  let y = date.getFullYear().toString(); // 年
  let mo = zeroFill(date.getMonth() + 1); // 月
  let d = zeroFill(date.getDate()); // 日
  let h = zeroFill(date.getHours()); // 小时
  let mi = zeroFill(date.getMinutes()); // 分钟
  let s = zeroFill(date.getSeconds()); // 秒
  let ms = zeroFill(date.getMilliseconds()); // 毫秒

  switch (type) {
    case 'year':
      currentTime = `${y}`;
      break;
    case 'month':
      currentTime = `${y}-${mo}`;
      break;
    case 'hour':
      currentTime = `${y}-${mo}-${d} ${h}`;
      break;
    case 'minute':
      currentTime = `${y}-${mo}-${d} ${h}:${mi}`;
      break;
    case 'second':
      currentTime = `${y}-${mo}-${d} ${h}:${mi}:${s}`;
      break;
    case 'milliSecond':
      currentTime = `${y}-${mo}-${d} ${h}:${mi}:${s}.${ms}`;
      break;
    default:
      currentTime = `${y}-${mo}-${d}`;
      break;
  }

  return currentTime;
};

/**
 * UTC时间格式转换成 YYYY-MM-DD HH:MM:SS 格式
 * @param timestamp 需要转换的时间字符串。例如: 2020-04-02T15:41:49.9867995
 * @param type 转换成的时间格式。例如 hour 就会返回 2020-04-02 15
 */
const timeUTCToTime = (timestamp, type = 'day') => {
  let currentTime = '';
  // 不符合格式的时间参数就会返回原来的字符串
  if (timestamp.split('T').length !== 2) {
    return timestamp;
  }

  let [date, time] = timestamp.split('T');

  let dateReg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
  let timeReg = /([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/;

  // 不符合格式的时间和日期就会返回 ""
  if (!dateReg.test(date) || !timeReg.test(time)) {
    return '';
  }

  let [y, mo, d] = date.split('-'); // 获取年、月、日
  let [h, mi, ts] = time.split(':'); // 获取时、分、秒加毫秒
  let [s, ms] = ts.split('.'); // 获取秒
  // 补零
  y = zeroFill(y);
  mo = zeroFill(mo);
  d = zeroFill(d);
  h = zeroFill(h);
  mi = zeroFill(mi);
  s = zeroFill(s);

  // 组合成所需字符串
  switch (type) {
    case 'year':
      currentTime = `${y}`;
      break;
    case 'month':
      currentTime = `${y}-${mo}`;
      break;
    case 'hour':
      currentTime = `${y}-${mo}-${d} ${h}`;
      break;
    case 'minute':
      currentTime = `${y}-${mo}-${d} ${h}:${mi}`;
      break;
    case 'second':
      currentTime = `${y}-${mo}-${d} ${h}:${mi}:${s}`;
      break;
    case 'milliSecond':
      currentTime = `${y}-${mo}-${d} ${h}:${mi}:${s}.${ms}`;
      break;
    default:
      currentTime = `${y}-${mo}-${d}`;
      break;
  }

  return currentTime;
};

/**
 * 根据年龄和运动强度计算运动心率
 * @param age 年龄
 * @param strength 运动强度
 */
const heartRateRange = function(age) {
  let min = 0,
    max = 0;
  let ageNum = becomeInteger(age);

  max = 210 - ageNum;
  min = 195 - ageNum;
  return {
    min,
    max,
  };
};

/**
 * 数组里面的值交换
 * @param {*} arr // 要交换值的数组
 * @param {*} index1  // 数组的缩影
 * @param {*} index2  // 数组的索引
 */
const swapArray = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};

/**
 * 对list进行分组的函数
 * @param list 需要进行分组的数组
 * @param fn  分组函数。函数的返回值最好是个字符串
 * @return {{}}
 */
const groupBy = (list = [], fn) => {
  const groups = {};
  list.forEach(function(o) {
    let key = fn(o);
    const group = dataType(key) === 'String' ? key : JSON.stringify(key);
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return groups;
};

export default {
  zeroFill,
  timestampToTime,
  nowTime,
  isUndef,
  becomeInteger,
  strTrim,
  getBase64Url,
  dataType,
  ergodicAssign,
  // ergodicTitleCase,
  deepObjectMerge,
  hasValue,
  timeUTCToTime,
  heartRateRange,
  swapArray,
  groupBy,
};
