<template>
	<view class="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar title="互动消息" bgColor="var(--bg-color)" autoBack placeholder  />
		<!-- 菜单选项 -->
		<actionSheet :show="showActionSheet" :actions="actionList" @close="showActionSheet=false" @select="actionSelect" />
		
		<view class="page-main">
			<view class="list">
				<u-empty v-if="notificationList.length==0" text="没有记录" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"/>
				<view v-for="item in notificationList" :class="'type-'+item.type"  class="item click-active flex-start">
					<view class="left" @click="toPersonDetail(item.user.userId)">
						<u-avatar size="34" :src="item.user.avatar"></u-avatar>
					</view>
					<view class="right" @click="clickItem(item)">
						<view class="name">{{item.user.nickName}}</view>
						<view class="des u-line-1">
							{{parseType(item)}}
						</view>
						<view class="content">
							{{item.content}}
						</view>
						<view class="bottom flex-between">
							<view class="datetime">{{+new Date(item.createdTime)|date('yyyy-mm-dd hh:MM')}}</view>
						</view>
						<view v-if="item.cover!=null" class="cover">
							<u--image :showLoading="true" :src="item.cover" height="60px" width="60px"/>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 添加回复 -->
		<view class="add-comment-section" v-if="replying">
			<view class="input-row input-top">
				<view class="row-left">
					<input type="text" :focus="true" v-model="replyBody.content" 
						auto-blur :adjust-position="true" cursor-spacing="28" placeholder="回复" >
				</view>
				<view v-show="replyBody.content!=''" :class="{popIn:replyBody.content!=''}" class="row-right">
					<view class="add-comment-btn" @click="addReplyEvent()">发送</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import {interactNotificationPage,readAllOfInteract} from '@/api/notification.js'
	import {addComment} from '@/api/comment.js'
	// import actionSheetMixin from '@/mixin/actionSheet.js'
	import actionSheet from '@/components/action-sheet/action-sheet.vue'
	export default {
		components: {
			actionSheet
		},
		// mixins: [actionSheetMixin],
		data() {
			return {
				notificationList: [],
				queryBody: {
					pageNum: 0,
					pageSize: 20
				},
				replying: false,
				clickedItem: null,
				replyBody: {
					content: null
				},
				showActionSheet: false,
				actionList: [
					{
						name: '回复',
						onclick: () => {
							this.replying = true
						}
					},
					{
						name: '查看详情',
						onclick: () => {
							let resource = this.clickedItem.resource
							if (this.clickedItem.type=="1") {
								this.toPostDetail(resource.postId)
							}
							else if (this.clickedItem.type=="2") {
								this.toCommentDetail(resource.parentCommentId,resource.postUserId,resource.postId,false,true)
							}
						}
					},
				]
			};
		},
		mounted() {
			uni.showLoading()
			this.getNextPage()
			readAllOfInteract()
		},
		onReachBottom() {
			this.getNextPage()
		},
		methods: {
			actionSelect(index) {
				this.actionList[index].onclick();
			},
			async getNextPage() {
				this.queryBody.pageNum++
				this.queryBody.type = 0
				let res = await interactNotificationPage(this.queryBody)
				this.notificationList = [...this.notificationList,...res.data.records]
				if (res.data.records.length == 0) {
					this.queryBody.pageNum--
				}
			},
			parseType(item) {
				switch (item.type) {
					case "1": return `评论了你的动态 ${item.title==null?'':'·'+item.title}`;
					case "2": return `回复了你的评论 ${item.title==null?'':'· '+item.title}`;
					case "3": return `给你点赞了 ${item.title==null?'':'· '+item.title}`;
					default: return ''
				}
			},
			clickItem(item) {
				this.clickedItem = item
				let resource = this.clickedItem.resource
				this.replyBody = {
					commentId: resource.parentCommentId,
					postId: resource.postId,
					replyUserId: resource.userId,
					replyCommentId: resource.commentId,
					type: 1
				}
				if (item.type=="1"||item.type=="2") { // 评论或者回复
					this.showActionSheet = true
				}
			},
			async addReplyEvent() {
				let res = await addComment(this.replyBody)
				this.$u.toast(res.msg)
				this.replying = false
			}
		}
	}
</script>

<style lang="scss" scoped>
/deep/.u-image__image > div {
	border-radius: $uni-border-radius-lg !important;
}
.page-main {
	.list {
		.item {
			align-items: flex-start;
			background-color: var(--bg-card-color);
			border-bottom: 1px solid var(--color-eee);
			padding: 32rpx 30rpx;
			&:active {
				background-color: var(--color-eee);
			}
			.left {
				
			}
			.right {
				flex: 1;
				margin-left: 28rpx;
				position: relative;
				font-size: 30rpx;
				.des {
					font-size: 24rpx;
					color: var(--color-888);
					margin: 8rpx 0 14rpx;
					max-width: 68%;
				}
				.bottom {
					font-size: 22rpx;
					margin: 8rpx 0;
					box-sizing: border-box;
					color: #aaa;
				}
				.cover {
					position: absolute;
					right: 0;
					top: 0;
				}
			}
		}
		// 评论
		.type-1 {
			
		}
		// 回复
		.type-2 {
			.right {
				.cover {
					display: none;
				}
			}
		}
		// 点赞
		.type-3 {
			.right {
				.des {
					color: var(--color-000);
				}
				.content {
					display: none;
				}
			}
		}
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
