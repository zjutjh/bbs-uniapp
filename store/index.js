import Vue from 'vue'
import Vuex from 'vuex'
import user from './user/index.js'
import msg from './msg/index.js'
import theme from './theme/index.js'
import school from './school/index.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
	msg,
	theme,
	school
  },
})

export default store