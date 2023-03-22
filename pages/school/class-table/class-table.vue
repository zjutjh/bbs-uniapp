<template>
	<view class="page-container" :data-theme="theme" @click="isCameraMode=false">
		<u-navbar v-show="!isCameraMode" title="课程表" bgColor="var(--bg-color)" autoBack placeholder/>
		
		<view class="table-wrapper" :class="{'camera-mode-wrap':isCameraMode}">
			<view class="loading-icon">
				<u-loading-icon :show="isloading"></u-loading-icon>
			</view>
			<view class="table-list flex-start">
				<!-- 7列 -->
				<view class="weekday" v-for="i in 7">
					<!-- 星期 -->
					<view class="head center">{{numToWeekDay[i-1]}}</view>
					<view class="wrapper">
						<!-- 课表 -->
						<view class="card-wrapper" :style="{top:parseTop(item),height:parseHeight(item)}" v-for="item in lessonsTable[i]">
							<view class="card flex-column" :style="{backgroundColor:parseColor(item)}">
								<view class="lessonPlace">{{item.lessonPlace}}</view>
								<view class="lessonName">{{item.lessonName}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="table-side flex-column">
				<view class="wrapper">
					<view class="side-head center" v-for="i in 12">
						{{i}}
					</view>
				</view>
			</view>
		</view>
		
		<u-picker :show="pickerShow" closeOnClickOverlay :columns="columns" :defaultIndex="defaultIndex" @cancel="pickerShow=false" @confirm="confirm"></u-picker>
		
		<view v-if="!isCameraMode" class="bottom center">
			<view class="left flex-start">
				<view class="change center refresh" @click="filterWeek(true)">
					<u-icon name="reload" size="22" color="white"></u-icon>
				</view>
			</view>
			<view class="mid flex">
				<view class="change pre-week center" @click="weekNum-=1">
					<u-icon name="arrow-left" size="20" color="white"></u-icon>
				</view>
				<view class="filter" @click="pickerShow=true">{{friendlyStr}}</view>
				<view class="change next-week center" @click="weekNum+=1">
					<u-icon name="arrow-right" size="20" color="white"></u-icon>
				</view>
			</view>
			<view class="right flex-end">
				<view class="change center camera-mode" @click.stop="isCameraMode=true">
					<u-icon name="camera" size="22" color="white"></u-icon>
				</view>
			</view>
			
		</view>
		
		<WejhLoginPopup :show="loginShow" @afterLogin="afterLoginEvent()" @close="loginShow=false"/>
	</view>
</template>

<script>
	import {classTable} from '@/api/wejh.js';
	import WejhLoginPopup from '@/components/wejh-login/wejh-login.vue';
	export default {
		components: {
			WejhLoginPopup
		},
		data() {
			return {
				body : {
					year: this.$store.state.school.termInfo.termYear,
					term: this.$store.state.school.termInfo.term
				},
				loginShow: false,
				defaultIndex: [0],
				isloading: false,
				pickerShow: false,
				columns: [['第1周','第2周','第3周','第4周','第5周','第6周','第7周','第8周','第9周','第10周','第11周','第12周','第13周','第14周','第15周','第16周']],
				numToWeekDay: ['周一','周二','周三','周四','周五','周六','周日'],
				lessonsTable:{},
				rowDataList: [],
				weekNum: this.$store.state.school.termInfo.week,
				colorList: ['#81c6e7','#e781bd','#81cae7','#51bbbb','#53d1b6','#81c6e7','#9381e7','#bd81e7','#9681e7','#8193e7','#81e7c8','#81e7a1','#8196e7','#eb8888','#f0c03e',
						'#93d9d4','#93d996','#9f81e7','#ccd993','#85bec9','#d9c393','#d9a093','#93a4d9','#d993b4','#d99393'],
				usedColor: {},
				isCameraMode: false
			};
		},
		mounted() {
			this.defaultIndex = [this.weekNum-1]
			let cookie = uni.getStorageSync('wejh-cookie')
			if (cookie) {
				this.getClassTable()
			} else {
				this.loginShow = true
			}
		},
		methods: {
			parseTop(item) {
				let start = item.sections.slice(0,item.sections.indexOf("-"))
				return parseInt(start-1)*8.333 + '%'
			},
			parseHeight(item) {
				let index = item.sections.indexOf("-")
				let start = item.sections.slice(0,index)
				let end = item.sections.slice(index+1)
				return parseInt(end-start+1)*8.333 + '%'
			},
			parseColor(item) {
				let randomNum = parseInt(Math.random()*this.colorList.length)
				if (this.usedColor[item.id] != undefined) {
					return this.usedColor[item.id]
				}
				let index = randomNum % (this.colorList.length-1)
				this.usedColor[item.id] = this.colorList[index]
				return this.colorList[index]
			},
			async getClassTable() {
				this.isloading = true
				let res = await classTable(this.body)
				if (res.code == 4100) {
					this.$u.toast(res.msg)
					// uni.navigateBack()
					// return this.loginShow = true
				}
				this.rowDataList = res.data
				this.filterWeek()
				this.isloading = false
				this.$forceUpdate()
			},
			filterWeek(changeColor=false) {
				this.lessonsTable= {}
				if (changeColor) {
					this.usedColor = {}
				}
				for (let item of this.rowDataList) {
					let weekday = item.weekday // 星期几
					let beginWeek = item.week.slice(0,item.week.indexOf('-'))
					let endWeek = item.week.slice(item.week.indexOf('-')+1,-1)
					if (this.weekNum!=undefined) {
						if (this.weekNum < parseInt(beginWeek) || this.weekNum > parseInt(endWeek)) { // 不满足
							continue
						}
					}
					if (this.lessonsTable[weekday] == undefined) {
						this.lessonsTable[weekday] = []
					}
					this.lessonsTable[weekday].push(item)
				}
			},
			confirm(e) {
				this.weekNum = e.indexs[0]+1
				this.pickerShow = false
			},
			async afterLoginEvent() {
				this.loginShow = false
				this.getClassTable()
			}
		},
		watch: {
			weekNum(newValue,oldValue) {
				if (newValue<=0) {
					this.weekNum = 1
				}
				if (newValue>16) {
					this.weekNum = 16
				}
				this.filterWeek()
			}
		},
		computed: {
			friendlyStr () {
				return this.columns[0][this.weekNum-1]
			}
		}
	}
</script>

<style lang="scss" scoped>
$left-side-width: 36px;
$top-head-height: 42px;
$bottom-height: 56px;
.wrapper {
	position: absolute;
	top: 42px;
	bottom: 0;
	right: 0;
	left: 0;
}
.table-wrapper {
	position: fixed;
	top: calc(44px + 20px + var(--status-bar-height));
	bottom: $bottom-height + 20px;
	left: 16px;
	right: 16px;
	background-color: var(--bg-card-color);
	border-radius: 32rpx;
	box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, .05);
}
.camera-mode-wrap {
	transform: scale(.94);
	// bottom: 20px;
}
.loading-icon {
	position: absolute;
	top: 50%;
	left: 50%;
}
.table-list {
	height: 100%;
	overflow: scroll;
	margin-left: $left-side-width;
	box-sizing: border-box;
	
	.weekday {
		min-width: 20%;
		max-width: 20%;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;	
		position: relative;
		.head {
			height: $top-head-height;
			border-bottom: 1px solid var(--color-ddd);
			box-sizing: border-box;
		}
		
		.card-wrapper {
			position: absolute;
			padding: 12rpx 8rpx;
			width: 100%;
			box-sizing: border-box;
			.card {
				color: var(--r-color-fff);
				height: 100%;
				background-color: #00ee8b;
				border-radius: 12rpx;
				box-sizing: border-box;
				text-align: center;
				padding: 0 8rpx;
				.lessonPlace {
					font-size: 26rpx;
					font-weight: 700;
				}
				.lessonName {
					margin-top: 4rpx;
					font-size: 22rpx;
				}
			}
		}
	}
}
.table-side {
	position: absolute;
	top: -1px;
	left: 0;
	bottom: 0;
	width: $left-side-width;
	border-right: 1px solid var(--color-ddd);
	.side-head {
		height: 8.3333%;
		box-sizing: border-box;
		&:first-child {
			border-top: 1px solid var(--color-ddd);
		}
	}
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
	.mid {
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
		margin: 0 8rpx;
	}
	.change {
		background-color: #51d0b5;
		border-radius: 50%;
		width: 32px;
		height: 32px;
	}
	.left {
		flex: 1;
		.refresh {
			margin-left: 40rpx;
			background-color: #51d0b5;
		}
	}
	.right{
		flex: 1;
		.camera-mode {
			margin-left: auto;
			margin-right: 40rpx;
			background-color: #51d0b5;
		}
	}
	
}
</style>
