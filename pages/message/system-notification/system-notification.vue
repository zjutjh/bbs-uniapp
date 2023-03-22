<template>
	<view class="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar title="系统通知" bgColor="var(--bg-color)" autoBack placeholder  />
		<view class="page-main">
			<view class="list">
				<u-empty v-if="notificationList.length==0" text="没有记录" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"/>
				<view class="item" v-for="item in notificationList">
					<u--image v-if="item.cover!=null" :showLoading="true" :src="item.cover" height="120px" width="100%"/>
					<view class="title">{{item.title}}</view>
					<view class="des">
						{{item.content}}
					</view>
					<view class="bottom flex-between">
						<view class="datetime">{{+new Date(item.createdTime)|date('yyyy-mm-dd hh:MM')}}</view>
						<view class="more flex">查看详情></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {notificationPage,readAllOfSystem} from '@/api/notification.js'
	export default {
		data() {
			return {
				notificationList: [],
				queryBody: {
					pageNum: 0,
					pageSize: 20
				}
			};
		},
		created() {
			uni.showLoading()
			this.getNextPage()
			readAllOfSystem()
		},
		onReachBottom() {
			this.getNextPage()
		},
		methods: {
			async getNextPage() {
				this.queryBody.pageNum++
				this.queryBody.type = 0
				let res = await notificationPage(this.queryBody)
				this.notificationList = [...this.notificationList, ...res.data.records]
				if (res.data.records.length == 0) {
					this.queryBody.pageNum--
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-main {
	padding: 32rpx;
	.list {
		.item {
			background-color: var(--bg-card-color);
			border-radius: $uni-border-radius-xxlg;
			padding: 16rpx 22rpx;
			margin: 60rpx 0;
			/deep/.u-image__image > div {
				border-radius: $uni-border-radius-xxlg !important;
			}
			.title {
				font-size: 30rpx;
				margin-top: 12rpx;
			}
			.des {
				font-size: 24rpx;
				color: var(--color-888);
				margin: 8rpx 0 14rpx;
			}
			.bottom {
				border-top: 1px solid var(--color-eee);
				font-size: 22rpx;
				padding: 12rpx 0 6rpx;
				box-sizing: border-box;
				color: #aaa;
				.u-icon {
					margin-left: 6rpx;
					color: #aaa;
				}
			}
		}
	}
}
</style>
