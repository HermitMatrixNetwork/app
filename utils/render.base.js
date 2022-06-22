/**
 * 执行主对象方法
 * 
 * @param {int} vmId
 * @param {String} methodName
 * @param {Object} params
 */
let runMethod = (vmId, methodName, params, that) => {
  if (that && methodName in that) {
    that[methodName](params);
  }
  //#ifdef APP-PLUS
  UniViewJSBridge.publishHandler('onWxsInvokeCallMethod', {
    cid: vmId,
    method: methodName,
    args: params
  })
  //#endif	
}

/**
 * 获取当前页面对象
 */
function getCurrentView() {
  let pages = getCurrentPages();
  return pages[pages.length - 1];
}

export default {
  runMethod,
  getCurrentView
}
