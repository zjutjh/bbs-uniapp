<template>
	<view class="page-container height-auto overflow-visible" :data-theme="theme">
		<u-navbar leftIcon="arrow-left" :autoBack="true"  placeholder bgColor="var(--ba-circle-detail-page)" >
			<view class="navbar-left flex" slot="left">
				<u-icon class="left-icon" name="arrow-left" color="#fff" size="18"/>
				<view class="flex" v-show="style.circleInfo">
					<u-avatar size="24" :src="circleInfo.avatar" shape="square"></u-avatar>
					<text class="circle-name">{{circleInfo.name}}</text>
					<!-- <view class="follow-btn" :class="{'follow-btn-joined':circleInfo.isFollow}">已加入</view> -->
					<view v-if="!circleInfo.isFollow" class="follow-btn" @click.stop="joinCircleSubmit()">加入</view>
					<view v-else class="follow-btn follow-btn-joined" @click.stop="leaveCircleSubmit()">已加入</view>
				</view>
			</view>
			<view class="navbar-right" slot="right">
			</view>
		</u-navbar>
		<view class="page-main">
			<!-- 圈子信息板块 -->
			<view class="circle-info-wrapper">
				<!-- 圈子行信息 -->
				<view class="circle-info flex">
					<u-avatar size="72" :src="circleInfo.avatar" shape="square"></u-avatar>
					<view class="flex-column flex-1">
						<text class="circle-name">{{circleInfo.name}}</text>
						<text class="circle-detail">{{circleInfo.activityCount}}热度 {{circleInfo.postCount}}动态</text>
						<view class="flex-start">
							<u-avatar-group size="16" gap="0.4" v-if="circleInfo.joinUserList&&circleInfo.joinUserList.length!=0"
								:urls="circleInfo.joinUserList.map(user=>user.avatar)"/>
							<text style="margin-left: 6px;">{{circleInfo.joinCount}}关注</text>
						</view>
					</view>
					<view v-if="!circleInfo.isFollow" class="follow-btn" @click="joinCircleSubmit()">加入</view>
					<view v-else class="follow-btn follow-btn-joined" @click="leaveCircleSubmit()">已加入</view>
				</view>
				<!-- 圈子说明信息 -->
				<view class="circle-des space-pre-wrap">
					{{circleInfo.description}}
				</view>
				<view class="circle-more hide">
					更多详细信息 >
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
			
			<view class="btn center" @click="clickAddBtn({id:circleInfo.id,name:circleInfo.name})">
				<u-icon color="white" size="26" name="plus"></u-icon>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import PostList from '@/components/post-list/post-list.vue';
	import {getCircleById,joinCircle,leaveCircle} from '@/api/circle.js';
	import {getPostList,readAllOfCircle} from "@/api/post.js";

	export default {
		components: {
			PostList
		},
		data() {
			return {
				style: {
					circleInfo: false,
					postWrapperBg: 'rbga(255,255,255,.5)'
				},
				postList: [],
				loadStatus: 'nomore',
				circleInfo:{},
				queryCondition: {
					circleId: null,
					pageNum: 0,
					pageSize: 5
				}
			};
		},
		onPageScroll(e) {
			if (e.scrollTop > 58) {
				this.style.circleInfo = true
			} else {
				this.style.circleInfo = false
			}
			if (e.scrollTop > 120) {
				
			}
		},
		async onLoad({circleId}) {
			uni.showLoading()
			let res = await getCircleById(circleId);
			this.circleInfo = res.data
			this.getNextPage()
			this.readAll()
		},
		onReachBottom(){
			this.getNextPage()
		},
		methods: {
			async joinCircleSubmit() {
				let res = await joinCircle(this.circleInfo.id)
				this.circleInfo.isFollow = true
				this.circleInfo.joinCount += 1
			},
			async leaveCircleSubmit() {
				let res = await leaveCircle(this.circleInfo.id)
				this.circleInfo.isFollow = false
				this.circleInfo.joinCount -= 1
			},
			async getNextPage() {
				this.loadStatus = 'loading'
				this.queryCondition.pageNum++
				this.queryCondition.circleId = this.circleInfo.id
				let res= await getPostList(this.queryCondition)
				setTimeout(() => {
					if (res.data.records.length == 0) {
						this.loadStatus = 'nomore'
						this.queryCondition.pageNum--
					}
					this.postList = [...this.postList, ...res.data.records]
				},500)
			},
			async readAll() {
				await readAllOfCircle(this.circleInfo.id)
			},
			clickAddBtn(param) {
				if (!this.circleInfo.isFollow) {
					return this.$u.toast('请先加入圈子')
				}
				this.toAddPost(param)
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
		.left-icon {
			margin-right: 28rpx;
		}
		.circle-name {
			font-weight: 700;
			font-size: 28rpx;
			margin-left: 16rpx;
			color: var(--r-color-ddd);
		}
		.follow-btn {
			margin: 2rpx 0;
			margin-left: 16rpx;
			padding: 8rpx 14rpx;
			font-size: 24rpx;
			border-radius: 24rpx;
			background-color: red;
			color: var(--color-primary-light);
			background-color: var(--color-primary-dark);
		}
		.follow-btn-joined {
			color: var(--color-info);
			background-color: var(--color-info-light);
		}
	}
}
.circle-info-wrapper {
	.circle-info {
		.flex-column {
			margin-left: 28rpx;
			.circle-name {
				font-weight: 700;
				font-size: 32rpx;
				color: var(--r-color-ddd);
			}
			.circle-detail {
				margin: 12rpx 0;
				color: var(--text-grey-color);
			}
			.flex-start {
				font-size: 20rpx;
				color: var(--text-light-color);
			}
		}
		.follow-btn {
			font-weight: 700;
			margin-left: auto;
			margin-right: 12rpx;
			padding: 14rpx 26rpx;
			font-size: 28rpx;
			border-radius: 12rpx;
			background-color: red;
			color: var(--color-primary-light);
			background-color: var(--color-primary-dark);
		}
		.follow-btn-joined {
			color: var(--color-info);
			background-color: var(--color-info-light);
		}
	}
	.circle-des {
		padding: 24rpx 0;
		color: var(--text-grey-color);
	}
	.circle-more {
		font-size: 22rpx;
		// padding: 18rpx 0;
		color: var(--text-light-color);
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
