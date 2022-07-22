import {getDelegationTotalRewards,getDelegatorDelegations,getStakingValidator} from '@/utils/secretjs/SDK'
export default {

  methods:{
    async getLists(address){
      let list = await getDelegatorDelegations(address)
      for(let i= 0;i<list.length;i++){
        let {delegatorAddress,validatorAddress} = list[i].delegation
        let validator = await this.getStakingValidator(delegatorAddress,validatorAddress)
        list[i].validator = validator
      }
      return list
    },
    async getStakingValidator(delegatorAddr,validatorAddr){
      let data = await getStakingValidator(delegatorAddr,validatorAddr)
      return data.validator
    }
  }
}