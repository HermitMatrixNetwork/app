<template>
  <view class="miners-cost">
    <view class="title">{{ language.text22 }}</view>
    <view class="content">
      <view class="miners-list">
        <view v-for="(item,index) in minersList" :key="index" :class="[selectedMiners == index ? 'selectedMiners' : '']"
          @click="costChoose(item,index)">
          <text class="speed">{{ item.speed }}</text>
          <view class="amount">{{ item.amount }} {{ item.demon || mainCoin.alias_name }}</view>
          <view class="price">$ {{ item.price }}</view>
          <view class="time">{{ item.time }}</view>
        </view>
        <view class="custom" @click="addCustom" v-if="minersList.length < 4">
          <text>{{ language.text27 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mainCoin from '@/config/index.js'
import language from './language/index.js'
export default {
  name: 'miners-column',
  props: {
    redirectUrl: {
      type : String,
      default: ''
    },
    minusIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      selectedMiners: 1,
      minersList: [{
        amount: '0.0125',
        demon: 'ughm',
        price: '0.0000000125',
        speed: language[this.$cache.get('_language')].text25,
        time: `${language[this.$cache.get('_language')].text28} 15 ${language[this.$cache.get('_language')].text26}`
      },

      {
        amount: '0.015',
        demon: 'ughm',
        price: '0.000000015',
        speed: language[this.$cache.get('_language')].text24,
        time: `${language[this.$cache.get('_language')].text28} 5 ${language[this.$cache.get('_language')].text26}`
      },
      {
        amount: '0.02',
        demon: 'ughm',
        price: '0.00000002',
        speed: language[this.$cache.get('_language')].text23,
        time: `${language[this.$cache.get('_language')].text28} 3 ${language[this.$cache.get('_language')].text26}`
      },
      ],
      mainCoin,
      language: language[this.$cache.get('_language')]
      // {
      //   speed: '慢',
      //   amount: '0.000215',
      //   demon: 'GHM'
      //   price: '0.0002',
      //   time: '15'
      // }
    }
  },
  created() {
    this.$emit('getMinersCost', this.minersList[this.selectedMiners])
    if (this.minusIndex !== 0) {
      this.selectedMiners = this.minusIndex
    }
    
    if (this.customData.amount) {
      this.minersList.push(this.customData)
    }
  },
  methods: {
    resetMiners() {
      this.minersList.length = 3
      this.selectedMiners = 1
    },
    costChoose(item, index) {
      if (index == 3 && this.selectedMiners == 3) {
        uni.navigateTo({
          url: `/pages/account/send/custom_cost?data=${JSON.stringify(this.minersList[3])}&redirectUrl=${this.redirectUrl}&notQuery=true`,
          events: {
            someEvent: data => {
              data = Object.assign({
                price: '0.00',
                demon: 'ughm',
                speed: this.language.text27,
                time: `${language[this.$cache.get('_language')].text28} 3 ${language[this.$cache.get('_language')].text26}`
              }, data)
              this.minersList.splice(3, 1, data)
              this.$emit('getMinersCost', data)
            }
          }
        })
      } else {
        this.selectedMiners = index
        this.$emit('getMinersCost', item)
				
      }
    },
    addCustom() {
      this.$emit('getMinimumGas')
      uni.navigateTo({
        url: `/pages/account/send/custom_cost?redirectUrl=${this.redirectUrl}`,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          someEvent: data => {
            data = Object.assign({
              price: '0.00',
              demon: 'ughm',
              speed: this.language.text27,
              time: `${language[this.$cache.get('_language')].text28} 3 ${language[this.$cache.get('_language')].text26}`
            }, data)
            this.minersList.push(data)
            this.$emit('getMinersCost', data)
            this.selectedMiners = this.minersList.length - 1
          }
        },
      })
    }
  }
}
</script>

<style lang="scss">
  .miners-cost {
    width: 100%;
    height: 312rpx;
    background: #FFFFFF;
    position: relative;
    top: 24rpx;
    overflow-x: scroll;

    .title {
      font-weight: 600;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      padding-left: 32rpx;
      margin-top: 32rpx;
    }

    .content {
      width: 100%;
      overflow-x: scroll;
      padding: 0 32rpx 48rpx;

      .miners-list {
        height: 180rpx;
        margin-top: 16rpx;
        display: flex;

        .price,
        .amount {
          white-space: nowrap;
        }

        >view {
          display: inline-block;
          text-align: center;
          flex-shrink: 0;
        }

        >view {
          position: relative;
          width: 158rpx;
          height: 180rpx;
          background: #FFFFFF;
          border: 2rpx solid rgba(131, 151, 177, 0.20);
          border-radius: 8rpx;
          // overflow: hidden;

          &:not(:first-child) {
            margin-left: 18rpx;
          }

          text:nth-child(1) {
            height: 60rpx;
            line-height: 60rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: #2C365A;
            letter-spacing: 0;
          }

          .amount,
          .price {
            padding-bottom: 6rpx;
            font-weight: 400;
            font-size: 20rpx;
            color: #8397B1;
            width: 100%;
            overflow-x: scroll;
          }

          .time {
            width: 100%;
            height: 40rpx;
            position: absolute;
            bottom: 0;
            text-align: center;
            line-height: 40rpx;
            background: #F5F6F8;
            border-radius: 0 0 8rpx 4rpx;
            border-radius: 0 0 4rpx 4rpx;
            color: #8397B1;
            font-size: 20rpx;
            overflow-x: scroll;
            white-space: nowrap;
          }
        }

        .selectedMiners {
          position: relative;
          border: 2rpx solid rgba(30, 94, 255, 0.60);
          box-sizing: border-box;
					
					&:after {
						position: absolute;
						content: '';
						width: 32rpx;
						height: 32rpx;
						top: -10rpx;
						right: -2rpx;
						border-top-right-radius: 8rpx;
						background: url('/static/img/xuanzhong3.png') no-repeat;
						background-size: contain;
					}
					
          .price,
          .amount,
          .time,
          .speed {
            color: #1E5EFF !important;
          }

          .time {
            border-top: 2rpx solid rgba(30, 94, 255, 0.60);
          }
          
          
        }

        .custom {
          text:nth-child(1) {
            height: 180rpx;
            line-height: 180rpx;
            color: #8397B1;
          }
        }
      }
    }
  }

  .time {
    border-top: 2rpx solid rgba(0, 0, 0, 0);
  }
</style>
