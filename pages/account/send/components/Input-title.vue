<template>
  <view style="width: 100%;">
    <view class="input-title">
      <text :class="{ 'blod' : isBlod }">{{title}}</text>
      <!-- @click="chooseAddress" -->
      <!-- <u-icon name="scan" size="44rpx"/> -->
      <slot name="title-icon"></slot>
    </view>
    <view :class="inputContainerStyle">
      <input v-if="!isTextarea" :type="type" :placeholder="placeholder" class="common-input input-content" v-model="childValue"
        :maxlength="maxlength" :style="inputOtherStyle"
        :class="[warningStyleisShow?'beyondWarning':'']"
        :disabled="disabled"
      />

      <u--textarea v-model="childValue" :placeholder="placeholder" autoHeight v-else class="textarea" maxlength="60" :disabled="disabled">
      </u--textarea>
      <slot name="inputRight"></slot>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
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
      required: true
    },
    maxlength: Number,
    isTextarea: {
      type: Boolean,
      default: false
    },
    isBlod: {
      type: Boolean,
      default: false
    },
    placeholderStyle: {
      type: Object | String,
      default: ''
    },
    inputContainerStyle: {
      type: Object | String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      childValue: this.inputVal,
    }
  },
  watch: {
    childValue: {
      handler(newVal) {
        this.$emit('update:inputVal', newVal)
      }
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
    margin-bottom: 16rpx;

    text {
      font-weight: 600;
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
      // #ifdef APP-PLUS
      font-size: 28rpx;
      color: #8397B1 !important;
      font-size: 28rpx !important;
      // #endif

    }
  }

  //超出警告
  .beyondWarning {
    background: rgba(236, 40, 40, 0.06) !important;
    border: 2rpx solid #EC2828;
    color: #EC2828 !important;
  }

  //自动换行input
  .textarea {
    /deep/ .u-textarea__field {
      line-height: 60rpx !important;
      font-size: 28rpx;
      color: #2C365A;
    }

    /deep/ .uni-textarea-wrapper {
      width: 560rpx !important;
    }
  }

  .u-textarea {
    background: #F2F4F8 !important;
    margin-top: 16rpx;
    padding: 18rpx 32rpx;

    .uni-textarea-placeholder {
      color: #8397B1 !important;
      font-size: 28rpx !important;
    }
  }

  .u-textarea--radius {
    border-radius: 16rpx;
  }

  .blod {
    font-weight: 600 !important;
  }
  
  .input-content::placeholder {
    // #ifdef H5
    font-size: 28rpx;
    color: #8397B1 !important;
    line-height: 96rpx !important;
    // #endif
  }
</style>
