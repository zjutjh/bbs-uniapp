<template>
	<view>
		<!-- 登录账号 -->
		<u-popup :show="show" mode="center" round="16" closeOnClickOverlay @close="close()">
			<view class="loginPopup">
				<view class="title">
					登录微精弘账号
				</view>
				<u-input v-model="xuehao" placeholder="账号(学号)" prefixIcon="account" color="var(--color-111)" fontSize="16px" placeholderStyle="color:var(--color-111)"
					prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
				<u-input v-model="password" placeholder="密码" type="password" prefixIcon="lock" color="var(--color-111)" fontSize="16px" placeholderStyle="color:var(--color-111)"
					prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
				<view class="choose flex-start">
					<u-switch v-model="save" size="14"></u-switch>
					<text>保存密码到本地</text>
				</view>
				<view class="btn" @click="login()">{{loginBtnText}}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {wejhLogin} from '@/api/wejh.js'
	export default {
		name:"wejh-login",
		props: {
			show : Boolean
		},
		data() {
			return {
				xuehao: null,
				password: null,
				save: true,
				loginBtnText: '登录'
			}
		},
		mounted() {
		},
		methods: {
			async login() {
				this.loginBtnText = '登录中...'
				let res = await wejhLogin(this.xuehao,this.password)
				uni.setStorageSync('wejh-cookie',res.data)
				if (this.save) {
					let config = uni.getStorageSync('config')
					if (!config) {
						config = {}
					} else {
						config = JSON.parse(config)
					}
					if (!config.wejh) {
						config.wejh = {}
					}
					config.wejh.xuehao = this.xuehao
					config.wejh.password = this.password
					config.wejh.save = this.save
					uni.setStorageSync('config',JSON.stringify(config))
				}
				this.$emit('afterLogin')
			},
			close() {
				this.$emit('close')
			},
			onShowChange() { //显示的时候
				let cookie = uni.getStorageSync('wejh-cookie')
				if (cookie) {
					return
				}
				let config = uni.getStorageSync('config')
				if (config) {
					config = JSON.parse(config)
					if (config.wejh) {
						this.xuehao = config.wejh.xuehao
						this.password = config.wejh.password
						this.save = config.wejh.save
						if (this.xuehao && this.password) {
							this.login()
						}
					}
				}
			}
		},
		watch: {
			show(value) {
				if (value) {
					this.onShowChange()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.loginPopup {
		padding: 20rpx 48rpx;
		background-color: var(--color-white);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 0 6px 0px rgb(242,242,242);
		.title {
			font-size: 28rpx;
			color: var(--color-111);
			text-align: center;
			margin: 28rpx 0;
		}
		.choose {
			font-size: 22rpx;
			text {
				margin-left: 12rpx;
			}
			padding: 0 18rpx;
			margin-bottom: 18rpx;
			color: var(--color-666);
		}
		.btn {
			line-height: 38rpx;
			width: 100%;
			font-size: 28rpx;
			border-radius: 40rpx;
			padding: 18rpx 0;
			background-color: var(--color-primary);
			text-align: center;
			font-weight: 700;
			color: #eee;
			margin: 12rpx 0 28rpx 0;
		}
		.u-input {
			background-color: transparent;
			font-size: 28rpx;
			height: 80rpx;
			border-radius: 60rpx;
			margin: 18rpx 0;
			border: none;
			/deep/.u-input__content {
				padding-bottom: 8px;
				border-bottom: 1px solid var(--color-aaa);
			}
		}
	}
</style>