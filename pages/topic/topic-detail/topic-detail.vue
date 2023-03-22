<template>
	<view class="page-container height-auto overflow-visible" :data-theme="theme">
		<!-- 导航条 -->
		<u-navbar class="white" leftIcon="arrow-left" :autoBack="true"  placeholder bgColor="var(--ba-circle-detail-page)" >
			<view class="navbar-left flex" slot="left">
				<u-icon class="left-icon" name="arrow-left" color="#fff" size="18"/>
				<view class="flex" v-show="style.topicInfo">
					<text class="circle-name">{{'#   '+topicInfo.name}}</text>
				</view>
			</view>
			<view class="navbar-right" slot="right">
			</view>
		</u-navbar>
		
		<view class="page-main">
			<!-- 圈子信息板块 -->
			<view v-if="topicInfo&&topicInfo.name" class="circle-info-wrapper">
				<!-- 圈子行信息 -->
				<view class="circle-info flex-column">
					<text class="circle-name">{{'# '+topicInfo.name}}</text>
					<text class="circle-detail hide"> {{topicInfo.postCount}} 热度 {{topicInfo.postCount}} 动态</text>
				</view>
				<!-- 圈子说明信息 -->
				<view class="circle-des space-pre-wrap">
					{{topicInfo.description}}
				</view>
			</view>
			<!-- 动态板块 -->
			<view class="post-wrapper" :style="{backgroundColor: style.postWrapperBg}">
				<view class="filter flex-start hide">
					<text class="filter-item filter-item-active">推荐</text>
					<text class="filter-item">最新</text>
					<text class="filter-item">精华</text>
				</view>
				<PostList :list="postList"/>
				<u-loadmore :status="loadStatus" />
			</view>
			<view class="btn center" @click="toAddPost(null,[{id:topicInfo.id,name:topicInfo.name}])">
				<u-icon color="white" size="26" name="plus"></u-icon>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import PostList from '@/components/post-list/post-list.vue';
	import {getTopicById} from '@/api/topic.js';
	import {postListByTopic} from "@/api/post.js";
	export default {
		components: {
			PostList
		},
		data() {
			return {
				style: {
					topicInfo: false,
					postWrapperBg: 'rbga(255,255,255,.5)'
				},
				postList: [],
				loadStatus: 'nomore',
				topicInfo:{},
				queryCondition: {
					topicId: null,
					pageNum: 0,
					pageSize: 20,
					isDesc: true
				}
			};
		},
		onPageScroll(e) {
			if (e.scrollTop > 58) {
				this.style.topicInfo = true
			} else {
				this.style.topicInfo = false
			}
		},
		async onLoad({topicId}) {
			uni.showLoading()
			let res = await getTopicById(topicId);
			this.topicInfo = res.data
			this.getNextPage()
		},
		onReachBottom(){
			this.getNextPage()
		},
		methods: {
			async getNextPage() {
				this.loadStatus = 'loading'
				this.queryCondition.pageNum++
				this.queryCondition.topicId = this.topicInfo.id
				let res= await postListByTopic(this.queryCondition)
				setTimeout(() => {
					if (res.data.records.length == 0) {
						this.loadStatus = 'nomore'
						this.queryCondition.pageNum--
					}
					this.postList = [...this.postList, ...res.data.records]
				},500)
			}
		}
	}
</script>

<style lang="scss" scoped>
$page-bg-color: var(--color-444);
.page-container {
	background-color: var(--ba-circle-detail-page);
	.page-main {
		height: 100%;
		padding: $uni-navbar-padding;
	}
}

.u-navbar {
	z-index: 2;
	.navbar-left {
		display: flex;
		.circle-name {
			font-weight: 700;
			font-size: 28rpx;
			margin-left: 16rpx;
			color: var(--r-color-ddd);
		}
	}
}
.circle-info-wrapper {
	.flex-column {
		.circle-name {
			font-weight: 700;
			font-size: 44rpx;
			color: var(--r-color-ddd);
		}
		.circle-detail {
			margin: 12rpx 0;
			color: var(--text-grey-color);
			font-size: 24rpx;
		}
	}
	.circle-des {
		font-size: 30rpx;
		padding: 8rpx 0;
		margin-bottom: 28rpx;
		color: var(--r-color-ddd);
	}
}
.post-wrapper {
	.filter {
		position: sticky;
		top: $top-height;
		right: 0;
		left: 0;
		margin: 8rpx 0;
		z-index: 99;
		background-color: var(--ba-circle-detail-page);
		.filter-item {
			font-size: 30rpx;
			padding: 16rpx 24rpx;
			padding-left: 0;
			color: var(--text-light-color);
		}
		.filter-item-active {
			color: var(--r-color-fff);
			font-weight: 700;
		}
	}
}

/deep/.u-loadmore__content__text {
	color: var(--text-light-color) !important;
}
.btn {
	position: fixed;
	right: 50rpx;
	bottom: 70rpx;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: var(--color-primary);
	box-shadow: 2px 2px 12px 2px rgba(0, 0, 0, .1);
}

</style>
