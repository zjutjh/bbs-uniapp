import {termInfo} from '@/api/wejh.js'
import Vue from 'vue';

const state = {
	termInfo: {}
}
const mutations = {
	
}

const actions = {
	async GetTermInfo({commit,state}) {
		let res = await termInfo()
		state.termInfo = res.data
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
