<template>
	<view class="address_pages">
		<custom-header :title="'添加地址'" :customStyle="headerStyle">
			<template #right>
				<text class="save" @click="saveAddress">保存</text>
			</template>
		</custom-header>
		<view class="main">
			<view style="position: relative;">
				<InputTitle :title="'地址信息'" :placeholder="'请输入地址'" :isTextarea="true" ref="textarea">
					<template #inputRight>
						<view class="scan">
							<u-icon :name="require('@/static/img/account/mipmap-mdpi_saoma.png')" size="44rpx" @click="scanCode"></u-icon>
						</view>
					</template>
				</InputTitle>
			</view>
			<InputTitle :title="'钱包名称'" :placeholder="'设置钱包名称（不超过10个字符）'" :inputVal.sync="wolletName"></InputTitle>
			<InputTitle :title="'描述'" :placeholder="'描述（选填，不超过20个字符）'" :inputVal.sync="wolletDescribe"></InputTitle>
		</view>
	</view>
</template>

<script>
import InputTitle from './send/components/Input-title.vue'
export default {
  components: {
    InputTitle
  },
  data() {
    return {
      wolletName: '', //钱包名称
      wolletDescribe: '', //钱包描述
      headerStyle: {
			  background: '#FFFFFF'
      },
    }
  },
  methods: {
    saveAddress() {
      console.log(this.$refs.textarea.textAreaValue) //获取输入的钱包地址
      console.log(this.address)
    },
    scanCode() { //扫码
		  let that = this
		  uni.scanCode({
		    onlyFromCamera: false,
		    scanType: ['qrCode'],
		    success(res) {
		      console.log('条码内容：' + res.result)
		      that.$refs.textarea.textAreaValue = res.result
		    },
		  })
    },
  }
}
</script>

<style lang="scss" scoped>
	.address_pages {
		height: 100vh;
		background: #F4F6FA;
	}

	.main {
		padding: 32rpx 32rpx 48rpx;
		background: #FFFFFF;
		view{
			&:nth-child(2),&:nth-child(3){
				margin-top: 32rpx;
			}
		}
	}

	.save {
		font-family: PingFangSC-Regular;
		font-weight: 400;
		font-size: 28rpx;
		color: #1E5EFF;
		letter-spacing: 0;
		line-height: 28rpx;
	}
	
	.scan{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 32rpx;
	}
</style>
