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
    'chain_id': 'Hermit',
    ...data
  })
}

export const getCumulativeRewardCollection = (data) => {
  return http.post('/browser/accountinfo', {
    'chain_id': 'Hermit',
    ...data
  })
}

//发送记录
export const getSendRecord = async (data) => {
	return http.post('/browser/txaccount_send',{
    'chain_id': 'Hermit',
    ...data
  })
}

//接受记录
export const getReceiveRecord = async (data) => {
	return http.post('/browser/txaccount_recv',{
    'chain_id': 'Hermit',
    ...data
  })
}

//委托记录
export const getDelegateRecord = async (data) => {
	return http.post('/browser/txdelegate',{
    'chain_id': 'Hermit',
    ...data
  })
}

//取消委托记录
export const getUndelegateRecord = async (data) => {
	return http.post('/browser/txundelegate',{
    'chain_id': 'Hermit',
    ...data
  })
}

//领取奖励交易记录
export const getWithdrawRecord = async (data) => {
  return http.post('/browser/txwithdraw', {
	  'chain_id':'Hermit',
	  ...data
  })
}

//全部交易记录
export const getAllRecord = async (data) => {
	return http.post('/browser/txaccount',{
    'chain_id': 'Hermit',
    ...data
  })
}