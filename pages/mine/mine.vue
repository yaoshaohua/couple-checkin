<template>
  <view class="container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">我的主页</text>
      <text class="page-subtitle">💕 记录我们的爱 💕</text>
    </view>



    <!-- 数据统计 -->
    <view class="stats-section">
      <view class="stats-title">数据统计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ records.length }}</text>
          <text class="stat-label">总记录数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value love">{{ loveScore }}</text>
          <text class="stat-label">爱意积分</text>
        </view>
        <view class="stat-item">
          <text class="stat-value resent">{{ resentScore }}</text>
          <text class="stat-label">怨气积分</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ exchangeRecords.length }}</text>
          <text class="stat-label">兑换次数</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="exportData">
        <view class="menu-left">
          <text class="menu-icon">📊</text>
          <text class="menu-text">导出数据</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item" @click="clearData">
        <view class="menu-left">
          <text class="menu-icon">🗑️</text>
          <text class="menu-text">清空数据</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item" @click="showAbout">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text class="version-text">情侣打卡 v1.0.0</text>
      <text class="version-tip">记录爱的每一刻 💕</text>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
    }
  },

  computed: {
    ...mapState(['userInfo', 'loveScore', 'resentScore', 'records', 'exchangeRecords'])
  },

  methods: {
    exportData() {
      uni.showModal({
        title: '导出数据',
        content: '此功能将导出所有打卡记录和任务数据，敬请期待~',
        showCancel: false
      })
    },

    clearData() {
      uni.showModal({
        title: '确认清空',
        content: '清空后所有数据将无法恢复，确定要清空所有数据吗？',
        confirmText: '确定清空',
        confirmColor: '#F5222D',
        success: (res) => {
          if (res.confirm) {
            try {
              uni.removeStorageSync('couple_checkin_data')
              uni.showToast({
                title: '清空成功',
                icon: 'success'
              })
              // 延迟重启小程序
              setTimeout(() => {
                uni.reLaunch({
                  url: '/pages/index/index'
                })
              }, 1500)
            } catch (e) {
              uni.showToast({
                title: '清空失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    showAbout() {
      uni.showModal({
        title: '关于我们',
        content: '情侣打卡小程序\n\n用爱意和怨气积分记录情侣间的点滴时光，让生活充满趣味和甜蜜。\n\n愿你们相爱相守，幸福永远 💕',
        showCancel: false,
        confirmText: '我知道了'
      })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F8 0%, #FFFFFF 50%, #FFF5F8 100%);
  padding: 30rpx;
  position: relative;
  overflow-x: hidden;
}

/* 页面标题 */
.page-header {
  text-align: center;
  padding: 20rpx 0 40rpx;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 44rpx;
  font-weight: 800;
  color: #FF91A4;
  margin-bottom: 10rpx;
  display: block;
}

.page-subtitle {
  font-size: 24rpx;
  color: #FFB8C3;
  display: block;
}



/* 数据统计 */
.stats-section {
  background: #ffffff;
  border-radius: 28rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1;
}

.stats-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15rpx 0;
}

.stat-value {
  font-size: 34rpx;
  font-weight: 800;
  color: #333333;
  margin-bottom: 6rpx;
  font-family: 'DIN Alternate', sans-serif;
}

.stat-value.love {
  color: #FF91A4;
  text-shadow: 0 2rpx 6rpx rgba(255, 145, 164, 0.2);
}

.stat-value.resent {
  color: #64B5F6;
  text-shadow: 0 2rpx 6rpx rgba(100, 181, 246, 0.2);
}

.stat-label {
  font-size: 22rpx;
  color: #999999;
}

/* 功能菜单 */
.menu-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.menu-item {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 28rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  cursor: pointer;
}

.menu-item:active {
  transform: scale(0.98);
  background: #FFF0F5;
  box-shadow: 0 4rpx 12rpx rgba(255, 145, 164, 0.15);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.menu-icon {
  font-size: 36rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 26rpx;
  color: #CCCCCC;
}

/* 版本信息 */
.version-info {
  text-align: center;
  padding: 20rpx 0;
  position: relative;
  z-index: 1;
}

.version-text {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 8rpx;
}

.version-tip {
  font-size: 22rpx;
  color: #FFB8C3;
  display: block;
}
</style>
