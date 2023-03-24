<template>
	<view class="page-container height-auto" :data-theme="theme">
		<u-navbar title="我加入的圈子" bgColor="var(--bg-color)" autoBack placeholder>
			<view slot="right" @click="toFindCircle(1)">
				发现圈子
			</view>
		</u-navbar>
		<view class="class-wrap">
			<view class="circle-item" @click="chooseCircle(item.id,item.name)" v-for="item in circleList" :key="item.id">
				<u-avatar size="46" :src="item.avatar" shape="square"></u-avatar>
				<view class="circle-info">
					<view class="circle-name">{{item.name}}</view>
					<view class="circle-des">{{item.resume}}</view>
				</view>
			</view> 
		</view>
	</view>
</template>

<script>
	import {getJoinCircleListByUid} from '@/api/circle.js'
	export default {
		data() {
			return {
				circleList: []

			};
		},
		onShow() {
			this.getCircleList();
		},
		methods: {
			async getCircleList() {
				this.circleList = (await getJoinCircleListByUid(this.userInfo.userId)).data
			},
			chooseCircle(id, name) {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.circle = {
					id,
					name
				}
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.circle-item {
		position: relative;
		display: flex;
		align-items: center;
		padding: 23rpx 32rpx;
		background-color: var(--bg-card-color);
		.circle-info {
			display: flex;
			flex-direction: column;
			margin-left: 24rpx;
			.circle-name {
				font-size: 28rpx;
				color: var(--color-444);
			}
			.circle-des {
				font-size: 24rpx;
				margin-top: 8rpx;
				color: var(--text-grey-color);
			}
		}
		&:active {
			background-color: var(--color-eee);
		}
	}
</style>
