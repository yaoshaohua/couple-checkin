<template>
  <view class="container">
    <!-- 顶部欢迎区域 - 全新设计 -->
    <view class="welcome-card">
      <view class="welcome-bg">
        <view class="bubble bubble-1"></view>
        <view class="bubble bubble-2"></view>
        <view class="bubble bubble-3"></view>
        <view class="star star-1">✦</view>
        <view class="star star-2">✧</view>
        <view class="star star-3">✦</view>
      </view>
      <view class="welcome-content">
        <view class="wedding-days">
          <text class="days-number">{{ marriedDays }}</text>
          <text class="days-unit">天</text>
        </view>
        <text class="greeting">我们结婚啦 💕</text>
        <text class="subtitle">✨ {{ weddingDate }} - 至今 ✨</text>
        <view class="date-badge">
          <text class="date-icon">📅</text>
          <text class="date-text">{{ currentDate }}</text>
        </view>
      </view>
    </view>

    <!-- 积分展示区域 - 3D卡片设计 -->
    <view class="score-container">
      <view class="score-card love-card">
        <view class="card-glow love-glow"></view>
        <view class="card-inner">
          <view class="icon-circle love-circle">
            <image src="/static/images/happy.png" class="big-icon-img" mode="aspectFit"></image>
          </view>
          <view class="score-info">
            <text class="score-label">爱意值</text>
            <text class="score-number love-number">{{ loveScore }}</text>
          </view>
        </view>
      </view>

      <view class="score-card resent-card">
        <view class="card-glow resent-glow"></view>
        <view class="card-inner">
          <view class="icon-circle resent-circle">
            <image src="/static/images/sad.png" class="big-icon-img" mode="aspectFit"></image>
          </view>
          <view class="score-info">
            <text class="score-label">怨气值</text>
            <text class="score-number resent-number">{{ resentScore }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷操作按钮 - 可爱卡通风格 -->
    <view class="action-buttons">
      <view class="action-btn love-btn" @click="quickLove">
        <view class="btn-bg">
          <view class="floating-icon icon-1">✨</view>
          <view class="floating-icon icon-2">💫</view>
          <view class="floating-icon icon-3">⭐</view>
        </view>
        <view class="btn-content">
          <view class="btn-icon-wrap">
            <image src="/static/images/happy-active.png" class="btn-emoji-img" mode="aspectFit"></image>
          </view>
          <text class="btn-title">开心打卡</text>
          <text class="btn-desc">记录甜蜜时刻</text>
        </view>
      </view>

      <view class="action-btn resent-btn" @click="quickResent">
        <view class="btn-bg">
          <view class="floating-icon icon-1">💨</view>
          <view class="floating-icon icon-2">💢</view>
          <view class="floating-icon icon-3">💭</view>
        </view>
        <view class="btn-content">
          <view class="btn-icon-wrap">
            <image src="/static/images/sad-active.png" class="btn-emoji-img" mode="aspectFit"></image>
          </view>
          <text class="btn-title">生气记录</text>
          <text class="btn-desc">吐槽一下嘛</text>
        </view>
      </view>
    </view>

    <!-- 底部导航提示 - 可爱风格 -->
    <view class="bottom-hint">
      <view class="hint-card">
        <text class="hint-icon">👇</text>
        <text class="hint-text">点击底部菜单查看更多功能哦</text>
      </view>
    </view>

    <!-- 自定义打卡弹窗 - 可爱风格 -->
    <view v-if="showDialog" class="modal-overlay" @click="hideDialog">
      <view class="modal-wrapper" @click.stop>
        <view class="modal-card">
          <view class="modal-header">
            <text class="modal-title">💝 自定义打卡</text>
            <view class="close-btn" @click="hideDialog">
              <text class="close-icon">✕</text>
            </view>
          </view>
          
          <view class="modal-body">
            <view class="input-group">
              <view class="cute-label">
                <text class="label-text">选择类型</text>
              </view>
              <view class="type-selector">
                <view 
                  :class="getTypeItemClass('love')"
                  @click="setCustomType('love')"
                >
                  <image src="/static/images/happy-active.png" class="type-emoji-img" mode="aspectFit"></image>
                  <text class="type-name">开心</text>
                </view>
                <view 
                  :class="getTypeItemClass('resent')"
                  @click="setCustomType('resent')"
                >
                  <image src="/static/images/sad-active.png" class="type-emoji-img" mode="aspectFit"></image>
                  <text class="type-name">生气</text>
                </view>
              </view>
            </view>

            <view class="input-group">
              <view class="cute-label">
                <text class="label-text">记录原因</text>
              </view>
              <view class="textarea-wrapper">
                <textarea 
                  v-model="customReason" 
                  class="reason-input" 
                  placeholder="说说发生了什么..."
                  placeholder-class="input-placeholder"
                  maxlength="50"
                  :auto-height="true"
                />
                <text class="char-count">{{ customReason.length }}/50</text>
              </view>
            </view>

            <view class="input-group">
              <view class="cute-label">
                <text class="label-text">选择积分</text>
              </view>
              <view class="score-grid">
                <view 
                  v-for="s in [1, 2, 3, 5, 10]" 
                  :key="s"
                  :class="getScoreItemClass(s)"
                  @click="setCustomScore(s)"
                >
                  <text class="score-value">{{ s }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="modal-footer">
            <view class="footer-btn cancel" @click="hideDialog">
              <text class="btn-text">取消</text>
            </view>
            <view class="footer-btn confirm" @click="confirmCustomCheckin">
              <text class="btn-text">✨ 确定打卡</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showDialog: false,
      customType: 'love',
      customReason: '',
      customScore: 1
    }
  },

  computed: {
    ...mapState(['loveScore', 'resentScore', 'userInfo']),
    
    marriedDays() {
      const weddingDate = new Date('2025-06-07')
      const today = new Date()
      const diffTime = today - weddingDate
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays >= 0 ? diffDays : 0
    },
    
    weddingDate() {
      return '2025.06.07'
    },
    
    currentDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekDays = ['日', '一', '二', '三', '四', '五', '六']
      const weekDay = weekDays[date.getDay()]
      return `${year}年${month}月${day}日 星期${weekDay}`
    }
  },

  methods: {
    getTypeItemClass(type) {
      return this.customType === type ? 'type-item active' : 'type-item'
    },
    
    setCustomType(type) {
      this.customType = type
    },
    
    getScoreItemClass(score) {
      return this.customScore === score ? 'score-item active' : 'score-item'
    },
    
    setCustomScore(score) {
      this.customScore = score
    },
    
    quickLove() {
      uni.showModal({
        title: '开心时刻 💕',
        editable: true,
        placeholderText: '说说为什么开心...',
        content: '',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            const reason = res.content && res.content.trim() ? res.content : '开心打卡'
            
            this.$store.dispatch('addLoveScore', {
              score: 1,
              reason: reason
            })
            
            uni.showToast({
              title: '❤️ +1',
              icon: 'none',
              duration: 1000
            })
            uni.vibrateShort()
          }
        }
      })
    },
    
    quickResent() {
      uni.showModal({
        title: '生气时刻 😤',
        editable: true,
        placeholderText: '说说为什么生气...',
        content: '',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            const reason = res.content && res.content.trim() ? res.content : '生气记录'
            
            this.$store.dispatch('addResentScore', {
              score: 1,
              reason: reason
            })
            
            uni.showToast({
              title: '😤 +1',
              icon: 'none',
              duration: 1000
            })
            uni.vibrateShort()
          }
        }
      })
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
        title: '✨ 打卡成功',
        icon: 'success'
      })

      this.hideDialog()
      uni.vibrateShort()
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFE8F0 0%, #FFF5F8 30%, #FFFBFC 100%);
  padding-bottom: 120rpx;
  overflow-x: hidden;
  width: 100%;
}

/* 顶部欢迎卡片 - 可爱卡通风格 */
.welcome-card {
  position: relative;
  height: 380rpx;
  margin: 24rpx 28rpx 32rpx;
  border-radius: 36rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF9EC4 100%);
  box-shadow: 0 12rpx 36rpx rgba(255, 107, 157, 0.3);
}

.welcome-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  animation: bubble 10s ease-in-out infinite;
}

.bubble-1 {
  width: 160rpx;
  height: 160rpx;
  top: -40rpx;
  right: 30rpx;
  animation-delay: 0s;
}

.bubble-2 {
  width: 100rpx;
  height: 100rpx;
  bottom: 40rpx;
  left: 20rpx;
  animation-delay: 3s;
}

.bubble-3 {
  width: 80rpx;
  height: 80rpx;
  top: 120rpx;
  right: 100rpx;
  animation-delay: 6s;
}

.star {
  position: absolute;
  color: rgba(255, 255, 255, 0.4);
  font-size: 40rpx;
  animation: twinkle 2.5s ease-in-out infinite;
}

.star-1 {
  top: 50rpx;
  left: 60rpx;
  animation-delay: 0s;
}

.star-2 {
  bottom: 100rpx;
  right: 80rpx;
  font-size: 32rpx;
  animation-delay: 1s;
}

.star-3 {
  top: 140rpx;
  left: 140rpx;
  font-size: 28rpx;
  animation-delay: 2s;
}

@keyframes bubble {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.15;
  }
  50% {
    transform: translate(-15rpx, -20rpx) scale(1.15);
    opacity: 0.2;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3) rotate(10deg);
  }
}

.welcome-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 28rpx 40rpx;
  box-sizing: border-box;
}

.wedding-days {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  margin-bottom: 12rpx;
}

.days-number {
  font-size: 96rpx;
  font-weight: 900;
  color: #ffffff;
  font-family: 'DIN Alternate', 'Helvetica', sans-serif;
  text-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.2);
  line-height: 1;
  letter-spacing: -3rpx;
}

.days-unit {
  font-size: 40rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 3rpx 12rpx rgba(0, 0, 0, 0.15);
}

.greeting {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12rpx;
  text-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
  letter-spacing: 2rpx;
}

.subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 16rpx;
  letter-spacing: 1rpx;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 26rpx;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50rpx;
  backdrop-filter: blur(20rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.date-icon {
  font-size: 24rpx;
}

.date-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 积分卡片 - 可爱卡通风格 */
.score-container {
  display: flex;
  gap: 28rpx;
  margin: 0 28rpx 40rpx;
}

.score-card {
  flex: 1;
  position: relative;
  border-radius: 36rpx;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  right: -10rpx;
  bottom: -10rpx;
  opacity: 0.5;
  filter: blur(40rpx);
  z-index: 0;
  pointer-events: none;
}

.love-glow {
  background: radial-gradient(circle, rgba(255, 107, 157, 0.5) 0%, transparent 70%);
}

.resent-glow {
  background: radial-gradient(circle, rgba(100, 181, 246, 0.5) 0%, transparent 70%);
}

.card-inner {
  position: relative;
  z-index: 1;
  background: #ffffff;
  padding: 48rpx 36rpx;
  border-radius: 36rpx;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.1);
  border: 4rpx solid rgba(255, 107, 157, 0.1);
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.resent-card .card-inner {
  border-color: rgba(100, 181, 246, 0.1);
}

.icon-circle {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8rpx);
  }
}

.love-circle {
  background: linear-gradient(135deg, #FFD6E7 0%, #FFC1DC 100%);
}

.resent-circle {
  background: linear-gradient(135deg, #D4EDFC 0%, #C1E5FC 100%);
}

.big-icon {
  font-size: 60rpx;
  z-index: 1;
}

.big-icon-img {
  width: 70rpx;
  height: 70rpx;
  z-index: 1;
}

.score-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.score-label {
  font-size: 28rpx;
  color: #999999;
  font-weight: 600;
}

.score-number {
  font-size: 88rpx;
  font-weight: 900;
  font-family: 'DIN Alternate', 'Helvetica', sans-serif;
  line-height: 1;
}

.love-number {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.resent-number {
  background: linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 快捷操作按钮 - 超可爱卡通风格 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  margin: 0 28rpx 40rpx;
}

.action-btn {
  position: relative;
  height: 160rpx;
  border-radius: 36rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.action-btn:active {
  transform: scale(0.96);
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.15);
}

.love-btn {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA9CE 50%, #FFB6D9 100%);
}

.resent-btn {
  background: linear-gradient(135deg, #64B5F6 0%, #90CAF9 50%, #A5D6FA 100%);
}

.btn-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  font-size: 48rpx;
  opacity: 0.2;
  animation: float-icon 4s ease-in-out infinite;
}

.icon-1 {
  top: 20rpx;
  right: 40rpx;
  animation-delay: 0s;
}

.icon-2 {
  bottom: 30rpx;
  left: 50rpx;
  animation-delay: 1.5s;
}

.icon-3 {
  top: 80rpx;
  left: 25%;
  font-size: 36rpx;
  animation-delay: 3s;
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-15rpx) rotate(10deg);
    opacity: 0.3;
  }
}

.btn-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 40rpx;
  gap: 32rpx;
}

.btn-icon-wrap {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.btn-emoji {
  font-size: 50rpx;
}

.btn-emoji-img {
  width: 56rpx;
  height: 56rpx;
}

.btn-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 3rpx 12rpx rgba(0, 0, 0, 0.2);
  letter-spacing: 2rpx;
  margin-bottom: 8rpx;
  display: block;
}

.btn-desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  display: block;
}

/* 底部提示 - 可爱风格 */
.bottom-hint {
  margin: 0 28rpx 40rpx;
}

.hint-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  padding: 28rpx;
  background: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.08);
  border: 3rpx dashed #FFD6E7;
}

.hint-icon {
  font-size: 36rpx;
  animation: point 1.5s ease-in-out infinite;
}

@keyframes point {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8rpx);
  }
}

.hint-text {
  font-size: 28rpx;
  color: #999999;
  font-weight: 600;
}

/* 弹窗样式 - 超可爱风格 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: overlay-in 0.3s ease-out;
  backdrop-filter: blur(6rpx);
}

@keyframes overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-wrapper {
  width: 100%;
  animation: modal-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-card {
  background: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  overflow: hidden;
}

.modal-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36rpx 80rpx;
  background: linear-gradient(135deg, #FFF8FA 0%, #FFF0F5 100%);
  border-bottom: 2rpx solid #FFE8F0;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #FF6B9D;
  letter-spacing: 2rpx;
}

.close-btn {
  position: absolute;
  right: 28rpx;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.close-btn:active {
  transform: scale(0.88) rotate(90deg);
  background: #F8F8F8;
}

.close-icon {
  font-size: 32rpx;
  color: #999999;
  line-height: 1;
  font-weight: 400;
}

.modal-body {
  padding: 36rpx 32rpx;
  max-height: 75vh;
  overflow-y: auto;
}

.input-group {
  margin-bottom: 36rpx;
}

.input-group:last-child {
  margin-bottom: 0;
}

.cute-label {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
}

.label-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #333333;
}

.type-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 36rpx 24rpx;
  background: #F8F8F8;
  border-radius: 28rpx;
  border: 4rpx solid transparent;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.type-item:active {
  transform: scale(0.92);
}

.type-item.active {
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE5EE 100%);
  border-color: #FF6B9D;
  box-shadow: 0 12rpx 32rpx rgba(255, 107, 157, 0.2);
  transform: scale(1.03);
}

.type-emoji {
  font-size: 56rpx;
  animation: emoji-bounce 2s ease-in-out infinite;
}

.type-emoji-img {
  width: 64rpx;
  height: 64rpx;
  animation: emoji-bounce 2s ease-in-out infinite;
}

@keyframes emoji-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6rpx);
  }
}

.type-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #666666;
}

.type-item.active .type-name {
  color: #FF6B9D;
}

.textarea-wrapper {
  position: relative;
  background: #F8F8F8;
  border-radius: 28rpx;
  border: 4rpx solid transparent;
  transition: all 0.3s;
  min-height: 160rpx;
}

.textarea-wrapper:focus-within {
  background: #ffffff;
  border-color: #FF6B9D;
  box-shadow: 0 6rpx 20rpx rgba(255, 107, 157, 0.15);
}

.reason-input {
  width: 100%;
  min-height: 140rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
  background: transparent;
  line-height: 1.6;
}

.input-placeholder {
  color: #CCCCCC;
}

.char-count {
  position: absolute;
  right: 24rpx;
  bottom: 20rpx;
  font-size: 22rpx;
  color: #CCCCCC;
  font-weight: 600;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16rpx;
}

.score-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx 16rpx;
  background: #F8F8F8;
  border-radius: 24rpx;
  border: 4rpx solid transparent;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.score-item:active {
  transform: scale(0.88);
}

.score-item.active {
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE5EE 100%);
  border-color: #FF6B9D;
  box-shadow: 0 10rpx 28rpx rgba(255, 107, 157, 0.2);
  transform: scale(1.08);
}

.score-value {
  font-size: 40rpx;
  font-weight: 900;
  color: #666666;
  font-family: 'DIN Alternate', sans-serif;
  line-height: 1;
}

.score-item.active .score-value {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 28rpx 32rpx;
  padding-bottom: calc(28rpx + env(safe-area-inset-bottom));
  background: linear-gradient(135deg, #FFF8FA 0%, #FFF0F5 100%);
  border-top: 2rpx solid #FFE8F0;
}

.footer-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
  border-radius: 50rpx;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.footer-btn:active {
  transform: scale(0.94);
}

.cancel {
  background: #ffffff;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  border: 3rpx solid #F5F5F5;
}

.cancel .btn-text {
  color: #999999;
  font-weight: 700;
}

.confirm {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA9CE 100%);
  box-shadow: 0 12rpx 32rpx rgba(255, 107, 157, 0.4);
}

.confirm .btn-text {
  color: #ffffff;
}

.btn-text {
  font-size: 30rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
}
</style>
