<template>
	<view class="miners-cost">
		<view class="content">
			<text class="title">矿工费</text>
			<view class="miners-list">
				<view v-for="(item,index) in minersList" :key="index"
					:class="[selectedMiners==index?'selectedMiners':'',item.price?'':'custom']"
					@click="costChoose(item,index)">
					<text>{{item.title}}</text>
					<text :style="{display:item.quantity?'':'none'}">{{item.quantity}}</text>
					<text :style="{display:item.price?'':'none'}">{{item.price}}</text>
					<text :style="{display:item.time?'':'none'}">{{item.time}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  name: 'miners-column',
  data() {
    return {
      selectedMiners: 1,
      minersList: [{
        title: '慢',
        quantity: '0.000215GHM',
        price: '$0.0002',
        time: '15'
      },
      {
        title: '推荐',
        quantity: '0.000215GHM',
        price: '$0.0002',
        time: '5'
      },
      {
				 	title: '快',
        quantity: '0.000357ETH',
        price: '$0.0002',
        time: '3'
      },
      {
        title: '自定义',
        quantity: '',
        price: '',
        time: ''
      }
      ]
    }
  },
  onLoad(){
    
  },
  methods: {
    costChoose(item, index) {
      if (index == 3) {
        let that = this
        uni.navigateTo({
          url: '/pages/account/send/custom_cost',
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            someEvent: function(data) {
              // console.log('接收的数据', data)
              that.minersList[3].price = data['price']
              that.minersList[3].quantity = data['num']
              that.$emit('getMinersCost',that.minersList[3])
              that.selectedMiners = 3
            }
          },
        })
        return
      }
      this.$emit('getMinersCost',this.minersList[index])
      this.selectedMiners = index
    },
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

		.content {
			padding: 32rpx 32rpx 48rpx;

			.title {
				font-weight: 600;
				font-size: 28rpx;
				color: #2C365A;
				letter-spacing: 0;
			}

			.miners-list {
				height: 180rpx;
				margin-top: 16rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				view {
					display: flex;
					flex-direction: column;
					align-items: center;
					position: relative;
					width: 158rpx;
					height: 180rpx;
					background: #FFFFFF;
					border: 2rpx solid rgba(131, 151, 177, 0.20);
					border-radius: 8rpx;
					overflow: hidden;

					text:nth-child(1) {
						height: 60rpx;
						line-height: 60rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: #2C365A;
						letter-spacing: 0;
					}

					text:nth-child(2),
					text:nth-child(3) {
						padding-bottom: 6rpx;
						font-weight: 400;
						font-size: 20rpx;
						color: #8397B1;
					}

					text:nth-child(4) {
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
					}
				}

				.selectedMiners {
					border: 2rpx solid rgba(30, 94, 255, 0.60);
					box-sizing: border-box;

					text {
						color: #1E5EFF !important;
					}

					text:nth-child(4) {
						border-top: 2rpx solid rgba(30, 94, 255, 0.60);
					}
				}

				.custom {
					text:nth-child(1) {
						height: 180rpx;
						line-height: 180rpx;
					}
				}
			}
		}
	}
</style>
