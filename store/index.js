import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const STORAGE_KEY = 'couple_checkin_data'

// 从本地存储加载数据
const loadState = () => {
  try {
    const data = uni.getStorageSync(STORAGE_KEY)
    return data || {
      loveScore: 0,
      resentScore: 0,
      records: [],
      tasks: [
        { id: 1, name: '洗碗', cost: 3, icon: '🍽️', description: '洗一次碗' },
        { id: 2, name: '做饭', cost: 5, icon: '🍳', description: '做一顿饭' },
        { id: 3, name: '洗衣服', cost: 3, icon: '👔', description: '洗一次衣服' },
        { id: 4, name: '打扫卫生', cost: 4, icon: '🧹', description: '打扫一次卫生' },
        { id: 5, name: '倒垃圾', cost: 2, icon: '🗑️', description: '倒一次垃圾' },
        { id: 6, name: '按摩', cost: 8, icon: '💆', description: '按摩30分钟' },
        { id: 7, name: '看电影', cost: 10, icon: '🎬', description: '陪看一场电影' },
        { id: 8, name: '购物陪逛', cost: 6, icon: '🛍️', description: '陪逛街2小时' }
      ],
      exchangeRecords: [],
      userInfo: {
        myName: '我',
        partnerName: 'TA'
      }
    }
  } catch (e) {
    return {
      loveScore: 0,
      resentScore: 0,
      records: [],
      tasks: [
        { id: 1, name: '洗碗', cost: 3, icon: '🍽️', description: '洗一次碗' },
        { id: 2, name: '做饭', cost: 5, icon: '🍳', description: '做一顿饭' },
        { id: 3, name: '洗衣服', cost: 3, icon: '👔', description: '洗一次衣服' },
        { id: 4, name: '打扫卫生', cost: 4, icon: '🧹', description: '打扫一次卫生' },
        { id: 5, name: '倒垃圾', cost: 2, icon: '🗑️', description: '倒一次垃圾' },
        { id: 6, name: '按摩', cost: 8, icon: '💆', description: '按摩30分钟' },
        { id: 7, name: '看电影', cost: 10, icon: '🎬', description: '陪看一场电影' },
        { id: 8, name: '购物陪逛', cost: 6, icon: '🛍️', description: '陪逛街2小时' }
      ],
      exchangeRecords: [],
      userInfo: {
        myName: '我',
        partnerName: 'TA'
      }
    }
  }
}

const store = new Vuex.Store({
  state: loadState(),
  
  mutations: {
    // 增加爱意积分
    ADD_LOVE_SCORE(state, payload) {
      state.loveScore += payload.score
      state.records.unshift({
        id: Date.now(),
        type: 'love',
        score: payload.score,
        reason: payload.reason,
        time: new Date().toISOString()
      })
      this.commit('SAVE_STATE')
    },
    
    // 增加怨气积分
    ADD_RESENT_SCORE(state, payload) {
      state.resentScore += payload.score
      state.records.unshift({
        id: Date.now(),
        type: 'resent',
        score: payload.score,
        reason: payload.reason,
        time: new Date().toISOString()
      })
      this.commit('SAVE_STATE')
    },
    
    // 兑换任务
    EXCHANGE_TASK(state, task) {
      if (state.resentScore >= task.cost) {
        state.resentScore -= task.cost
        state.exchangeRecords.unshift({
          id: Date.now(),
          taskName: task.name,
          cost: task.cost,
          status: 'pending', // pending: 待完成, completed: 已完成
          time: new Date().toISOString()
        })
        this.commit('SAVE_STATE')
        return true
      }
      return false
    },
    
    // 完成任务
    COMPLETE_TASK(state, recordId) {
      const record = state.exchangeRecords.find(r => r.id === recordId)
      if (record) {
        record.status = 'completed'
        record.completeTime = new Date().toISOString()
        this.commit('SAVE_STATE')
      }
    },
    
    // 删除记录
    DELETE_RECORD(state, recordId) {
      const index = state.records.findIndex(r => r.id === recordId)
      if (index > -1) {
        const record = state.records[index]
        if (record.type === 'love') {
          state.loveScore -= record.score
        } else {
          state.resentScore -= record.score
        }
        state.records.splice(index, 1)
        this.commit('SAVE_STATE')
      }
    },
    
    // 更新用户信息
    UPDATE_USER_INFO(state, userInfo) {
      state.userInfo = { ...state.userInfo, ...userInfo }
      this.commit('SAVE_STATE')
    },
    
    // 添加自定义任务
    ADD_CUSTOM_TASK(state, task) {
      state.tasks.push({
        id: Date.now(),
        ...task
      })
      this.commit('SAVE_STATE')
    },
    
    // 保存状态到本地存储
    SAVE_STATE(state) {
      try {
        uni.setStorageSync(STORAGE_KEY, {
          loveScore: state.loveScore,
          resentScore: state.resentScore,
          records: state.records,
          tasks: state.tasks,
          exchangeRecords: state.exchangeRecords,
          userInfo: state.userInfo
        })
      } catch (e) {
        console.error('保存数据失败', e)
      }
    }
  },
  
  actions: {
    addLoveScore({ commit }, payload) {
      commit('ADD_LOVE_SCORE', payload)
    },
    
    addResentScore({ commit }, payload) {
      commit('ADD_RESENT_SCORE', payload)
    },
    
    exchangeTask({ commit }, task) {
      return commit('EXCHANGE_TASK', task)
    },
    
    completeTask({ commit }, recordId) {
      commit('COMPLETE_TASK', recordId)
    },
    
    deleteRecord({ commit }, recordId) {
      commit('DELETE_RECORD', recordId)
    },
    
    updateUserInfo({ commit }, userInfo) {
      commit('UPDATE_USER_INFO', userInfo)
    },
    
    addCustomTask({ commit }, task) {
      commit('ADD_CUSTOM_TASK', task)
    }
  },
  
  getters: {
    // 获取总记录数
    totalRecords: state => state.records.length,
    
    // 获取爱意记录
    loveRecords: state => state.records.filter(r => r.type === 'love'),
    
    // 获取怨气记录
    resentRecords: state => state.records.filter(r => r.type === 'resent'),
    
    // 获取待完成任务
    pendingTasks: state => state.exchangeRecords.filter(r => r.status === 'pending'),
    
    // 获取已完成任务
    completedTasks: state => state.exchangeRecords.filter(r => r.status === 'completed')
  }
})

export default store
