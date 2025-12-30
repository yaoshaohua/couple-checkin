<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card card">
      <view class="user-avatars">
        <view class="avatar-item">
          <view class="avatar">👨</view>
          <text class="avatar-name">{{ userInfo.myName }}</text>
        </view>
        <view class="heart-icon">💕</view>
        <view class="avatar-item">
          <view class="avatar">👩</view>
          <text class="avatar-name">{{ userInfo.partnerName }}</text>
        </view>
      </view>
      <view class="edit-btn" @click="showEditDialog = true">
        <text class="edit-icon">✏️</text>
        <text class="edit-text">编辑昵称</text>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-section card">
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
      <view class="menu-item card" @click="exportData">
        <view class="menu-left">
          <text class="menu-icon">📊</text>
          <text class="menu-text">导出数据</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item card" @click="clearData">
        <view class="menu-left">
          <text class="menu-icon">🗑️</text>
          <text class="menu-text">清空数据</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item card" @click="showAbout">
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

    <!-- 编辑昵称弹窗 -->
    <view v-if="showEditDialog" class="dialog-mask" @click="hideEditDialog">
      <view class="dialog-content" @click.stop>
        <view class="dialog-title">编辑昵称</view>
        
        <view class="dialog-form">
          <view class="form-item">
            <text class="form-label">我的昵称</text>
            <input 
              v-model="editMyName" 
              class="form-input" 
              placeholder="输入你的昵称"
              maxlength="10"
            />
          </view>

          <view class="form-item">
            <text class="form-label">TA的昵称</text>
            <input 
              v-model="editPartnerName" 
              class="form-input" 
              placeholder="输入TA的昵称"
              maxlength="10"
            />
          </view>
        </view>

        <view class="dialog-btns">
          <button class="dialog-btn cancel-btn" @click="hideEditDialog">取消</button>
          <button class="dialog-btn confirm-btn" @click="confirmEdit">保存</button>
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
      showEditDialog: false,
      editMyName: '',
      editPartnerName: ''
    }
  },

  computed: {
    ...mapState(['userInfo', 'loveScore', 'resentScore', 'records', 'exchangeRecords'])
  },

  methods: {
    showEditDialog() {
      this.editMyName = this.userInfo.myName
      this.editPartnerName = this.userInfo.partnerName
      this.showEditDialog = true
    },

    hideEditDialog() {
      this.showEditDialog = false
    },

    confirmEdit() {
      if (!this.editMyName.trim()) {
        uni.showToast({
          title: '请输入你的昵称',
          icon: 'none'
        })
        return
      }

      if (!this.editPartnerName.trim()) {
        uni.showToast({
          title: '请输入TA的昵称',
          icon: 'none'
        })
        return
      }

      this.$store.dispatch('updateUserInfo', {
        myName: this.editMyName.trim(),
        partnerName: this.editPartnerName.trim()
      })

      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })

      this.hideEditDialog()
    },

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
.user-card {
  padding: 40rpx;
  margin-bottom: 20rpx;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  color: #ffffff;
}

.user-avatars {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25rpx;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  margin-bottom: 10rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.avatar-name {
  font-size: 28rpx;
  font-weight: 500;
}

.heart-icon {
  font-size: 48rpx;
  margin: 0 30rpx;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15rpx 30rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
}

.edit-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.edit-text {
  font-size: 24rpx;
}

.stats-section {
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.stats-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
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
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.stat-value.love {
  color: #FF6B9D;
}

.stat-value.resent {
  color: #1890FF;
}

.stat-label {
  font-size: 22rpx;
  color: #999999;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
}

.menu-item:active {
  background: #F8F8F8;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 15rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #CCCCCC;
}

.version-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;
  padding-bottom: 40rpx;
}

.version-text {
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 10rpx;
}

.version-tip {
  font-size: 22rpx;
  color: #CCCCCC;
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
  margin-bottom: 25rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 15rpx;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  background: #F5F5F5;
  border-radius: 10rpx;
  font-size: 28rpx;
  box-sizing: border-box;
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
