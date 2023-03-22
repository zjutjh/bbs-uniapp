<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar placeholder border :bgColor="style.navBarBgColor">
			<view class="flex-start" slot="left">
				<u-icon name="arrow-left" size="18" @click="back()"></u-icon>
				<u-tabs :list="tabList" :current="tabIndex" @change="tabChange"></u-tabs>
			</view>
			<view class="navbar-right" slot="right">
				<text class="btn add-post-btn hide" @click="toWebTest()">创建</text>
			</view>
		</u-navbar>
		<view class="page-main">
			<!-- 我加入的圈子 -->
			<view v-show="tabIndex==0" class="my-join-list">
				<view class="circle-item" v-for="circle in joinCircleList" :key="circle.id" @click="toCircleDetail(circle.id)">
					<u-avatar size="46" :src="circle.avatar" shape="square"></u-avatar>
					<view class="circle-info">
						<view class="circle-name">{{circle.name}}</view>
						<view class="circle-des">{{circle.resume}}</view>
					</view>
					<!-- <view class="follow-btn">已加入</view> -->
				</view>
			</view>
			<!-- 发现更多圈子 -->
			<view v-show="tabIndex==1" class="more-circle">
				<view class="search-input-wrapper">
					<input :maxlength="1000" v-model="searchCircleName" placeholder="搜索圈子" type="text" name="find-circle" class="search-circle-input" :adjust-position="true" cursor-spacing="30">
				</view>
				<div class="more-circle-wrapper flex">
					<view class="left">
						<view class="center category-item" :class="{'category-item-active':categoryIndex==index}" 
								v-for="(category,index) in categoryList" :key="index" @click="categoryClick(index,category.id)">
							<text>{{category.name}}</text>
						</view>
					</view>
					<view class="right">
						<view @click="toCircleDetail(circle.id)" class="circle-item" v-for="circle in queryCircleList" :key="circle.id">
							<u-avatar size="46" :src="circle.avatar" shape="square"></u-avatar>
							<view class="circle-info">
								<view class="circle-name">{{circle.name}}</view>
								<view class="circle-des">{{circle.resume}}</view>
							</view>
							<!-- <view class="follow-btn follow-btn-joined">{{circle.isFollow}}</view> -->
						</view>
					</view>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
	import {getJoinCircleListByUid} from "@/api/circle.js";
	import {getCircleList} from "@/api/circle.js";
	import {getCircleCategoryList,getCircleListByCategoryId} from "@/api/circleCategory.js";
	import {mapGetters} from "vuex";
	export default {
		data() {
			return {
				tabIndex: 1,
				tabList: [{name: '我加入的'},
					{name: '更多圈子',}
				],
				style: {
					navBarBgColor: 'var(--color-fff)'
				},
				joinCircleList: [],
				categoryList: [],
				categoryIndex: 0,
				queryCircleList: [],
				queryCircleCondition: {
					name: ''
				},
				searchCircleName: null
			};
		},
		async onLoad({tabIndex}) {
			this.tabIndex = tabIndex
			this.joinCircleList = (await getJoinCircleListByUid(this.userInfo.userId || 0)).data
			this.categoryList = (await getCircleCategoryList({})).data
			this.updateCircleByCategoryId(this.categoryList[0].id)
		},
		methods: {
			tabChange({index}) {
				this.tabIndex = index;
			},
			toCircleDetail(circleId) {
				uni.navigateTo({
					url: `/pages/circle/circle-detail/circle-detail?circleId=${circleId}`
				})
			},
			toWebTest() {
				this.toWebview(this.searchCircleName) 
			},
			async categoryClick(index,categoryId) {
				this.categoryIndex = index
				this.updateCircleByCategoryId(categoryId)
			},
			async updateCircleByCategoryId(categoryId) {
				let res = await getCircleListByCategoryId(categoryId)
				this.queryCircleList = res.data
			},
			async searchCircle() {
				uni.showLoading()
				this.categoryIndex = -1
				let res = await getCircleList({name:this.searchCircleName})
				this.queryCircleList = res.data
			},
			back(){
				// console.log(1);
				uni.navigateBack()
			}
		},
		watch: {
			searchCircleName(nValue) {
				if (nValue.trim() != '') {
					this.searchCircle()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
/*通用item样式*/
.circle-item {
	position: relative;
	display: flex;
	align-items: center;
	padding: 23rpx 32rpx;
	background-color: var(--bg-card-color);
	.circle-info {
		display: flex;
		flex-direction: column;
		margin-left: 24rpx;
		.circle-name {
			font-size: 28rpx;
			color: var(--color-444);
		}
		.circle-des {
			font-size: 24rpx;
			margin-top: 8rpx;
			color: var(--text-grey-color);
		}
	}
	.follow-btn {
		margin-left: auto;
		margin-right: 12rpx;
		padding: 14rpx 22rpx;
		font-size: 24rpx;
		border-radius: 8rpx;
		background-color: red;
		color: var(--color-primary);
		background-color: var(--color-opacity-primary);
	}
	.follow-btn-joined {
		color: var(--color-info);
		background-color: var(--color-info-light);
	}
}
/*导航右侧样式*/
.navbar-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	.btn {
		display: inline-block;
		font-size: 28rpx;
		margin: 0 8rpx;
		box-sizing: border-box;
		padding: 8rpx;
		border-radius: 26rpx;
		background-color: transparent;
	}
	.add-post-btn {
		font-weight: 700;
		background-color: var(--color-primary);
		color: white;
		padding: 8rpx 26rpx;
	}
}
/*本页布局*/
.page-container {
	background-color: var(--bg-card-color);
}
.more-circle {
	
	background-color: var(--bg-card-color);
	// background-color: red;
	font-size: 28rpx;
	$left-width: 180rpx;
	$search-input-height: 90rpx;
	$top-height: calc(44px + var(--status-bar-height));
	$top-height-with-search: calc(44px + 90rpx + var(--status-bar-height)); /*$search-input-height*/
	.search-input-wrapper {
		position: fixed;
		z-index: 99;
		right: 0;
		left: 0;
		padding: 12rpx 24rpx;
		background-color: white;
		height: $search-input-height;
		box-sizing: border-box;
		background-color: var(--color-fff);
		.search-circle-input {
			font-size: 26rpx;
			color: var(--color-000);
			background-color: var(--bg-light-color);
			padding: 16rpx 12rpx;
			border-radius: 4px;
		}
	}
	
	.more-circle-wrapper {
		padding-top: 90rpx; /*$search-input-height*/
		.left {
			position: fixed;
			top: $top-height-with-search;
			bottom: 0;
			left: 0;
			overflow-y: scroll;
			width: $left-width;
			border-right: 1px solid var(--border-light-color);
			box-sizing: border-box;
			color: var(--color-666);
			.category-item {
				padding: 38rpx 30rpx;
				text {
					&::after {
						content: '';
						display: block;
						margin-top: 8rpx;
						border-radius: 6rpx;
						width: 24rpx;
						height: 8rpx;
						background-color: transparent;
						margin-left: 50%;
						transform: translateX(-12rpx);
					}
				}
			}
			.category-item-active {
				font-weight: 700;
				color: var(--color-primary);
				text {
					&::after {
						content: '';
						display: block;
						margin-top: 8rpx;
						border-radius: 6rpx;
						width: 24rpx;
						height: 8rpx;
						background-color: var(--color-primary);
						margin-left: 50%;
						transform: translateX(-12rpx);
					}
				}
				
			}
		}
		.right {
			overflow-y: scroll;
			margin-left: $left-width;
			flex: 1;
			background-color: var(--color-white);
			
		}
	}
	
}
</style>
