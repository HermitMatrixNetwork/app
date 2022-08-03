import Request from '@/utils/luch-request/index.js'

import baseServer from '@/config/requestConfig.js'

const http = new Request()

const devServer = '/cosmosServer'

// const devServer = ''


// http.setConfig((config) => {
//   /* config 为默认全局配置*/
//   config.baseURL = baseServer.cosmosServer /* 根域名 */
//   return config
// })

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