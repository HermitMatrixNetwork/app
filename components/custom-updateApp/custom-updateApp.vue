<template>
  <view class="content" v-if="show">
    <!-- <image src='/static/icon/update_logo.png'/> -->
    <view class="image"></view>
    <view class="title">
      <text>V{{ version }}{{ language.text83 }}</text>
    </view>

    <view class="describe">
      <text class="desc" v-if="!downloading">
        {{ describe }}
      </text>
      <u-line-progress v-else :percentage="progress" showText />
    </view>

    <view class="control">
      <u-button class="cancel" @click="cancel">{{ language.text84 }}</u-button>
      <u-button class="upgrade" @click="upgrade">{{ language.text85 }}</u-button>
    </view>
  </view>
  <view v-else></view>
</template>

<script>
import {
  getVersion
} from '@/api/token.js'
import language from '@/pages/mine/language/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      version: '',
      describe: '',
      downUrl: '',
      downloading: false,
      show: false,
      progress: 0,
    }
  },
  props: {
    tip: {
      type: Boolean,
      default: false
    },
    checkImmediate: {
      type: Boolean,
      default: false
    },
    latestVersion: {
      type: String,
      default: ''
    }
  },
  created() {
    // #ifdef APP-PLUS
    if (this.checkImmediate) {
      this.checkUpdate()
    }
    this.immediateCheck()
    // #endif
  },
  methods: {
    async immediateCheck() {
      const res = (await getVersion()).data.data.version
      plus.runtime.getProperty(plus.runtime.appid, (inf) => {
        const {
          versionCode, 
          version
        } = inf
        // res.version = '100'
        if (Number(versionCode) >= Number(res.version)) {
          if (this.tip) {
            this.$emit('update:latestVersion', version)
          }
        } else {}
      })
    },
    async checkUpdate() {
      const res = (await getVersion()).data.data.version
      plus.runtime.getProperty(plus.runtime.appid, (inf) => {
        const {
          versionCode, 
          version
        } = inf
        // res.version = '100'
        if (Number(versionCode) >= Number(res.version)) {
          if (this.tip) {
            this.$emit('update:latestVersion', version)
            uni.showToast({
              // 已是最新版本，无需更新！
              title: this.language.text115,
              icon: 'none'
            })
          }
        } else {
          this.version = res.version_name
          this.describe = res.remark
          this.downUrl = res.url
          this.$emit('update:updating', true)
          this.show = true
        }
        
        this.$emit('update:checking', false)
      })
    },
    cancel() {
      this.$emit('update:updating', false)
      this.show = false
    },
    async upgrade() {
      // #ifdef APP-PLUS

      let lastProgressValue = 0
      let dtask = plus.downloader.createDownload(this.downUrl, {
        filename: '_doc/update/'
      },
      (download, status) => {
        if (status == 200) {
          console.log('正在安装', {
            download,
            status
          })
          plus.runtime.install(download.filename, {}, function() {
            console.log('安装完成', {
              download,
              status
            })
          }, function(e) {
            console.log('安装文件失败', {
              download,
              status,
              e
            })
            plus.nativeUI.alert('安装文件失败[' + e.code + ']：' + e.message)
          })
        } else {
          console.log('文件下载失败')
        }
      })
      dtask.start()
      this.downloading = true  
      dtask.addEventListener('statechanged', (task, status) => {
        switch (task.state) {
        case 1: // 开始
          res.change({
            progressValue: 0,
            progressTip: '准备下载...',
            progress: true
          })
          break
        case 2: // 已连接到服务器  
          res.change({
            progressValue: 0,
            progressTip: '开始下载...',
            progress: true
          })
          break
        case 3:
          this.progress = parseInt(task.downloadedSize / task.totalSize * 100)
          console.log('进度条', this.progress)
          if (this.progress - lastProgressValue >= 2) {
            lastProgressValue = progress
            // res.change({
            //   progressValue: progress,
            //   progressTip: '已下载' + progress + '%',
            //   progress: true
            // })
          }

          break
        }
      })
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    position: fixed;
    width: 686rpx;
    padding-bottom: 32rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 16rpx;
    z-index: 999999999999999999;

    .title {
      padding-left: 60rpx;
      padding-top: 78rpx;

      text {
        font-weight: 600;
        font-size: 36rpx;
        font-family: PingFangSC-Medium;
        color: #2C365A;
      }
    }

    .describe {
      padding-left: 60rpx;
      padding-right: 68rpx;
      padding-top: 32rpx;

      .desc {
        font-family: PingFangSC-Regular;
        font-size: 28rpx;
        color: #8397B1;
        line-height: 48rpx;
      }
    }
  }

  .control {
    display: flex;
    justify-content: space-between;
    margin-top: 64rpx;
    padding: 0 32rpx;

    .u-button {
      width: 292rpx;
      height: 96rpx;
      border-radius: 16rpx;
      font-family: PingFangSC-Regular;
      font-size: 32rpx;
      line-height: 96rpx;
      color: #8397B1;
    }

    .cancel {
      border: 2px solid rgba(131, 151, 177, 0.30);
    }

    .upgrade {
      color: #FCFCFD;
      background-color: #002FA7;
    }
  }

  .image {
    position: absolute;
    right: 0;
    transform: translateY(-50%);
    width: 322rpx;
    height: 332rpx;
    background: url('/static/icon/update_logo.png');
  }
</style>
