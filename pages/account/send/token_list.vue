<template>
	<view class="choose_token">
		<custom-header :title="'代币选择'" />
		<view class="token-list">
			<TokenColumn :tokenName="item.name" v-for="item in tokenList" :key="item.name" :tokenIcon="item.icon"
				@click.native="tokenChoose(item)" :tokenColumnStyle="tokenColumnStyle">
				<template #right>
					<view>0.00</view>
					<view>0.00</view>
				</template>
			</TokenColumn>
		</view>
	</view>
</template>

<script>
import TokenColumn from './components/TokenColumn.vue'
export default {
  components: {
    TokenColumn
  },
  data() {
    return {
      tokenList: [{
        name: 'uGHM',
        num: '',
        price: '',
        icon: require('@/static/img/account/uGHM.png')
      },
      {
        name: 'USDT',
        num: '',
        price: '',
        icon: require('@/static/img/account/USDT.png')
      }
      ],
      tokenColumnStyle: {
        paddingBottom: '32rpx',
        paddingTop: '32rpx',
      },
    }
  },
  methods: {
    tokenChoose(item) {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('changeToken', item)
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
	.token-list {
		margin: 32rpx 32rpx 0;
	}
</style>
