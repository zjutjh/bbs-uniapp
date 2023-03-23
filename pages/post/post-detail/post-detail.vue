<template>
	<view class="page-container height-auto" :data-theme="theme" v-if="postDetail.user">
		<u-navbar title="动态" bgColor="var(--bg-color)" autoBack placeholder />
		</u-navbar>
		<!-- 帖子内容主体 -->
		<view class="post-detail">
			<!-- 楼主信息 -->
			<view class="user-info">
				<view class="user-avatar" @click.stop="toPersonDetail(postDetail.user.userId)">
					<u-avatar size="34" :src="postDetail.user.avatar"></u-avatar>
				</view>
				<view class="user-detail">
					<view class="user-name">
						<text>{{postDetail.user.nickName}}</text>
						<view class="tags">
							<view class="tag hide"><text>楼</text></view>
						</view>
					</view>
					<view class="datetime">
						{{+new Date(postDetail.createdTime)|date('yyyy-mm-dd hh:MM')}}
					</view>
				</view>
			</view>
			<!-- 详情 -->
			<view class="post-body">
				<view class="content-text space-pre-wrap select-text ">
					{{postDetail.content}}
				</view>
				<view v-if="postDetail.imageList.length>0" class="content-imgs">
					<image @click="previewImg(index)" v-for="url,index in postDetail.imageList" :src="url" mode="widthFix" lazy-load/>
				</view>
			</view>
			
			<!-- 圈子、话题部分 -->
			<view class="cirle-topic-list">
				<view class="circle-item item ripple" hover-class="hoverClass" @click.stop="toCircleDetail(postDetail.circle.id)" v-if="postDetail.circle">
					<u-avatar size="14" :src="postDetail.circle.avatar" shape="square"></u-avatar>
					<text class="name">{{postDetail.circle.name}}</text>
				</view>
				<view class="topic-item item" v-for="topic in postDetail.topicList" :key="topic.id" @click.stop="toTopicDetail(topic.id)"> 
					<text>#</text>
					<text class="name">{{topic.name}}</text>
				</view>
			</view>
			<!-- 底部：点赞分享部分 -->
			<view class="bottom">
				<view class="data-card"><u-icon size="18" color="" name="eye"/>{{postDetail.readCount}}</view>
				<view class="data-card"><u-icon size="18" color="" name="chat"/>{{postDetail.commentCount}}</view>
				<view class="data-card"><u-icon size="18" name="thumb-up"/>{{postDetail.thumbCount}}</view>
				<view  @click.stop="showActionSheet=true" class="data-card more"><u-icon size="14" name="more-dot-fill"/></view>
			</view>
		</view>
		<!-- 评论列表 -->
		<scroll-view class="comment-list" scroll-y scroll-with-animation :scroll-into-view="scrollToView">
			<view class="comment-top-bar flex-between">
				<view class="comment-count">评论 {{postDetail.commentCount}}</view>
				<view class="wrapper flex">
					<view class="comment-count" :class="{'active':queryCondition.orderMode==1}" @click="changeDesc(1)">最新</view>
					<view class="comment-count ml-8" :class="{'active':queryCondition.orderMode==2}" @click="changeDesc(2)">最旧</view>
				</view>
			</view>
			<view class="comment-item" :class="{'comment-item-active':scrollCommentId==comment.id}"  
					v-for="(comment,index) in commentList" :key="comment.id" :id="'comment-'+comment.id"
					@click.stop="toCommentDetail(comment.id,postDetail.user.userId,postDetail.id)">
				<!-- 评论头像 -->
				<view class="user-avatar" @click.stop="toPersonDetail(comment.user.userId)">
					<u-avatar size="32" :src="comment.user.avatar"></u-avatar>
				</view>
				<view class="comment-main">
					<!-- 评论者信息 -->
					<view class="user-name">
						<text>{{comment.user.nickName}}</text>
						<view class="tags">
							<view v-if="comment.user.userId==postDetail.user.userId" class="tag tag-primary">楼主</view>
						</view>
						<view class="right-tags">
							<view v-if="comment.type==2" class="tag tag-primary">置顶</view>
						</view>
					</view>
					<!-- 评论内容 -->
					<view class="comment-content pre-wrap select-text">
						{{comment.content}}
					</view>
					<!-- 评论时间、点赞数、回复数 -->
					<view class="comment-bottom">
						<view class="bottom-left">
							{{index+1+'楼·'+timeFormat(comment.createdTime)}}{{comment.ipAddress?'·'+comment.ipAddress:''}}
						</view>
						<view class="bottom-right">
							<view class="count" @click.stop="toCommentDetail(comment.id,postDetail.user.userId,postDetail.id,true)">
								<u-icon name="chat" />{{comment.replyCount}}
							</view>
							<view class="count" :class="{'count-comment-active':comment.isThumb}" @click.stop="changeLikeComment(comment)">
								<u-icon color="" name="thumb-up" />{{comment.thumbCount}}
							</view>
						</view>
					</view>
					<!-- 评论热门回复 -->
					<view v-if="comment.hotReplyList && comment.hotReplyList.length!=0" class="comment-reply-list">
						<view class="comment-reply-item" v-for="hotReply in comment.hotReplyList" :key="hotReply.id">
							<view class="reply-name space-nowrap">{{hotReply.user.nickName}}
								<view v-if="hotReply.user.userId==postDetail.user.userId" class="tag tag-purple">
									<text>楼</text>
								</view>：
							</view>
							<view class="reply-content u-line-3">{{hotReply.content}}</view>
						</view>
						<view v-if="comment.replyCount>3" class="read-all-reply">
							查看所有回复({{comment.replyCount}})
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="load-more">
			<view v-if="loadStatus=='nomore'" class="no-more-data">
				没有更多数据了~
			</view>
			<view v-if="loadStatus=='loading'" class="no-more-data">
				正在加载...
			</view>
		</view>
			
		<!-- 添加评论 -->
		<view class="add-comment-section">
			<view class="input-row input-top">
				<!-- 输入框 -->
				<view class="row-left">
					<input type="text" v-model="commentValue" :adjust-position="true" cursor-spacing="36"
						placeholder="参与评价~">
				</view>
				<view v-show="commentValue==''" class="row-right count-wrap">
					<view class="count" @click="share()">
						<u-icon name="share-square" color="" size="24" />{{postDetail.shareCount}}
					</view>
					<!-- 点赞是否高亮 -->
					<view v-if="postDetail.isThumb" @click.stop="changeLikePost(false)" class="count count-active">
						<u-icon name="thumb-up" color="" size="24" />{{postDetail.thumbCount}}
					</view>
					<view v-else class="count" @click.stop="changeLikePost(true)">
						<u-icon name="thumb-up" color="" size="24" />{{postDetail.thumbCount}}
					</view>
				</view>
				<!-- 发送按钮 -->
				<view v-show="commentValue!=''" :class="{popIn:commentValue!=''}" class="row-right">
					<view class="add-comment-btn" @click="addPostCommentEvent()">发送</view>
				</view>
			</view>
		</view>
		<!-- 菜单选项 -->
		<actionSheet :show="showActionSheet" :actions="actionList" @close="showActionSheet=false" @select="actionSelect" />
	</view>
</template>

<script>
	import actionSheet from '@/components/action-sheet/action-sheet.vue'
	import {
		postDetailApi,
		postCommentApi,
		likePostApi,
		unLikePostApi,
		likeCommentApi,
		unLikeCommentApi,
		getPostVoById,
		thumbPost,
		cancelThumbPost,
		addReadCount
	} from '@/api/post.js';
	import {getCommentPage,addComment,thumbComment,cancelThumbComment} from '@/api/comment.js';
	import {timeFormat} from '@/utils/timeFormat.js';
	export default {
		components: {
			actionSheet
		},
		data() {
			return {
				queryCondition: {
					pageNum: 0,
					pageSize: 16,
					postId: null,
					orderMode: 0
				},
				loadStatus: 'nomore',
				commentValue: '',
				postDetail: {},
				commentList: [],
				timeFormat,
				scrollToView: null,
				scrollCommentId: 0,
				fliterIds: [],
				showActionSheet: false,
				actionList: [
					{
						name: '举报',
						onclick: () => {
							setTimeout(() => {
								this.$u.toast('举报成功')
							},1000)
						}
					}
				]
				
			};
		},
		onReachBottom() { // 底部加载评论
			this.getNextPageComment()
		},
		async onLoad({postId}) {
			uni.showLoading()
			this.postDetail = (await getPostVoById(postId)).data
			if (this.postDetail == null) {
				this.$u.toast('动态消失了')
				setTimeout( ()=>{uni.navigateBack()},500)
			}
			this.queryCondition.postId = this.postDetail.id
			// // 获取下一页评论
			this.getNextPageComment()
			addReadCount(this.postDetail.id)
		},
		mounted() {
		},
		methods: {
			// 获取下一页评论
			async getNextPageComment() {
				this.loadStatus = 'loading'
				this.queryCondition.pageNum++
				let res = await getCommentPage(this.queryCondition)
				let filteredList = res.data.records
				if (this.fliterIds.length!=0) { // 过滤前端手动添加的评论
					filteredList = filteredList.filter(comment => {
						return this.fliterIds.indexOf(comment.id) < 0
					})
				}
				setTimeout(() => {
					this.commentList = [...this.commentList, ...filteredList]
					if (filteredList.length == 0) {
						this.queryCondition.pageNum--
					}
					this.loadStatus = 'nomore'
				}, 500)
			},
			// 添加评论
			async addPostCommentEvent() {
				uni.showToast({
					icon: 'loading',
				})
				let addCommentBody = {
					postId: this.postDetail.id,
					content: this.commentValue,
					type: 0
				}
				let res = await addComment(addCommentBody)
				uni.hideToast()
				this.commentList.push(res.data)
				this.fliterIds.push(res.data.id)
				this.commentValue = ''
				uni.showToast({
					title: '发布成功',
					duration: 2000
				});
				this.scrollCommentId = res.data.id
				this.postDetail.commentCount += 1
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
			
			async changeLikePost(flag) {
				if (flag) { // 点赞
					await thumbPost(this.postDetail.id)
					this.postDetail.thumbCount += 1
				} else { // 取消点赞
					await cancelThumbPost(this.postDetail.id)
					this.postDetail.thumbCount -= 1
				}
				this.postDetail.isThumb = flag
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
			previewImg(index) {
				uni.previewImage({
					current: index,
					urls: this.postDetail.imageList,
					longPressActions: {
						itemList: ['举报', '保存图片'],
						success: (data) => {
							switch (data.tapIndex){
								case 0: // 举报
									this.$u.toast('举报成功')
									break;
								case 1: // 保存图片到系统相册
									uni.saveImageToPhotosAlbum({
										filePath: this.postDetail.imageList[index],
										success: () => {
											this.$u.toast('保存成功')
										},
										fail: () => {
											this.$u.toast('保存失败')
										}
									});
									break;
							}
						}
					}
				});
			},
			changeDesc(orderMode) {
				this.queryCondition.orderMode = orderMode
				this.queryCondition.pageNum = 0
				this.fliterIds = []
				this.commentList.splice(0)
				this.getNextPageComment()
			},
			share() {
				let pages = getCurrentPages()
				let curPage = pages[pages.length-1]
				let path = curPage.__page__.fullPath.slice(1)
				let url = `${this.$config.h5Url}${path}`
				
				// #ifdef APP-PLUS
				uni.shareWithSystem({
				  summary: '快看这个',
				  href: url
				})
				// #endif
				
				// #ifndef APP-PLUS
				uni.setClipboardData({
					data: url,
					showToast: false,
					success: () => {
						this.$u.toast('已复制分享链接')
					}
				});
				// #endif
				
			},
			actionSelect(index) {
				this.actionList[index].onclick();
			}
		}
	}
</script>

<style lang="scss" scoped>
	// $add-comment-section-height: 104rpx;
	$radius: 24rpx;
	
	.page-container {
		padding: 24rpx;
		// min-height: calc( 100% - 44px );
	}

	.post-detail {
		padding: 32rpx;
		background-color: var(--bg-card-color);
		border-radius: $uni-border-radius-xxlg;

		.user-info {
			display: flex;
			align-items: center;

			.user-detail {
				display: flex;
				flex-direction: column;
				margin-left: 16rpx;
				width: 100%;

				.user-name {
					font-size: 30rpx;
					font-weight: 600;
					display: flex;
					align-items: center;
					.tags {
						display: flex;
						font-size: 24rpx;
						.tag {
							display: flex;
							margin-left: 8rpx;
							border-radius: 8rpx;
							color: white;
							padding: 0 6rpx;
							background-color: var(--color-primary);
						}
					}
				}

				.datetime {
					font-size: 22rpx;
					color: var(--color-bbb);
					margin-top: 4rpx;
				}
			}
		}

		.post-body {
			padding: 20rpx 0;
			font-size: 32rpx;
			color: var(--text-black-color);
			line-height: 1.6em;

			.content-imgs {
				margin-top: 16rpx;

				image {
					width: 32%;
					max-width: 120px;
					vertical-align: middle;
					min-height: 120px;
					max-height: 120px;
					border-radius: 8rpx;
					margin: 0.2%;
				}
			}
		}
		
		.cirle-topic-list {
			display: flex;
			flex-wrap: nowrap;
			overflow: auto;
			align-items: center;
			margin: 14rpx 0;
			.item {
				word-break:keep-all;
				display: flex;
				align-items: center;
				margin-right: 20rpx;
				background-color: var(--bg-light-color);
				border-radius: 12rpx;
				padding: 14rpx 20rpx;
				font-size: 22rpx;
				color: var(--color-444);
				.name {
					margin-left: 10rpx;
				}
			}
		}
		
		.bottom {
			display: flex;
			margin-top: 18rpx;
			padding: 16rpx 0;
			.data-card {
				width: 140rpx;
				display: flex;
				align-items: flex-end;
				color: #6f7374;
				.u-icon {
					margin-right: 10rpx;
				}
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

	.comment-list {
		margin-top: 24rpx;
		padding: 24rpx;
		border-radius: $uni-border-radius-xxlg;
		box-sizing: border-box;
		background-color: var(--bg-card-color);

		.comment-top-bar {
			color: var(--text-grey-color);
			font-size: 24rpx;
			padding: 4rpx 0;
			.wrapper {
				font-size: 22rpx;
				.active {
					color: var(--color-555);
				}
			}
		}

		.comment-item {
			display: flex;
			border-radius: 16rpx;
			padding: 24rpx 0;
			border-bottom: .5px solid var(--color-eee);
			
			.comment-main {
				display: flex;
				flex-direction: column;
				margin-left: 16rpx;
				width: 100%;
				

				.user-name {
					font-size: 28rpx;
					color: var(--color-888);
					font-weight: 600;
					display: flex;
					align-items: center;

					.tags {
						display: flex;
						font-size: 10px;
					}
					.right-tags {
						font-size: 10px;
						margin-left: auto;
					}
					.tag {
						display: flex;
						margin-left: 2px;
						border-radius: 4px;
						color: white;
						padding: 0 2px;
						background-color: var(--color-primary); 
					}
				}

				.comment-content {
					margin: 12rpx 0;
					font-size: 31rpx;
					line-height: 1.6em;
				}

				.comment-bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;
					color: var(--color-bbb);
					.bottom-left {
						font-size: 22rpx;
					}
					.bottom-right {
						display: flex;

						.count {
							display: flex;
							margin-left: 16rpx;
							padding: 8rpx;

							.u-icon {
								margin-right: 6rpx;
							}
						}

						.count-comment-active {
							color: var(--color-primary);
						}
					}
				}

				.comment-reply-list {
					padding: 16rpx;
					background-color: var(--bg-light-color);
					
					margin-top: 16rpx;
					border-radius: 16rpx;

					.comment-reply-item {
						padding: 6rpx 0;
						display: flex;
						align-items: flex-start;
						.reply-name {
							color: var(--color-primary);
							display: flex;
							align-items: center;

							.tag {
								font-size: 18rpx;
								margin-left: 4rpx;
								color: white;
								padding: 0 6rpx;
								border-radius: 8rpx;
								background-color: var(--color-primary); 
							}
						}

						.reply-content {
							color: var(--color-444);
						}
					}
					.read-all-reply {
						padding: 6rpx 0;
						font-size: 24prx;
						color: var(--color-primary);
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
			padding: 24rpx 8rpx 8rpx;
			text-align: center;
			color: var(--color-bbb);
			font-size: 26rpx;
		}
	}
	.add-comment-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 112rpx;
		padding: 16rpx;
		box-sizing: border-box;
		background-color: var(--color-white);
		.input-row {
			display: flex;
			align-items: center;
			color: var(--color-999);

			.row-left {
				flex: 1;
				border-radius: 40rpx;
				font-size: 28rpx;
				padding: 16rpx 16rpx 16rpx 26rpx;
				box-sizing: border-box;
				background-color: var(--bg-color);

				input {
					color: var(--color-111);
					font-size: 28rpx;
					padding: 4rpx;
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
					font-weight: 600;
					font-size: 28rpx;
					background-color: var(--color-primary);
					border-radius: 12rpx;
					color: white;
				}
			}
		}

	}
	// .placehodler {
	// 	height: 104rpx;
	// 	background-color: transparent;
	// }
</style>
