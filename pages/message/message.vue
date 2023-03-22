<template>
	<view class="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar placeholder :bgColor="style.navBarBgColor" title="消息">
			<view slot="left"></view>
		</u-navbar>

		<view class="page-main">
			<view class="msg-list">
				<view class="msg-item flex-start system" @click="systemItemClick()">
					<view class="icon-wrapper">
						<u-avatar size="52" icon="bell" fontSize="28" />
						<u-badge absolute :value="systemItem.unReadCount" type="error" :offset="[0,0]"></u-badge>
					</view>
					<view class="right flex-column">
						<text class="msg-name">系统通知</text>
						<text class="msg-tips">{{systemItem.title}}</text>
						<text class="msg-date">{{timeFormat(systemItem.date)}}</text>
					</view>
				</view>
				<view class="msg-item flex-start interaction" @click="interactItemClick()">
					<view class="icon-wrapper">
						<u-avatar size="52" icon="chat" fontSize="28" />
						<u-badge absolute :value="interactItem.unReadCount" max="99" type="error" :offset="[0,0]">
						</u-badge>
					</view>
					<view class="right flex-column">
						<text class="msg-name">互动消息</text>
						<text class="msg-tips">{{interactItem.title}}</text>
						<text class="msg-date">{{timeFormat(interactItem.date)}}</text>
					</view>
				</view>
				<view class="msg-item flex-start hide" @click.stop="toPostDetail(1)">
					<view class="icon-wrapper" @click.stop="toPersonDetail(1)">
						<u-avatar size="52" src="https://q.qlogo.cn/g?b=qq&nk=491705331&s=100" />
						<u-badge absolute :isDot="true" type="error" :offset="[0,0]"></u-badge>
					</view>
					<view class="right flex-column">
						<text class="msg-name">小编</text>
						<text class="msg-tips">哈哈哈哈可以的</text>
						<text class="msg-date">17:08</text>
					</view>
				</view>

				<view v-for="item,index in chatItemList">
					<u-swipe-action>
						<u-swipe-action-item :options="[{text:'删除'}]" :key="item.user.userId" :index="index" @click="deleteChatItem(item.user.userId,index)">
							<view class="msg-item flex-start">
								<view class="icon-wrapper" @click="toChatRoom(item.user.userId,item.user.nickName,index)">
									<u-avatar size="52" :src="item.user.avatar" />
									<u-badge absolute :value="item.unReadCount" max="99" type="error" :offset="[0,0]">
									</u-badge>
								</view>
								<view class="right flex-column" @click="toChatRoom(item.user.userId,item.user.nickName,index)">
									<text class="msg-name">{{item.user.nickName}}</text>
									<text class="msg-tips">{{item.lastMessage.content}}</text>
									<text class="msg-date">{{timeFormat(item.lastMessage.createdTime)}}</text>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapActions,mapState,mapGetters} from 'vuex';
	import {timeFormat} from '@/utils/timeFormat.js';
	export default {
		data() {
			return {
				style: {
					navBarBgColor: 'var(--bg-color)'
				},
				timeFormat
				// chatItemList: [],
				// systemItem: {},
				// interactItem: {}
			};
		},
		onShow() {
			this.UpdateAll()
			// #ifdef APP-PLUS
			plus.push.clear();
			// #endif
		},
		mounted() {
			
		},
		methods: {
			deleteChatItem(userId,index) {
				this.DeleteChatItem({userId,index})
			},
			systemItemClick() {
				this.toSystemNotification()
			},
			interactItemClick() {
				this.toInteractNotification()
			},
			...mapActions('msg',['UpdateAll','UpdateChatItemList','UpdateSystemNotification','UpdateInteractNotification','DeleteChatItem','ReadAllOfSystem','ReadAllOfInteract'])
		},
		computed: {
			...mapState('msg',['chatItemList','systemItem','interactItem']),
			...mapGetters('msg',['unReadCountSum'])
		},
	}
</script>

<style lang="scss">
	.msg-list {
		.msg-item {
			padding: 28rpx;
			background-color: var(--bg-color);
			position: relative;

			.right {
				flex: 1;
				width: 100%;
				margin-left: 26rpx;

				.msg-name {
					font-size: 34rpx;
				}

				.msg-tips {
					margin-top: 8rpx;
					font-size: 26rpx;
					color: var(--text-tips-color);
				}

				.msg-date {
					font-size: 20rpx;
					height: 20rpx;
					position: absolute;
					right: 36rpx;
					top: 25%;
					color: var(--text-light-color);
				}
			}

			.icon-wrapper {
				position: relative;

				.u-badge--dot {
					height: 8px;
					width: 8px;
				}
			}

			&:active {
				background-color: var(--color-ddd);
			}

		}

		.system .u-avatar {
			background-color: rgb(130, 163, 228) !important;
		}

		.interaction .u-avatar {
			background-color: #f6b872 !important;
		}
	}
</style>
