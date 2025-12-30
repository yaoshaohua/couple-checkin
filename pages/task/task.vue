<template>
  <view class="container">
    <!-- 怨气积分显示 -->
    <view class="score-banner card">
      <view class="banner-content">
        <view class="banner-icon">😤</view>
        <view class="banner-info">
          <text class="banner-label">当前怨气积分</text>
          <text class="banner-score">{{ resentScore }}</text>
        </view>
      </view>
      <text class="banner-tip">可以兑换任务惩罚对方啦~</text>
    </view>

    <!-- 待完成任务 -->
    <view v-if="pendingTasks.length > 0" class="section">
      <view class="section-header">
        <text class="section-title">⏰ 待完成任务</text>
        <text class="section-count">{{ pendingTasks.length }}</text>
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
      <text class="custom-icon">➕</text>
      <text class="custom-text">自定义任务</text>
    </view>

    <!-- 已完成任务 -->
    <view v-if="completedTasks.length > 0" class="section">
      <view class="section-header">
        <text class="section-title">✅ 已完成任务</text>
        <text class="section-count">{{ completedTasks.length }}</text>
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
.score-banner {
  background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
  padding: 40rpx;
  margin-bottom: 20rpx;
}

.banner-content {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.banner-icon {
  font-size: 80rpx;
  margin-right: 20rpx;
}

.banner-info {
  display: flex;
  flex-direction: column;
}

.banner-label {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 5rpx;
}

.banner-score {
  font-size: 56rpx;
  font-weight: bold;
  color: #1890FF;
}

.banner-tip {
  font-size: 24rpx;
  color: #999999;
  text-align: center;
}

.section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.section-count {
  font-size: 24rpx;
  color: #999999;
  background: #F5F5F5;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.task-record {
  padding: 25rpx;
}

.task-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.task-record-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.task-record-cost {
  font-size: 24rpx;
  color: #1890FF;
}

.task-record-time {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 15rpx;
}

.complete-btn {
  width: 100%;
  padding: 20rpx;
  background: linear-gradient(135deg, #52C41A 0%, #73D13D 100%);
  color: #ffffff;
  border-radius: 10rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 500;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
  padding: 0 20rpx;
}

.task-card {
  position: relative;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 25rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 280rpx;
}

.task-card.can-exchange {
  border: 2rpx solid #1890FF;
}

.task-card.can-exchange:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.task-card.cannot-exchange {
  opacity: 0.5;
}

.task-icon {
  font-size: 60rpx;
  margin-bottom: 15rpx;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 15rpx;
}

.task-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.task-desc {
  font-size: 22rpx;
  color: #999999;
  line-height: 1.4;
}

.task-cost {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 20rpx;
  background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%);
  border-radius: 20rpx;
}

.cost-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #1890FF;
}

.cost-label {
  font-size: 20rpx;
  color: #1890FF;
}

.task-lock {
  position: absolute;
  top: 15rpx;
  right: 15rpx;
  font-size: 24rpx;
}

.custom-task-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx;
  margin: 20rpx;
  background: linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%);
  border-radius: 20rpx;
  border: 2rpx dashed #CCCCCC;
}

.custom-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.custom-text {
  font-size: 28rpx;
  color: #666666;
  font-weight: 500;
}

.completed-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  padding: 0 20rpx;
}

.completed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 25rpx;
  background: #F8F8F8;
  border-radius: 12rpx;
}

.completed-name {
  font-size: 28rpx;
  color: #666666;
  text-decoration: line-through;
}

.completed-time {
  font-size: 22rpx;
  color: #999999;
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
  max-height: 80vh;
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
  max-height: 60vh;
  overflow-y: auto;
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

.icon-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10rpx;
}

.icon-option {
  text-align: center;
  padding: 15rpx;
  background: #F5F5F5;
  border-radius: 10rpx;
  font-size: 32rpx;
  border: 2rpx solid transparent;
}

.icon-option.active {
  background: #E8F4FD;
  border-color: #1890FF;
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
  gap: 10rpx;
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
  background: #E8F4FD;
  color: #1890FF;
  border-color: #1890FF;
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
