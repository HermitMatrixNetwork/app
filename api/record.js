import baseServer from '@/config/requestConfig.js'

import Request from '@/utils/luch-request/index.js'
import async from 'pbkdf2/lib/async'

const http = new Request()

http.setConfig((config) => {
  /* config 为默认全局配置*/

  // #ifdef APP-PLUS
  config.baseURL = baseServer.recordServer /* 根域名 */
  // #endif
  
  // #ifdef H5
  config.baseURL = '/recordServer' /* 根域名 */
  // #endif

  return config
})

export const getRecordList = (data) => {
  return http.post('/browser/txlist', {
    'chain_id': 'ghm-testnet',
    ...data
  })
}

export const getCumulativeRewardCollection = (data) => {
  return http.post('/browser/accountinfo', {
    'chain_id': 'ghm-testnet',
    ...data
  })
}