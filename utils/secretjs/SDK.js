import async from 'pbkdf2/lib/async'
import WalletCrpto from '@/utils/walletCrypto.js'

import { Tx } from 'secretjs-hmt/src/protobuf_stuff/cosmos/tx/v1beta1/tx'
import secretjs from './index.js'
let wallet = {}
//#ifdef APP-PLUS
wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
//#endif

//#ifndef APP-PLUS
wallet = uni.getStorageSync('_currentWallet').data
//#endif

let walletAddress = wallet.address

//获取secret
async function getSecret() {
  let privateKey64 = WalletCrpto.decode(wallet.privateKey64)
  let privateKey = WalletCrpto.StringToUint(privateKey64)
  let publicKey = await WalletCrpto.getPublickey(privateKey)
  wallet.privateKey = privateKey
  wallet.publicKey = publicKey
  wallet.getAccounts = new secretjs.Wallet().getAccounts.bind(wallet)
  wallet.signAmino = new secretjs.Wallet().signAmino.bind(wallet)
  wallet.signDirect = new secretjs.Wallet().signDirect.bind(wallet)
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  return Secret
}
//查询余额
export async function getBalance(address, denom = 'uGHM') {
  let Secret = await getSecret()
  const result = await Secret.query.bank.balance({
    address,
    denom
  })

  return result
}


//获取合约信息
export async function getContractInfo(address) {
  let Secret = await getSecret()
  // try {
  const result = await Secret.query.compute.contractInfo(address)
  console.log(222)
  // return result
  // } catch (e) {
  // return false
  //TODO handle the exception
  // }
}

export async function QueryStakingValidators(status) {
  let Secret = await getSecret()
  const result = await Secret.secretjs.query.staking.validators(
    pagination,
    status
  )
}

//发送其他地址
export async function SendTokentoOtherAddress(myaddress, toaddress, amount, memo = '') {
  let Secret = await getSecret()
  const result = await Secret.tx.bank.send(
    {
      fromAddress: myaddress,
      toAddress: toaddress,
      amount: [
        {
          denom: 'uGHM',
          amount: amount + ''
        }
      ]
    },
    {
      gasPriceInFeeDenom: 0.0215,
      feeDenom: 'uGHM',
      gasLimit: 20000,
      memo
    }
  )
  return result
}

export async function createViewKey(params, options) {
  let Secret = await getSecret()
  const result = await Secret.tx.snip20.createViewingKey(params, options)
  return result
}

//获取委托产生的总奖励
export async function getDelegationTotalRewards(delegatorAddress) {
  let Secret = await getSecret()
  const result = await Secret.query.distribution.delegationTotalRewards({
    delegatorAddress
  })
  return result
}

//委托记录
export async function getDelegatorDelegations(delegatorAddr) {
  let Secret = await getSecret()
  const result = await Secret.query.staking.delegatorDelegations({
    delegatorAddr
  })
  return result.delegationResponses
}

//查询验证信息
export async function getValidators(status) {
  let Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress)
  const result = await Secret.query.staking.validators({ status: status || '' })
  return result
}
export async function getSigningInfo(consAddress) {
  let Secret = await getSecret()
  const result = await Secret.query.slashing.signingInfo({
    consAddress
  })
  return result
}
//去委托
export async function toDelegate(data1, data2) {
  let Secret = await getSecret()
  const result = await Secret.tx.staking.delegate(data1, data2)
  // console.log('result', result)
  return result
}
//通过获取验证信息
export async function getStakingValidator(delegatorAddr, validatorAddr) {
  let Secret = await getSecret()
  const result = await Secret.query.staking.validator({
    delegatorAddr,
    validatorAddr
  })
  return result
}

//取消委托
export async function getDelegationRewards(delegatorAddr, validatorAddr) {
  let Secret = await getSecret()
  const result = await Secret.query.staking.validator({
    delegatorAddr,
    validatorAddr
  })
  return result
}

export async function unDelegate(data1, data2) {
  let Secret = await getSecret()
  const result = await Secret.tx.staking.undelegate(data1, data2)
  console.log(result)
  return result
}

//查询账户信息
export async function queryAccountInformation(query) {
  let Secret = await getSecret()
  const result = await Secret.query.txsQuery(query)
  return result
}

//通过hash查找
export async function queryAccountHash(hash) {
  let Secret = await getSecret()
  const result = await Secret.query.getTx(hash)
  return result
}

export async function getDelegationRecord(address) {
  let Secret = await getSecret()
  const result = await Secret.query.staking.delegatorDelegations({ delegatorAddr: address })
  return result
}

export async function getUnbondingDelegationRecord(address) {
  let Secret = await getSecret()
  const result = await Secret.query.staking.delegatorUnbondingDelegations({ delegatorAddr: address })
  const delegation = await Secret.query.staking.delegation({ delegatorAddr: address, validatorAddr: 'ghmvaloper15v4z6h7wjcrdx0pygxyvk3naaupgk6a6e5rtrl' })
  return result
}
