<template>
	<view class="page-container height-auto" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar autoBack :title="style.navBarTitle" :bgColor="style.navBarBgColor">
		</u-navbar>
		<!-- 用户背景图 -->
		<view class="bg-img" style="filter: blur(10px);">
			<u--image :showLoading="true" :src="user.avatar" width="100%" height="120px"></u--image>
		</view>
		<view class="page-main">
			<view class="user-info-section">
				<!-- 头像及数据 -->
				<view class="flex-around">
					<u-avatar size="72" :src="user.avatar"></u-avatar>
					<view class="data-section flex-around">
						<view class="data-item flex-column" @click="toFollowList(user.userId)">
							<text>{{user.followCount}}</text>
							<text>关注</text>
						</view>
						<view class="data-item flex-column" @click="toFanList(user.userId)">
							<text>{{user.fanCount}}</text>
							<text>粉丝</text>
						</view>
						<view class="data-item flex-column" @click="optionIndex=1">
							<text>{{user.postCount}}</text>
							<text>动态</text>
						</view>
					</view>
				</view>
				
			</view>
			<view class="rows">
				<!-- 昵称行 -->
				<view class="nick-row row flex-between">
					<view class="left">
						<text class="user-name">{{user.nickName}}</text>
						<text class="user-uid ml-8">uid:{{user.userId}}</text>
					</view>
					<view class="right flex" :class="{'show-flex':user.userId!=userInfo.userId}">
						<view v-if="!user.isFollow" @click="toggleFollowSubmit()" class="popIn tag tag-primary">关注</view>
						<view v-else @click="toggleFollowSubmit()" class="edit tag">取消关注</view>
						<view class="tag" @click="toChatRoom(user.userId,user.nickName)">私信</view>
					</view>
				</view>
				<!-- 标签行 -->
				<view class="tag-row row flex-start">
					<text class="tag tag-orange color-white">{{user.levelName}}</text>
					<text v-if="user.gender==1" class="tag tag-man color-white">♂</text>
					<text v-if="user.gender==2" class="tag tag-weman color-white">♀</text>
					<text v-for="tag in user.tags" class="tag">{{tag.name}}</text>
				</view>
				<!-- 简介行 -->
				<view class="sign-row row">
					<text>{{user.sign}}</text>
				</view>
			</view>
			<!-- <view class="divider-h12"></view> -->
			<view class="body-section">
				<view class="options">
					<text @click="optionIndex=0" class="tag-transparent" :class="{tag: optionIndex==0}">资料</text>
					<text @click="optionIndex=1" class="tag-transparent" :class="{tag: optionIndex==1}">动态 {{user.postCount}}</text>
					<text @click="optionIndex=2" class="tag-transparent" :class="{tag: optionIndex==2}">圈子</text>
				</view>
				<!-- 用户资料 -->
				<view v-show="optionIndex==0" class="user-info">
					<view class="card">
						<text class="title">基本信息</text>
						<view class="flex-start">
							<text class="tip">用户名</text>
							<text class="info">{{user.nickName}}</text>
						</view>
						<view class="flex-start">
							<text class="tip">学院</text>
							<text class="info">{{user.college}}</text>
						</view>
						<view class="flex-start">
							<text class="tip">专业</text>
							<text class="info">{{user.major}}</text>
						</view>
						<view class="flex-start">
							<text class="tip">注册时长</text>
							<text class="info">{{parseRegisterDays(user.createdTime)}}</text>
						</view>
						<view class="flex-start">
							<text class="tip">故乡</text>
							<text class="info">{{user.hometown}}</text>
						</view>
						<view class="flex-start">
							<text class="tip">生日</text>
							<text class="info">{{Number(user.birthday)|date}}</text>
						</view>
						<view class="flex-start">
							<text class="tip">个人简介</text>
							<text class="info">{{user.sign}}</text>
						</view>
					</view>
					<view class="au-card card hide">
						<view class="flex-between">
							<text class="title">认证信息</text>
							<text class="color-tip">管理&nbsp;></text>
						</view>
						
						<view class="flex-start">
							<text class="tip">身份</text>
							<text class="info">程序员</text>
						</view>
						<view class="flex-start">
							<text class="tip">说明</text>
							<text class="info">程序员，狗都不当</text>
						</view>
					</view>
					<!-- 共同关注 -->
					<view v-if="joinUser.length!=0" class="icon-card card">
						<text class="title">共同关注</text>
						<view class="flex-start" v-for="item in joinUser">
							<u-avatar size="28" :src="item.avatar"></u-avatar>
							<text class="ml-8 info">{{item.nickName}}</text>
						</view>
					</view>
					<view class="icon-card card hide">
						<text class="title">这些人关注了TA</text>
						<view class="flex-start" v-for="i in 4">
							<u-avatar size="28" src="https://q.qlogo.cn/g?b=qq&nk=2771268198&s=100"></u-avatar>
							<text class="ml-8 info">学生部部长</text>
						</view>
					</view>
				</view>
				<!-- 动态信息 -->
				<view v-show="optionIndex==1" class="posts">
					<PostList :list="userPostList"/>
				</view>
				<!-- 圈子信息 -->
				<view v-show="optionIndex==2" class="circles">
					<view class="icon-card card" v-if="createCircleList.length!=0">
						<text class="title">创建的圈子</text>
						<view class="flex-start ripple" hover-class="hoverClass" v-for="circle in createCircleList" @click="toCircleDetail(circle.id)">
							<u-avatar size="28" shape="square" :src="circle.avatar"></u-avatar>
							<text class="ml-8 info">{{circle.name}}</text>
						</view>
					</view>
					<view class="icon-card card">
						<text class="title">加入的圈子</text>
						<view class="flex-start ripple" hover-class="hoverClass" v-for="circle in joinCircleList" @click="toCircleDetail(circle.id)">
							<u-avatar size="28" shape="square" :src="circle.avatar"></u-avatar>
							<text class="ml-8 info">{{circle.name}}</text>
						</view>
					</view>
					<view class="icon-card card hide">
						<text class="title">共同加入的圈子</text>
						<view class="flex-start" v-for="i in 2">
							<u-avatar size="28" shape="square" src="https://q.qlogo.cn/g?b=qq&nk=2771268198&s=100"></u-avatar>
							<text class="ml-8 info">学生部部长</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import PostList from '@/components/post-list/post-list.vue';
	import {getUserInfoByUid} from '@/api/user.js';
	import {getJoinFollowSimple,toggleFollow} from '@/api/follow.js';
	import {getJoinCircleListByUid, getCreateCircleListByUid} from '@/api/circle.js';
	import {getPostListByUid} from '@/api/post.js';
	export default {
		components: {
			PostList
		},
		data() {
			return {
				uid:0,
				style: {
					navBarBgColor: 'transparent',
					navBarTitle: ''
				},
				optionIndex: 0,
				user: {}, // 用户信息
				joinUser: [], // 共同关注用户
				joinCircleList: [], // 加入的圈子信息
				createCircleList: [], // 创建的圈子信息
				userPostList: [],
				queryPostOfUser: {
					userId: -1,
					pageNum: 0,
					pageSize: 20
				}
			};
		},
		async onLoad({uid}) {
			if (!uid) 
				return
			uni.showLoading()
			this.uid = uid;
			let res = await getUserInfoByUid(uid) // 获取用户信息
			this.user = res.data
			res = await getJoinFollowSimple(uid) // 获取共同关注
			this.joinUser = res.data || []
			res = await getJoinCircleListByUid(uid) // 获取加入的圈子
			this.joinCircleList = res.data
			res = await getCreateCircleListByUid(uid) // 获取创建的圈子
			this.createCircleList = res.data

			this.queryPostOfUser.userId = uid
			this.getNextPageOfUserPostList()
			
		},
		onPageScroll(e) {
			if (e.scrollTop>10) {
				this.style.navBarBgColor = 'var(--color-fff)'
				this.style.navBarTitle = ` ${this.user.nickName}`
			} else {
				this.style.navBarBgColor = 'transparent'
				this.style.navBarTitle = ''
			}
		},
		onReachBottom() {
			if (this.optionIndex == 1) { // 用户动态页
				this.getNextPageOfUserPostList()
			}
		},
		mounted() {
			
		},
		methods: {
			parseRegisterDays(dateTime) {
				let registerTime = new Date(dateTime).getTime();
				let now = new Date().getTime();   //获取当前时间毫秒
				let yearMs = 3600*24*365*1000
				let monthMs = 3600*24*30*1000
				let year = parseInt((now-registerTime) / yearMs)
				let month = parseInt((now-registerTime) / monthMs - year*12 )
				return `${year}年 ${month}月`
			},
			async getNextPageOfUserPostList() {
				this.queryPostOfUser.pageNum++
				let res = await getPostListByUid(this.queryPostOfUser) // 获取用户动态
				if (res.data.records.length == 0) {
					return this.queryPostOfUser.pageNum--
				}
				this.userPostList = [...this.userPostList,...res.data.records]
			},
			async toggleFollowSubmit() {
				let res = await toggleFollow(this.uid)
				if (res.data == 1) { // 关注成功
					this.user.isFollow = true
					this.user.fanCount += 1
				} else { // 取消关注
					this.user.isFollow = false
					this.user.fanCount -= 1
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-container {
	overflow: visible;
	.page-main {
		background-color: var(--color-fff);
		position: relative;
		top: -8px;
		border-radius: $uni-border-radius-xxxlg $uni-border-radius-xxxlg 0 0;
	}
}
.user-info-section {
	.flex-between {
		padding: 16rpx;
	}
	.u-avatar {
		flex: 1;
		position: relative;
		top: -14px;
		/deep/.u-avatar__image {
			border: 4px solid white !important;
		}
	}
	.data-section {
		flex: 2;
		.data-item {
			width: 25%;
			align-items: center;
			text {
				&:nth-child(1) {
					font-size: 30rpx;
				}
				&:nth-child(2) {
					color: var(--text-content-color);
				}
			}
		}
	}
}
.rows {
	padding: $uni-navbar-padding;	
	.row {
		margin: 16rpx 0;
	}
	.nick-row {
		.left {
			.user-name {
				font-size: 28rpx;
			}
			.user-uid {
				color: var(--text-grey-color);
			}
		}
		.right {
			display: none;
			.tag {
				margin-right: 16rpx;
			}
		}
	}
	.tag-row {
		.tag {
			padding: 4rpx 16rpx;
			font-size: 20rpx;
			margin-right: 12rpx;
		}
	}
	.sign-row {
		color: var(--text-content-color);
	}
}
.body-section {
	background-color: var(--bg-color);
	.options {
		position: sticky;
		top: $top-height;
		background-color: var(--color-fff);
		z-index: 99;
		padding: $uni-navbar-padding;
		text {
			font-size: 28rpx;
		}
	}
	.user-info,.circles{
		padding: $uni-navbar-padding;
		.card {
			margin-bottom: 24rpx;
			font-size: 28rpx;
			padding: $uni-navbar-padding;
			border-radius: $uni-border-radius-xlg;
			background-color: var(--bg-card-color);
			.title {
				height: 1.5em;
				line-height: 1.5em;
				font-size: 32rpx;
			}
			.flex-between {
				height: 1.5em;
			}
			.flex-start, .title {
				margin: 28rpx 0;
			}
			.flex-start {
				align-items: flex-start;
			}
			.tip {
				color: var(--text-tips-color);
				width: 6em;
			}
			.info {
				flex: 1;
			}
		}
		.au-card {
			.tip {
				width: 4em;
			}
		}
		.icon-card {
			padding-bottom: 1rpx;
			.flex-start {
				padding: 14rpx 8rpx;
				margin: 8rpx 0;
				align-items: center;
				// border-bottom: 1px solid var(--border-light-color);
			}
		}
	}
	.circles {
		.icon-card {
			.flex-start {
				border: none;
			}
		}
	}
	.posts {
		padding: $uni-navbar-padding;
	}
}

</style>
