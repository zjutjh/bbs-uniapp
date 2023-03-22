import Vue from 'vue';
const state = {
	theme: 'light',
}
// todo 用Vue.set优化
const mutations = {
	SET_THEME: (state, targetTheme) => {
		if (targetTheme == 'light') {
			Vue.set(state,'theme','light')
			uni.setStorageSync('theme','light')
		} else {
			Vue.set(state,'theme','dark')
			uni.setStorageSync('theme','dark')
		}
	},
}

const actions = {
	toggle_theme({ commit,state }) {
	  if (state.theme == 'light') {
	  	commit('SET_THEME','dark')
	  } else {
		commit('SET_THEME','light')
	  }
	}
}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
