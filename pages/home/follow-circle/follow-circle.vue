<template>
	<view>
		<view class="follow-circle" :data-theme="theme">
			<view class="flex-between"  @click="toFindCircle(0)">
				<text class="title">我加入的</text>
				<view class="right-text flex">更多 <u-icon name="arrow-right" size="10"/></view>
			</view>
			<view class="circle-list">
				<view class="circle-item" @click="toFindCircle(1)">
					<u-avatar size="42" shape="circle" icon="plus"/>
					<text class="u-line-1">发现更多</text>
				</view>
				<view class="circle-item" v-for="circle in joinCircleList" :key="circle.id" @click="itemClick(circle.id)">
					<u-avatar size="42" :src="circle.avatar" shape="square"/>
					<text class="u-line-1">{{circle.name}}</text>
					<u-badge type="primary" max="99" :value="unReadCountMap[circle.id]" :offset="[0,10]" absolute/>
				</view>
			</view>
		</view>
		<PostList :list="list"/>
		<u-loadmore :status="loadStatus" />
	</view>
</template>

<script>
	import PostList from '@/components/post-list/post-list.vue';
	import {getJoinCircleListByUid} from "@/api/circle.js";
	import {unReadCountOfJoinCircle} from '@/api/post.js'
	export default {
		components: {
			PostList
		},
		props: {
			list: Array,
			loadStatus: String
		},
		data() {
			return {
				joinCircleList: [] ,// 我加入的圈子列表
				unReadCountMap: {}
			};
		},
		async mounted() {
			this.joinCircleList = (await getJoinCircleListByUid(this.userInfo.userId || 0)).data
			this.unReadCountMap = (await unReadCountOfJoinCircle()).data
		},
		methods: {
			itemClick(circleId) {
				this.unReadCountMap[circleId] = 0
				this.toCircleDetail(circleId)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		padding-bottom: 54px;
	}
	.follow-circle {
		color: var(--text-black-color);
		.flex-between {
			padding: 0 18rpx;
			color: var(--color-aaa);
			.title {
				font-weight: 700;
			}
		}
		
		.circle-list {
			margin-top: 8rpx;
			display: flex;
			width: 100%;
			overflow: auto;
			.circle-item {
				position: relative;
				max-width: 33%;
				min-width: 76px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: $uni-border-radius-xxlg;
				margin: 6rpx 10rpx;
				margin-left: 0;
				padding: 18rpx;
				box-sizing: border-box;
				text {
					margin-top: 8rpx;
				}
			}
		}
	}
</style>
