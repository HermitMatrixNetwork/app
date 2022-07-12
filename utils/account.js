import secretjs from './secretjs/index.js'


let wallet = uni.getStorageSync('_currentWallet')
let walletAddress = wallet.data.address
async function getSecret(){
	  let Secret= await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  return Secret
}

export async function getBalance(address){
  let Secret = await getSecret()
  const result = await Secret.secretjs.query.bank.balance({
	  address,
	  denom: 'uGHM'
  })
  return result
}

export async function QueryStakingValidators(){
	 const result = await Secret.secretjs.query.staking.validators(pagination, status)
}
