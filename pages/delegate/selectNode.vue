<template>
	<view class="select-node">
		<custom-header :title="'节点选择'" >
			<template #right>
				<u-icon name="search" size="44rpx" />
			</template>
		</custom-header>
		<view class="lists">
			<List />
			<no-data></no-data>
		</view>
	</view>
</template>

<script>
import List from './components/List.vue'
export default {
  components: {
    List
  },
  data(){
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
	.lists {
		padding: 0 32rpx;
		border-top: 2rpx solid rgba(131,151,177,0.20);
	}
</style>