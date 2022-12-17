/*
 * @Author: Huanghaicong
 * @Date: 2022-06-22 16:27:58
 * @LastEditors: Huanghaicong
 * @FilePath: /utils/secretjs/SecretNetWorkClient.js
 * @Description: In User Settings Edit
 */
import {
  SecretNetworkClient
} from 'secretjs-hmt'

class NetworkClient {
  static async create(wallet, walletAddress, rpc, chainId = 'ghm-testnet') {
    const secretjs = await SecretNetworkClient.create({
      grpcWebUrl: rpc,
      chainId,
      wallet,
      walletAddress
    })
    return secretjs
    // return new NetworkClient(secretjs)
  }

  constructor(secretjs) {
    this.secretjs = secretjs
  }
	
  /* 
      查询用户余额
      @param { String } address 用户地址
  */
  async QueryBankBalanlce(address) {
    const result = await this.secretjs.query.bank.balance({
      address,
      denom: 'ughm'
    })
    // result.balance.amount = result.balance.amount / 1e6
    return result
  }
  /* 
      根据状态查询验证人集合
      @param { Object } pagination 分页
      @param { String } status 状态
  */
  async QueryStakingValidators(status, pagination = {}) {

    const result = await this.secretjs.query.staking.validators(pagination, status)

    // result.validators.forEach(item => {
    //   // 汇率换算
    //   let rate = item.commission.commissionRates.rate
    //   item.commission.commissionRates.rate = rate / 1e6
    // })
    return result
  }
}

export default NetworkClient
