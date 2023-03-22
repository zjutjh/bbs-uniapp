<template>
	<view>
		<u-popup :show="show" :mode="mode" @close="close()" closeOnClickOverlay :round="round">
			<view class="popup-wrapper">
				<slot name="top"></slot>
				<view v-if="title" class="title mb-12">{{title}}</view>
				<slot name="bottom"></slot>
				<view class="btn-wrapper flex">
					<view class="btn cancel" @click="cancel()">{{cancelText}}</view>
					<view class="btn ok" @click="submit()">{{okText}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"input-popup",
		props: {
			show: Boolean,
			round: {
				type: String,
				default: '16'
			},
			mode: {
				type: String,
				default: 'center'
			},
			title: {
				type: String,
				default: null
			},
			okText: {
				type: String,
				default: '确定'
			},
			cancelText: {
				type: String,
				default: '取消'
			}
		},
		data() {
			return {
			};
		},
		methods: {
			close() {
				this.$emit('close')
			},
			submit() {
				this.$emit('submit')
			},
			cancel() {
				this.$emit('cancel')
			}
		}
	}
</script>

<style lang="scss" scoped> 

.popup-wrapper {
	padding: 56rpx;
	padding-top: 38rpx;
	font-size: 32rpx;
	input {
		padding: 20rpx 28rpx;
		font-size: 28rpx;
		background-color: var(--color-eee);
		border-radius: 100rpx;
	}
	.title {
		font-weight: 800;
		font-size: 32rpx;
		margin: 22rpx 0;
	}
	.btn-wrapper {
		font-weight: 700;
		margin-top: 40rpx;
		.btn {
			flex: 1;
			margin: 0 16rpx;
			background-color: var(--color-primary);
			text-align: center;
			padding: 18rpx 40rpx;
			border-radius: 100rpx;
			color: white;
		}
		.cancel {
			background-color: var(--color-eee);
			color: var(--color-primary);
		}
	}
}
</style>