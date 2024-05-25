/* 空函数 */
export function noop() { }

/**
 * 校验非空
 * @param {*} val
 * @return boolean
 */
export function notEmpty(val) {
  if (!notNull(val)) {
    return false
  }
  if (getRawType(val) === 'array') {
    return val.length
  }
  if (getRawType(val) === 'object') {
    return Reflect.ownKeys(val).length
  }
  return true
}
export function notNull(val) {
  return val !== undefined && val !== null
}

/** 
* 获取指定的URL参数值 
* URL:http://www.quwan.com/index?name=tyler 
* 参数：paramName URL参数 
* 调用方法:getParam("name") 
* 返回值:tyler 
*/ 
export function getParam(paramName) { 
   var paramValue = "", isFound = !1; 
   if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) { 
      //unescape->decodeURI
      var arrSource = decodeURI(window.location.search).substring(1, window.location.search.length).split("&"), i = 0; 
      while (i < arrSource.length && !isFound) 
         arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++ 
   } 
   return paramValue == "" && (paramValue = null), paramValue; 
}

/**
 * 返回数据原始类型
 * @param value
 * @return { 'string' | 'array' | 'boolean' | 'number' | 'object' | 'function' } type
 */
export function getRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
