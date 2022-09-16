<template>
	<view>
		<custom-header tabUrl="/pages/mine/index" :title="language.text93">
			<template slot="right">
				<view class="record" @click="showEditWalletNameModal = true">
        {{ language.text95 }}</view>
			</template>
		</custom-header>

		<view class="content">
			<view class="wallet-name item">
				<view class="wallet-name-label">
					{{ language.text94 }}
				</view>
				<!-- :class="{error: invalidFields.fieldName == 'name'}" -->
				<u-input class="wallet-name-input" v-model="formData.title" :placeholder="language.text70"></u-input>
				<!-- :style="{ opacity: confirmePasswordError ? 1 : 0 }" -->
				<!--       <view class="error-tip">
            {{ language.errorTip }}
          </view> -->
			</view>

			<view class="wallet-name item">
				<view class="wallet-name-label">
					{{ language.text96 }}
				</view>
				<!-- :class="{error: invalidFields.fieldName == 'name'}" -->
				<u-input class="wallet-name-input address" v-model="formData.email" :placeholder="language.text71">
				</u-input>
				<!-- :style="{ opacity: confirmePasswordError ? 1 : 0 }" -->
				<!--          <view class="error-tip">
            {{ language.errorTip }}
          </view> -->
			</view>

			<view class="item">
				<view class="item-label">{{ language.text97 }}</view>
				<view class="item-input">
					<u--textarea v-model="formData.desc" :placeholder="language.text72" :maxlength="-1"></u--textarea>
				</view>
			</view>

			<view class="item">
				<view class="item-label">{{ language.text73 }}</view>
				<view class="item-input">
					<u-upload class="upload" :fileList="fileList" @afterRead="afterRead" @delete="deletePic" :maxCount="5">
						<view class="upload-content">
							<image src="/static/img/account/add.png"></image>
						</view>
					</u-upload>
				</view>
			</view>

			<SubmitBtn class="submit-btn" @click.native="submitBtn">{{ language.text29 }}</SubmitBtn>
		</view>

		<!-- 模态框 -->
		<u-modal class="edit-name-modal" :show="showEditWalletNameModal" :closeOnClickOverlay="false"
			:showConfirmButton="false">
			<template slot="default">
				<view>
					<view class="title">
						<!-- <text>{{ language.editName }}</text> -->
						<text>{{ language.text98 }}</text>
					</view>
					<u--input :placeholder="language.text99" border="surround" v-model="email" class="edit-name-input"
						:class="{ 'error-edit-name': editNameError }" clearable>
					</u--input>
		<!-- 			<view class="error-tip" :style="{ opacity: editNameError ? 1 : 0 }">
						邮箱格式不正确, 请出入正确的邮箱
					</view> -->
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
					<uni-button class="cancel" @click="cancel()">{{ language.text17 }}</uni-button>
					<uni-button class="confirm" @click="confirm()">{{ language.text29 }}</uni-button>
					<!--          <uni-button class="cancel" @click="cancel('name')">{{ language.cancel }}</uni-button>
          <uni-button class="confirm" @click="confirm('name')">{{ language.confirm }}</uni-button> -->
				</view>
			</template>
		</u-modal>
    <custom-notify ref="notify" class="notify" ></custom-notify>
	</view>
</template>

<script>
import language from '../language/index.js'
import SubmitBtn from '../../account/send/components/submit-btn.vue'
import {
  problemFeedback,
  queryFeedbackHistory
} from '@/api/token.js'
import { pathToBase64 } from 'image-tools'
export default {
  components: {
    SubmitBtn
  },
  data () {
    return {
      language: language[this.$cache.get('_language')],
      fileList: [],
      showEditWalletNameModal: false,
      email: '',
      editNameError: false,
      formData: {
        title: '',
        desc: '',
        email: '',
      },
      btnswitch:true
    }
  },
  methods: {
    async afterRead (file, lists, name) {
      pathToBase64(file.file.url).then(res => {
        this.fileList.push({ ...file.file, base64: res })
      })
    },
    cancel () {
      this.showEditWalletNameModal = false
    },
    async confirm () {
      if(!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email))) {
        this.$refs.notify.show('', this.language.text71)
        return
      }
      if(this.btnswitch){
        console.log('执行')
        this.btnswitch = false
        const res = await queryFeedbackHistory(this.email)
        console.log(this.btnswitch)
        console.log('历史记录', res)
        if (res.data.code == 0 && res.data.data.notices.length !== 0) {
				  uni.navigateTo({
				    url: './record',
				    events: {
				      sendMessage (res) {
				        console.log(res)
				      }
				    },
				    success (data) {
				      data.eventChannel.emit('acceptDataFromOpenerPage', res)
				    }
				  })
				  this.email = ''
        } else {
				  
				  this.showEditWalletNameModal = false
				  this.$refs.notify.show('success', this.language.text124)
        }
        this.btnswitch = true
      }
      

      // }else{
      //   this.editNameError = true
      // }  
    },
    async submitBtn () {
      if(!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.formData.email))) {
        this.$refs.notify.show('', this.language.text71)
        return
      }
      const {
        title,
        desc,
        email
      } = this.formData
      let arr = this.fileList.map(item => {
        return item.base64
      })
      let data = {
        title,
        desc,
        email,
        photos: JSON.stringify(arr)
      }
      if (!(title && desc && email)) return this.$refs.notify.show('error', this.language.text76)
      const res = await problemFeedback(data)
      console.log(res)
      if (res.data.code == 0) {
        this.$refs.notify.show('success', this.language.text77, { bgColor: '#275EF1' })

        this.formData = {
          title: '',
          desc: '',
          email: ''
        }
        this.fileList = []
      } else {
        this.$refs.notify.show('error', res.data.msg)
      }
    },
    deletePic(e){
      this.fileList.splice(e.index,1)
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

.submit-btn {
	position: absolute;
	bottom: 64rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 622rpx;
	height: 96rpx;
	border-radius: 16rpx;
	background-color: #002FA7 !important;
	font-weight: 400;
	font-size: 32rpx;
	color: #FCFCFD;
}

.notify {
  z-index: 999999999999;
}
</style>
