// 添加类的操作
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 判断是否有该类
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}


export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    O: 'OTransform',
    moz: 'msTransform',
    standard: 'transform',
  }

  for (let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined){
      return key
    }
  }

  return false
})()

/**
 * 给CSS3属性添加浏览器前缀
 * @param style
 */
export function prefixStyle(style) {
  if (!vendor) {
    return
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
