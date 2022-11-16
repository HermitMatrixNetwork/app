<template>
  <view class="account">
    <view class="mask" v-show="updating"></view>
    <view class="mask" v-show="switchingWallet || delayHide"></view>
    <custom-updateApp ref="custom_update" :updating.sync="updating" checkImmediate />
    <!-- 钱包主页 -->
    <view class="account-header">
      <view class="header-left" @click="showSwitchWallet = true">
        <view class="title">{{ currentWallet.name }}</view>
        <!-- <image src="/static/img/account/down.png" style="width: 45rpx; height: 45rpx;"></image> -->
        <image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAZlBMVEUAAADP0efZ4+i6xdiwwdCwwdCwwdDM3eGwwdCwwdCwwdC0xNS8zdexwtG1w9Oxw9GxwtGwwtCxw9Gxw9Kyw9K2x9OxwtCywdGxwtGxwdGxwtCyw9GyxNO1xNSxwtSzxtmwwtKwwdA0r7PfAAAAIXRSTlMACgUZ9/zoCP7w+ksTuTnX096rd18l5s+ix7OMWEEdG5I3578+AAABKUlEQVRYw+2T2W7DIBBFBzBlJ15iZ086//+TZdRKlSVD7EppXjgPSAjuzEXcgUqlUnkZXLECisPLUf4hsjy8euIflAtm+sgwmbNTwEvtwQdEjRk0yt5DyQQDMaFpshhsBbCyg2OTdyDRfJYdcIAxoMUMFsNIl8oVbiG1Wu6P4VbWEwrcQaNc0uuDeyqnBtx1ywU6lw5hRQW236HVOENb3O3ZGj3dYUOHWs7aa+wGRofrKvjBpAozvRn8Sj0NJNwvBuUsAJc7bBhFDiIFSv7qm6PItM8HqqeP+5kA7Ef64PWQ29h/B4qWc6R3bYIziCdJ4rScIjAOG0mC2KY4UAAibTejIIUarcXW0WY7JEqRTAEs68slrm17Tfb/jhJCwVvhjHGoVCqVyn/xBV5BKDJmI0NzAAAAAElFTkSuQmCC"
          style="width: 45rpx; height: 45rpx;"></image>
      </view>

      <view class="header-icon">
        <!-- <image src="/static/img/account/saoma2.png" style="width:44rpx;height:44rpx;" @click="scanCode" /> -->
        <image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsBAMAAADsqkcyAAAAHlBMVEUAAAArNlotN1ouLl0vOFwtN1ktOlosN1skN1ssNlrzHy1YAAAACXRSTlMAlHsLcnE+3Q7xTH8hAAAAdUlEQVQoz2MgFSQJCgqKGEDYzI5AjhqIxTQTBBSALBROJqbwNCBLczpQnyjMkEAgp3ISkCU5EcUmsMigEvacgiIGEzFSRhVEiNAftAqigAiosOZMFDAJrzCmIQMBcAQsjmgYVOkEmzCOZI8jk+DIUjgyIIkAAM2VUFubUISJAAAAAElFTkSuQmCC"
          style="width:44rpx;height:44rpx;" @click="scanCode" />
        <!-- <image src="/static/img/account/setting.png" style="width:44rpx;height:44rpx;" @click="toGo('/pages/walletManager/index')"></image> -->
        <image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAY1BMVEUAAAArN1sqQ1osNlosNlstNlosNlosNlstOVwtNlsuNlstPl0rN1osN1osNlorNlsvN1ssNlosNlotN1wsNlouNlwsN14tNlsrNlosNlssN1ssNlosNlstN1stOFksN1osNloJ7xsmAAAAIHRSTlMAgQb0cc7CZCFTSA+1no0wKOragHg9F+Xe1Dmqp5yJXTBfpeUAAAGDSURBVDjLvZXJtoMgEEQVcA55mph58P7/Vz7DiYCKCzapFTR1oJsqmuQnaFW6gmrD3EISgCxC3DsbuAfIO7j1yyz6G+zW3Ao4rcMnoFoGRQavRKzCyQuyZVhBFyy87UDNQ+UVjm5jf+sjXMtZbA+HJgmiOcDeD/xJKLa0KkD+efMH5GKLLHJ4uGkN1GtWeDmHp79Vezq1/kFPyDeSKvIOurwIlnSeldvs+GLXzC7rbEYpXM5+NcjbTeLXfL5AavSQoKwEb0CXQpQaeFuZFMiPMhoye2B5+VAM3nApbXIZ6NFWEiq78QCZcNYa7NYVyHuiZoZNIf1y7djaXS3Ie1CeEfdzskvDoAc9jTX0ZuDSMO5upqNro48YYZSox5At8OWuzlWVleZeMluruzrjbidKBXTHuj52QOVEMW/Dyi1s1hb9dNwktzWSXaiuGFyrceIZKWzRZtB5rodmbtEo88c8q6gHG9MKYptMfPtyOutQY9RG9fiWG9/M47+J7Q8o6mv7Bf4BR0s0+RbLnCYAAAAASUVORK5CYII="
          style="width:44rpx;height:44rpx;" @click="toGo('/pages/walletManager/index')"></image>
      </view>
    </view>
    <view class="main">

      <view class="basic-data">
        <view class="user-msg">
          <view class="allassets" style="display: flex; align-items: center;">
            <!-- 总资产 -->
            <text style="font-size:28rpx; padding-right: 8rpx;">{{ languages.text02 }}</text>
            <image :src="eyeAsset? '/static/img/eye.png' : '/static/img/eye-close.png'" @click="assentIsShow"
              style="width: 32rpx; height: 32rpx;"></image>
          </view>
          <view class="user-balance">
            <!-- {{ eyeAsset ? '$' + formatBalance(tokenList[0].balance) : '∗∗∗∗∗∗∗∗' }} -->
            {{ eyeAsset ? '$' + formatBalance(new decimal(tokenList[0].balance + '').add(new decimal(lockAmount + '')).add(new decimal(unBoundingBalance + '')).toString()) : '∗∗∗∗∗∗∗∗' }}
          </view>
          <view class="user-address" @click="copy">
            <text>{{
              currentWallet.address | sliceAddress
            }}</text>
            <image class="copy-icon" src="/static/img/account/copy.png"></image>
            <!-- {{eyeAsset?(currentWallet.address|sliceAddress):'∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗'}} -->
          </view>
        </view>
      </view>
      <view class="account-column">
        <view class="column-item" @click="toGo('/pages/account/send/index')">
          <!-- <image src="/static/img/account/send.png" style="width:80rpx; height: 80rpx"></image> -->
          <image
            src="data:image/png;base64,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"
            style="width:80rpx; height: 80rpx"></image>
          <text>{{ languages.text03 }}</text>
        </view>
        <view class="column-item" @click="toGo('./receive')">
          <!-- <image src="/static/img/account/receive.png" style="width:80rpx; height: 80rpx"></image> -->
          <image
            src="data:image/png;base64,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"
            style="width:80rpx; height: 80rpx"></image>
          <text>{{ languages.text04 }}</text>
        </view>
        <view class="column-item" @click="toDelegate">
          <!-- <image src="/static/img/account/delegate.png" style="width:80rpx; height: 80rpx"></image> -->
          <image
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAAhFBMVEUzM1UAAAAvLkwsNlovMFswN1osNlotNlksNlpxg6F6jaiAka+ClbCClLAsNlqDl7EsNlotNlouN1osNlouNlszN1kwOFotNlovN1owNlstN1osN1oxN1ksNlp4iqUsNlosNlqDlrF+kaxpdZNhZYmDl7GAk64uN1lvfpiClK8sNlqDl7FFcaVmAAAAKnRSTlMPAAr4FSTprGM5YJXGse70vINQ4m8pG5JEMKTaOpxM0MbVcSYa5ohbMKIuiZGnAAAEmUlEQVR42uzWWVfqMBiF4Z3dMHm0tEDLLCiO8f//v3NWB704pEn7ddFcuF1eEh7fUJZQPYzl8D2WUz1MCiQVSRD/jSiRAqYQWNIADfs0IEgpAxIt1s4oB5JoOTqNcqBbJ+8oB1IRgtFhFAPtOnlFOZAOnswoBxK9TVEAFOXrPyIE9W5ChCCfcJQD5Tx5RAh8N4kIAe8mESHw3SQihuW5I0Lukwu7AokbjQ7ggP3cQgzfr/mWEUC/xoYIoF9jQwTRr6EhgujX0BCB9LM2RCD9rA0RTD9LQ4Tku9YQwVywJSGC8l0RIqALvipE24BaMjmQ7tdLRrYWoo2PhM5Hgmm4iaQAiMNql5yW4y5b7s+TdJGz5SXB16epRqvJeRmZ7ovGpyQ9kG2E8O2n8sV6Wb5N5xWvnky3LiItQDSM+Wpf2IxkhTI+bl0NrwPZdL+jY2z6WWSiZEPtmxBeXwFqtI5NdUWSVUKTbJTvkwy/JySNTMUT5isTmkkGz4Tw8JHF5696izged1wcRTUzXudKOxL6AzFKTH070W662Y66LDu8r5ff54w39EsI9yNMndYHm/N0q6k6Dtli9/OHbpXXgwznI6JVdqo/O5MNFaA7DlTZOq7PeldeCeG+YCxiExVnng9KQ7Jc4RiVh5kUjSN9gRyl1ZnjBSEds6QCTvw+hXB/Bx6SyBQ/x1xpMZCrpSm2X5EeCeG8YbXYmwJ4WoCQb7urvg7TZiD8gXH54CUZellqykteK38g7NPqvTpwQqKHqVV13s4BxA+QjcBpDVRtgPLzyMCB+AEiTCBqIEMFMnAgKyBDBQIsgQgVyNCBwRcsgUS4QFAIJKwj+ygoBr7MLPsABy9IzN7urXt4vnBo4OVz/mXf6zPkQEiAuJt//RNaf+9nvRRkVyAvb0VA657uQHFBCoFW4rwfIAmi8xU/vjYWvP8AxAUlQPXy2SCcPz2TwwKBl7s/D5Z9vj0CGBqo8DGz7UI1PBCgso3oqSAQ8j8LwC/wF/gL/NveGeQmDENBdDysgCJOUEukAQW4//26SLpoi8XHBv+xxRzAevoxRNgzg9qCb0C19fwBWbIgg030ehev48ai+EUPQCLu9leLjqfJBXA6XK06g/UBx2FvBjxEMAeQRT+atg8ADmN9wDoTLDlZWB/NgLvR4WSB2HwYP8XnSJ/jt3jaWjRMhA8gzS8SJ0DQpHzAJo6A5Q/R34AdA5Lal4nN3HbqX2jrWwLkAX1sKZ/3AFsy9uhbo6qZy5BhLqtpz2OmPS+QagZH/LWIQssiSrZmstW3KWsZvcHHrfKXlYNV3iNssLpYwgYtxjX0Ay8ykSGy1dCVfmytQvAPxD2x5eikfvg0ED5KAyolyAF0ECHXD+EHT8D/NNApqgDCDUGl6mN5vsJlJEiVkagQznyyhThIF+JIEPKHT7SUCQxpQAFCGmutyr8Py+fXV7WafjldxkYsxeuvIDE9RJWKyQZKOuchuuAtgD5DvM3XbdXuTFiBr+u65ycxZhdmWwm1K8f1S9uzGevV3i9ieMnGe/pfL9i2nYGvGDANmXzgzGArBkxi/pomDWxGfQPBEIMRMbjhJgAAAABJRU5ErkJggg=="
            style="width:80rpx; height: 80rpx"></image>
          <text>{{ languages.text05 }}</text>
        </view>
        <view class="column-item" @click="dealBtn">
          <!-- <image src="/static/img/account/transaction.png" style="width:80rpx; height: 80rpx"></image> -->
          <image
            src="data:image/png;base64,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"
            style="width:80rpx; height: 80rpx"></image>
          <text>{{ languages.text06 }}</text>
        </view>
      </view>

      <u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
        <view class="modalContent">
          <image src="/static/img/tishi2.png" style="width: 64rpx; height: 64rpx;"></image>
          <view class="modal-title">{{ languages.text172 }}</view>
          <text class="modal-content">{{ languages.text08 }}</text>
          <button @click="aa = false">{{ languages.text09 }}</button>
        </view>
      </u-modal>
      <view class="coin-list">
        <!--        <u-tabs :list="coinList" lineColor="#2C365A" @click="click" :inactiveStyle="inactiveStyle" :scrollable="false"
          :activeStyle="activeStyle" lineWidth="20" lineHeight="3" :itemStyle="itemStyle" :current="currentIndex" class="coin-tabs">
          <view slot="right" style="padding-bottom: 8rpx">
            <image src="/static/img/account/add3.png" @click="toAsset" style="width: 48rpx;height: 48rpx;"></image>
          </view>
        </u-tabs> -->
        <view class="coin-list-top coin-tabs">
          <view class="tabs">
            <view class="tabs-item" :class="{ 'actived': coinType == 'All' }" @click="coinType = 'All'">
              <view class="tabs-item-text">
                <text>{{ languages.text07 }}</text>
              </view>
              <!-- <view class="tabs-item-bar"></view> -->
            </view>
            <view class="tabs-item" :class="{ 'actived': coinType == 'NFT' }" @click="coinType = 'NFT'">
              <view class="tabs-item-text">
                <text>NFT</text>
              </view>
              <!-- <view class="tabs-item-bar"></view> -->
            </view>
          </view>
          <view class="tabs-right">
            <!-- <image src="/static/img/account/add3.png" @click="toAsset" style="width: 48rpx;height: 48rpx;"></image> -->
            <image
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAHlBMVEV2ibEAAACBlLFygrB9kLV2i7N5ibGDl7GClrGDl7FPcLTlAAAACXRSTlMaAIcPCBMg9sKLcCUQAAAA3UlEQVQ4y5WUTQrCMBCFH7R1L9QLuOuuYA/QUNxHENdu7B08gtts1NuaxOanZJ7g24TmY14zycxgu6idNNAMKnwj7Gt4NWoNJkQNOWiRSQWQfIJbBCNWqgOIRrkZvgFlCHyAEAIfUIR4oEvQOJCc5jnzQnKqOtNHLwt6CVQWQAJ2u5WBwk4GJ4wyqDnoZVAh5X3rzCXlvqwHq3Nnjm5Fps3e6fHyyzUH93fUk4PfVvTn9Lg0wf/vil47fSj2tLQYaPnQgmMlSouatgFrHNpqrDl5O/MBwEcGHzJ0LH0AaZxKYcGIZ9wAAAAASUVORK5CYII="
              @click="toAsset" style="width: 48rpx;height: 48rpx;"></image>
          </view>
        </view>
        <scroll-view v-if="visibaleTokenList.length" class="coinbox" scroll-y :style="{ height: scrollHeight }">
          <view class="content" v-for="item in visibaleTokenList" :key="item.ID">
            <TokenColumn :showWarn="item.showWarn" :tokenName="item.alias_name" :tokenIcon="item.logo" class="token"
              @click.native="queryToken(item)" @showTishi="aa = true">
              <template #right>
                <custom-loading v-if="item.loadingBalance"></custom-loading>
                <view class="coinNumber" v-else>
                  <view class="number" v-if="item.apply_type == 'NFT'">{{ item.nums || 0 }}</view>
                  <!-- 非主网币 -->
                  <view class="number" v-else-if="item.alias_name !== mainCoin.alias_name">
                    {{ formatBalance(item.balance) || '0.00' }}
                  </view>
                  <!-- 主网币 -->
                  <!-- -if="!lockAmountLoading || item.balance" -->
                  <view class="number" v-else style="display: flex; align-items: center; justify-content: flex-end;">
                    <!-- <custom-loading v-if="lockAmountLoading || unboundingBlanceLoading"></custom-loading> -->
                    <!-- <view v-else> -->
                    {{ formatBalance(new decimal(item.balance + '').add(new decimal(lockAmount + '')).add(new decimal(unBoundingBalance + '')).toString()) || '0.00' }}
                    <!--                      {{ formatBalance(item.balance + lockAmount + unBoundingBalance) || '0.00' }} -->
                    <!-- <custom-loading v-if="updatingBalance"></custom-loading> -->
                    <!-- </view> -->
                  </view>
                  <!-- <view class="number" v-else>0.00</view> -->
                  <view v-if="item.apply_type == 'NFT'"></view>
                  <view v-else-if="item.alias_name !== mainCoin.alias_name" class="money">$0.00000</view>
                  <view v-else class="money">
                    ${{ formatBalance(new decimal(item.balance + '').add(new decimal(lockAmount + '')).add(new decimal(unBoundingBalance + '')).toString()) || '0.000000' }}
                  </view>
                </view>
              </template>
            </TokenColumn>
          </view>
        </scroll-view>
        <no-data v-else></no-data>
      </view>
    </view>
    <SwitchWallet :showSwitchWallet="showSwitchWallet" @close="closeSwitchWalletPopup" ref="switchWallet" />

    <view :initRender="initRender" :change:initRender="render.init"></view>
    <view :callBalanceLoading="callBalanceLoading" :change:callBalanceLoading="render.setBalanceLoading"></view>
    <view :getLockAmount="getLockAmount" :change:getLockAmount="render.getDelegationRecord"></view>
    <view :callUnboundingDelegators="callUnboundingDelegators"
      :change:callUnboundingDelegators="render.getUnbondingDelegationRecord"></view>

    <!-- 指纹验证 -->
    <view class="toast" v-show="switchingWallet || delayHide">
      <view class="toast-icon">
        <image :src="toast.icon"></image>
      </view>
      <view class="toast-content">
        <text>{{ toast.msg }}</text>
      </view>
    </view>

    <custom-notify ref="notify"></custom-notify>
    <tab-bar />
  </view>
</template>

<script>
import {
  sliceAddress
} from '@/utils/filters.js'
import mainCoin from '@/config/index.js'
import SwitchWallet from '@/pages/walletManager/switchWallet.vue'
import TokenColumn from './send/components/TokenColumn.vue'
import languages from './language'
import mixin from './mixins/index.js'
import decimal from 'decimal'
// import serialize from 'serialize-javascript'
export default {
  mixins: [mixin],
  components: {
    TokenColumn,
    SwitchWallet
  },
  filters: {
    sliceAddress,
  },
  onHide() {
    this.$refs.custom_update && this.$refs.custom_update.reset()
    uni.stopPullDownRefresh()
  },
  data() {
    return {
      updating: false,
      showSwitchWallet: false,
      address: '',
      currentWallet: this.$cache.get('_currentWallet'),
      languages: languages[this.$cache.get('_language')],
      coinList: [{
        name: languages[this.$cache.get('_language')].text07
      }],
      inactiveStyle: {
        fontSize: '34rpx',
        color: '#8397B1',
        // fontWeight: '500'
      },
      activeStyle: {
        fontSize: '34rpx',
        color: '#2C365A',
        // fontWeight: '600'
      },
      itemStyle: {
        height: '70rpx',
        // alignItems: 'flex-start'
      },
      allassets: 0, //总资产
      eyeAsset: true,
      aa: false,
      firstShowAa: true,
      tokenList: [],
      tempList: [],
      coinType: 'All',
      initRender: 0, // call render.init
      callBalanceLoading: 0,
      currentIndex: 0,
      systemBarHeight: 0,
      basicDataHeight: 0,
      accountColumnHeight: 0,
      coinTabsHeight: 0,
      lockAmountLoading: true,
      lockAmount: 0,
      mainCoin,
      getLockAmount: 0,
      gettingBalance: true,
      switchWallet: false,
      toast: {
        icon: '/static/img/mine/loading.gif',
        msg: languages[this.$cache.get('_language')].text231
      },
      delayHide: false,
      unboundingBlanceLoading: true,
      callUnboundingDelegators: 0,
      unBoundingBalance: 0,
      decimal,
      initSecretClient: 0
    }
  },
  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 3000)
    this.gettingBalance = true
    this.lockAmountLoading = true
    this.unboundingBlanceLoading = true
    this.callUnboundingDelegators++
    this.getLockAmount++
    // this.initCoinList()
    this.aa = false
    this.firstShowAa = true
    this.initRender++
    this.address = ''
    this.$nextTick(() => {
      this.address = this.$cache.get('_currentWallet').address
    })
  },
  onShow() {
    if (this.$refs.switchWallet) {
      this.$refs.switchWallet.currentWallet = this.$cache.get('_currentWallet')
    }
    // if (getApp().globalData.secretClient == null) {
    //   this.initSecretClient = 1
    // } else {
    //   this.initSecretClient = getApp().globalData.secretClient
    //   this.$nextTick(() => {
    //     this.initSecretClient = 0
    //   })
    // }
    if (this.$cache.get('_closeSwitchPopup')) {
      this.showSwitchWallet = false
      this.$refs.switchWallet.showAddWallet = false
      this.$cache.delete('_closeSwitchPopup')
      this.currentWallet = this.$cache.get('_currentWallet')
      this.address = this.currentWallet.address
    }
    if (this.$cache.get('_tokenContent_unBoundingBalance_data') !== undefined) {
      this.unBoundingBalance = this.$cache.get('_tokenContent_unBoundingBalance_data')
    } else {
      this.unBoundingBalance = null
    }

    this.lockAmount = this.$cache.get('_account_locakAmount_data') || 0
    this.$refs.custom_update && this.$refs.custom_update.checkUpdate()

    this.aa = false
    this.firstShowAa = true
    this.lockAmountLoading = true
    this.unboundingBlanceLoading = true
    this.gettingBalance = true
    this.tokenList = this.$cache.get('_currentWallet').coinList || [mainCoin]
    setTimeout(() => {
      this.initRender++
      this.callUnboundingDelegators++
      this.getLockAmount++
    }, 1500)
  },
  onReady() {
    // this.newuserAdres = this.userAdres.replace(this.userAdres.slice(16, 36), '***')
    // this.initCoinList()


    // this.$refs.custom_update && this.$refs.custom_update.checkUpdate()

    // this.aa = false
    // this.firstShowAa = true
    // this.lockAmountLoading = true
    // this.unboundingBlanceLoading = true
    // this.gettingBalance = true
    // this.tokenList = this.$cache.get('_currentWallet').coinList || [mainCoin]

    // setTimeout(() => {
    //   this.initRender++
    //   this.callUnboundingDelegators++
    //   this.getLockAmount++
    // }, 1500)

  },
  created() {
    //获取选择的代币
    this.address = this.currentWallet.address
  },
  async mounted() {
    this.getSystemStatusHeight()
    this.calculateHeight()

  },
  // onBackPress() {
  //   uni.reLaunch({
  //     url: '/pages/index/index'
  //   })
  //   return true
  // },
  methods: {
    formatBalance(val) {
      if (isNaN(val)) {
        return '0.000000'
      } else if (val) {
        return Number(val).toFixed(6)
      } else {
        return '0.000000'
      }
    },
    getSystemStatusHeight() {
      uni.getSystemInfo({
        success: res => {
          this.systemBarHeight = res.statusBarHeight
        }
      })
    },
    calculateHeight() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.basic-data').boundingClientRect(data => {
        this.basicDataHeight = data.height + 'px'
      })

      query.select('.account-column').boundingClientRect(data => {
        this.accountColumnHeight = data.height + 'px'
      })
      query.select('.coin-tabs').boundingClientRect(data => {
        this.coinTabsHeight = data.height + 'px'
      })

      query.exec()

    },
    initCoinList() {
      let coinList = this.$cache.get('_currentWallet').coinList || []
      let tokenType = new Set()
      this.coinList = [{
        name: this.languages.text07
      },
        // {
        //   name: 'NFT',
        //   disabled: true
        // }
      ]
      // coinList.forEach(item => item.apply_type && (tokenType.add(item.apply_type)))
      // Array.from(tokenType).forEach(item => {
      //   switch (item) {
      //   case 'token':
      //     this.coinList.push({
      //       name: 'SNIP20'
      //     })
      //     break
      //   }
      // })
    },
    toDelegate() {
      uni.switchTab({
        url: '/pages/delegate/index'
      })
    },
    click(item) {
      this.coinType = item.name == this.languages.text07 ? 'All' : item.name
    },
    //页面跳转
    goTo(e) {
      uni.navigateTo({
        url: e.currentTarget.dataset.url
      })
    },
    //页面跳转
    toGo(url) {
      uni.navigateTo({
        url
      })
    },
    //复制地址
    copy() {
      uni.setClipboardData({
        data: this.currentWallet.address,
        showToast: false,
        success: () => {
          this.$refs.notify.show('', this.languages.text56, {
            bgColor: '#275EF1'
          })
        },
        fail: () => {
          // this.$refs.notify.show('error', this.language.copyfailure)
        }
      })
    },
    dealBtn() {
      uni.showToast({
        title: this.languages.text180,
        icon: 'none'
      })
    },
    assentIsShow() {
      //用户总资产是否显示
      this.eyeAsset = !this.eyeAsset
    },
    closeSwitchWalletPopup(update) {

      if (update) {
        this.switchWallet = true
        this.delayHide = true
        this.gettingBalance = true
        this.toast.msg = this.languages.text231
        this.toast.icon = '/static/img/mine/loading.gif'
        this.currentWallet = this.$cache.get('_currentWallet')
        this.unboundingBlanceLoading = true
        this.lockAmountLoading = true
        this.address = ''
        // this.initCoinList()
        this.tokenList = this.currentWallet.coinList
        this.$cache.delete('_tokenContent_accountTransfer_data')
        this.$cache.delete('_tokenContent_unBoundingBalance_data')
        this.$cache.delete('_tokenContent_locakAmount_data')
        this.$cache.delete('_my_list_data')
        this.$cache.delete('_my_totalReward_data')
        this.$cache.delete('_my_cumulativeReward_data')
        this.$cache.delete('_my_unBoundingBalance_data')
        this.$cache.delete('_ident_delegationsBlance_data')
        this.$cache.delete('_delegateInfo')
        this.$cache.delete('_tokenContent_locakAmount_data')
        this.$cache.delete('_tokenContent_unBoundingBalance_data')
        this.$cache.delete('_tokenContent_balance_data')
        this.$cache.delete('_account_locakAmount_data')
        console.log('update wallet')
        this.$nextTick(() => {
          this.address = this.$cache.get('_currentWallet').address
          this.callUnboundingDelegators++
          this.initRender++
          this.getLockAmount++
        })

      } else {
        this.showSwitchWallet = false
      }
    },
    balanceDataUpdate() {
      this.gettingBalance = false
    },
    queryToken(token) {
      if (token.apply_type == 'NFT') {
        uni.navigateTo({
          url: `./NFT-list?symbol=${token.symbol}`
        })
      } else if (token.apply_type) {
        uni.navigateTo({
          url: `./send/token_content_other?tokenID=${token.ID}`
        })
      } else {
        uni.navigateTo({
          url: `./send/token_content?tokenID=${token.ID}`
        })
      }
    },
    updateWalletList(wallet) {
      console.log('updateWalletList')
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1)
      }
      walletList.unshift(wallet)
      this.$cache.set('_walletList', walletList, 0)
      return true
    },
    updateCoinList(coinList) {
      this.tokenList = coinList
      const wallet = this.$cache.get('_currentWallet')
      wallet.coinList = coinList
      this.$cache.set('_currentWallet', this.currentWallet, 0)
      // this.updateWalletList(this.currentWallet)
    },
    showError(msg) {
      this.$refs.notify.show('error', msg)
    },
    toAsset() {
      this.$nextTick(() => {
        // uni.redirectTo({
        //   url: '/pages/assetManage/index'
        // })
        if (this.coinType == 'NFT') {
          uni.navigateTo({
            url: '/pages/assetManage/nftToken'
          })
        } else {
          uni.navigateTo({
            url: '/pages/assetManage/index'
          })
          
        }
      })
      this.callBalanceLoading += 1
    },
    setLockAmount({
      result
    }) {
      let lock = 0
      result.delegationResponses.forEach(item => {
        lock += Number(item.balance.amount)
      })
      this.lockAmount = lock / mainCoin.decimals
      this.$cache.set('_account_locakAmount_data', this.lockAmount, 0)
      this.lockAmountLoading = false
      // console.log('lockAmount', this.lockAmount)
    },
    handlerUnboundingBlance(res) {
      // this.unBoundingBalance = 0
      let tempUnBoundingBalance = 0
      res.result.unbondingResponses.forEach(item => {
        item.entries.forEach(item => {
          tempUnBoundingBalance += Number(item.balance)
        })
      })

      this.unBoundingBalance = tempUnBoundingBalance / mainCoin.decimals
      this.$cache.set('_tokenContent_unBoundingBalance_data', this.unBoundingBalance, 0)
      this.unboundingBlanceLoading = false
      // this.unBoundingBalance = res.result.unboundingResponses.reduce((pre, cur, 0) => {
      //   return pre + Number(cur.ent)
      // })
    },
    handlerSecretClient(client) {
      getApp().globalData.secretClient = client
      console.log('handlerSecretClient', client)
    }
  },
  computed: {
    switchingWallet() {
      // 
      return (this.lockAmountLoading || this.gettingBalance || this.unboundingBlanceLoading) && this.switchWallet
    },
    updatingBalance() {
      return (this.lockAmountLoading || this.gettingBalance || this.unboundingBlanceLoading)
    },
    visibaleTokenList() {
      const type = {
        'token': 'SNIP20',
        'NFT': 'NFT',
        'default': ''
      }
      let result = this.coinType === 'All' ? this.tokenList.filter(item => item.apply_type !== 'NFT') : this.tokenList.filter(item => type[item.apply_type ||
          'default'] === this.coinType)
      // if (result.length == 0) {
      //   result = this.tokenList
      // }
      return result
    },
    scrollHeight() {
      const operation_btn = '180rpx'
      const marginHeight = '24rpx + 48rpx'
      return `calc(100vh - 112rpx - ${operation_btn} - ${marginHeight} - ${this.systemBarHeight + 'rpx'} - ${this.basicDataHeight} - ${this.accountColumnHeight} - ${this.coinTabsHeight} - 56rpx)`
    }
  },
  watch: {
    // tokenList: {
    //   deep: true,
    //   handler(newVal) {
    //     if (this.firstShowAa) {
    //       this.aa = newVal.find(item => item.showWarn) ? true : false
    //       if (this.aa) this.firstShowAa = false
    //     }
    //   }
    // }
    updatingBalance(newVal) {
      if (!newVal) {
        this.switchWallet = false
      }
    },
    switchingWallet(newVal) {
      if (!newVal) {
        // setTimeout(() => {
        // this.toast.msg = this.languages.text232
        // this.toast.icon = '/static/img/mine/success.png'
        // setTimeout(() => {
        this.delayHide = false
        this.showSwitchWallet = false
        // }, 500)
        // }, 500)

      }
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    getBalance,
    getCodeHash,
    getOtherBalance,
    getTokenDecimals,
    getDelegationRecord,
    getUnbondingDelegationRecord,
    getSecret,
    get721codeHash,
    get721TokenBlance,
    get721TokenDecimals
  } from '@/utils/secretjs/SDK'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'
  // import serialize from 'serialize-javascript'

  export default {
    data() {
      return {
        balanceLoading: true,
        secretClient: null
      }
    },
    methods: {
      async init(val) {
        try {
          if (val == 0) return;
          this.balanceLoading = true
          let wallet;
          //#ifdef APP-PLUS
          wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
          //#endif

          //#ifndef APP-PLUS 
          wallet = uni.getStorageSync('_currentWallet').data
          //#endif
          //获取主网币余额
          let coinList = wallet.coinList || []

          //代币数组为空时，为其添加主币
          if (coinList.length == 0) coinList.push(mainCoin)
          renderUtils.runMethod(this._$id, 'updateCoinList', coinList, this)
          this.getBalance(coinList, wallet)
        } catch (e) {
          console.log('e', e);
        } finally {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            plus.navigator.closeSplashscreen()
            clearTimeout(this.timer)
          }, 3500)
        }

      },
      async getBalance(coin, wallet) {
        try {
          let coinList = JSON.parse(JSON.stringify(coin))
          for (let i = 0; i < coinList.length; i++) {
            let coin = coinList[i]
            let balance = 0.00
            if (coin.alias_name == mainCoin.alias_name) {
              coin.showWarn = false
              let res = await getBalance(wallet.address, this.secretClient)
              balance = res.balance.amount
              console.log(res);
            } else { // 非主网币
              if (coin.view_key == '') {
                coin.showWarn = true
              } else if (coin.apply_type == 'NFT') {
                console.log('NFT QUERY BALANCE');
                // if (!coin.codeHash) {
                //   try {
                //     let codeHash = await get721codeHash(coin.contract_address)
                //     coin.codeHash = codeHash
                //     balance = await this.get721TokenBalance(coin, wallet)
                //   } catch (e) {
                //     let msg = '获取721codeHash失败，请检查合约地址是否正确'
                //     console.log('获取721codeHash失败，请检查合约地址是否正确');
                //   }
                // } else {
                //   balance = await this.get721TokenBalance(coin, wallet)
                // }
              } else {
                if (!coin.codeHash) {
                  try {
                    let codeHash = await getCodeHash(coin.contract_address, this.secretClient)
                    coin.codeHash = codeHash
                    balance = await this.getOtherTokenBalance(coin, wallet)
                  } catch (e) {
                    let msg = '获取codeHash失败，请检查合约地址是否正确'
                    console.log('获取codeHash失败，请检查合约地址是否正确');
                    // renderUtils.runMethod(this._$id, 'showError', msg, this)
                  }
                } else {
                  balance = await this.getOtherTokenBalance(coin, wallet)
                }
              }
            }
            if (coin.decimals) balance = balance / coin.decimals
            coin.balance = balance
            coin.loadingBalance = false
          }
          this.balanceLoading && renderUtils.runMethod(this._$id, 'updateCoinList', coinList, this)
          renderUtils.runMethod(this._$id, 'balanceDataUpdate', '', this)
        } catch (e) {
          console.log('e', e);
        } finally {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            plus.navigator.closeSplashscreen()
            clearTimeout(this.timer)
          }, 3500)
        }

      },
      setBalanceLoading(newVal) {
        if (newVal == 0) return

        this.balanceLoading = false
      },
      async getDelegationRecord(val) {
        try {
          if (val == 0) return
          let wallet;
          //#ifdef APP-PLUS
          wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
          //#endif

          //#ifndef APP-PLUS 
          wallet = uni.getStorageSync('_currentWallet').data
          //#endif
          const result = await getDelegationRecord(wallet.address, this.secretClient)
          renderUtils.runMethod(this._$id, 'setLockAmount', {
            result
          }, this)
        } catch (e) {
          console.log('e', e);
        } finally {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            plus.navigator.closeSplashscreen()
            clearTimeout(this.timer)
          }, 3500)
        }

      },
      async getOtherTokenBalance(coin, wallet) {
        try {
          let balance = 0
          let res = await getOtherBalance({
            address: wallet.address,
            contract: {
              address: coin.contract_address,
              codeHash: coin.codeHash
            },
            auth: {
              key: coin.view_key
            }
          }, this.secretClient)
          if (res.viewing_key_error) {
            coin.showWarn = true
          } else {
            const tokeninfo = await getTokenDecimals({
              contract: {
                address: coin.contract_address,
                codeHash: coin.codeHash
              }
            }, this.secretClient)

            coin.decimals = Math.pow(10, tokeninfo.token_info.decimals) || 1
            balance = res.balance.amount
            coin.showWarn = false
          }
          return balance
        } catch (e) {
          //TODO handle the exception
          console.log('e', e);
        } finally {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            plus.navigator.closeSplashscreen()
            clearTimeout(this.timer)
          }, 3500)
        }
      },
      async getUnbondingDelegationRecord(val) {
        try {
          if (val == 0) return
          let wallet;
          //#ifdef APP-PLUS
          wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
          //#endif

          //#ifndef APP-PLUS 
          wallet = uni.getStorageSync('_currentWallet').data
          //#endif
          const result = await getUnbondingDelegationRecord(wallet.address, this.secretClient)
          renderUtils.runMethod(this._$id, 'handlerUnboundingBlance', {
            result
          }, this)
          // console.log('getUnbondingDelegationRecord', result.unbondingResponses);
        } catch (e) {
          console.log('e', e);
          //TODO handle the exception
        } finally {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            plus.navigator.closeSplashscreen()
            clearTimeout(this.timer)
          }, 3500)
        }
      },
      async callInitSecretClient(val) {
        if (val == 0) {
          return
        } else if (val == 1) {
          const secretClient = await getSecret()
          console.log('initSecretClient');
          // this.secretClient = secretClient
          console.log(secretClient);
          // window.secreserialize = serialize
          window.secretClient = secretClient
          // console.log(serialize(secretClient));
          renderUtils.runMethod(this._$id, 'handlerSecretClient', secretClient, this)
        } else {
          val()
          // console.log('globalData', getApp().globalData );
          console.log('set secretClient');
          // this.secretClient = val.secretClient ? val.secretClient : val
          // renderUtils.runMethod(this._$id, 'handlerSecretClient', {
          //   secretClient
          // }, this)
        }
      },
      async get721TokenBalance(coin, wallet) {
        console.log('get721TokenBalance', coin.codeHash);
        let balance = 0
        let res = await get721TokenBlance({
          address: wallet.address,
          contract: {
            address: coin.contract_address,
            codeHash: coin.codeHash
          },
          auth: {
            key: coin.view_key
          }
        }, this.secretClient)
        if (res.viewing_key_error) {
          coin.showWarn = true
        } else {
          const tokeninfo = await get721TokenDecimals({
            contract: {
              address: coin.contract_address,
              codeHash: coin.codeHash
            }
          }, this.secretClient)

          coin.decimals = Math.pow(10, tokeninfo.token_info.decimals) || 1
          balance = res.balance.amount
          coin.showWarn = false
        }
        return balance
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .5) !important;
    z-index: 999999;
  }

  page {
    width: 100%;
    height: 100%;
  }

  .account {
    width: 100%;
    height: 100%;
    padding-top: calc(112rpx + var(--status-bar-height));
  }

  .account-header {
    padding: 0 32rpx;
    position: fixed;
    top: var(--status-bar-height);
    width: 100%;
    height: 112rpx;
    font-size: 34rpx;
    font-weight: 600;
    color: #2c3457;
    letter-spacing: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-icon {
      display: flex;
      align-items: center;
      width: 125rpx;
      justify-content: space-between;
    }
  }

  .main {
    // margin-left: 38rpx;
    // margin-right: 26rpx;
    padding: 0 32rpx;
    height: 100%;


    .basic-data {
      width: 100%;
      height: 280rpx;
      background-image: url('@/static/img/account/card1.png');
      background-size: 100% 100%;
      border-radius: 24rpx;

      .user-msg {
        color: #ffffff;
        padding: 40rpx 32rpx 48rpx 32rpx;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .user-balance {
          font-family: DIN-Medium;
          font-weight: 600;
          font-size: 64rpx;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 64rpx;
        }

        .user-address {
          font-size: 24rpx;
          display: flex;
          align-items: center;

          text {
            opacity: 0.7;
            margin-right: 4rpx;
          }

          // overflow: hidden;
        }
      }
    }

    .account-column {
      width: 100%;
      height: 188rpx;
      margin-top: 24rpx;
      display: flex;
      border-radius: 24rpx;
      justify-content: space-around;
      border: 2px solid rgba(44, 54, 90, 0.06);

      .column-item {
        width: 25%;
        color: #2c4364;
        font-size: 28rpx;
        font-weight: 400;
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        text {
          padding-top: 16rpx;
        }
      }
    }

    .coin-list {
      width: 100%;
      margin-top: 48rpx;

      .coinbox {
        width: 100%;
      }
    }
  }

  /deep/ .hintModal {

    .u-modal__content {
      padding: 32rpx;
      padding-top: 48rpx !important;
    }

    .modalContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .modal-title {
        font-size: 32rpx;
        color: #2c365a;
        font-weight: 600;
        line-height: 32rpx;
        margin-top: 32rpx;
      }

      .modal-content {
        font-size: 28rpx;
        color: #8397b1;
        line-height: 42rpx;
        margin-top: 32rpx;
        margin-bottom: 48rpx;
      }

      button {
        width: 622rpx;
        height: 96rpx;
        font-size: 32rpx;
        line-height: 96rpx;
        background: #002fa8;
        color: #ffffff;
      }
    }
  }

  /deep/ .u-tabs__wrapper {
    justify-content: space-between;
  }

  /deep/ .u-tabs__wrapper__scroll-view-wrapper {
    flex: none;
  }

  .title {
    font-size: 34rpx;
    font-weight: 600;
  }

  .copy-icon {
    width: 32rpx;
    height: 32rpx;
  }

  .content {
    padding-top: 33rpx;

    /deep/ .token {
      padding-bottom: 40rpx;
    }

    .coinNumber {
      .number {
        height: 32rpx;
        font-weight: 600;
        font-size: 32rpx;
        color: #2C365A;
        line-height: 32rpx;
        margin-bottom: 20rpx;
      }

      .money {
        height: 28rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #8397B1;
        line-height: 28rpx;
      }
    }

    .border {
      height: 2rpx;
      opacity: 0.16;
      background-color: #8397B1;
    }
  }

  .toast {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) !important;
    width: 240rpx;
    background: rgba(0, 0, 0, .6);
    padding: 0 20rpx 32rpx;
    justify-content: center;
    border-radius: 6rpx;
    z-index: 999999999;

    &-icon {
      text-align: center;
      margin-top: 65rpx;

      image {
        width: 65rpx;
        height: 65rpx;
      }
    }

    &-content {
      margin-top: 20rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #FFFFFF;
      text-align: center;
    }
  }

  .coin-tabs {
    display: flex;
    justify-content: space-between;

    .tabs-item {
      &:not(:first-child) {
        margin-left: 20rpx;
      }
    }

    .tabs {
      display: flex;

      .actived {
        font-family: PingFangSC-S0pxibold;
        font-weight: 600;
        font-size: 34rpx;
        color: #2C365A;

        &:after {
          content: '';
          display: block;
          height: 6rpx;
          width: 65%;
          background-color: #2C365A;
          margin: 10rpx auto 0;
        }
      }
    }
  }
</style>
