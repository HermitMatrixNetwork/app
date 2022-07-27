<template>
  <view class="delegate">
    
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>
    <view class="container">
      <div class="top">
        <view class="left" @click="selindex = 1" :class="{ actived: selindex == 1 }">
          {{language.myDelegate}}
          <view v-if="selindex == 1" class="line" />
        </view>
        <view class="right" @click="selindex = 2" :class="{ actived: selindex == 2 }">
          {{language.verifiedBy}}
          <view v-if="selindex == 2" class="line" />
        </view>
      </div>
      
      <!-- 我的委托 -->
      <My v-if="selindex == 1" />
      
      <!-- 验证人 -->
      <Ident v-else />
    </view>
    <tab-bar :current-page="2" />
  </view>
</template>

<script>
import language from './language'
import My from './components/my.vue'
import Ident from './components/ident.vue'
export default {
  components: {
    My,
    Ident
  },
  data() {
    return {
      selindex: 1,
      language: language[this.$cache.get('_language')],
      list: [{
        // name: language.myDelegate,
        name: '我的委托',
      }, {
        name: '验证人',
      }, ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
  .delegate {
    .container {
      .top {
        display: flex;
        padding: 26rpx 32rpx;
        font-size: 40rpx;
        color: #8397B1;
        border-radius: 2px;
        
      }

      .left {
        width: 160rpx;
        text-align: center;

      }

      .right {
        width: 120rpx;
        margin-left: 32rpx;
      }

      .line {
        height: 4rpx;
        width: 70%;
        margin: auto;
        margin-top: 12rpx;
        background: #275EF1;
        border-radius: 32px;
        opacity: .8;
      }
    }
  }

  .actived {
    color: #2C365A;
    font-weight: 600;
  }
</style>
