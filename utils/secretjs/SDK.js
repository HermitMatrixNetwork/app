import WalletCrpto from '@/utils/walletCrypto.js'

import secretjs from './index.js'
import mainCoin from '@/config/index.js'

import {
	getCurrentRpc
} from '@/config/index.js'

let walletMap = {}
let queue = 0
//获取secret
export function getSecretUt(wallet, address, rpc) {
	return new Promise((reslove, reject) => {
		if (!(address in walletMap)) {
			walletMap[address] = {}
		}
		if (rpc == walletMap[address].rpc) {
			reslove(walletMap[address].Secret)
		}
		if (!walletMap[address].wallet) {
			let Wallet = new secretjs.Wallet()
			wallet.privateKey = WalletCrpto.StringToUint(WalletCrpto.decode(wallet.privateKey64))
			wallet.publicKey = WalletCrpto.getPublickey(wallet.privateKey)
			wallet.getAccounts = Wallet.getAccounts.bind(wallet)
			wallet.signAmino = Wallet.signAmino.bind(wallet)
			wallet.signDirect = Wallet.signDirect.bind(wallet)
		}
		let Secret = secretjs.SecretNetworkClient.create(wallet, address, rpc)
		walletMap[address] = {
			rpc,
			Secret,
			wallet
		};
		reslove(Secret)
	})
}

export function getSecret() {
	let wallet = {}
	//#ifdef APP-PLUS
	wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
	//#endif

	//#ifndef APP-PLUS
	wallet = uni.getStorageSync('_currentWallet').data
	//#endif
	let address = wallet.address
	let rpc = getCurrentRpc()
	if (address in walletMap) {
		return getSecretUt(wallet, address, rpc)
	}
	if (++queue == 1) {
		setTimeout(() => {
			queue = 0
		}, 2000)
		return getSecretUt(wallet, address, rpc)
	}
	return new Promise((reslove, reject) => {
		setTimeout(() => {
			reslove(getSecretUt(wallet, address, rpc))
		}, 200)
	})
}


//查询余额
export async function getBalance(address) {
	let Secret = await getSecret()
	const result = await Secret.query.bank.balance({
		address,
		denom: 'ughm'
	})
	return result
}


//获取合约信息
export async function getContractInfo(address) {
	let Secret = await getSecret()
	try {
		const result = await Secret.query.compute.contractInfo(address)
		return result
	} catch (e) {
		return false
	}
}

export async function QueryStakingValidators(status) {
	let Secret = await getSecret()
	const result = await Secret.secretjs.query.staking.validators(
		pagination,
		status
	)
}

//发送其他地址
export async function SendTokentoOtherAddress(myaddress, toaddress, amount, memo = '', gas, gasPrice) {
	let Secret = await getSecret()
	const result = await Secret.tx.bank.send({
		fromAddress: myaddress,
		toAddress: toaddress,
		amount: [{
			denom: 'ughm',
			amount: amount + ''
		}]
	}, {
		gasPriceInFeeDenom: gasPrice,
		feeDenom: 'ughm',
		gasLimit: gas,
		memo
	})
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
	let Secret = await getSecret()
	const result = await Secret.query.staking.validators({
		status: status || ''
	})
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
export async function toDelegate(data, memo = '', gas, gasPrice) {
	let Secret = await getSecret()
	const result = await Secret.tx.staking.delegate(data, {
		gasPriceInFeeDenom: gasPrice,
		feeDenom: 'ughm',
		gasLimit: gas,
		memo
	})
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

export async function unDelegate(data, memo = '', gas, gasPrice) {
	let Secret = await getSecret()
	const result = await Secret.tx.staking.undelegate(data, {
		gasPriceInFeeDenom: gasPrice,
		feeDenom: 'ughm',
		gasLimit: gas,
		memo
	})
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
	const result = await Secret.query.staking.delegatorDelegations({
		delegatorAddr: address
	})
	return result
}

export async function getUnbondingDelegationRecord(address) {
	let Secret = await getSecret()
	const result = await Secret.query.staking.delegatorUnbondingDelegations({
		delegatorAddr: address
	})
	return result
}

export async function setViewKey(data, gas, gasPrice) {
	let Secret = await getSecret()
	let codeHash = data.codeHash
	if (!data.codeHash) {
		codeHash = await Secret.query.snip20.contractCodeHash(data.contract_address)
	}
	const result = await Secret.tx.snip20.setViewingKey({
		sender: data.address,
		contractAddress: data.contract_address,
		codeHash,
		msg: {
			set_viewing_key: {
				key: data.view_key
			}
		}
	}, {
		gasPriceInFeeDenom: gasPrice,
		feeDenom: 'ughm',
		gasLimit: gas
	})
	return result
}


export async function getOtherBalance(data) {
	let Secret = await getSecret()
	const result = await Secret.query.snip20.getBalance(data)
	return result
}

export async function getCodeHash(data) {
	let Secret = await getSecret()
	const codeHash = await Secret.query.snip20.contractCodeHash(data)
	return codeHash
}

export async function getOtherTransationHistory(data, pagination, token) {
	let Secret = await getSecret()
	let codeHash = data.contract.codeHash
	if (!token.codeHash) {
		codeHash = await Secret.query.snip20.contractCodeHash(token.contract_address)
	}
	data.contract.codeHash = codeHash
	const result = Secret.query.snip20.getTransactionHistory({
		...data,
		page: pagination.page - 1,
		page_size: pagination.page_size

	})
	return result
}

export const getTokenDecimals = async (data) => {
	let Secret = await getSecret()
	const result = await Secret.query.snip20.getSnip20Params(data)
	return result
}

export const transferOtherToken = async (data, memo = '', gas, gasPrice) => {
	let Secret = await getSecret()
	const result = await Secret.tx.snip20.transfer(data, {
		gasPriceInFeeDenom: gasPrice,
		feeDenom: 'ughm',
		memo,
		gasLimit: gas
	})
	return result
}

// 根据指定验证器查相应信息
export const getDelegatorHistory = async (data) => {
  let Secret = await getSecret()
  const result = await Secret.query.txsQuery(`message.sender='${Secret.wallet.address}' AND delegate.validator='ghmvaloper15v4z6h7wjcrdx0pygxyvk3naaupgk6a6e5rtrl'`)
  // console.log(result)
}

export const alla = async (data) => {
	let Secret = await getSecret()
	const result = await Secret.query.txsQuery(
		`message.sender='${Secret.wallet.address}' AND message.module='staking'`)
	console.log(result)
}

export const getRewards = async (delegatorAddress, validatorAddress) => {
	let Secret = await getSecret()
	const result = await Secret.query.distribution.delegationRewards({
		delegatorAddress,
		validatorAddress
	})
	return result
}

export const withdrawDelegatorReward = async (data, gas, gasPrice) => {
	let Secret = await getSecret()
	const result = await Secret.tx.distribution.withdrawDelegatorReward(data, {
		gasPriceInFeeDenom: gasPrice,
		feeDenom: 'ughm',
		gasLimit: gas
	})
	return result
}

export const setWithdrawAddress = async (data, gas, gasPrice) => {
	let Secret = await getSecret()
	const result = await Secret.tx.distribution.setWithdrawAddress(data, {
		gasPriceInFeeDenom: gasPrice,
		feeDenom: 'ughm',
		gasLimit: gas
	})
	return result
}

export const getWithdrawAddress = async (address) => {
	let Secret = await getSecret()
	const result = await Secret.query.distribution.delegatorWithdrawAddress({
		delegatorAddress: address
	})

	return result
}

export const getMainCoinBalance = async (address) => {
	let Secret = await getSecret()

	const result = await Secret.query.bank.balance({
		address,
		denom: 'ughm'
	})

	let balance = result.balance.amount

	balance = balance / mainCoin.decimals

	return balance
}

export const queryContract = async (contractAddress) => {
  let Secret = await getSecret()
  const result = await Secret.query.compute.queryContract({
    contractAddress,
    query: { token_info: {} }
  })
  return result
}
