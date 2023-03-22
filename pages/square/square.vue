<template>
	<view class="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar placeholder :bgColor="style.navBarBgColor" title="逛一逛">
			<view slot="left"></view>
		</u-navbar>
		
		
		<view class="page-main">
			<view class="hot-app-section">
				<view class="app-item flex-column" @click="toCircleDetail(5)">
					<text class="title">学业解答</text>
					<text class="tips u-line-1">解决学业疑惑</text>
					<view class="icon center">
						<u-icon name="bookmark" color="rgb(254, 236, 135)" size="28"></u-icon>
					</view>
				</view>
				<view class="app-item flex-column" @click="toCircleDetail(2)">
					<text class="title">寻物启示</text>
					<text class="tips u-line-1">别再丢东西啦</text>
					<view class="icon center">
						<u-icon name="heart" color="#a0fdf2" size="28"></u-icon>
					</view>
				</view>
				<view class="app-item flex-column" @click="toCircleDetail(7)">
					<text class="title">闲置交易</text>
					<text class="tips u-line-1">闲置物品交易</text>
					<view class="icon center">
						<u-icon name="shopping-cart" color="#a5ddfe" size="32"></u-icon>
					</view>
				</view>
<!-- 				<view class="app-item flex-column" @click="toChaoxingIndex()">
					<text class="title">超星助手</text>
					<text class="tips u-line-1">自动签到</text>
					<view class="icon center">
						<u-icon name="bag" color="#a5ddfe" size="32"></u-icon>
					</view>
				</view> -->
<!-- 				<view class="app-item flex-column">
					<text class="title">组队攒局</text>
					<text class="tips u-line-1">随机选餐</text>
					<view class="icon center">
						<u-icon name="plus-people-fill" color="#a5ddfe" size="32"></u-icon>
					</view>
				</view> -->
			</view>
			
			<view v-if="top10List.length!=0" class="top10 recommend-wrapper">
				<view class="title-section flex-between">
					<text class="title">🔥 Top10</text>
				</view>
				<view class="card">
					<view class="item top10-item flex-column" v-for="item,i in top10List" :key="item.id" @click="toPostDetail(item.id)">
						<view class="top flex">
							<view class="index">{{i<9?'0'+(i+1):i}}</view>
							<view class="ml-8">评论{{item.commentCount}} 阅读{{item.readCount}}</view>
						</view>
						<view class="post-title flex-between">
							<view class="u-line-3 space-pre-wrap">{{item.content}}</view>
							<view class="cover" v-if="item.imageList.length!=0">
								<u--image radius="12rpx" :showLoading="true" :src="item.imageList[0]" width="100rpx" height="100rpx"/>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-if="topicList.length!=0" class="hot-topic recommend-wrapper">
				<view class="title-section flex-between">
					<text class="title">🎉 热门话题</text>
				</view>
				<view class="card">
					<view @click="toTopicDetail(item.id)" class="item topic-item flex-start" v-for="item in topicList" :key="item.id">
						<text class="icon center">#</text>
						<text class="post-title u-line-1">{{item.name}}</text>
					</view>
				</view>
			</view>
			
			<view v-if="activityList.length>0" class="hot-activity recommend-wrapper">
				<view class="title-section flex-between">
					<text class="title">✨ 近期活动</text>
				</view>
				<view class="card">
					<view @click="activityClick(item)" class="item hot-activity-item flex-start" v-for="item,i in activityList" :key="item.id">
						<text class="index ml-8">{{item.beginTime}}</text>
						<view class="flex-column">
							<text class="post-title u-line-2">{{item.title}}</text>
							<image v-if="item.cover!=null" :showLoading="true" :src="item.cover"/>
						</view>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {getTop10} from '@/api/post.js'
	import {getActivityList} from '@/api/system.js'
	import {getRecommendTopicList} from '@/api/topic.js'
	export default {
		data() {
			return {
				style: {
					navBarBgColor: 'var(--bg-color)'
				},
				top10List: [],
				topicList: [],
				activityList: []
			};
		},
		mounted() {
			this.getTop10List()
			this.getTopicList()
			this.getActivityList()
		},
		methods: {
			async getTop10List() {
				let res = await getTop10()
				this.top10List = res.data
			},
			async getTopicList() {
				let res = await getRecommendTopicList()
				this.topicList = res.data
			},
			async getActivityList() {
				let res = await getActivityList()
				this.activityList = res.data
			},
			activityClick(item) {
				if (item.type == 0) {
					this.toPostDetail(item.resourceId)
				}
				else if (item.type == 1) {
					console.log(item);
					this.toWebview(item.url)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-container {
	.page-main {
		padding: $uni-navbar-padding;
	}
}
.hot-app-section {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	.app-item {
		position: relative;
		padding: 16rpx 26rpx;
		padding-right: 68rpx;
		background-color: var(--color-fff);
		border-radius: $uni-border-radius-xxlg;
		box-shadow: 1px 1px 2px 1px var(--color-eee);
		width: 32%;
		margin: 0 .5%;
		box-sizing: border-box;
		flex-wrap: wrap;
		.title {
			font-size: 31rpx;
		}
		.tips {
			margin-top: 4rpx;
			font-size: 20rpx;
			color: #6c6a64;
		}
		.icon {
			width: 60rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
		&:nth-child(1) {
			background-color: #fefbea;
		}
		&:nth-child(2) {
			background-color: #e9fdfb;
		}
		&:nth-child(3) {
			background-color: #e9f6fe;
		}
		&:nth-child(n+4) {
			margin-top: 16rpx;
		}
		
	}
}
[data-theme='dark']  {
	.hot-app-section .app-item {
		&:nth-child(1) {
			background-color: #312e1f;
		}
		&:nth-child(2) {
			background-color: #233836;
		}
		&:nth-child(3) {
			background-color: #27353d;
		}
	}	
}
[data-theme='dark'] {
	.top10 .card {
		background-image: linear-gradient(180deg, #5b5d5f 0%, #5b5d5e 50%, #393838 100%);
	}
	.hot-topic .card {
		background-image: linear-gradient(180deg, #a2879b 0%, #746e72 50%, #4a434a 100%);
	}
	.hot-activity .card {
		background-image: linear-gradient(180deg, #6c7254 0%, #42423e 50%, #0e0e0e 100%);
	}
	
}
.top10 .card  {
	background-color: #e2f5ff;
	background-image: linear-gradient(180deg, #e2f5ff 0%, #f4fbff 50%, #ffffff 100%);
	.top10-item {
		font-size: 32rpx;
		padding: 24rpx 24rpx;
		align-items: start;
		.top {
			font-size: 24rpx;
		}
		.index {
			font-size: 20rpx;
			color: #beaa81;
			background-color: #f7f2ec;
			border-radius: 6rpx;
			padding: 0rpx 10rpx;
		}
		.ml-8 {
			color: var(--text-light-color);
		}
		&:nth-child(-n+3) {
			.index {
				font-weight: 700;
				color: #fff8ca;
				background-color: #fec51f;
			}
		}
		.post-title {
			margin-top: 12rpx;
			width: 100%;
			align-items: flex-start;
			.cover {
				margin-left: auto;
				border-radius: 12rpx;
			}
		}
	}
}
.hot-topic .card  {
	display: flex;
	flex-wrap: wrap;
	background-color: #e2f5ff;
	padding: 10rpx 10rpx;
	background-image: linear-gradient(180deg, #fbedf7 0%, #fff9fd 50%, #ffffff 100%);
	.topic-item {
		font-size: 28rpx;
		padding: 12rpx 20rpx;
		margin: 8rpx 16rpx 8rpx 0;
		border-radius: 40rpx;
		width: auto;
		overflow: hidden;
		box-shadow: 1px 3px 12px 1px rgba(0, 0, 0, .06);
		.icon {
			font-size: 24rpx;
			color: white;
			box-sizing: border-box;
			height: 20rpx;
			width: 20rpx;
			background-color: $u-primary;
			opacity: .8;
			border-radius: 50%;
			padding: 16rpx;
			margin-right: 12rpx;
		}
	}
}
.hot-activity .card {
	font-size: 32rpx;
	background-color: #f9ffe1;
	background-image: linear-gradient(180deg, #f9ffe1 0%, #fcfff2 50%, #ffffff 100%);

	.hot-activity-item {
		line-height: 48rpx;
		padding: 24rpx 16rpx;
		align-items: flex-start;
		vertical-align: top;
		box-sizing: border-box;
		.index {
			font-weight: 700;
			font-size: 22rpx;
			color: #8c8c8c;
			word-break: keep-all;   
			white-space: nowrap;  
			min-width: 3em;
		}
		.flex-column {
			padding: 0 18rpx;
			.post-title {
				vertical-align: top;
				margin-bottom: 8rpx;
			}
			image {
				max-width: 80%;
				vertical-align: middle;
				height: 120px;
				border-radius: 8rpx;
				margin: 0.2%;
			}
		}
		
	}
	
}
.recommend-wrapper {
	margin: 46rpx 0 32rpx;
	.title-section {
		font-size: 28rpx;
		padding: 0 8rpx;
		margin: 26rpx 0;
		color: var(--text-content-color);
		.title {
			color: var(--color-000);
		}
	}
	.card {
		margin-top: 12rpx;
		overflow: hidden;
		border-radius: $uni-border-radius-xxlg;
		.item {
			&:active {
				background-color: var(--color-eee);
			}
		}
		
	}
}


</style>
