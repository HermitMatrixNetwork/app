import Request from '@/utils/luch-request/index.js'

import baseServer from '@/config/requestConfig.js'

const http = new Request()

http.setConfig((config) => {
  /* config 为默认全局配置*/
  
  // #ifdef APP-PLUS
  config.baseURL = baseServer.browserServer /* 根域名 */
  // #endif
  
  // #ifndef APP-PLUS
  config.baseURL = '/browserServer' /* 根域名 */
  // #endif
  
  return config
})

export const getFailRecord = async () => {
  return http.post('/browser')
} 