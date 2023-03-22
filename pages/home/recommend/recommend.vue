<template>
	<view class="page-container" :data-theme="theme">
		<view class="recommend-top">
			<u-swiper v-if="swiperList.length>0" @click="swiperClick" :list="swiperList" interval="5000" keyName="cover" showTitle></u-swiper>
			<u-grid :border="false" col="5" align="center">
				<u-grid-item v-for="(baseListItem,baseListIndex) in baseList" :key="baseListIndex" @click="click($event)">
					<view class="grid-icon" :style="{backgroundColor:baseListItem.bgColor}">
						<u-icon :name="baseListItem.name" :size="22" color="white"></u-icon>
					</view>
					<text class="grid-text">{{baseListItem.title}}</text>
				</u-grid-item>
			</u-grid>
			<!-- <view class="item" v-for="i in 6" :key="i">
				<u-avatar size="26" src="https://q.qlogo.cn/g?b=qq&nk=2771268198&s=100" shape="square"></u-avatar>
				<view class="right">
					<text class="title">#热门话题</text>
					<text class="grey">搜索更多话题</text>
				</view>
			</view> -->
		</view>
		<PostList :list="list" />
		<u-loadmore :status="loadStatus" />
	</view>
</template>

<script>
	import PostList from '@/components/post-list/post-list.vue';
	import {getSwiperList} from '@/api/system.js'
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
				swiperList: [],
				baseList: [
					{
						name: 'eye',
						title: '官网',
						bgColor: '#fcbd71',
						click: ()=> {
							this.toWebview('http://www.zjut.edu.cn/')
						}
					},
					{
						name: 'calendar',
						title: '课表',
						bgColor: '#cc77db',
						click: () => {
							this.toClassTable()
						}
					},
					{
						name: 'map',
						title: '地图',
						bgColor: '#44acf2',
						click: () => {
							this.toWebview('http://map.zjut.edu.cn/')
						}
					},
					{
						name: 'file-text',
						title: '成绩',
						bgColor: '#71d5a1',
						click: () => {
							this.toScore()
						}
					},
					{
						name: 'star',
						title: '超星',
						bgColor: '#db2d3b',
						click:() => {
							this.toChaoxingIndex()
						}
						// 跑腿，帮拿外卖，帮取快递
					},
				]
			};
		},
		mounted() {
			this.getSwiperList()
		},
		onReachBottom() {
		},
		methods: {
			click(e) {
				this.baseList[e].click()
			},
			async getSwiperList() {
				let res = await getSwiperList()
				this.swiperList = res.data
			},
			swiperClick(index) {
				let item = this.swiperList[index]
				if (item.type == 0) {
					this.toPostDetail(item.resourceId)
				}
				else if (item.type == 1) {
					console.log(item);
					this.toWebview(item.url)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recommend-top {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
		background-color: var(--bg-card-color);
		border-radius: $uni-border-radius-xxlg;
		overflow: hidden;

		.u-swiper {
			width: 100%;
			/deep/ .u-swiper__wrapper__item__wrapper__title {
				font-size: 24rpx;
				padding: 8rpx 18rpx;
				background-color: transparent;
			}
		}

		.u-grid {
			margin: 22rpx 0;
			width: 100%;

			.grid-icon {
				padding: 8px;
				border-radius: 50%;
				background-color: #8888ad;
			}

			.grid-text {
				font-size: 22rpx;
				margin-top: 4rpx;
			}

		}

		// padding: 10rpx 32rpx;
		// margin-bottom: 18rpx;
		// margin-top: -8rpx;
		.item {
			display: flex;
			align-items: center;
			width: 50%;
			margin: 16rpx 0;
			box-sizing: border-box;

			.right {
				margin-left: 16rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				font-size: 26rpx;

				.title {
					font-weight: 600;
					color: var(--text-black-color);
				}

				.grey {
					margin-top: 4rpx;
					font-size: 22rpx;
					color: var(--text-grey-color);
				}
			}
		}
	}

	// .u-loadmore {
	// 	margin-bottom: 64px !important;
	// }
</style>
