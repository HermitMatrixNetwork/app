<template>
  <u-modal class="edit-name-modal" :show="showModal" :closeOnClickOverlay="false"
    :showConfirmButton="false">
    <template slot="default">
      <view>
        <view class="title">
          <text>{{ title }}</text>
        </view>
        <u--input type="number" :placeholder="placeholder" border="surround" v-model="inputValue" class="edit-name-input"
          :class="{ 'error-edit-name': editError }" @change="change" clearable>
        </u--input>
        <view class="error-tip" :style="{ opacity: editError ? 1 : 0 }">
          {{ errorTip }}
        </view>
      </view>
    </template>
    <template slot="confirmButton">
      <view class="confirm-button">
        <uni-button class="cancel" @click="cancel">{{ language.text17 }}</uni-button>
        <uni-button class="confirm" @click="confirm">{{ language.text29 }}</uni-button>
      </view>
    </template>
  </u-modal>
</template>

<script>
import language from '../language/index.js'
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '标题'
    },
    placeholder: {
      type: String,
      default: '占位符'
    },
    value: {
      type: [String, Number],
      required: true
    },
    errorTip: {
      type: String,
      default: '错误提示'
    }
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      editError: false,
      inputValue: Number(this.value) == 0 ? '' : this.value
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm', this.inputValue)
    },
    change(val) {
      val < 0 ? this.editError = true : this.editError = false
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-name-modal {
    /deep/ .u-modal {
      width: 686rpx !important;
    }

    /deep/ .u-modal__content {
      display: block !important;
      padding: 0 32rpx 0;
    }

    .title {
      height: 32rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      line-height: 32rpx;
      margin-bottom: 64rpx;
    }

    /deep/ .edit-name-input {
      background-color: #F2F4F8;
      height: 96rpx;

      .uni-input-input {
        height: 48rpx;
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
        line-height: 48rpx;
      }

      .input-placeholder {
        height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        color: #8397B1 !important;
        line-height: 48rpx !important;
      }
    }

    .error-tip {
      height: 24rpx;
      margin-top: 16rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #EC2828;
      line-height: 24rpx;
    }

    /deep/ .u-modal__button-group--confirm-button {
      padding: 0;
    }

    .confirm-button {
      display: flex;
      margin-top: 40rpx;
      margin-bottom: 48rpx;
      padding: 0 32rpx;
      justify-content: space-between;

      uni-button {
        width: 292rpx;
        height: 96rpx;
        font-weight: 400;
        font-size: 32rpx;
        line-height: 96rpx;
        color: #FCFCFD;
        border-radius: 16rpx;
      }

      .confirm {
        background-color: #002FA7;
      }

      /deep/ .cancel {
        color: #8397B1;
        background-color: rgba(0, 47, 167, 0.00);
        border: 1px solid rgba(131, 151, 177, 0.30);

        &:after {
          border: 0 !important
        }
      }
    }
  }
</style>
