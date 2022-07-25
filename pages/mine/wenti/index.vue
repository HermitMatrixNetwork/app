<template>
  <view>
    <custom-header title="问题反馈">
      <template slot="right">
        <view class="record">记录</view>
      </template>
    </custom-header>

    <view class="content">
      <view class="wallet-name item">
        <view class="wallet-name-label">
          您的问题
        </view>
        <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
        <u-input class="wallet-name-input" v-model="name" placeholder="请输入您的问题"></u-input>
        <!-- :style="{ opacity: confirmePasswordError ? 1 : 0 }" -->
        <!--       <view class="error-tip">
            {{ language.errorTip }}
          </view> -->
      </view>

      <view class="wallet-name item">
        <view class="wallet-name-label">
          您的邮箱
        </view>
        <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
        <u-input class="wallet-name-input address" v-model="name" placeholder="请准确填写您的邮箱地址，邮箱错误将无法收到回复"></u-input>
        <!-- :style="{ opacity: confirmePasswordError ? 1 : 0 }" -->
        <!--          <view class="error-tip">
            {{ language.errorTip }}
          </view> -->
      </view>

      <view class="item">
        <view class="item-label">问题描述</view>
        <view class="item-input">
          <u--textarea v-model="describe" placeholder="请具体描述您的问题" :maxlength="-1"></u--textarea>
        </view>
      </view>
      
      <view class="item">
        <view class="item-label">上传截图</view>
        <view class="item-input">
          <u-upload
            class="upload"
          	:fileList="fileList"
          	@afterRead="afterRead"
          	:maxCount="5"
          >
          <view class="upload-content">
            <image src="/static/img/account/add.png"></image>
          </view>
          </u-upload>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import language from './language/index.js'
export default {
  data() {
    return {
      name: '',
      describe: '',
      language: language[this.$cache.get('_language')],
      fileList: []
    }
  },
  methods: {
    afterRead(file, lists, name) {
      console.log({ file, lists, name })
      this.fileList.push(file.file)
      console.log(this.fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
  .record {
    font-weight: 400;
    font-size: 28rpx;
    color: #1E5EFF;
  }
  .upload {
    &-content {
      width: 160rpx;
      height: 160rpx;
      background-color: #F2F4F8;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      
      /deep/ .u-upload__wrap {
        align-content: center;
      }
      image {
        width: 48rpx;
        height: 48rpx;
      }      
    }
  }
  
  .content {
    padding: 32rpx 32rpx 0 32rpx;
  }

  .item {
    margin-bottom: 32rpx;
    
    &-label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-weight: 500;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      line-height: 28rpx;
    }

    .u-textarea {
      background-color: #F2F4F8;
      height: 256rpx;
      border-radius: 16rpx !important;
      padding: 24rpx !important;

      /deep/ textarea {
        color: #2C365A !important;
        font-size: 28rpx !important;
        line-height: 48rpx !important;
        height: 208rpx !important;
        
        .input-placeholder {
          color: #8397B1 !important;
        }
      }
    }
  }

  .wallet-name {
    margin-bottom: 32rpx;

    &-label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-weight: 500;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      line-height: 28rpx;
    }

    .u-input {
      height: 96rpx;
      background-color: #F2F4F8;

      /deep/ input {
        color: #2C365A !important;
        font-size: 28rpx !important;
      }

      /deep/ .input-placeholder {
        height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        color: #8397B1 !important;
        line-height: 48rpx !important;
      }

    }

    /deep/ .address .input-placeholder {
      font-size: 24rpx !important;
    }
  }

  .wallet-name {

    /deep/ .u-input {
      border-radius: 16rpx !important;
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

  .error {
    background-color: rgba(230, 55, 51, 0.12) !important;

    /deep/ .uni-input-input {
      color: #E63733 !important;
    }

    /deep/ .uni-input-wrapper .input-placeholder {
      color: #E63733 !important;
    }
  }
</style>
