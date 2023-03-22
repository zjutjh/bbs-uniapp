<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="关注列表" bgColor="var(--bg-color)" autoBack placeholder></u-navbar>
		<u-empty v-if="dataList.length==0" text="没有记录" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"/>
		<view class="list" v-if="dataList.length>0">
			<view class="item flex-start" v-for="item in dataList" @click="toPersonDetail(item.userId)">
				<u-avatar :src="item.avatar"></u-avatar>
				<text>{{item.nickName}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {getFollowPage} from '@/api/follow.js'
	export default {
		data() {
			return {
				dataList: [],
				targetUserid: null
			};
		},
		onLoad({userId}) {
			console.log(11112);
			if (userId==null||userId=='null' || userId=='undefined') {
				console.log(111);
				if (!this.isLogined) {
					return uni.redirectTo({
						url: '/pages/profile/login/login'
					})
				} else {
					this.targetUserid = this.userInfo.userId
				}
			} else {
				this.targetUserid = userId
			}
			this.nextPage()
		},
		onReachBottom() {
			this.nextPage()
		},
		methods: {
			async nextPage() {
				uni.showLoading()
				let page
				let size = 20;
				let length = this.dataList.length
				let tempInt = parseInt(length/size)
				page = length%size==0 ? tempInt : tempInt+1
				let body = {pageNum:page+1,pageSize:size}
				let res = await getFollowPage(this.targetUserid,body)
				if (res.data.records.length==0) {
					return
				}
				this.dataList = [ ...this.dataList ,...res.data.records]
			}
		}
	}
</script>

<style lang="scss" scoped>

.list {
	.item {
		padding: 24rpx 28rpx;
		border-bottom: 1px solid var(--color-eee);
		background-color: var(--bg-card-color);
		text {
			font-size: 34rpx;
			margin-left: 24rpx;
		}
		&:active {
			background-color: var(--color-ddd);
		}
	}
}
</style>
