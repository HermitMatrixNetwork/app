<template>
	<view style="width: 100%;">
		<view class="input-title">
			<text>{{title}}</text>
			<!-- @click="chooseAddress" -->
			<!-- <u-icon name="scan" size="44rpx"/> -->
			<slot name="title-icon"></slot>
		</view>
		<view>
			<input :type="type" :placeholder="placeholder" class="common-input" v-model="childValue" :maxlength="maxlength"
				:style="inputOtherStyle" @input="childValueChange" :class="warningStyleisShow?'beyondWarning':''">
			<slot name="inputRight"></slot>
		</view>
	</view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    inputOtherStyle: Object,
    warningStyleisShow: {
      type: Boolean,
      default: false
    },
    inputVal: {
      type: String,
      default: ''
    },
    maxlength:Number
  },
  data() {
    return {
      childValue: this.inputVal
    }
  },
  watch: {
    childValue() {
      this.childValue = this.inputVal
    }
  },
  methods: {
    childValueChange(v) {
      this.$emit('update:inputVal', v.target.value)
      // console.log(v.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
	.input-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 44rpx;
		font-family: PingFangSC-Medium;

		text {
			font-weight: 500;
			font-size: 28rpx;
			color: #2C365A;
			letter-spacing: 0;
		}
	}

	//输入框公共样式
	.common-input {
		width: 100%;
		border: none;
		outline: none;
		margin-top: 16rpx;
		height: 96rpx;
		background: #F2F4F8;
		border-radius: 16rpx;
		text-indent: 32rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #2C365A;
		letter-spacing: 0;
		font-family: DIN-Medium;

		.uni-input-placeholder {
			color: #8397B1;
			font-size: 28rpx !important;
		}
	}

	//超出警告
	.beyondWarning {
		background: rgba(236, 40, 40, 0.06) !important;
		border: 2rpx solid #EC2828;
		color: #EC2828 !important;
	}
</style>
