<template>
  <view class="container">
    <!-- 顶部欢迎区域 -->
    <view class="welcome-card card">
      <view class="welcome-text">
        <text class="greeting">Hi~ {{ userInfo.myName }} & {{ userInfo.partnerName }}</text>
        <text class="subtitle">记录每一个爱的瞬间 💕</text>
      </view>
    </view>

    <!-- 积分展示区域 -->
    <view class="score-container">
      <view class="score-card love-card card">
        <view class="score-icon">❤️</view>
        <view class="score-info">
          <text class="score-label">爱意积分</text>
          <text class="score-value">{{ loveScore }}</text>
        </view>
        <view class="score-tip">+{{ loveScore * 10 }} 甜蜜值</view>
      </view>

      <view class="score-card resent-card card">
        <view class="score-icon">😤</view>
        <view class="score-info">
          <text class="score-label">怨气积分</text>
          <text class="score-value">{{ resentScore }}</text>
        </view>
        <view class="score-tip">可兑换任务</view>
      </view>
    </view>

    <!-- 快捷打卡区域 -->
    <view class="checkin-section card">
      <view class="section-title">
        <text>快捷打卡</text>
        <text class="section-subtitle">记录此刻的心情</text>
      </view>

      <view class="checkin-type">
        <text class="type-title">❤️ 开心时刻</text>
        <view class="checkin-btns">
          <view 
            v-for="item in loveOptions" 
            :key="item.value"
            class="checkin-btn love-btn"
            @click="handleCheckin('love', item)"
          >
            <text class="btn-icon">{{ item.icon }}</text>
            <text class="btn-text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="checkin-type">
        <text class="type-title">😤 生气时刻</text>
        <view class="checkin-btns">
          <view 
            v-for="item in resentOptions" 
            :key="item.value"
            class="checkin-btn resent-btn"
            @click="handleCheckin('resent', item)"
          >
            <text class="btn-icon">{{ item.icon }}</text>
            <text class="btn-text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="custom-checkin" @click="showCustomDialog">
        <text class="custom-icon">✏️</text>
        <text class="custom-text">自定义打卡</text>
      </view>
    </view>

    <!-- 最近记录 -->
    <view class="recent-section card">
      <view class="section-title">
        <text>最近记录</text>
        <text class="more-btn" @click="goToRecord">查看全部 →</text>
      </view>
      
      <view v-if="recentRecords.length === 0" class="empty-tip">
        <text>暂无记录，快去打卡吧~</text>
      </view>
      
      <view v-else class="record-list">
        <view 
          v-for="record in recentRecords" 
          :key="record.id"
          class="record-item"
        >
          <view class="record-icon">{{ record.type === 'love' ? '❤️' : '😤' }}</view>
          <view class="record-content">
            <text class="record-reason">{{ record.reason }}</text>
            <text class="record-time">{{ formatTime(record.time) }}</text>
          </view>
          <view :class="['record-score', record.type === 'love' ? 'love-score' : 'resent-score']">
            +{{ record.score }}
          </view>
        </view>
      </view>
    </view>

    <!-- 自定义打卡弹窗 -->
    <view v-if="showDialog" class="dialog-mask" @click="hideDialog">
      <view class="dialog-content" @click.stop>
        <view class="dialog-title">自定义打卡</view>
        
        <view class="dialog-form">
          <view class="form-item">
            <text class="form-label">类型</text>
            <view class="radio-group">
              <view 
                :class="['radio-item', customType === 'love' ? 'active' : '']"
                @click="customType = 'love'"
              >
                ❤️ 爱意
              </view>
              <view 
                :class="['radio-item', customType === 'resent' ? 'active' : '']"
                @click="customType = 'resent'"
              >
                😤 怨气
              </view>
            </view>
          </view>

          <view class="form-item">
            <text class="form-label">原因</text>
            <input 
              v-model="customReason" 
              class="form-input" 
              placeholder="说说发生了什么..."
              maxlength="30"
            />
          </view>

          <view class="form-item">
            <text class="form-label">积分</text>
            <view class="score-picker">
              <view 
                v-for="s in [1, 2, 3, 5, 10]" 
                :key="s"
                :class="['score-option', customScore === s ? 'active' : '']"
                @click="customScore = s"
              >
                {{ s }}
              </view>
            </view>
          </view>
        </view>

        <view class="dialog-btns">
          <button class="dialog-btn cancel-btn" @click="hideDialog">取消</button>
          <button class="dialog-btn confirm-btn" @click="confirmCustomCheckin">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { formatRelativeTime } from '../../utils/index'

export default {
  data() {
    return {
      loveOptions: [
        { icon: '😊', label: '小开心', value: 'small_happy', score: 1 },
        { icon: '😍', label: '很开心', value: 'happy', score: 2 },
        { icon: '🥰', label: '超开心', value: 'super_happy', score: 3 },
        { icon: '💝', label: '收到礼物', value: 'gift', score: 5 }
      ],
      resentOptions: [
        { icon: '😠', label: '小生气', value: 'small_angry', score: 1 },
        { icon: '😡', label: '很生气', value: 'angry', score: 2 },
        { icon: '🤬', label: '超生气', value: 'super_angry', score: 3 },
        { icon: '💢', label: '吵架了', value: 'fight', score: 5 }
      ],
      showDialog: false,
      customType: 'love',
      customReason: '',
      customScore: 1
    }
  },

  computed: {
    ...mapState(['loveScore', 'resentScore', 'records', 'userInfo']),
    
    recentRecords() {
      return this.records.slice(0, 5)
    }
  },

  methods: {
    handleCheckin(type, item) {
      const action = type === 'love' ? 'addLoveScore' : 'addResentScore'
      
      this.$store.dispatch(action, {
        score: item.score,
        reason: item.label
      })

      uni.showToast({
        title: `${item.icon} ${item.label} +${item.score}`,
        icon: 'none',
        duration: 1500
      })

      // 添加震动反馈
      uni.vibrateShort()
    },

    showCustomDialog() {
      this.showDialog = true
      this.customReason = ''
      this.customScore = 1
      this.customType = 'love'
    },

    hideDialog() {
      this.showDialog = false
    },

    confirmCustomCheckin() {
      if (!this.customReason.trim()) {
        uni.showToast({
          title: '请输入原因',
          icon: 'none'
        })
        return
      }

      const action = this.customType === 'love' ? 'addLoveScore' : 'addResentScore'
      
      this.$store.dispatch(action, {
        score: this.customScore,
        reason: this.customReason
      })

      uni.showToast({
        title: '打卡成功',
        icon: 'success'
      })

      this.hideDialog()
      uni.vibrateShort()
    },

    formatTime(time) {
      return formatRelativeTime(time)
    },

    goToRecord() {
      uni.switchTab({
        url: '/pages/record/record'
      })
    }
  }
}
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  color: #ffffff;
  text-align: center;
  padding: 40rpx 30rpx;
}

.greeting {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 24rpx;
  opacity: 0.9;
  display: block;
}

.score-container {
  display: flex;
  gap: 20rpx;
  margin: 20rpx 0;
}

.score-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx;
}

.love-card {
  background: linear-gradient(135deg, #FFE5EE 0%, #FFF0F5 100%);
}

.resent-card {
  background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
}

.score-icon {
  font-size: 60rpx;
  margin-bottom: 10rpx;
}

.score-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10rpx;
}

.score-label {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 5rpx;
}

.score-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #FF6B9D;
}

.resent-card .score-value {
  color: #1890FF;
}

.score-tip {
  font-size: 20rpx;
  color: #999999;
}

.checkin-section {
  margin: 20rpx 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.section-subtitle {
  font-size: 24rpx;
  color: #999999;
  font-weight: normal;
}

.more-btn {
  font-size: 24rpx;
  color: #FF6B9D;
  font-weight: normal;
}

.checkin-type {
  margin-bottom: 30rpx;
}

.type-title {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
}

.checkin-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.checkin-btn {
  flex: 0 0 calc(50% - 7.5rpx);
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 15rpx;
  transition: all 0.3s;
}

.love-btn {
  background: #FFE5EE;
}

.love-btn:active {
  background: #FFD1E0;
  transform: scale(0.98);
}

.resent-btn {
  background: #E8F4FD;
}

.resent-btn:active {
  background: #D0E8FA;
  transform: scale(0.98);
}

.btn-icon {
  font-size: 40rpx;
  margin-right: 15rpx;
}

.btn-text {
  font-size: 28rpx;
  color: #333333;
}

.custom-checkin {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25rpx;
  background: linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%);
  border-radius: 15rpx;
  border: 2rpx dashed #CCCCCC;
  margin-top: 20rpx;
}

.custom-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.custom-text {
  font-size: 28rpx;
  color: #666666;
}

.recent-section {
  margin: 20rpx 0;
}

.empty-tip {
  text-align: center;
  padding: 60rpx 0;
  color: #999999;
  font-size: 28rpx;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #F8F8F8;
  border-radius: 12rpx;
}

.record-icon {
  font-size: 40rpx;
  margin-right: 15rpx;
}

.record-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.record-reason {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 5rpx;
}

.record-time {
  font-size: 22rpx;
  color: #999999;
}

.record-score {
  font-size: 28rpx;
  font-weight: bold;
}

.love-score {
  color: #FF6B9D;
}

.resent-score {
  color: #1890FF;
}

/* 弹窗样式 */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  width: 600rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
}

.dialog-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 30rpx;
}

.dialog-form {
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 15rpx;
}

.radio-group {
  display: flex;
  gap: 15rpx;
}

.radio-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  background: #F5F5F5;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #666666;
  border: 2rpx solid transparent;
}

.radio-item.active {
  background: #FFE5EE;
  color: #FF6B9D;
  border-color: #FF6B9D;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  background: #F5F5F5;
  border-radius: 10rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.score-picker {
  display: flex;
  gap: 15rpx;
}

.score-option {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  background: #F5F5F5;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #666666;
  border: 2rpx solid transparent;
}

.score-option.active {
  background: #FFE5EE;
  color: #FF6B9D;
  border-color: #FF6B9D;
  font-weight: bold;
}

.dialog-btns {
  display: flex;
  gap: 20rpx;
}

.dialog-btn {
  flex: 1;
  padding: 25rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  border: none;
}

.cancel-btn {
  background: #F5F5F5;
  color: #666666;
}

.confirm-btn {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  color: #ffffff;
}
</style>
