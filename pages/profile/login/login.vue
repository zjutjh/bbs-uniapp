<template>
	<view class="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar autoBack :leftText="' 返回'" bgColor="transparent" placeholder>
			<view slot="right"  @click="chooseLoginType(1)">
				账号登录
			</view>
		</u-navbar>
		
		<view v-if="loginDto.loginType==null" class="login-bg">
			<view class="bottom-wrapper flex-column">
				<!-- <view class="login-btn flex" @click="chooseLoginType(1)">
					<text>账号密码登录</text>
				</view> -->
				<view class="login-btn flex" @click="chooseLoginType(2)">
					<u-avatar src="/static/image/icon/chaoxing.png" size="18"></u-avatar>
					<text>超星登录</text>
				</view>
				<view class="login-btn flex" @click="chooseLoginType(3)">
					<u-avatar src="/static/image/icon/wejh.png" size="18"></u-avatar>
					<text>微精弘登录</text>
				</view>
			</view>
		</view>
		
		<!-- 登录 -->
		<view v-else class="wrapper" @click="showIndex=1">
			<view class="title">
				{{'登录'+loginTypeName()+'账号'}}
				<!-- <view class="tip">根据国家法律法规，请先绑定手机号</view> -->
			</view>
			<u-input v-model="loginDto.userName" :placeholder="loginTypeName()+'用户名'" prefixIcon="account" color="var(--color-111)" fontSize="14px" placeholderStyle="color:var(--color-111)"
				prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
			<u-input v-model="loginDto.password" type="password" :placeholder="loginTypeName()+'密码'" prefixIcon="lock" color="var(--color-111)" fontSize="14px" placeholderStyle="color:var(--color-111)"
				prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
			<u-input v-model="loginDto.captcha" color="var(--color-111)" placeholder="验证码" placeholderStyle="color:var(--color-111)" class="captcha">
				<template slot="suffix">
					<u-image @click="updateCaptch()" showLoading :src="captchaUrl" radius="6" width="200rpx"
						height="80rpx"></u-image>
				</template>
			</u-input>
			<view class="btn" @click="loginSumbit()">登录</view>
			<view class="color-tip mt-12" style="font-size: 22rpx;">
				注：超星账号通常是手机号，微精弘账号通常是学号
			</view>
		</view>

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
					loginType: null,
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
				this.captchaUrl = 'data:image/png;base64,' + res.data.img
			},
			async loginSumbit() {
				uni.showLoading()
				let res = await login(this.loginDto)
				if (res.code == 2000) {
					this.$u.toast('登录成功')
					this.$store.commit('user/SET_TOKEN',res.data.token)
					this.$store.dispatch('user/UpdateUserInfo') // 更新用户信息
					setTimeout( () => {
						uni.navigateBack()
					},500)
				}
			},
			chooseLoginType(type) {
				this.loginDto.loginType = type
			},
			loginTypeName() {
				if (this.loginDto.loginType==1) {
					return ''
				}
				else if(this.loginDto.loginType==2) {
					return '超星'
				} 
				else if (this.loginDto.loginType==3) {
					return '微精弘'
				}
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
	}
	.login-bg {
		justify-content: end;
		align-items: center;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		padding-bottom: 80px;
		background-image: url('../../../static/image/bg-dark.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
		.bottom-wrapper {
			position: absolute;
			bottom: 80rpx;
			left: 0;
			right: 0;
			align-items: center;
			.login-btn {
				width: 60%;
				font-size: 28rpx;
				font-weight: 700;
				margin: 26rpx 0;
				padding: 32rpx 18rpx;
				border-radius: 100rpx;
				color: #111;
				background-color: #fff;
				box-shadow: 1px 2px 12px 3px rgba(0, 0, 0, .3);
				text {
					margin-left: 20rpx;
				}
				&:active {
					background-color: #ddd;
				}
			}
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
	
</style>
