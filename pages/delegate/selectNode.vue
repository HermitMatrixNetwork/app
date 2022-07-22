<template>
	<view class="select-node">
		<view :address="address" :change:address="init"></view>
		<custom-header :title="'节点选择'" >
			<template #right>
				<u-icon name="search" size="44rpx" />
			</template>
		</custom-header>
		<view class="lists">
			<List :list="list"/>
			<no-data></no-data>
		</view>
	</view>
</template>

<script>
import mixin from './mixins/index.js'
import List from './components/List.vue'
export default {
  components: {
    List
  },
  mixins: [mixin],
  data(){
    return {
      list: [],
		
    }
  },
  mounted(){
    console.log('xxxx')
	  // this.address = this.currentWallet.address
  },
  methods: {
    initData(data){
      this.list = data.list
      console.log(data)
    }
  }
}
</script>
<script lang="renderjs" module="render">
import renderUtils from '@/utils/render.base.js'
import mixin from './mixins/render.js'
export default {
	mixins: [mixin],
	methods:{
		async init(address){
			if(address=='') return
			let list = await this.getLists(address)
			let data ={}
			data.list = list
			renderUtils.runMethod(this._$id, 'initData', data, this)
		},
	}
}
</script>

<style lang="scss" scoped>
	.lists {
		padding: 0 32rpx;
		border-top: 2rpx solid rgba(131,151,177,0.20);
	}
</style>