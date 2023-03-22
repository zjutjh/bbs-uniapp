<template>
	<view>
		<scroll-view v-if="list && list.length!=0" class="post-list" scroll-y :lower-threshold="300" >
			<view v-for="post in list" :key="post.id" class="post-item" @click.stop="toPostDetail(post.id)">
				<!-- 顶部-头像部分 -->
				<view class="top">
					<view @click.stop="toPersonDetail(post.user.userId)">
						<u-avatar size="36" :src="post.user.avatar"/>
					</view>
					
					<view class="user-info">
						<view class="user-name">
							<text>{{post.user.nickName}}</text>
						</view>
						<text class="datail">
							{{timeFormat(post.createdTime)}}
						</text>
					</view>
				</view>
				<!-- 中间-内容部分 -->
				<view class="body">
					<view class="body-text u-line-5 space-pre-wrap">
						{{post.content}}
					</view>
					<view class="body-imgList">
						<view class="img-item">
							<image v-for="url in post.imageList" :src="url" mode="aspectFill" lazy-load/>
						</view>
					</view>
				</view>
				<!-- 圈子、话题部分 -->
				<view class="cirle-topic-list">
					<view class="circle-item item" v-if="post.circle" @click.stop="toCircleDetail(post.circle.id)">
						<u-avatar size="14" :src="post.circle.avatar" shape="square"></u-avatar>
						<text class="name">{{post.circle.name}}</text>
					</view>
					<view class="topic-item item" v-for="topic in post.topicList" :key="topic.id" @click.stop="toTopicDetail(topic.id)">
						<text>#</text>
						<text class="name">{{topic.name}}</text>
					</view>
				</view>
				<!-- 热门评论 -->
				<view v-if="post.hotCommentList.length!=0" class="hot-comment-list">
					<view class="hot-comment-item" v-for="hotComment in post.hotCommentList" :key="hotComment.id">
						<view class="comment-name space-nowrap">{{hotComment.user.nickName}}：</view>
						<view class="comment-content u-line-3">{{hotComment.content}}</view>
					</view>
				</view>
				
				<!-- 底部：点赞分享部分 -->
				<view class="bottom">
					<view class="data-card"><u-icon size="16" color="" name="eye"/>{{post.readCount}}</view>
					<view class="data-card"><u-icon size="16" color="" name="chat"/>{{post.commentCount}}</view>
					<view class="data-card" :class="{active:post.isThumb}"><u-icon size="16" color="" name="thumb-up"/>{{post.thumbCount}}</view>
					<view class="data-card more"><u-icon size="14" name="more-dot-fill"/></view>
				</view>
			</view>
		</scroll-view>
		<u-empty v-else text=" " mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"/>
	</view>
</template>

<script>
	import {timeFormat} from '@/utils/timeFormat.js';
	export default {
		name: "post-list",
		props: {
			list: Array,
		},
		data() {
			return {
				timeFormat,
			};
		},
		onReachBottom() {
			console.log('reachBottom');
		},
		methods: {
		}

	}
</script>

<style lang="scss" scoped>
	
	.post-list {
		.post-item {
			background-color: var(--bg-card-color);
			border-radius: $uni-border-radius-xxlg;
			margin-bottom: 24rpx;
			padding: 32rpx 26rpx;
			.top {
				display: flex;
				align-items: center;
				.user-info {
					margin-left: 20rpx;
					display: flex;
					width: 100%;
					flex-direction: column;
					.user-name {
						font-size: 30rpx;
						color: var(--text-black-color);
						display: flex;
						align-items: center;
						.tags {
							display: flex;
							font-size: 20rpx;
							.tag {
								display: flex;
								margin-left: 4rpx;
								border-radius: 8rpx;
								color: white;
								padding: 0 4rpx;
							}
						}
					}
					.datail {
						font-size: 24rpx;
						color: var(--text-tips-color);
					}
				}
			}
			.body {
				padding: 26rpx 0;
				font-size: 30rpx;
				.body-text {
					line-height: 1.6em;
					color: var(--text-black-color);
				}
				.body-imgList {
					margin-top: 20rpx;
					.img-item {
						image {
							height: 100px;
							width: 32%;
							max-width: 100px;
							// max-height: ;
							vertical-align: middle;
							
							border-radius: 8rpx;
							margin: 0.2%;
						}
					}
				}
			}
			.cirle-topic-list {
				display: flex;
				flex-wrap: nowrap;
				align-items: center;
				overflow: auto;
				.item {
					display: flex;
					word-break:keep-all;
					align-items: center;
					margin-right: 16rpx;
					background-color: var(--bg-light-color);
					border-radius: 12rpx;
					padding: 10rpx 18rpx;
					font-size: 22rpx;
					color: var(--color-444);
					.name {
						margin-left: 10rpx;
					}
					&:active {
						background-color: var(--color-ddd);
					}
				}
			}
			.hot-comment-list {
				padding: 12rpx 16rpx;
				background-color: var(--bg-light-color);
				margin-top: 24rpx;
				font-size: 24rpx;
				border-radius: 16rpx;
				.hot-comment-item {
					padding: 6rpx 0;
					display: flex;
					.comment-name {
						color: var(--color-primary);
					}
					.comment-content {
						color: var(--color-444);
					}
				}
			}
			.bottom {
				display: flex;
				margin-top: 24rpx;
				.data-card {
					width: 140rpx;
					display: flex;
					align-items: flex-end;
					color: #6f7374;
					.u-icon {
						margin-right: 8rpx;
					}
					
				}
				.active {
					color: var(--color-primary);
				}
				.more {
					margin-left: auto;
					flex-direction: row-reverse;
					.u-icon {
						transform: rotate(90deg);
					}
				}
				.data-card-active {
					color: #18b566;
				}
			}
		}
	}
</style>
