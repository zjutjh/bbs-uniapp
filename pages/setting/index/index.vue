<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="设置" bgColor="var(--bg-color)" autoBack placeholder/>
		<view class="page-main">
			<view class="title">账号</view>
			<view class="row-section">
				<view class="row-item" @click="toPersonEdit()">我的资料</view>
				<view class="row-item" @click="toUserActive()">激活账号</view>
				<view class="row-item">拉黑列表 [开发中]</view>
			</view>
			<view class="title">系统设置</view>
			<view class="row-section">
				<view class="row-item">消息通知 [开发中]</view>
				<view class="row-item">隐私 [开发中]</view>
			</view>
			<view class="title">配置</view>
			<view class="row-section">
				<view class="row-item">课程自动签到 [开发中]</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.page-main {
		padding: 28rpx;
		.title {
			margin: 0 12rpx;
			margin-bottom: 18rpx;
			font-size: 28rpx;
			color: var(--color-555);
		}
	}
.row-section {
	margin-bottom: 32rpx;
	background-color: var(--bg-card-color);
	border-radius: $uni-border-radius-xxlg;
	overflow: hidden;
	.row-item {
		border-bottom: .4px solid var(--color-eee);
		padding: 28rpx;
		font-size: 30rpx;
		&:active {
			background-color: var(--color-eee);
		}
	}
}
</style>
