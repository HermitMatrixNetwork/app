import secretjs from './index.js'
let wallet = {}
//#ifdef APP-PLUS
wallet= plus.storage.getItem('_currentWallet')
//#endif
 
//#ifndef APP-PLUS
wallet = uni.getStorageSync('_currentWallet').data
//#endif

let walletAddress = wallet.address

//获取secret
async function getSecret(){
	  let Secret= await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  console.log('Secret',Secret)
  return Secret
}
//查询余额
export async function getBalance(address){
  let Secret = await getSecret()
  const result = await Secret.query.bank.balance({
	  address,
	  denom: 'uGHM'
  })
	
  return result
}

//获取合约信息
export async function getContractInfo(address){
  let Secret = await getSecret()
  try{
    const result = await Secret.query.compute.contractInfo(address)
    return result
  }catch(e){
    return false
    //TODO handle the exception
  }
 
}

export async function QueryStakingValidators(){
	 const result = await Secret.secretjs.query.staking.validators(pagination, status)
}
