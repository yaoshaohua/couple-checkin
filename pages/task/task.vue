<template>
  <view class="container">
    <!-- 背景装饰元素 -->
    <view class="background-decoration">
      <view class="bubble bubble-1"></view>
      <view class="bubble bubble-2"></view>
      <view class="bubble bubble-3"></view>
      <view class="star star-1">✦</view>
      <view class="star star-2">✧</view>
      <view class="star star-3">✦</view>
      <view class="cloud cloud-1">☁️</view>
      <view class="cloud cloud-2">☁️</view>
    </view>

    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">福利兑换</text>
      <text class="page-subtitle">✨ 用怨气积分给TA整点活儿~ ✨</text>
    </view>

    <!-- 怨气积分显示 -->
    <view class="score-banner card">
      <view class="banner-glow"></view>
      <view class="banner-content">
        <view class="banner-icon">
          <image src="/static/images/angry.png" mode="aspectFit"></image>
        </view>
        <view class="banner-info">
          <text class="banner-label">当前怨气值</text>
          <text class="banner-score">{{ resentScore }}</text>
        </view>
      </view>
    </view>

    <!-- 待完成任务 -->
    <view v-if="pendingTasks.length > 0" class="section">
      <view class="section-header">
        <text class="section-title">⏰ 待完成任务</text>
        <view class="section-badge">{{ pendingTasks.length }}</view>
      </view>

      <view class="task-list">
        <view 
          v-for="record in pendingTasks" 
          :key="record.id"
          class="task-record card"
        >
          <view class="task-record-header">
            <text class="task-record-name">{{ record.taskName }}</text>
            <text class="task-record-cost">-{{ record.cost }}积分</text>
          </view>
          <text class="task-record-time">兑换时间：{{ formatTime(record.time) }}</text>
          <button class="complete-btn" @click="completeTask(record)">
            ✅ 标记完成
          </button>
        </view>
      </view>
    </view>

    <!-- 可兑换任务 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">🎁 可兑换任务</text>
      </view>

      <view class="tasks-grid">
        <view 
          v-for="task in tasks" 
          :key="task.id"
          :class="['task-card', resentScore >= task.cost ? 'can-exchange' : 'cannot-exchange']"
          @click="handleExchange(task)"
        >
          <view class="task-icon">{{ task.icon }}</view>
          <view class="task-info">
            <text class="task-name">{{ task.name }}</text>
            <text class="task-desc">{{ task.description }}</text>
          </view>
          <view class="task-cost">
            <text class="cost-value">{{ task.cost }}</text>
            <text class="cost-label">积分</text>
          </view>
          <view v-if="resentScore < task.cost" class="task-lock">🔒</view>
        </view>
      </view>
    </view>

    <!-- 自定义任务按钮 -->
    <view class="custom-task-btn" @click="showCustomTaskDialog">
      <view class="btn-bg">
        <view class="floating-icon icon-1">✨</view>
        <view class="floating-icon icon-2">💫</view>
        <view class="floating-icon icon-3">⭐</view>
      </view>
      <text class="custom-icon">➕</text>
      <text class="custom-text">自定义任务</text>
    </view>

    <!-- 已完成任务 -->
    <view v-if="completedTasks.length > 0" class="section">
      <view class="section-header">
        <text class="section-title">✅ 已完成任务</text>
        <view class="section-badge">{{ completedTasks.length }}</view>
      </view>

      <view class="completed-list">
        <view 
          v-for="record in completedTasks.slice(0, 5)" 
          :key="record.id"
          class="completed-item"
        >
          <text class="completed-name">{{ record.taskName }}</text>
          <text class="completed-time">{{ formatTime(record.completeTime) }}</text>
        </view>
      </view>
    </view>

    <!-- 自定义任务弹窗 -->
    <view v-if="showDialog" class="dialog-mask" @click="hideDialog">
      <view class="dialog-content" @click.stop>
        <view class="dialog-title">自定义任务</view>
        
        <view class="dialog-form">
          <view class="form-item">
            <text class="form-label">任务图标</text>
            <view class="icon-picker">
              <view 
                v-for="icon in iconOptions" 
                :key="icon"
                :class="['icon-option', customIcon === icon ? 'active' : '']"
                @click="customIcon = icon"
              >
                {{ icon }}
              </view>
            </view>
          </view>

          <view class="form-item">
            <text class="form-label">任务名称</text>
            <input 
              v-model="customName" 
              class="form-input" 
              placeholder="例如：洗碗"
              maxlength="10"
            />
          </view>

          <view class="form-item">
            <text class="form-label">任务描述</text>
            <input 
              v-model="customDesc" 
              class="form-input" 
              placeholder="例如：洗一次碗"
              maxlength="20"
            />
          </view>

          <view class="form-item">
            <text class="form-label">所需积分</text>
            <view class="score-picker">
              <view 
                v-for="s in [2, 3, 5, 8, 10]" 
                :key="s"
                :class="['score-option', customCost === s ? 'active' : '']"
                @click="customCost = s"
              >
                {{ s }}
              </view>
            </view>
          </view>
        </view>

        <view class="dialog-btns">
          <button class="dialog-btn cancel-btn" @click="hideDialog">取消</button>
          <button class="dialog-btn confirm-btn" @click="confirmCustomTask">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatTime } from '../../utils/index'

export default {
  data() {
    return {
      showDialog: false,
      customIcon: '🍽️',
      customName: '',
      customDesc: '',
      customCost: 3,
      iconOptions: ['🍽️', '🍳', '👔', '🧹', '🗑️', '💆', '🎬', '🛍️', '🎮', '📺', '🏃', '🎵']
    }
  },

  computed: {
    ...mapState(['resentScore', 'tasks', 'exchangeRecords']),
    ...mapGetters(['pendingTasks', 'completedTasks'])
  },

  methods: {
    handleExchange(task) {
      if (this.resentScore < task.cost) {
        uni.showToast({
          title: '怨气积分不足',
          icon: 'none'
        })
        return
      }

      uni.showModal({
        title: '确认兑换',
        content: `确定要用 ${task.cost} 怨气积分兑换"${task.name}"吗？`,
        success: (res) => {
          if (res.confirm) {
            const success = this.$store.dispatch('exchangeTask', task)
            if (success) {
              uni.showToast({
                title: '兑换成功',
                icon: 'success'
              })
              uni.vibrateShort()
            }
          }
        }
      })
    },

    completeTask(record) {
      uni.showModal({
        title: '确认完成',
        content: `确认"${record.taskName}"已经完成了吗？`,
        success: (res) => {
          if (res.confirm) {
            this.$store.dispatch('completeTask', record.id)
            uni.showToast({
              title: '任务完成 🎉',
              icon: 'success'
            })
            uni.vibrateShort()
          }
        }
      })
    },

    showCustomTaskDialog() {
      this.showDialog = true
      this.customName = ''
      this.customDesc = ''
      this.customIcon = '🍽️'
      this.customCost = 3
    },

    hideDialog() {
      this.showDialog = false
    },

    confirmCustomTask() {
      if (!this.customName.trim()) {
        uni.showToast({
          title: '请输入任务名称',
          icon: 'none'
        })
        return
      }

      if (!this.customDesc.trim()) {
        uni.showToast({
          title: '请输入任务描述',
          icon: 'none'
        })
        return
      }

      this.$store.dispatch('addCustomTask', {
        icon: this.customIcon,
        name: this.customName,
        description: this.customDesc,
        cost: this.customCost
      })

      uni.showToast({
        title: '添加成功',
        icon: 'success'
      })

      this.hideDialog()
    },

    formatTime(time) {
      return formatTime(time)
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F4FD 0%, #F0F8FF 30%, #FFFBFC 100%);
  padding: 24rpx 24rpx 120rpx;
  position: relative;
  overflow-x: hidden;
}

/* 背景装饰元素 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.1);
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
  color: rgba(24, 144, 255, 0.4);
  font-size: 40rpx;
  text-shadow: 0 2rpx 8rpx rgba(24, 144, 255, 0.3);
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

.cloud {
  position: absolute;
  font-size: 60rpx;
  animation: float-cloud 8s ease-in-out infinite;
}

.cloud-1 {
  top: 80rpx;
  right: 120rpx;
  animation-delay: 0s;
}

.cloud-2 {
  bottom: 150rpx;
  left: 100rpx;
  animation-delay: 4s;
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

@keyframes float-cloud {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(20rpx);
  }
}

/* 页面标题 */
.page-header {
  text-align: center;
  padding: 40rpx 0 32rpx;
  position: relative;
  z-index: 1;
}

.page-title {
  display: block;
  font-size: 48rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #1890FF 0%, #40A9FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12rpx;
  letter-spacing: 2rpx;
}

.page-subtitle {
  display: block;
  font-size: 26rpx;
  color: #999999;
  font-weight: 500;
  letter-spacing: 1rpx;
}

/* 卡片通用样式 */
.card {
  position: relative;
  border-radius: 36rpx;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.1);
}

.score-banner {
  background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
  padding: 36rpx;
  margin-bottom: 32rpx;
  position: relative;
}

.banner-glow {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  right: -10rpx;
  bottom: -10rpx;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.3) 0%, transparent 70%);
  filter: blur(40rpx);
  z-index: 0;
  pointer-events: none;
}

.banner-content {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
  position: relative;
  z-index: 1;
}

.banner-icon {
  margin-right: 20rpx;
  animation: shake 2s ease-in-out infinite;
}
.banner-icon image {
  width: 80rpx;
  height: 80rpx;
}

@keyframes shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.banner-info {
  display: flex;
  flex-direction: column;
}

.banner-label {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 5rpx;
  font-weight: 600;
}

.banner-score {
  font-size: 56rpx;
  font-weight: 900;
  color: #1890FF;
  font-family: 'DIN Alternate', 'Helvetica', sans-serif;
}

.banner-tip {
  font-size: 24rpx;
  color: #999999;
  text-align: center;
  position: relative;
  z-index: 1;
  font-weight: 500;
}

.section {
  margin-bottom: 32rpx;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 4rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333333;
}

.section-badge {
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
  color: #1890FF;
  font-size: 24rpx;
  font-weight: 700;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.2);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.task-record {
  padding: 28rpx;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FBFF 100%);
  border: 2rpx solid rgba(24, 144, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.task-record:active {
  transform: scale(0.98);
}

.task-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.task-record-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #333333;
}

.task-record-cost {
  font-size: 24rpx;
  color: #1890FF;
  font-weight: 700;
}

.task-record-time {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 16rpx;
}

.complete-btn {
  width: 100%;
  padding: 22rpx;
  background: linear-gradient(135deg, #52C41A 0%, #73D13D 100%);
  color: #ffffff;
  border-radius: 50rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 20rpx rgba(82, 196, 26, 0.3);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.complete-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(82, 196, 26, 0.2);
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  padding: 0 4rpx;
}

.task-card {
  position: relative;
  background: #ffffff;
  border-radius: 32rpx;
  padding: 28rpx;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300rpx;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 3rpx solid transparent;
}

.task-card.can-exchange {
  border-color: rgba(24, 144, 255, 0.2);
}

.task-card.can-exchange:active {
  transform: scale(0.98);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.task-card.cannot-exchange {
  opacity: 0.5;
  filter: grayscale(0.5);
}

.task-icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 16rpx;
}

.task-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #333333;
  margin-bottom: 8rpx;
}

.task-desc {
  font-size: 24rpx;
  color: #999999;
  line-height: 1.5;
}

.task-cost {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 24rpx;
  background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
  border-radius: 50rpx;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.2);
}

.cost-value {
  font-size: 36rpx;
  font-weight: 900;
  color: #1890FF;
  font-family: 'DIN Alternate', 'Helvetica', sans-serif;
}

.cost-label {
  font-size: 22rpx;
  color: #1890FF;
  font-weight: 600;
}

.task-lock {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  font-size: 32rpx;
  animation: shake 2s ease-in-out infinite;
}

.custom-task-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  margin: 24rpx 4rpx;
  background: linear-gradient(135deg, #FFFBFC 0%, #FFF5F8 100%);
  border-radius: 32rpx;
  border: 3rpx dashed rgba(255, 107, 157, 0.3);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 12rpx 36rpx rgba(255, 107, 157, 0.15);
}

.custom-task-btn:active {
  transform: scale(0.98);
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 157, 0.2);
}

.btn-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  font-size: 24rpx;
  opacity: 0.4;
  animation: float-icon 3s ease-in-out infinite;
}

.icon-1 {
  top: 20rpx;
  left: 30rpx;
  animation-delay: 0s;
}

.icon-2 {
  top: 40rpx;
  right: 40rpx;
  animation-delay: 1s;
}

.icon-3 {
  bottom: 20rpx;
  left: 50%;
  animation-delay: 2s;
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15rpx) rotate(15deg);
  }
}

.custom-icon {
  font-size: 36rpx;
  margin-right: 12rpx;
  position: relative;
  z-index: 1;
}

.custom-text {
  font-size: 30rpx;
  color: #FF6B9D;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.completed-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 0 4rpx;
}

.completed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 28rpx;
  background: linear-gradient(135deg, #F8F8F8 0%, #F0F0F0 100%);
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.completed-item:active {
  transform: scale(0.98);
}

.completed-name {
  font-size: 28rpx;
  color: #999999;
  text-decoration: line-through;
  font-weight: 500;
}

.completed-time {
  font-size: 24rpx;
  color: #CCCCCC;
  font-weight: 500;
}

/* 弹窗样式 */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(6rpx);
}

.dialog-content {
  width: 600rpx;
  max-height: 80vh;
  background: #ffffff;
  border-radius: 36rpx;
  padding: 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
  animation: dialog-in 0.3s ease-out;
}

@keyframes dialog-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.dialog-title {
  font-size: 36rpx;
  font-weight: 900;
  color: #333333;
  text-align: center;
  margin-bottom: 32rpx;
  letter-spacing: 1rpx;
}

.dialog-form {
  margin-bottom: 32rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
  font-weight: 600;
}

.icon-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12rpx;
}

.icon-option {
  text-align: center;
  padding: 18rpx;
  background: #F5F5F5;
  border-radius: 20rpx;
  font-size: 36rpx;
  border: 3rpx solid transparent;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-option:active {
  transform: scale(0.95);
}

.icon-option.active {
  background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
  border-color: #1890FF;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.2);
}

.form-input {
  width: 100%;
  padding: 24rpx;
  background: #F5F5F5;
  border-radius: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  border: 3rpx solid transparent;
  transition: all 0.3s;
}

.form-input:focus {
  background: #ffffff;
  border-color: #1890FF;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.1);
}

.score-picker {
  display: flex;
  gap: 12rpx;
}

.score-option {
  flex: 1;
  text-align: center;
  padding: 24rpx;
  background: #F5F5F5;
  border-radius: 20rpx;
  font-size: 30rpx;
  color: #666666;
  border: 3rpx solid transparent;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.score-option:active {
  transform: scale(0.95);
}

.score-option.active {
  background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
  color: #1890FF;
  border-color: #1890FF;
  font-weight: 900;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.2);
}

.dialog-btns {
  display: flex;
  gap: 16rpx;
}

.dialog-btn {
  flex: 1;
  padding: 28rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  border: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-btn:active {
  transform: scale(0.95);
}

.cancel-btn {
  background: #F5F5F5;
  color: #666666;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.cancel-btn:active {
  background: #E8E8E8;
}

.confirm-btn {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  color: #ffffff;
  box-shadow: 0 8rpx 20rpx rgba(255, 107, 157, 0.3);
}

.confirm-btn:active {
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 157, 0.2);
}
</style>
