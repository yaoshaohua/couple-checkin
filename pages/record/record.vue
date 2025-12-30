<template>
  <view class="container">
    <!-- 背景装饰元素 -->
    <view class="background-decoration">
      <view class="bubble bubble-1"></view>
      <view class="bubble bubble-2"></view>
      <view class="bubble bubble-3"></view>
      <view class="bubble bubble-4"></view>
      <view class="star star-1">✦</view>
      <view class="star star-2">✧</view>
      <view class="star star-3">✦</view>
      <view class="star star-4">✧</view>
      <view class="heart heart-1">💕</view>
      <view class="heart heart-2">💖</view>
    </view>

    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">📝 记录时光</text>
      <text class="page-subtitle">✨ 每一刻都值得珍藏 ✨</text>
    </view>

    <!-- 筛选与统计一体化 -->
    <view class="filter-stats-container">
      <view 
        :class="['filter-stats-item', filterType === 'all' ? 'active' : '']"
        @click="filterType = 'all'"
      >
        <view class="item-icon">📚</view>
        <view class="item-content">
          <text class="item-label">全部记录</text>
          <text class="item-value">{{ records.length }}</text>
        </view>
      </view>
      <view 
        :class="['filter-stats-item', filterType === 'love' ? 'love-active' : '']"
        @click="filterType = 'love'"
      >
        <view class="item-icon love-icon">❤️</view>
        <view class="item-content">
          <text class="item-label">爱意记录</text>
          <text class="item-value love">{{ loveRecords.length }}</text>
        </view>
      </view>
      <view 
        :class="['filter-stats-item', filterType === 'resent' ? 'resent-active' : '']"
        @click="filterType = 'resent'"
      >
        <view class="item-icon resent-icon">😤</view>
        <view class="item-content">
          <text class="item-label">怨气记录</text>
          <text class="item-value resent">{{ resentRecords.length }}</text>
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view v-if="filteredRecords.length === 0" class="empty-container">
      <view class="empty-bg">
        <view class="floating-icon icon-1">✨</view>
        <view class="floating-icon icon-2">💫</view>
        <view class="floating-icon icon-3">⭐</view>
        <view class="floating-icon icon-4">🌟</view>
      </view>
      <view class="empty-content">
        <view class="empty-emoji">📭</view>
        <text class="empty-title">还没有记录哦</text>
        <text class="empty-desc">快去记录你们的甜蜜时光吧~</text>
        <view class="empty-btn" @click="goToHome">
          <text class="btn-text">✨ 去打卡</text>
        </view>
      </view>
    </view>

    <view v-else class="record-list">
      <view 
        v-for="(record, index) in filteredRecords" 
        :key="record.id"
        class="record-card base-card"
        :style="{ animationDelay: index * 0.1 + 's' }"
      >
        <view class="card-glow" :class="record.type === 'love' ? 'love-glow' : 'resent-glow'"></view>
        <view class="card-inner">
          <view class="record-header">
            <view class="record-type" :class="record.type === 'love' ? 'love-type' : 'resent-type'">
              <view class="type-badge">
                <text class="type-icon">{{ record.type === 'love' ? '💕' : '💢' }}</text>
              </view>
              <view class="type-info">
                <text class="type-text">{{ record.type === 'love' ? '爱意记录' : '怨气记录' }}</text>
                <text class="type-time">{{ formatTime(record.time) }}</text>
              </view>
            </view>
            <view class="score-badge" :class="record.type === 'love' ? 'love-score' : 'resent-score'">
              <text class="score-icon">{{ record.type === 'love' ? '❤️' : '😤' }}</text>
              <text class="score-number">+{{ record.score }}</text>
            </view>
          </view>

          <view class="record-body">
            <text class="record-reason">{{ record.reason }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 上拉加载更多提示 -->
    <view v-if="filteredRecords.length > 0" class="load-more">
      <view class="load-icon">✨</view>
      <text class="load-text">{{ loadMoreText }}</text>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatTime } from '../../utils/index'

export default {
  data() {
    return {
      filterType: 'all', // all, love, resent
      loadMoreText: '已加载全部'
    }
  },

  computed: {
    ...mapState(['records']),
    ...mapGetters(['loveRecords', 'resentRecords']),

    filteredRecords() {
      if (this.filterType === 'all') {
        return this.records
      } else if (this.filterType === 'love') {
        return this.loveRecords
      } else {
        return this.resentRecords
      }
    }
  },

  methods: {
    formatTime(time) {
      return formatTime(time)
    },

    goToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFE8F0 0%, #FFF5F8 30%, #FFFBFC 100%);
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
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 157, 0.1);
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

.bubble-4 {
  width: 60rpx;
  height: 60rpx;
  bottom: 200rpx;
  right: 150rpx;
  animation-delay: 9s;
}

.star {
  position: absolute;
  color: rgba(255, 107, 157, 0.4);
  font-size: 40rpx;
  text-shadow: 0 2rpx 8rpx rgba(255, 107, 157, 0.3);
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

.star-4 {
  bottom: 150rpx;
  left: 100rpx;
  font-size: 36rpx;
  animation-delay: 1.5s;
}

.heart {
  position: absolute;
  font-size: 32rpx;
  animation: float-heart 4s ease-in-out infinite;
}

.heart-1 {
  top: 200rpx;
  right: 60rpx;
  animation-delay: 0s;
}

.heart-2 {
  bottom: 300rpx;
  left: 80rpx;
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

@keyframes float-heart {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-30rpx) scale(1.2);
    opacity: 0.8;
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
  background: linear-gradient(135deg, #FF6B9D 0%, #FF9EC4 100%);
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
.base-card {
  position: relative;
  border-radius: 36rpx;
  overflow: hidden;
  margin-bottom: 28rpx;
  z-index: 1;
  animation: slide-in 0.5s ease-out;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  border-radius: 36rpx;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.1);
  padding: 32rpx;
  border: 3rpx solid rgba(255, 107, 157, 0.08);
}

/* 统计卡片容器 */
/* 筛选与统计一体化 */
.filter-stats-container {
  display: flex;
  gap: 16rpx;
  margin-bottom: 32rpx;
  position: relative;
  z-index: 1;
}

.filter-stats-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 20rpx;
  background: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 3rpx solid transparent;
}

.filter-stats-item:active {
  transform: scale(0.98);
}

.filter-stats-item.active {
  background: linear-gradient(135deg, #FFD6E7 0%, #FFC1DC 100%);
  border-color: #FF6B9D;
  box-shadow: 0 12rpx 36rpx rgba(255, 107, 157, 0.25);
}

.filter-stats-item.love-active {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  border-color: #FF6B9D;
  box-shadow: 0 12rpx 36rpx rgba(255, 107, 157, 0.3);
}

.filter-stats-item.resent-active {
  background: linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%);
  border-color: #64B5F6;
  box-shadow: 0 12rpx 36rpx rgba(100, 181, 246, 0.3);
}

.item-icon {
  font-size: 48rpx;
  flex-shrink: 0;
}

.love-icon {
  animation: heartbeat 1.5s ease-in-out infinite;
}

.resent-icon {
  animation: shake 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
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

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.item-label {
  font-size: 24rpx;
  color: #999999;
  font-weight: 600;
  white-space: nowrap;
}

.item-value {
  font-size: 36rpx;
  font-weight: 900;
  color: #333333;
  font-family: 'DIN Alternate', 'Helvetica', sans-serif;
  white-space: nowrap;
}

.item-value.love {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.item-value.resent {
  background: linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filter-stats-item.active .item-label,
.filter-stats-item.love-active .item-label,
.filter-stats-item.resent-active .item-label {
  color: #ffffff;
}

.filter-stats-item.active .item-value {
  color: #FF6B9D;
}

.filter-stats-item.love-active .item-value,
.filter-stats-item.resent-active .item-value {
  color: #ffffff;
  background: none;
  -webkit-text-fill-color: #ffffff;
}

/* 空状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  position: relative;
  z-index: 1;
}

.empty-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.floating-icon {
  position: absolute;
  font-size: 40rpx;
  animation: float-icon 3s ease-in-out infinite;
}

.icon-1 {
  top: 20%;
  left: 25%;
  color: #FF6B9D;
  animation-delay: 0s;
}

.icon-2 {
  top: 60%;
  right: 20%;
  color: #64B5F6;
  animation-delay: 1s;
}

.icon-3 {
  top: 40%;
  left: 70%;
  color: #FFA07A;
  animation-delay: 2s;
}

.icon-4 {
  top: 70%;
  left: 40%;
  color: #FFD700;
  animation-delay: 1.5s;
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20rpx) rotate(180deg);
  }
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.empty-emoji {
  font-size: 120rpx;
  margin-bottom: 32rpx;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15rpx);
  }
}

.empty-title {
  font-size: 36rpx;
  color: #666666;
  margin-bottom: 16rpx;
  font-weight: 700;
}

.empty-desc {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 50rpx;
  font-weight: 500;
}

.empty-btn {
  padding: 24rpx 80rpx;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  color: #ffffff;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 12rpx 36rpx rgba(255, 107, 157, 0.3);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.empty-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

.empty-btn:active {
  transform: scale(0.95);
  box-shadow: 0 6rpx 20rpx rgba(255, 107, 157, 0.4);
}

.btn-text {
  display: block;
  position: relative;
  z-index: 1;
}

/* 记录列表 */
.record-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.record-card {
  margin-bottom: 0;
}

.record-card .card-inner {
  border-color: rgba(255, 107, 157, 0.08);
  padding: 28rpx;
}

.record-card:nth-child(even) .card-inner {
  border-color: rgba(100, 181, 246, 0.08);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.record-type {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.type-badge {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.love-type .type-badge {
  background: linear-gradient(135deg, #FFD6E7 0%, #FFC1DC 100%);
}

.resent-type .type-badge {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.type-icon {
  font-size: 36rpx;
}

.type-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.type-text {
  font-size: 30rpx;
  color: #333333;
  font-weight: 700;
}

.type-time {
  font-size: 24rpx;
  color: #999999;
  font-weight: 500;
}

.score-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 50rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.score-badge.love-score {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
}

.score-badge.resent-score {
  background: linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%);
}

.score-icon {
  font-size: 28rpx;
}

.score-number {
  font-size: 32rpx;
  font-weight: 900;
  color: #ffffff;
  font-family: 'DIN Alternate', 'Helvetica', sans-serif;
}

.record-body {
  margin-bottom: 0;
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #FFFBFC 0%, #FFF5F8 100%);
  border-radius: 20rpx;
  border: 2rpx solid rgba(255, 107, 157, 0.1);
}

.record-card:nth-child(even) .record-body {
  background: linear-gradient(135deg, #F8FBFF 0%, #F0F7FF 100%);
  border-color: rgba(100, 181, 246, 0.1);
}

.record-reason {
  font-size: 30rpx;
  color: #333333;
  line-height: 1.6;
  font-weight: 500;
}

/* 加载更多 */
.load-more {
  padding: 50rpx 0;
  text-align: center;
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.load-icon {
  font-size: 28rpx;
  animation: twinkle 2s ease-in-out infinite;
}

.load-text {
  font-size: 26rpx;
  color: #CCCCCC;
  font-weight: 500;
}
</style>
