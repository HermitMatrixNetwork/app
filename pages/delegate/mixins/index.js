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
  methods:{
    dealInputValue(string) {
      if (typeof string !== 'string') return
      let obj = {
        // '\&': {
        // 	key: /&/g,
        // 	value: '&amp'
        // },
        '\<': {
          key: /</g,
          value: '&lt'
        },
        '\>': {
          key: />/g,
          value: '&gt'
        },
        '\'': {
          key: /'/g,
          value: '&lsquo'
        },
        '\"': {
          key: /"/g,
          value: '&ldquo'
        }
      }
      // for (let i in obj) {
      // 	if (string.includes(i)) {
      // 		string = string.replace(obj[i].key, obj[i].value)
      // 	}
      // }
      return string.replace(/[\>,\<,\&,\',\"]/g,'')
    }
  }
}