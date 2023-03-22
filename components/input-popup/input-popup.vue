<template>
	<view>
		<u-popup :show="show" :mode="mode" @close="close()" closeOnClickOverlay :round="round">
			<view class="popup-wrapper">
				<view v-if="title" class="title flex mb-12">请输入</view>
				<input type="text" v-model="inputValue" :placeholder="placeholder">
				<view class="btn-wrapper flex">
					<view class="btn cancel" @click="cancel()">取消</view>
					<view class="btn ok" @click="submit()">确定</view>
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
			placeholder: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: null
			}
		},
		data() {
			return {
				inputValue: ''
			};
		},
		methods: {
			close() {
				this.$emit('close')
			},
			submit() {
				this.$emit('submit',this.inputValue)
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
	font-size: 32rpx;
	input {
		padding: 20rpx 28rpx;
		font-size: 28rpx;
		background-color: var(--color-eee);
		border-radius: 100rpx;
	}
	.title {
		font-weight: 600;
		font-size: 32rpx;
		margin: 12rpx 0;
	}
	.btn-wrapper {
		font-weight: 700;
		margin-top: 40rpx;
		.btn {
			flex: 1;
			margin: 0 8rpx;
			background-color: var(--color-primary);
			text-align: center;
			padding: 12rpx 40rpx;
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