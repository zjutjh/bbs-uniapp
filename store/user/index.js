import Vue from 'vue';
import {currentUserInfo} from '@/api/user.js';

const state = {
	userInfo: {},
	token: uni.getStorageSync("token"),
}

const mutations = {
  SET_USERINFO: (state, userInfo) => {
	Vue.set(state,'userInfo',userInfo)
  },
  SET_TOKEN: (state, token) => {
  	Vue.set(state,'token',token)
	uni.setStorageSync('token',token)
  },
  LOG_OUT: (state) => {
	  uni.removeStorageSync("token")
	  Vue.set(state,'userInfo',{})
  }
}

const actions = {
  Logout({commit,state}) {
	commit('LOG_OUT')
  },
  async UpdateUserInfo({ commit }) {
	if (uni.getStorageSync('token')!='') {
		let res = await currentUserInfo()
		commit("SET_USERINFO",res.data)
	}
  },
}

const getters = {
	// 更多消息
	isLogined(state) {
	  return state.userInfo!=null && state.userInfo.userId
	},
	userInfo(state) {
		return state.userInfo
	}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
