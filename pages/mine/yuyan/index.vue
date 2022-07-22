<template>
  <view class="language-set">
    <custom-header title="语言设置">
      <template slot="right">
        <view class="save" @click="save">
          <text>保存</text>
        </view>
      </template>
    </custom-header>
    
    
    <view class="content">
      <view class="item" v-for="(item, index) in languageList" :key="index" @click="clickItem(item.value)">
        <text>{{ item.label }}</text>
        <u-icon name="checkmark" v-show="language == item.value" color="#1E5EFF" size="44rpx"></u-icon>
      </view>
    </view>
    
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
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
      language: this.$cache.get('_language')
    }
  },
  methods: {
    clickItem(val) {
      this.language = val
    },
    save() {
      this.$cache.set('_language', this.language, 0)
      this.$refs.uToast.show({
        type: 'success',
        message: '语言更换成功',
        duration: 2000,
        complete: () => {
          uni.navigateBack()
        }
      })
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
