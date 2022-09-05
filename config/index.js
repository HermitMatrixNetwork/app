import minersLanguage from '@/components/miners-column/language/index.js'

// let language
// export function updateLanguage() {
//   //#ifdef APP-PLUS
//   language = JSON.parse(plus.storage.getItem('_language')).data.data
//   //#endif
    
//   //#ifndef APP-PLUS
//   language = uni.getStorageSync('_language').data
//   //#endif
  
//   console.log(language)
// }

// updateLanguage()

const mainCoin = {
  ID: 0,
  alias_name: 'GHM',
  full_name: 'Hermit Matrix Network',
  logo: '/static/img/account/uGHM.png',
  contract_address: '',
  decimals: 10 ** 6,
  delegateDecimals: 10 ** 24,
  view_key: '',
  official: 'https://ghmchain.org',
  contract_address: '',
  loadingBalance: true,
  desc: '' //发布信息
}

const MINERS_GAS = 20000

const DEFAULT_RPC = {
  name: 'ghmdev',
  chainId: 'ghmdev',
  link: 'http://167.179.118.118:9091'
}

const getCurrentRpc = () => {
  let rpc 
  try {
    //#ifdef APP-PLUS
    rpc = JSON.parse(plus.storage.getItem('_currentRpc')).data.data
    //#endif
    
    //#ifndef APP-PLUS
    rpc = uni.getStorageSync('_currentRpc').data
    //#endif
  } catch {
    rpc = DEFAULT_RPC.link
  }

  
  if (!rpc) {
    rpc = DEFAULT_RPC.link
  }
  
  return rpc
}

export default mainCoin
export { MINERS_GAS, DEFAULT_RPC, getCurrentRpc }