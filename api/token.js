import baseServer from '@/config/requestConfig.js'

import Request from '@/utils/luch-request/index.js'
import async from 'pbkdf2/lib/async'

const http = new Request()

http.setConfig((config) => {
  /* config 为默认全局配置*/

  // #ifdef APP-PLUS
  config.baseURL = baseServer.goServer /* 根域名 */
  // #endif
  
  // #ifdef H5
  config.baseURL = '/goServer' /* 根域名 */
  // #endif

  return config
})

// 根据合约搜索代币
export const searchCoin = async (contractAddress) => {
  return http.get(`/search_assets/${contractAddress}`)
}

export const getLinkList = async () => {
  return http.get('/message/get_contact_info')
}

export const getHotList = async () => {
  return http.get('/hot/hotlist')
}

//获取所有通知信息
export const getNotice = async() => {
  return http.get('/message/get_notices')
}

//问题反馈
export const problemFeedback = async(data) => {
  return http.post('/message/feedback_problem',{...data})
}

//获取版本号
export const getVersion = async () => {
  return http.get('/message/get_last_version')
}

//通过email查询历史反馈
export const queryFeedbackHistory = async (email) => {
  return http.post('/message/feedback_problem_history',{email})
}

export const getHelp = async () => {
  return http.get('/message/get_help')
}

export const getBannerList = async () => {
  return http.get('/message/get_banner')
} 
