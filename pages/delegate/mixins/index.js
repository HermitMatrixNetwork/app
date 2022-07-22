import {
  sliceAddress
} from '@/utils/filters.js'
export default {
  filters: {
	  sliceAddress
  },
  data(){
    return {
      address:'',
      currentWallet: this.$cache.get('_currentWallet'),
    }
  },
  mounted(){
	  this.address = this.currentWallet.address
  },
}