<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="我的回复" bgColor="var(--bg-color)" autoBack placeholder></u-navbar>
		<u-empty v-if="dataList.length==0" text="没有记录" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"/>
		<view class="list" v-if="dataList.length>0">
			<view class="item flex-start" v-for="item in dataList" @click="itemClick(item)">
				<u-avatar :src="item.user.avatar" size="36"></u-avatar>
				<view class="right">
					<view class="user-info flex-column">
						<view>{{item.user.nickName}}</view>
						<view class="datetime">{{+new Date(item.createdTime)|date('yyyy-mm-dd hh:MM')}}</view>
						<view class="content">{{item.content}}</view>
					</view>
					<view class="replyed-comment" v-if="item.parentComment!=null">
						<text>{{item.parentComment.user.nickName+': '}}</text>
						<text>{{item.parentComment.content}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getCommentOfMe} from '@/api/comment.js'
	export default {
		data() {
			return {
				dataList: []
			};
		},
		onLoad() {
			uni.showLoading()
			this.nextPage()
		},
		onReachBottom() {
			this.nextPage()
		},
		methods: {
			async nextPage() {
				let page
				let size = 20;
				let length = this.dataList.length
				let tempInt = parseInt(length/size)
				page = length%size==0 ? tempInt : tempInt+1
				let body = {pageNum:page+1,pageSize:size}
				let res = await getCommentOfMe(body)
				if (res.data.records.length==0) {
					return
				}
				this.dataList = [ ...this.dataList ,...res.data.records]
			},
			itemClick(item) {
				if (item.type=="0") {
					this.toPostDetail(item.postId)
				} 
				else if (item.type == "1") {
					this.toCommentDetail(item.commentId,null,item.postId,null,true)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

.list {
	.item {
		padding: 28rpx 32rpx;
		align-items: flex-start;
		border-bottom: 1px solid var(--color-eee);
		background-color: var(--bg-card-color);
		.right {
			margin-left: 28rpx;
			flex: 1;
			.user-info {
				font-size: 30rpx;
			}
			.datetime {
				margin-top: 6rpx;
				font-size: 24rpx;
				color: var(--color-888);
			}
			.content {
				margin: 18rpx 0;
			}
			.replyed-comment {
				padding: 12rpx 16rpx;
				border: 1px solid var(--color-ccc);
				color: var(--color-999);
				border-radius: 10rpx;
			}
		}
		
		&:active {
			background-color: var(--color-ddd);
		}
	}
}
</style>
