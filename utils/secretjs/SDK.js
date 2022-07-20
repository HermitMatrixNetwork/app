import {
  Tx
} from 'secretjs-cjgs/src/protobuf_stuff/cosmos/tx/v1beta1/tx'
import secretjs from './index.js'
let wallet = {}
//#ifdef APP-PLUS
wallet = plus.storage.getItem('_currentWallet')
//#endif

//#ifndef APP-PLUS
wallet = uni.getStorageSync('_currentWallet').data
//#endif

let walletAddress = wallet.address

//获取secret
async function getSecret() {
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  console.log('Secret', Secret)
  return Secret
}
//查询余额
export async function getBalance(address) {
  let Secret = await getSecret()
  const result = await Secret.query.bank.balance({
    address,
    denom: 'uGHM'
  })

  return result
}

//获取合约信息
export async function getContractInfo(address) {
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  try {
    const result = await Secret.query.compute.contractInfo(address)
    return result
  } catch (e) {
    return false
    //TODO handle the exception
  }
}


export async function QueryStakingValidators() {
  const result = await Secret.secretjs.query.staking.validators(pagination, status)
}

//发送其他地址
export async function SendTokentoOtherAddress(myaddress, toaddress, amount) {
  let Secret = await getSecret()
  console.log(amount)
  const result = await Secret.tx.bank.send({
    fromAddress: myaddress,
    toAddress: toaddress,
    amount: [{
      denom: 'uGHM',
      amount: amount
    }],
  }, {
    gasPriceInFeeDenom: 0.25,
    feeDenom: 'uGHM',
    gasLimit: 20000,
  })
  return result
}

//获取委托产生的总奖励
export async function getDelegationTotalRewards(delegatorAddress) {
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  console.log('Secret',Secret)
  const result = await Secret.query.distribution.delegationTotalRewards({
    delegatorAddress
  })
  console.log('xxx',result)
  return result
 
}

//委托记录
export async function getDelegatorDelegations(status) {
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  const result = await Secret.query.staking.delegatorDelegations({
    delegatorAddr: walletAddress
  })
  return result
}


//查询验证信息
export async function getValidators(status) {
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  console.log('Secret',Secret)
  const result = await Secret.query.staking.validators({ status: status||'' })
	  console.log('result',result)
  return result
}
export async function getSigningInfo(consAddress) {
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  const result = await Secret.query.slashing.signingInfo({consAddress})
  return result
}
//去委托
export async function toDelegate(data1,data2) {
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  const result = await Secret.tx.staking.delegate(data1,data2)
  return result
}