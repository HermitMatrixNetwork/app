<template>
  <view class="language-set">
    <custom-header relaunchUrl="/pages/mine/index" :title="language.text55">
      <template slot="right">
        <view class="save" @click="save">
          <text>{{ language.text56 }}</text>
        </view>
      </template>
    </custom-header>
    
    
    <view class="content">
      <view class="item" v-for="(item, index) in languageList" :key="index" @click="clickItem(item.value)">
        <text>{{ item.label }}</text>
        <image src="/static/img/mine/check.png" v-show="currentLanguage == item.value" style="width: 44rpx; height: 44rpx;"></image>
      </view>
    </view>
    
    <u-toast ref="uToast"></u-toast>
    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
// import { updateLanguage } from '@/config/index.js'
import language from '../language/index.js'
export default {
  data() {
    return {
      languageList: [{
        label: 'English',
        value: 'EN'
      },{
        label: '繁体中文',
        value: 'CT'
      },{
        label: '简体中文',
        value: 'CN'
      }],
      language: language[this.$cache.get('_language')],
      currentLanguage: this.$cache.get('_language')
    }
  },
  methods: {
    clickItem(val) {
      this.currentLanguage = val
    },
    save() {
      this.$cache.set('_language', this.currentLanguage, 0)
      // updateLanguage()
      this.$refs.notify.show('', language[this.$cache.get('_language')].text60, { bgColor: '#275EF1' })
			this.language = language[this.$cache.get('_language')]
    },
  },
	onBackPress(event) {
		if (event.from == 'backbutton') {
			uni.reLaunch({
				url: '/pages/mine/index'
			})
			return true
		}
	}
}
</script>

<style lang="scss" scoped>
.language-set {
  height: 100vh;
  background-color: #F4F6F9;
}
.save {
  font-weight: 400;
  font-size: 28rpx;
  color: #1E5EFF;
  line-height: 28rpx;
}

.content {
  .item {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    align-items: center;
    padding: 32rpx;
    border-top: 2rpx solid #F4F6F9;
    font-size: 28rpx;
    color: #0F172A;
    line-height: 44rpx;
  }
}
</style>
