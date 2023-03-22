<script>
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			let start = 1678027693595
			let now = +new Date()
			let gapDay = (now - start) / (1000*60*60*24*7)
			if (gapDay > 7) {
				return plus.runtime.quit();
			}
			// #endif
			let theme = uni.getStorageSync("theme") || 'light'
			this.$store.commit('theme/SET_THEME',theme) // 更新主题
			
			this.$store.dispatch('user/UpdateUserInfo') // 更新用户信息
			
			// 获取学期信息
			this.$store.dispatch('school/GetTermInfo')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
@import "@/uni_modules/uview-ui/index.scss";
@import '@/static/css/common.css';
@import '@/static/css/theme.css';
@import '@/static/css/animate.css';
page {
	height: 100vh;
	font-size: 24rpx;
	// max-width: 960px;
	margin: 0 auto;
	// white-space: pre-wrap;
}


.u-navbar__content__title, .u-navbar__content__left__text {
	color: var(--text-black-color) !important;
}
.u-navbar__content {
	color: var(--text-black-color) !important;
	.u-icon__icon {
		color: var(--text-black-color) !important;
	}
}
.white {
	.u-navbar__content__title, .u-navbar__content__left__text {
		color: #eee !important;
	}
	.u-navbar__content {
		color: #eee !important;
		.u-icon__icon {
			color: #eee !important;
		}
	}
}

[data-theme='dark'] {
	.u-popup__content {
		background-color: black !important;
	}
	.uni-picker-view-mask {
		display: none !important;
	}
}

</style>
