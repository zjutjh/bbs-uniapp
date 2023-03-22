<template>
	<u-action-sheet
		:show="show"
		@close="close"
		:round="16"
	>
		<view class="actionSheet-wrapper">
			<view @click="select(index)" class="action-item ripple" hover-class="hoverClass" v-for="(item,index) in actions" :key="index">
				<text>{{item.name}}</text>
			</view>
			<view @click="close()" class="action-item action-item-cancle ripple" hover-class="hoverClass">
				<text>取消</text>
			</view>
		</view>
	</u-action-sheet>
</template>

<script>
	export default {
		name:"action-sheet",
		props: {
			show: Boolean,
			actions: Array,
			autoClose: {
				type: Boolean,
				default: true
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
			select(index) {
				this.$emit('select',index)
				if (this.autoClose) {
					this.close()
				}
			}
		}
	}
</script>

<style lang="scss">
.actionSheet-wrapper {
	padding: 30rpx;
	font-size: 30rpx;
	background-color: var(--bg-color);
	border-radius: 14px 14px 0 0;
	box-sizing: border-box;
	border-top: 1px solid #777;
	.action-item {
		color: var(--text-black-color);
		box-sizing: border-box;
		overflow: hidden;
		font-weight: 500;
		padding: 24rpx;
		margin: 20rpx 0;
		border-radius: 60rpx;
		border: .5px solid var(--color-ddd);
		&:active {
			background-color: var(--color-ddd);
		}
	}
	.action-item-cancle {
		border: none;
		margin-bottom: 0;
	}
}
</style>