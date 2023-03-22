<template>
	<view class="page-container height-auto" :data-theme="theme">
		<view class="input-wrap flex-start">
			<view class="status-bar"></view>
			<u-icon name="arrow-left" color="var(--color-black)" size="19" @click="back()" />
			<view class="flex">
				<u--input v-model="searchValue" placeholder="搜索一下" shape="circle" prefixIcon="search"
					prefixIconStyle="font-size: 22px;color: #909399">
				</u--input>
				<text @click="search()">搜索</text>
			</view>
		</view>
		<view class="body">
			<view class="tip-item-wrap hide">
				<view class="card">
					<view class="title">搜索历史</view>
					<view class="list flex-start">
						<view class="item" v-for="i in 2" @click="itemClick('你好')">你好</view>
						<view class="item" v-for="i in 2" @click="itemClick('11')">11</view>
					</view>
				</view>
				<view class="card">
					<view class="title">热门搜索</view>
					<view class="list flex-start">
						<view class="item" v-for="i in 2" @click="itemClick('你好')">你好</view>
						<view class="item" v-for="i in 2" @click="itemClick('11')">11</view>
					</view>
				</view>
			</view>
			<view class="post-list">
				<PostList :list="postList" />
				<u-loadmore v-if="postList.length!=0" :status="loadStatus" />
			</view>
		</view>
	</view>
</template>

<script>
	import PostList from '@/components/post-list/post-list.vue';
	import {getPostList} from "@/api/post.js";
	export default {
		components: {
			PostList
		},
		data() {
			return {
				postList: [],
				loadStatus: 'nomore',
				queryCondition: {
					circleId: null,
					content: null,
					pageNum: 0,
					pageSize: 10
				},
				searchValue: ''
			};
		},
		async onLoad({circleId}) {
			this.queryCondition.circleId = circleId
		},
		onReachBottom(){
			if (this.searchValue.trim().length < 2) {
				return
			}
			this.getNextPage()
		},
		methods: {
			async getNextPage() {
				this.loadStatus = 'loading'
				this.queryCondition.pageNum++
				let res= await getPostList(this.queryCondition)
				setTimeout(() => {
					if (res.data.records.length == 0) {
						this.loadStatus = 'nomore'
						this.queryCondition.pageNum--
						if (this.queryCondition.pageNum==0) {
							this.$u.toast('未找到')
						}
					}
					this.postList = [...this.postList, ...res.data.records]
				},500)
			},
			search() {
				if (this.searchValue.trim().length < 2) {
					return this.$u.toast('请至少输入两个字符')
				}
				uni.showLoading()
				this.queryCondition.content = this.searchValue.trim()
				this.clear()
				this.getNextPage()
			},
			itemClick(content) {
				this.searchValue = content
				this.search()
			},
			clear() {
				this.postList = []
				this.queryCondition.pageNum = 0
				this.queryCondition.pageSize = 10
			}
		}
	}
</script>

<style lang="scss" scoped>
	.input-wrap {
		position: fixed;
		top: var(--status-bar-height);;
		z-index: 99;
		width: 100%;
		height: 60px;
		box-sizing: border-box;
		padding: 28rpx;
		background-color: var(--bg-card-color);

		>.flex {
			margin-left: 18rpx;
			flex: 1;

			.u-input {
				flex: 1;
				/deep/.uni-input-input {
					color: var(--color-111);
				}
			}

			text {
				font-size: 28rpx;
				padding-left: 28rpx;
			}
		}
		.status-bar {
			height: var(--status-bar-height);
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			background-color: var(--bg-card-color);
			z-index: 99;
		}
	}

	.body {
		margin-top: calc(var(--status-bar-height) + 60px);
		height: 100vh;
		.tip-item-wrap {
			.card {
				padding: 18rpx;

				.title {
					margin: 12rpx 0;
					font-weight: 600;
					font-size: 24rpx;
				}

				.list {
					flex-wrap: wrap;

					.item {
						font-size: 28rpx;
						padding: 6rpx 20rpx;
						margin: 8rpx;
						border-radius: 40rpx;
						overflow: hidden;
						background-color: var(--color-fff);
						border: 1px solid rgba(0, 0, 0, .03);

						&:active {
							background-color: var(--color-eee);
						}
					}
				}
			}
		}
		.post-list {
			padding: $uni-page-padding;
		}
	}
</style>
