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
  // logo: '/static/img/account/uGHM.png',
  logo: 'data:image/png;base64,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',
  contract_address: '',
  decimals: 10 ** 6,
  delegateDecimals: 10 ** 24,
  view_key: '',
  official: 'https://www.hermit.network',
  contract_address: '',
  loadingBalance: true,
  desc: '' //发布信息
}

const MINERS_GAS = 20000

const DEFAULT_RPC = {
  name: 'ghm-testnet',
  chainId: 'ghm-testnet',
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