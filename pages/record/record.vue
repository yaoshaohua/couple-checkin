<template>
  <view class="container">
    <!-- 统计卡片 -->
    <view class="stats-card card">
      <view class="stats-item">
        <text class="stats-label">总记录</text>
        <text class="stats-value">{{ records.length }}</text>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item">
        <text class="stats-label">爱意记录</text>
        <text class="stats-value love">{{ loveRecords.length }}</text>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item">
        <text class="stats-label">怨气记录</text>
        <text class="stats-value resent">{{ resentRecords.length }}</text>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <view 
        :class="['tab-item', filterType === 'all' ? 'active' : '']"
        @click="filterType = 'all'"
      >
        全部
      </view>
      <view 
        :class="['tab-item', filterType === 'love' ? 'active' : '']"
        @click="filterType = 'love'"
      >
        ❤️ 爱意
      </view>
      <view 
        :class="['tab-item', filterType === 'resent' ? 'active' : '']"
        @click="filterType = 'resent'"
      >
        😤 怨气
      </view>
    </view>

    <!-- 记录列表 -->
    <view v-if="filteredRecords.length === 0" class="empty-container">
      <image 
        class="empty-img" 
        src="/static/images/empty.png" 
        mode="aspectFit"
      ></image>
      <text class="empty-text">暂无记录</text>
      <button class="empty-btn" @click="goToHome">去打卡</button>
    </view>

    <view v-else class="record-list">
      <view 
        v-for="record in filteredRecords" 
        :key="record.id"
        class="record-card card"
      >
        <view class="record-header">
          <view class="record-type">
            <text class="type-icon">{{ record.type === 'love' ? '❤️' : '😤' }}</text>
            <text class="type-text">{{ record.type === 'love' ? '爱意' : '怨气' }}</text>
          </view>
          <text :class="['record-score', record.type === 'love' ? 'love-score' : 'resent-score']">
            +{{ record.score }}
          </text>
        </view>

        <view class="record-body">
          <text class="record-reason">{{ record.reason }}</text>
        </view>

        <view class="record-footer">
          <text class="record-time">{{ formatTime(record.time) }}</text>
          <view class="record-actions">
            <view class="action-btn delete-btn" @click="handleDelete(record)">
              <text class="action-icon">🗑️</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 上拉加载更多提示 -->
    <view v-if="filteredRecords.length > 0" class="load-more">
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

    handleDelete(record) {
      uni.showModal({
        title: '确认删除',
        content: '删除后积分也会相应扣除，确定要删除这条记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.$store.dispatch('deleteRecord', record.id)
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      })
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
.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-label {
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 10rpx;
}

.stats-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
}

.stats-value.love {
  color: #FF6B9D;
}

.stats-value.resent {
  color: #1890FF;
}

.stats-divider {
  width: 2rpx;
  height: 60rpx;
  background: #EEEEEE;
}

.filter-tabs {
  display: flex;
  gap: 15rpx;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 50rpx;
  font-size: 28rpx;
  color: #666666;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.tab-item.active {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  color: #ffffff;
  font-weight: bold;
  transform: scale(1.05);
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-img {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 40rpx;
}

.empty-btn {
  padding: 20rpx 60rpx;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  color: #ffffff;
  border-radius: 50rpx;
  border: none;
  font-size: 28rpx;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-card {
  padding: 25rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.record-type {
  display: flex;
  align-items: center;
}

.type-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.type-text {
  font-size: 26rpx;
  color: #666666;
}

.record-score {
  font-size: 32rpx;
  font-weight: bold;
}

.love-score {
  color: #FF6B9D;
}

.resent-score {
  color: #1890FF;
}

.record-body {
  margin-bottom: 15rpx;
}

.record-reason {
  font-size: 30rpx;
  color: #333333;
  line-height: 1.6;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-time {
  font-size: 24rpx;
  color: #999999;
}

.record-actions {
  display: flex;
  gap: 15rpx;
}

.action-btn {
  padding: 8rpx 15rpx;
  border-radius: 8rpx;
  background: #F5F5F5;
}

.action-icon {
  font-size: 24rpx;
}

.delete-btn:active {
  background: #FFE5EE;
}

.load-more {
  padding: 40rpx 0;
  text-align: center;
}

.load-text {
  font-size: 24rpx;
  color: #CCCCCC;
}
</style>
