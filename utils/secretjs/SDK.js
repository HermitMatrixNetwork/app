// import WalletCrpto from '@/utils/walletCrypto.js'

// import secretjs from './index.js'
// import mainCoin from '@/config/index.js'

// import {
// 	getCurrentRpc
// } from '@/config/index.js'


let Secret
// let oldRpc = getCurrentRpc()
let arr = false
//获取secret
export function getSecret() {
	return new Promise((reslove, reject) => {
		let wallet = {}
		
		//#ifdef APP-PLUS
		wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
		//#endif

		//#ifndef APP-PLUS
		wallet = uni.getStorageSync('_currentWallet').data
		//#endif
		let rpc = getCurrentRpc()
		if (arr) {
			// console.log('Secret RETURN');
			reslove(Secret)
		}	
		oldRpc = rpc
		let walletAddress = wallet.address
		let privateKey64 = WalletCrpto.decode(wallet.privateKey64)
		let privateKey = WalletCrpto.StringToUint(privateKey64)
		let publicKey = WalletCrpto.getPublickey(privateKey)
		wallet.privateKey = privateKey
		wallet.publicKey = publicKey
		wallet.getAccounts = new secretjs.Wallet().getAccounts.bind(wallet)
		wallet.signAmino = new secretjs.Wallet().signAmino.bind(wallet)
		wallet.signDirect = new secretjs.Wallet().signDirect.bind(wallet)
		Secret = secretjs.SecretNetworkClient.create(wallet, walletAddress, rpc)
		arr = true
		reslove(Secret)
	})
}
// export async function getSecret() {
// 	let wallet = {}
// 	//#ifndef APP-PLUS
// 	wallet = uni.getStorageSync('_currentWallet').data
// 	//#endif


// 	let rpc = getCurrentRpc()
// 	// if (arr) {
// 	// 	return Secret
// 	// }
// 	oldRpc = rpc
// 	tempWallet = tempWallet ? tempWallet : new secretjs.Wallet()
// 	let walletAddress = wallet.address
// 	let privateKey64 = WalletCrpto.decode(wallet.privateKey64)
// 	let privateKey = WalletCrpto.StringToUint(privateKey64)
// 	let publicKey = await WalletCrpto.getPublickey(privateKey)
// 	wallet.privateKey = privateKey
// 	wallet.publicKey = publicKey
// 	let tempWallet = new secretjs.Wallet()
// 	wallet.getAccounts = tempWallet.getAccounts.bind(wallet)
// 	wallet.signAmino = tempWallet.signAmino.bind(wallet)
// 	wallet.signDirect = tempWallet.signDirect.bind(wallet)
// 	Secret = await secretjs.SecretNetworkClient.create(wallet, walletAddress, rpc)
// 	arr = true
// 	return Secret
// }


// getSecret()

//查询余额
export async function getBalance(address, denom = 'ughm') {
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
	// const result = querySnip.getTransactionHistory({
	//       contract: { address: 'ghm18hxq6kypae4arzxda4dvuwdr0p23rrg5pqffx9', codeHash: '188609c5d1fee7b0917d4fedccd04bb8286181bd45e2f77ccac364cda7f164c5' },
	//       address: wallet.address,
	//       auth: { key: "hello kitty" },
	//       page_size: 10,
	//       page: 1
	// })
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
	const result = await Secret.query.txsQuery(
		`message.sender='${Secret.wallet.address}' AND delegate.validator='ghmvaloper15v4z6h7wjcrdx0pygxyvk3naaupgk6a6e5rtrl'`
		)
	console.log(result)
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

export const getMainCoinBalance = async (address, denom = 'ughm') => {
	let Secret = await getSecret()

	const result = await Secret.query.bank.balance({
		address,
		denom
	})

	let balance = result.balance.amount

	balance = balance / mainCoin.decimals

	return balance
}
