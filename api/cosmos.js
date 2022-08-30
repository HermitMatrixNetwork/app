import Request from '@/utils/luch-request/index.js'

import baseServer from '@/config/requestConfig.js'

const http = new Request()

http.setConfig((config) => {
  /* config 为默认全局配置*/
  
  // #ifdef APP-PLUS
  config.baseURL = baseServer.cosmosServer /* 根域名 */
  // #endif
  
  // #ifndef APP-PLUS
  config.baseURL = '/cosmosServer' /* 根域名 */
  // #endif
  
  return config
})

export const txsQuery = async (events) => {
  let params = ''
  events.forEach((item, index) => {
    if (index) {
      params += '&' + item
    } else {
      params += '' + item
    }
  })
  return http.get(`${baseServer.cosmosServer}/cosmos/tx/v1beta1/txs?${params}`)
}