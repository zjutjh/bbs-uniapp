<template>
	<view class="wrap center">
		<view class="icon">
			<view class="center">
				<u-avatar src="/static/logo.png" size="128" shape="square"></u-avatar>
			</view>
			<view class="name">
				工大论坛
			</view>
			<view class="btn-wrap">
				<!-- <view class="invite-code btn">
					复制邀请码
				</view> -->
				<view class="download btn" @click="downLoad()">
					安卓端下载
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {updateApp} from '@/api/system.js'
	export default {
		data() {
			return {
				downloadUrl: null
			};
		},
		mounted() {
			this.getDownloadUrl()
		},
		methods: {
			async getDownloadUrl() {
				let res = await updateApp()
				this.downloadUrl = res.data.url
			},
			downLoad() {
				window.location.href = this.downloadUrl
			}
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FA8BFF;
	background-image: linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%);
}
.u-avatar {
	border-radius: 32rpx;
	overflow: hidden;
}
.name {
	font-size: 68rpx;
	margin: 32rpx 0;
	text-align: center;
	letter-spacing: 1px;
}
.btn-wrap {
	margin-top: 120rpx;
	.btn {
		font-size: 42rpx;
		text-align: center;
		background-color: white;
		padding: 30rpx 120rpx;
		border-radius: 100rpx;
		margin: 32rpx 0;
	}
	.download {
		background-color: var(--color-primary);
		color: white;
		font-weight: 800;
	}
}

</style>
