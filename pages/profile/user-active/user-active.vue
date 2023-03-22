<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="激活账号" bgColor="var(--color-fff)" autoBack placeholder/>
		
		<view class="page-main">
			<view class="section">
				<text class="title">账号激活方式（2选1）</text>
				<view class="body">
					<view>1. 邀请一位同学登录软件，并让ta激活你的账号。</view>
					<view class="mt-8">2. 花费50积分（签到获得5积分，激活他人账号获取20积分）</view>
				</view>
				<view class="color-tip mt-12" style="font-size: 22rpx;">注：已激活的账号无法再激活他人</view>
			</view>
			<view class="flex-start">
				<view class="btn active-other-btn" @click="inputShow=true">点击激活他人账号</view>
				<view @click="infoShow=true" class="btn coin-active-btn" :class="{'coin-active-btn-active':userInfo.coinCount>=30}">
					花费50积分激活账号
				</view>
			</view>
		</view>
		<InputPopUp placeholder="请输入对方学号" :show="inputShow"  @close="inputShow=false" @submit="submitEvent" @cancel="inputShow=false" />
		<InfoPopup title="确定要花费50积分激活账号吗？" mode='bottom' :show="infoShow" @close="infoShow=false" @submit="infoSubmit()" @cancel="infoShow=false" />
	</view>
</template>

<script>
	import {activeByCoin,activeOther} from '@/api/user.js'
	import InputPopUp from '@/components/input-popup/input-popup.vue'
	import InfoPopup from '@/components/info-pupup/info-pupup.vue'
	export default {
		components: {
			InputPopUp,InfoPopup
		},
		data() {
			return {
				inputShow: false,
				infoShow: false,
			};
		},
		methods: {
			async activeUser(studentNo) {
				uni.showLoading()
				let res = await activeOther(studentNo)
				this.processSuccess()
			},
			async coinActive() {
				uni.showLoading()
				let res = await activeByCoin()
				this.processSuccess()
			},
			processSuccess() {
				this.$u.toast('成功')
				setTimeout( () => {
					uni.navigateBack()
				},500)
			},
			submitEvent(value) {
				this.inputShow = false
				if (value.trim().length == 0) {
					return this.$u.toast('输入有误')
				}
				this.activeUser(value.trim())
			},
			infoSubmit() {
				this.coinActive()
			}
		}
	}
</script>

<style lang="scss" scoped>

.page-main {
	padding: 28rpx;
}	

.section {
	margin-bottom: 48rpx;
	.title {
		font-weight: 600;
		font-size: 34rpx;
	}
	.body {
		font-size: 28rpx;
		margin-top: 24rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		background-color: var(--bg-card-color);
	}
}
.btn {
	padding: 20rpx 28rpx;
	text-align: center;
	border-radius: 18rpx;
	background-color: var(--color-primary);
	color: white;
	margin: 0 18rpx;
}
.active-other-btn {
	
}
.coin-active-btn {
	background-color: var(--color-ddd);
	color: #888;
}
.coin-active-btn-active {
	background-color: var(--color-primary);
	color: white;
}

</style>
