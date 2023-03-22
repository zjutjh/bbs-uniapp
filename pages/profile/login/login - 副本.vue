<template>
	<view class="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar autoBack :leftText="' 返回'" bgColor="transparent">
		</u-navbar>

		<swiper @change="e=>current=e.detail.current" :interval="30" :duration="200" :current="current">
			<swiper-item>
				<!-- 登录 -->
				<view class="wrapper" @click="showIndex=1">
					<view class="title">
						登录账号
						<view class="tip">根据国家法律法规，请先绑定手机号</view>
					</view>
					<u-input v-model="loginDto.userName" placeholder="用户名" prefixIcon="account" color="var(--color-111)" fontSize="16px" placeholderStyle="color:var(--color-111)"
						prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
					<u-input v-model="loginDto.password" placeholder="密码" prefixIcon="lock" color="var(--color-111)" fontSize="16px" placeholderStyle="color:var(--color-111)"
						prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
					<u-input v-model="loginDto.captcha" color="var(--color-111)" placeholder="验证码" placeholderStyle="color:var(--color-111)" class="captcha">
						<template slot="suffix">
							<u-image @click="updateCaptch()" showLoading :src="captchaUrl" radius="6" width="200rpx"
								height="80rpx"></u-image>
						</template>
					</u-input>
					<view class="btn" @click="loginSumbit()">登录</view>
					<view class="flex-between">
						<text>找回密码</text>
						<text @click="current=1">注册账号</text>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<!-- 注册 -->
				<view class="wrapper" @click="showIndex=0">
					<view class="title">
						注册账号
						<view class="tip">111111</view>
					</view>
					<u-input v-model="registerDto.nickName" placeholder="昵称" prefixIcon="man-add" color="var(--color-111)" fontSize="16px"
						prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
					<u-input v-model="registerDto.userName" placeholder="用户名" prefixIcon="account" color="var(--color-111)" fontSize="16px"
						prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
					<u-input v-model="registerDto.password" placeholder="密码" prefixIcon="lock" color="var(--color-111)" fontSize="16px"
						prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
					<u-input v-model="registerDto.captcha" color="var(--color-111)" placeholder="验证码" class="captcha">
						<template slot="suffix">
							<u-image @click="updateCaptch()" showLoading :src="captchaUrl" radius="6" width="200rpx"
								height="80rpx"></u-image>
						</template>
					</u-input>
					<view class="btn" @click="registerSumbit()">注册</view>
					<view class="flex-between">
						<text @click="current=0">< 去登录</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		captchaImage
	} from '@/api/common.js';
	import {
		login,register
	} from '@/api/user.js'
	export default {
		data() {
			return {
				current: 0,
				captchaUrl: 'https://cdn.uviewui.com/uview/album/1.jpg',
				loginDto: {
					loginType: 1,
					userName: null,
					password: null,
					captcha: null,
					captchaId: null
				},
				registerDto: {
					nickName: null,
					userName: null,
					password: null,
					captcha: null,
					captchaId: null
				}
			}
		},
		onLoad({current}) {
			this.current = current || 0
		},
		mounted() {
			this.updateCaptch()
		},
		methods: {
			async updateCaptch(lastCaptchaId) {
				let res = await captchaImage()
				this.loginDto.captchaId = res.data.captchaId
				this.registerDto.captchaId = res.data.captchaId
				this.captchaUrl = 'data:image/png;base64,' + res.data.img
			},
			async loginSumbit() {
				let res = await login(this.loginDto)
				if (res.code == 2000) {
					this.$u.toast('登录成功')
					setTimeout( () => {
						uni.navigateBack()
					},500)
				}
				this.$store.commit('user/SET_USERINFO',res.data)
				this.$store.commit('user/SET_TOKEN',res.data.token)
			},
			async registerSumbit() {
				let res = await register(this.registerDto)
			} 
		},
	}
</script>

<style lang="scss" scoped>
	.page-container {
		background-color: var(--color-eee);
		overflow: scroll;
	}
	.wrapper {
		padding: 0 60rpx;
		.flex-between {
			margin-top: 16rpx;
			color: var(--color-primary);
			font-size: 28rpx;
			padding: 0 12rpx;
		}
	}
	.title {
		font-size: 52rpx;
		margin-top: 120rpx;
		margin-bottom: 80rpx;
		color: var(--color-111);
		font-weight: 700;
		.tip {
			font-size: 26rpx;
			margin-top: 24rpx;
			color: var(--color-999);
		}
	}
	.btn {
		line-height: 60rpx;
		width: 100%;
		font-size: 34rpx;
		border-radius: 60rpx;
		padding: 16rpx 0;
		background-color: var(--color-primary);
		text-align: center;
		font-weight: 700;
		color: #eee;
		margin-top: 24rpx;
	}
	
	.u-input {
		background-color: transparent;
		font-size: 28rpx;
		height: 80rpx;
		border-radius: 60rpx;
		margin: 44rpx 0;
		border: none;
		/deep/.u-input__content {
			padding-bottom: 8px;
			border-bottom: 1px solid var(--color-aaa);
		}
	}
	.captcha {
		padding-left: 32rpx !important;
		padding-right: 36rpx !important;
	}
	uni-swiper {
		height: 100vh;
		padding-top: calc( 44px + var(--status-bar-height));
		box-sizing: border-box;
		overflow: scroll;
	}
	
</style>
