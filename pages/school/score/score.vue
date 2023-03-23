<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="成绩查询" bgColor="var(--bg-color)" autoBack/>
		
		<view class="table-wrapper">
			<u-loading-icon v-if="isLoading" :show="true"></u-loading-icon>
			<view class="list">
				<view class="item flex-between" v-for="item in dataList">
					<text>{{item.lessonName}}</text>
					<text>{{item.score}}</text>
				</view>
			</view>
			<u-empty v-if="isLoading==false && dataList.length==0" text="没有找到记录" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"/>
		</view>
		
		<u-picker :show="pickerShow" closeOnClickOverlay :columns="columns" :defaultIndex="defaultIndex" @cancel="pickerShow=false" @confirm="confirm"></u-picker>
		
		<view class="bottom center">
			<!-- <view class="reload">刷新</view> -->
			<view class="filter" @click="pickerShow=true">{{friendlyStr}}</view>
		</view>
		<WejhLoginPopup :show="loginShow" @afterLogin="afterLoginEvent()" @close="loginShow=false"/>
	</view>
</template>

<script>
	import {examScore} from '@/api/wejh.js'
	import WejhLoginPopup from '@/components/wejh-login/wejh-login.vue';
	export default {
		components: {
			WejhLoginPopup
		},
		data() {
			return {
				body : {
					year: this.$store.state.school.termInfo.termYear,
					term: this.$store.state.school.termInfo.score,
					period: "期末"
				},
				columns: [
					[],
					['上', '下', '短'],
					['期中','期末']
				],
				loginShow: false,
				defaultIndex: [0,0,1],
				termYear: "2022",
				score: "上",
				pickerShow: false,
				isLoading: false,
				dataList: [
				]
			};
		},
		mounted() {
			for(let i=0; i<4; ++i) {
				let begin = parseInt(this.termYear)-i
				this.columns[0].push(begin+'/'+(begin+1))
			}
			if (this.body.term == '下') {
				this.defaultIndex = [0,1,1]
			}
			let cookie = uni.getStorageSync('wejh-cookie')
			if (cookie) {
				this.getData()
			} else {
				this.loginShow = true
			}
		},
		methods: {
			async getData() {
				this.isLoading = true
				let res = await examScore(this.body)
				if (res.code == 4100) {
					uni.navigateBack()
					// return this.loginShow = true
				}
				this.dataList = res.data
				this.isLoading = false
			},
			confirm(e) {
				let indexArr = e.indexs
				this.body.year = this.termYear-indexArr[0]
				this.body.term = this.columns[1][indexArr[1]]
				this.body.period = this.columns[2][indexArr[2]]
				this.pickerShow = false
				this.dataList = []
				this.getData()
			},
			async afterLoginEvent() {
				this.loginShow = false
				this.getData()
			}
		},
		computed: {
			friendlyStr () {
				let year = parseInt(this.body.year)
				return  year+'/'+(year+1)+ '（'+this.body.term+'）' + this.body.period
			}
		}
	}
</script>

<style lang="scss" scoped>
$bottom-height: 56px;
.list {
	.item {
		font-size: 28rpx;
		padding: 20rpx 0;
		border-bottom: 1px solid var(--color-eee);
		margin: 12rpx 0;
	}
}

.table-wrapper {
	margin: 0 16px;
	margin-top: calc(44px + 20px + var(--status-bar-height));
	margin-bottom: $bottom-height + 20px;
	background-color: var(--bg-card-color);
	border-radius: 32rpx;
	box-sizing: border-box;
	padding: 20rpx 48rpx;
	box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, .05);
}

.bottom {
	position: fixed;
	height: $bottom-height;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--bg-card-color);
	border-radius: 32rpx 32rpx 0 0;
	font-size: 32rpx;
	box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, .05);
	padding: 0 12%;
	> view {
		background-color: #51d0b5;
		height: 32px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		border-radius: 10rpx;
		color: var(--r-color-fff);
	}
	.filter {
		padding: 8rpx 28rpx;
		margin: 0 28rpx;
	}
	.reload {
		padding: 18rpx 12rpx;
	}
}
</style>
