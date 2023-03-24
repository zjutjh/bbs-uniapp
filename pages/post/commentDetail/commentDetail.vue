<template>
	<view class="container page-container" :data-theme="theme" v-if="commentDetail.user">
		<u-navbar title="评论回复" bgColor="var(--bg-color)" autoBack placeholder>
			<view slot="right" style="font-size: 22rpx;color: var(--color-777);">
				<text v-if="showToPost||showToPost=='true'" @click="toPostDetail(postId)">回到动态</text>
			</view>
		</u-navbar>
		<!-- 评论内容主体 -->
		<view class="comment-detail" @click="replyUser(commentDetail.id,commentDetail.user.userId,commentDetail.user.nickName)">
			<view class="user-avatar" @click="toPersonDetail(commentDetail.user.userId)">
				<u-avatar size="32" :src="commentDetail.user.avatar"></u-avatar>
			</view>
			<view class="comment-main">
				<view class="user-name">
					<text>{{commentDetail.user.nickName}}</text>
					<view class="tags">
						<view v-if="commentDetail.user.userId==postUserId" class="tag tag-primary"><text>楼</text></view>
						<!-- <view v-else class="tag tag-green"><text>层</text></view> -->
					</view>
				</view>
				<view class="comment-content select-text">
					{{commentDetail.content}}
				</view>
				<view class="comment-bottom">
					<view class="bottom-left">
						{{+new Date(commentDetail.createdTime)|date('yyyy-mm-dd hh:MM')}}
					</view>
					<view class="bottom-right">
						<view class="count"><u-icon name="chat"/>{{commentDetail.replyCount}}</view>
						<view class="count"><u-icon name="thumb-up"/>{{commentDetail.thumbCount}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 回复列表 -->
		<scroll-view  class="comment-list" scroll-y scroll-with-animation :scroll-into-view="scrollToView">
			<view class="comment-top-bar flex-between">
				<view class="comment-count">回复 {{commentDetail.replyCount}}</view>
				<view class="wrapper flex">
					<view class="comment-count" :class="{'active':queryCondition.orderMode==1}" @click="changeDesc(1)">最新</view>
					<view class="comment-count ml-8" :class="{'active':queryCondition.orderMode==2}" @click="changeDesc(2)">最旧</view>
				</view>
			</view>
			<view class="comment-item" :class="{'comment-item-active':scrollCommentId==comment.id}"  
				v-for="comment in replyList" :key="comment.id"  :id="'comment-'+comment.id">
				<view class="user-avatar" @click="toPersonDetail(comment.user.userId)">
					<u-avatar size="32" :src="comment.user.avatar"></u-avatar>
				</view>
				<view class="comment-main">
					<view class="user-name">
						<text>{{comment.user.nickName}}</text>
						<view class="tags">
							<view v-if="comment.user.userId==postUserId" class="tag tag-primary"><text>楼</text></view>
							<view v-else-if="commentDetail.user.userId==comment.user.userId" class="tag tag-green"><text>层</text></view>
						</view>
					</view>
					<!-- 回复内容 -->
					<view class="comment-content">
						<text v-if="comment.replyUser">回复&nbsp;<text class="comment-reply-username select-text " @click="toPersonDetail(comment.replyUser.userId)">{{comment.replyUser.nickName}}</text>：</text>
						{{comment.content}}
					</view>
					<view class="comment-bottom">
						<view class="bottom-left">
							{{+new Date(comment.createdTime)|date('yyyy-mm-dd hh:MM')}}
						</view>
						<view class="bottom-right">
							<view v-show="userInfo&&userInfo.userId!=comment.user.userId" @click="replyUser(comment.id,comment.user.userId,comment.user.nickName)" class="count">
								回复
							</view>
							<!-- <view class="count"><u-icon name="thumb-up"/>{{comment.thumbCount}}</view> -->
							<view class="count" :class="{'count-comment-active':comment.isThumb}" @click.stop="changeLikeComment(comment)">
								<u-icon color="" name="thumb-up" />{{comment.thumbCount}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view >
		
		<view class="load-more">
			<view v-if="loadStatus=='nomore'" class="no-more-data">
				没有更多数据了~
			</view>
			<view v-if="loadStatus=='loading'" class="no-more-data">
				正在加载...
			</view>
		</view>
		
		<!-- 添加回复 -->
		<view class="add-comment-section">
			<view class="input-row input-top">
				<view class="row-left">
					<input type="text" @blur="focus=false" :focus="focus" v-model="replyValue" auto-blur :adjust-position="true" cursor-spacing="28" :placeholder="placeholder">
					<!-- <textarea fixed :cursor-spacing="30" type="text" v-model="replyValue" :adjust-position="true" cursor-spacing="36" placeholder="说两句~"/> -->
				</view>
				<view v-show="replyValue==''" class="row-right count-wrap">
<!-- 					<view class="count"><u-icon name="share-square" color="#999" size="24"/>{{commentDetail.shareCount}}</view> -->
					<!-- 点赞是否高亮 -->
					<view @click.stop="changeLikeComment(commentDetail)" class="count" :class="{'count-active':commentDetail.isThumb}">
						<u-icon name="thumb-up" color="" size="24" />{{commentDetail.thumbCount}}
					</view>
				</view>
				<view v-show="replyValue!=''" :class="{popIn:replyValue!=''}" class="row-right">
					<view class="add-comment-btn" @click="addReplyEvent()">发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getReplyPage,addComment,getCommentById,thumbComment,cancelThumbComment} from '@/api/comment.js';
	import commentDetailVue from './commentDetail.vue';
	export default {
		data() {
			return {
				commentDetail:{}, //评论
				queryCondition: {
					pageNum: 0,
					pageSize: 10,
					commentId: null,
					orderMode: 2 // 0最热排序 1最新 2最旧
				},
				loadStatus: 'nomore',
				
				replyValue: '', //回复内容
				placeholder:'说两句~',
				focus: false,
				postUserId: null,
				replyUserId: null,
				replyCommentId: null,
				
				
				replyList: [], //回复列表
				fliterIds: [],
				
				scrollCommentId: 0,
				scrollToView: null,
				showToPost: false
			};
		},
		async onLoad({commentId,postUserId,postId,focus,showToPost}) {
			this.queryCondition.commentId = commentId
			this.postUserId = postUserId
			this.postId = postId
			this.showToPost = showToPost=='true'||showToPost=='1'
			if (focus=='true' || focus=='1') {
				this.$nextTick(()=> {
					setTimeout(()=> {
						this.focus = focus || false
					},500)
				})
			}
			
			this.commentDetail = (await getCommentById(commentId)).data
			// 设置默认值
			this.replyUserId = this.commentDetail.user.userId
			this.replyCommentId = this.commentDetail.id
			this.placeholder = '回复 ' + this.commentDetail.user.nickName + ":"
			// // 获取回复
			this.getNextPageReply()
		},
		onReachBottom() {
			this.getNextPageReply()
		},
		methods: {
			// 添加评论
			async addReplyEvent(replyCommentId,replyUserId) {
				uni.showToast({icon: 'loading',})
				let addCommentBody = {
					postId: this.postId,
					content: this.replyValue,
					type: 1,
					commentId: this.commentDetail.id,
					replyCommentId: this.replyCommentId,
					replyUserId: this.replyUserId
				}
				let res = await addComment(addCommentBody)
				uni.hideToast()
				this.replyValue = ''
				uni.showToast({
					title: '发布成功',
					duration: 2000
				});
				this.fliterIds.push(res.data.id)
				this.replyList.push(res.data)
				this.scrollCommentId = res.data.id
				this.commentDetail.replyCount += 1
				this.$nextTick(() => {
					uni.pageScrollTo({
						selector: `#comment-${res.data.id}`,
						duration: 100
					})
					setTimeout(()=> {
						this.scrollCommentId = 0
						uni.hideToast()
					},1000)
				})
			},
			// 获取下一页评论
			async getNextPageReply() {
				this.loadStatus = 'loading'
				this.queryCondition.pageNum++
				let res = await getReplyPage(this.queryCondition)
				let filteredList = res.data.records
				if (this.fliterIds.length!=0) { // 过滤前端手动添加的评论
					filteredList = filteredList.filter(comment => {
						return this.fliterIds.indexOf(comment.id) < 0
					})
				}
				setTimeout(() => {
					this.replyList = [...this.replyList, ...filteredList]
					if (filteredList.length == 0) {
						this.queryCondition.pageNum--
					}
					this.loadStatus = 'nomore'
				}, 500)
			},
			replyUser(replyCommentId,replyUserId,nickName) {
				this.replyCommentId = replyCommentId
				this.replyUserId = replyUserId
				this.placeholder = '回复 ' + nickName + ":"
				if (this.focus) {
					this.focus = false
				}
				this.$nextTick(()=> {
					this.focus = true
				})					
			},
			changeDesc(modeCode) {
				this.queryCondition.orderMode = modeCode
				this.queryCondition.pageNum = 0
				this.fliterIds = []
				this.replyList.splice(0)
				this.getNextPageReply()
			},
			async changeLikeComment(comment) {
				let flag = comment.isThumb
				if (!flag) { // 点赞
					await thumbComment(comment.id)
					comment.thumbCount += 1
					
				} else { // 取消点赞
					await cancelThumbComment(comment.id)
					comment.thumbCount -= 1
				}
				comment.isThumb = !flag
			},
		}
	}
</script>

<style lang="scss" scoped>
// $add-comment-section-height: 52px;

.page-container {
	font-size: 28rpx;
	padding: 16rpx;
}

.comment-detail {
	margin-top: 20rpx;
	border-radius: 16rpx;
	display: flex;
	padding: 28rpx;
	border-bottom: 2rpx solid var(--color-eee);
	background-color: var(--bg-card-color);
	.comment-main {
		display: flex;
		flex-direction: column;
		margin-left: 18rpx;
		width: 100%;
		.user-name {
			color: var(--color-555);
			display: flex;
			align-items: center;
			.tags {
				display: flex;
				font-size: 22rpx;
				.tag {
					display: flex;
					margin-left: 6rpx;
					border-radius: 8rpx;
					color: white;
					padding: 0 6rpx; 
				}
			}
		}
		.comment-content {
			margin: 12rpx 0;
			line-height: 1.6em;
			font-size: 29rpx;
		}
		.comment-bottom {
			display: flex;
			justify-content: space-between;
			font-size: 22rpx;
			color: var(--text-tips-color);
			.bottom-right {
				display: flex;
				.count {
					.u-icon {
						margin-right: 8rpx;
					}
					display: flex;
					margin-right: 16rpx;
				}
			}
		}
	}
}


.comment-list {
	margin-bottom: 0;
	margin-top: 28rpx;
	border-radius: 16rpx;
	padding: 28rpx;
	box-sizing: border-box;
	background-color: var(--bg-card-color);
	.comment-top-bar {
		color: var(--color-000);
		font-weight: 600;
		margin: 8rpx 0;
		.wrapper {
			font-weight: 500;
			font-size: 22rpx;
			color: var(--text-grey-color);
			.active {
				color: var(--color-444);
			}
		}
	}
	.comment-item {
		display: flex;
		padding: 26rpx 0;
		border-radius: 16rpx;
		border-bottom: .5px solid var(--color-eee);
		.comment-main {
			display: flex;
			flex-direction: column;
			margin-left: 18rpx;
			width: 100%;
			.user-name {
				color: var(--color-555);
				display: flex;
				align-items: center;
				.tags {
					display: flex;
					font-size: 22rpx;
					.tag {
						display: flex;
						margin-left: 6rpx;
						border-radius: 8rpx;
						color: white;
						padding: 0 6rpx;
					}
				}
			}
			.comment-content {
				margin: 12rpx 0;
				font-size: 29rpx;
				line-height: 1.6em;
				.comment-reply-username {
					color: var(--color-primary);
				}
			}
			.comment-bottom {
				display: flex;
				justify-content: space-between;
				font-size: 22rpx;
				color: var(--text-tips-color);
				.bottom-right {
					display: flex;
					.count {
						.u-icon {
							margin-right: 8rpx;
						}
						display: flex;
						margin-right: 16rpx;
					}
					.count-comment-active {
						color: var(--color-primary);
					}
				}
			}
		}	
	}
	.comment-item-active {
		background-color: var(--color-eee);
	}
}
.load-more {
	margin-bottom: 112rpx;
	.no-more-data {
		padding: 24rpx 8rpx;
		text-align: center;
		color: var(--color-bbb);
		font-size: 26rpx;
	}
}
	
.add-comment-section {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 112rpx;
	padding: 16rpx;
	box-sizing: border-box;
	background-color: white;
	background-color: var(--bg-card-color);
	.input-row {
		display: flex;
		align-items: center;
		color: var(--color-999);
		.row-left {
			flex: 1;
			border-radius: 18px;
			font-size: 28rpx;
			padding: 16rpx 16rpx 16rpx 24rpx;
			box-sizing: border-box;
			background-color: var(--bg-light-color);
			input {
				padding: 4rpx;
				color: var(--color-111);
				font-size: 28rpx;
			}
		}
		.row-right {
			display: flex;
			font-size: 28rpx;
			padding-left: 8rpx;
			.count {
				display: flex;
				align-items: center;
				margin: 0 12rpx;
				padding: 8rpx;
			}
			.count-active {
				color: var(--color-primary);
			}
			.add-comment-btn {
				box-sizing: border-box;
				padding: 8rpx 16rpx;
				margin: 0 16rpx;
				font-size: 28rpx;
				background-color: var(--color-primary);
				border-radius: 8rpx;
				color: white;
			}
		}
	}
	
}
</style>
