<template>
  <view class="delegate">
    <view class="container">
      <div class="top">
        <view class="left" @click="selindex = 0" :class="{ actived: selindex == 0 }">
          {{language.text01}}
          <view v-if="selindex == 0" class="line" />
        </view>
        <view class="right" @click="selindex = 1" :class="{ actived: selindex == 1 }">
          {{language.text44}}
          <view v-if="selindex == 1" class="line" />
        </view>
      </div>
      <component :is="['My', 'Ident'][selindex]" @switchToDelegate="switchToDelegate"></component>
			<!-- <My v-if="selindex===0" @switchToDelegate="switchToDelegate"></My> -->
			<!-- <Ident v-if="selindex===1" @switchToDelegate="switchToDelegate"></Ident> -->
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
      selindex: 0,
      language: language[this.$cache.get('_language')]
    }
  },
  // onShow() {
  //   this.$nextTick(() => {
  //     this.$refs.customChildNode.updateData()
  //     console.log('testtestestest')
  //   })
  // },
  methods: {
    switchToDelegate() {
      this.selindex = 1
    }
  },
  // onReady(){
  //   console.log('加载')
  // },
  // watch: {
  //   selindex: {
  //     // handler(newVal) {
  //     //   this.$nextTick(() => {
  //     //     this.$refs.customChildNode.updateData()
  //     //   })
  //     // }
  //   }
  // }
}
</script>

<style lang="scss" scoped>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
  .delegate {
    padding-top: calc(112rpx + var(--status-bar-height));
    .container {
      .top {
        position: fixed;
        top: var(--status-bar-height);
        width: 100%;
        background-color: #fff;
        height: 112rpx;
        display: flex;
        padding: 26rpx 32rpx;
        font-size: 40rpx;
        color: #8397B1;
        border-radius: 2px;
        
      }

      .left {
        text-align: center;

      }

      .right {
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
