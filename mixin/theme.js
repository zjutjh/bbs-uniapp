import store from '@/store/index.js'
export default {
	data() {
		return {
			theme: store.state.theme.theme
		}
	},
	beforeMount() {
		this.$watch(
			() => { return store.state.theme.theme} ,
			(nValue, oldValue) => {  // 主动切换主题
				if (nValue=='dark') 
					this.toDarkTheme()
				else 
					this.toLightTheme()
			},{
				immediate: true
			}
		)
	},
	onShow() { // 监听主题状态变化
		uni.onThemeChange((res) => {
			console.log(res);
			//黑夜
			if (res.theme == 'dark') {
				this.toDarkTheme()
			}
			//白天
			if (res.theme == 'light') 
				this.toLightTheme()
		});
	},
	methods: {
		toDarkTheme() {
			uni.setTabBarStyle({
			  backgroundColor: '#111',
			  borderStyle:"black"
			})
			//动态修改状态栏的颜色
			    uni.setNavigationBarColor({
			        frontColor: '#ffffff',
			        backgroundColor: '#000000'
			    })
			uni.setNav
			this.theme = 'dark'
		},
		toLightTheme() {
			uni.setTabBarStyle({
			  backgroundColor: '#fcfcfc',
			  borderStyle:"white"
			})
			//动态修改状态栏的颜色
		    uni.setNavigationBarColor({
		        frontColor: '#000000',
		        backgroundColor: '#ffffff'
		    })
			this.theme = 'light'
		}
	}
}