import baseServer from '@/config/requestConfig.js'

const devServer = '/goServer'

// const devServer = ''

// http.setConfig((config) => {
//   /* config 为默认全局配置*/
//   config.baseURL = baseServer.goServer /* 根域名 */
//   return config
// })

// 根据合约搜索代币
export const searchCoin = async (contractAddress) => {
  return uni.request({
    method: 'GET',
    url: `${devServer}/search_assets/${contractAddress}`
  })
}