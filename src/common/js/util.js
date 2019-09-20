/**
 * 获取[min,max]之间的随机数
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }

  return _arr
}

export function dateFormat(date) {
  let ret;
  let Y = date.getFullYear()
  let M = parseInt(date.getMonth()) + 1
  let D = date.getDate()
  return `${Y}-${M}-${D}`
}

/**
 * 节流函数
 * @param fn
 * @param delay
 * @returns {Function}
 */
export function debunce(fn, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)

  }
}
