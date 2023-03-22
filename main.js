import App from './App'
import Vue from 'vue'
import store from './store/index.js';
// uview
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 自定义request
import '@/utils/request.js'

// 配置
import config from './utils/config.js';
Vue.prototype.$config = config;

// mxmin
import themeMixin from '@/mixin/theme.js'
Vue.mixin(themeMixin)
import userInfo from '@/mixin/userInfo.js'
Vue.mixin(userInfo)
import router from '@/mixin/router.js'
Vue.mixin(router)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()


