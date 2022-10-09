import {
  getDelegationTotalRewards,
  getDelegatorDelegations,
  getStakingValidator,
  getRewards
} from '@/utils/secretjs/SDK'
import mainCoin from '@/config/index.js'

export default {

  methods: {
    async getLists(address) {
      let list = await getDelegatorDelegations(address)
      for (let i = 0; i < list.length; i++) {
        let {
          delegatorAddress,
          validatorAddress
        } = list[i].delegation
        await Promise.all([
          this.getStakingValidator(delegatorAddress, validatorAddress),
          getRewards(delegatorAddress, validatorAddress)
        ]
        ).then(res => {
          console.log('请求结束--2')
          list[i].validator = res[0]
          list[i].rewards = res[1].rewards[0]
        })
      }
      return list
    },
    async getStakingValidator(delegatorAddr, validatorAddr) {
      let data = await getStakingValidator(delegatorAddr, validatorAddr)
      return data.validator
    }
  }
}
