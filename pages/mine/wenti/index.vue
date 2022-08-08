<template>
  <view>
    <custom-header title="问题反馈">
      <template slot="right">
        <view class="record" @click="showEditWalletNameModal = true">记录</view>
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
    
    <!-- 修改钱包名字模态框 -->
    <u-modal class="edit-name-modal" :show="showEditWalletNameModal" :closeOnClickOverlay="false"
      :showConfirmButton="false">
      <template slot="default">
        <view>
          <view class="title">
            <!-- <text>{{ language.editName }}</text> -->
            <text>查询邮箱</text>
          </view>
          <u--input placeholder="输入邮箱查询" border="surround" v-model="email" class="edit-name-input"
            :class="{ 'error-edit-name': editNameError }" clearable>
          </u--input>
          <view class="error-tip" :style="{ opacity: editNameError ? 1 : 0 }">
            邮箱格式不正确, 请出入正确的邮箱
          </view>
          <!-- <u--input :placeholder="language.editNamePlaceholder" border="surround" v-model="name" class="edit-name-input"
            :class="{ 'error-edit-name': editNameError }" clearable>
          </u--input>
          <view class="error-tip" :style="{ opacity: editNameError ? 1 : 0 }">
            {{ language.editNameErrorTip }}
          </view> -->
        </view>
      </template>
      <template slot="confirmButton">
        <view class="confirm-button">
          <uni-button class="cancel" @click="cancel()">取消</uni-button>
          <uni-button class="confirm" @click="confirm()">确认</uni-button>
<!--          <uni-button class="cancel" @click="cancel('name')">{{ language.cancel }}</uni-button>
          <uni-button class="confirm" @click="confirm('name')">{{ language.confirm }}</uni-button> -->
        </view>
      </template>
    </u-modal>
    
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
      fileList: [],
      showEditWalletNameModal: false,
      email: '',
      editNameError: false
    }
  },
  methods: {
    afterRead(file, lists, name) {
      console.log({ file, lists, name })
      this.fileList.push(file.file)
      console.log(this.fileList)
    },
    cancel() {
      this.showEditWalletNameModal = false
    },
    confirm() {
      
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
      font-weight: 500;
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
        font-weight: 500;
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
