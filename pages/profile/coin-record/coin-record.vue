<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="积分记录" bgColor="var(--bg-color)" autoBack placeholder></u-navbar>
		<view class="coin-show center">
			<text class="coin-num">{{userInfo.coinCount}}<text class="tip">积分</text></text>
			
		</view>
		<view class="list" v-if="dataList.length>0">
			<u-empty v-if="dataList.length==0" text="没有记录" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"/>
			<view class="item flex-between" v-for="item in dataList">
				<view class="left">
					<view class="note">{{item.note}}</view>
					<view class="datetime">{{+new Date(item.createdTime)|date('yyyy-mm-dd hh:MM')}}</view>
				</view>
				<text class="count" :class="{'count-red':item.operationType==1}">{{item.operationType==0?'+'+item.count:'-'+item.count}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {coinRecordPage} from '@/api/coinRecord.js'
	export default {
		data() {
			return {
				dataList: []
			};
		},
		onLoad() {
			this.nextPage()
		},
		onReachBottom() {
			this.nextPage()
		},
		methods: {
			async nextPage() {
				let page
				let size = 14;
				let length = this.dataList.length
				let tempInt = parseInt(length/size)
				page = length%size==0 ? tempInt : tempInt+1
				let body = {pageNum:page+1,pageSize:size}
				let res = await coinRecordPage(body)
				if (res.data.records.length==0) {
					return
				}
				this.dataList = [ ...this.dataList ,...res.data.records]
			}
		}
	}
</script>

<style lang="scss" scoped>
.coin-show {
	height: 260rpx;
	background-color: var(--color-primary);
	vertical-align: bottom;
	color: var(--r-color-fff);
	.coin-num {
		font-size: 89rpx;
	}
	.tip {
		padding-left: 18rpx;
		font-size: 32rpx;
	}
}
.list {
	.item {
		padding: 28rpx 32rpx;
		border-bottom: 1px solid var(--color-eee);
		background-color: var(--bg-card-color);
		text {
			font-size: 34rpx;
			margin-left: 24rpx;
		}
		&:active {
			background-color: var(--color-ddd);
		}
		font-size: 32rpx;
		.note {
			font-weight: 700;
		}
		.datetime {
			font-size: 28rpx;
			color: var(--color-666);
			margin-top: 6rpx;
		}
		.count {
			font-size: 38rpx;
			color: orange;
			font-weight: 800;
		}
		.count-red {
			color: red;
		}
	}
}
</style>
