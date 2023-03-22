<!-- 第一页 -->
<template>
	<view class="page-container" ref="page-container" :data-theme="theme">
		<u-navbar placeholder :bgColor="style.navBarBgColor">
			<u-tabs slot="left" :list="tabList" :current="tabIndex" @change="e=>changeTabIndex(e.index)"></u-tabs>
			<view class="navbar-right" slot="right">
				<u-icon class="btn" name="search" size="24" @click="toSearch()"></u-icon>
				<text class="btn add-post-btn center" @click="toAddPost()">发布</text>
			</view>
		</u-navbar>
		<Update></Update>
		<view class="page-main">
			<FollowPerson :list="followPerson.list" :loadStatus="followPerson.loadStatus" v-if="tabIndex==0" />
			<Recommend :list="recommend.list" :loadStatus="recommend.loadStatus" v-if="tabIndex==1" />
			<FollowCircle :list="followCircle.list" :loadStatus="followCircle.loadStatus" v-if="tabIndex==2" />
		</view>
		<view v-show="isScollTop" class="fresh-btn center" @click="startFresh()">
			<u-icon color="white" size="26" name="reload"></u-icon>
		</view>
		
	</view>

</template>

<script>
	import FollowPerson from '@/pages/home/follow-person/follow-person.vue';
	import Recommend from '@/pages/home/recommend/recommend.vue';
	import FollowCircle from '@/pages/home/follow-circle/follow-circle.vue';
	import {getPostList,getCirclePostPage,getFollowUserPostPage,unReadCountOfFollowPerson} from "@/api/post.js";
	import Update from '@/components/update/update.vue'
	export default {
		components: {
			FollowPerson,
			Recommend,
			FollowCircle,
			Update
		},
		data() {
			return {
				tabIndex: 1,
				tabList: [{name: '关注',badge:{value:0}},{name: '推荐',},{name: '圈子'}],
				style: {
					navBarBgColor: 'transparent'
				},
				recommend: {
					list: [],
					loadStatus: 'nomore',
					query: {
						pageNum: 0,
						pageSize: 10
					}
				},
				followPerson: {
					list: [],
					loadStatus: 'nomore',
					query: {
						max: +new Date(),
						offset: 0,
						count: 10
					}
				},
				followCircle: {
					list: [],
					loadStatus: 'nomore',
					query: {
						max: +new Date(),
						offset: 0,
						count: 10
					}
				},
				oldScollTop: 0,
				isScollTop: false
			};
		},
		onReachBottom() {
			if (this.tabIndex == 0) 
				this.getNextFollowPage()
			else if (this.tabIndex == 1) 
				this.getNextRecommendPage()
			else if (this.tabIndex == 2) 
				this.getNextCirclePage()
		},
		onPageScroll(e) {
			this.isScollTop = false
			let topPx = e.scrollTop
			if (topPx < 20) {
				this.style.navBarBgColor = 'transparent'
			} else {
				this.style.navBarBgColor = 'var(--bg-color)'
				if (topPx < this.oldScollTop ) { // 向上滚动
					// this.isScollTop = true
				}
			}
			this.oldScollTop = topPx
		},
		mounted() {
			this.getNextRecommendPage()
			setTimeout(() => {
				this.getNextCirclePage()
			},1000)
			setTimeout(() => {
				this.getNextFollowPage()
			},1000)
			
			this.updateUnReadCountOfFollowPerson(1)
			// 监听消息
			this.$store.dispatch('msg/UpdateAll')
			this.$watch(
				() => { return this.$store.getters['msg/unReadCountSum']} ,
				(nValue, oldValue) => {  // 新来了一条消息
					if (nValue > 0) {
						uni.setTabBarBadge({index: 2,text: nValue+''})
					} else {
						uni.removeTabBarBadge({index: 2})
					}
				},
				{immediate:true,deep:true}
			)
			setTimeout( ()=> {
				this.$store.dispatch('msg/ListenChat')
				this.$store.dispatch('msg/ListenSystem')
				this.$store.dispatch('msg/ListenInteract')
			},2000)
					
		},
		onPullDownRefresh() {
			this.fresh()
		},
		methods: {
			async getNextFollowPage() {
				this.followPerson.loadStatus = 'loading'
				let res = await getFollowUserPostPage(this.followPerson.query);
				if (res.data.list.length == 0) {
					this.followPerson.loadStatus = 'nomore'
				}
				this.followPerson.query.max = res.data.minTime
				this.followPerson.query.offset = res.data.offset
				this.followPerson.list = [...this.followPerson.list, ...res.data.list]
			},
			async getNextRecommendPage() {
				this.recommend.query.pageNum++
				this.recommend.loadStatus = 'loading'
				let res = await getPostList(this.recommend.query);
				if (res.data.records.length == 0) {
					this.recommend.loadStatus = 'nomore'
					return this.recommend.query.pageNum--
				}
				this.recommend.list = [...this.recommend.list, ...res.data.records]
			},
			async getNextCirclePage() {
				this.followCircle.loadStatus = 'loading'
				let res = await getCirclePostPage(this.followCircle.query);
				if (res.data.list.length == 0) {
					this.followCircle.loadStatus = 'nomore'
				}
				this.followCircle.query.max = res.data.minTime
				this.followCircle.query.offset = res.data.offset
				this.followCircle.list = [...this.followCircle.list, ...res.data.list]
			},
			async updateUnReadCountOfFollowPerson(nextIndex) {
				this.tabList[0].badge.value = (await unReadCountOfFollowPerson()).data
				this.tabIndex = 0
				this.$nextTick(()=>{
					this.tabIndex = nextIndex
				})
			},
			changeTabIndex(index) {
				this.tabIndex = index
				if (index == 0) {
					this.tabList[0].badge.value = 0
				}
			},
			startFresh() {
				this.fresh()
			},
			fresh() {
				if (this.tabIndex==0) {
					this.followPerson.list=[]
					this.followPerson.query.max = +new Date()
					this.followPerson.query.offset = 0
					this.getNextFollowPage()
					this.updateUnReadCountOfFollowPerson(0)
				}
				else if (this.tabIndex==1) {
					this.recommend.list = []
					this.recommend.query.pageNum = 0
					this.getNextRecommendPage()
				}
				else if (this.tabIndex==2) {
					this.followCircle.list = []
					this.followCircle.query.max = +new Date()
					this.followCircle.query.offset = 0
					this.getNextCirclePage()
				}
				setTimeout(()=> {
					uni.stopPullDownRefresh()
				},200)
			}
		
		},

	}
</script>

<style lang="scss" scoped>
	.page-container {
		overflow: auto;
		height: auto;
		.navbar-right {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			box-sizing: border-box;
			.btn {
				display: inline-block;
				font-size: 14px;
				font-weight: 600;
				box-sizing: border-box;
				padding: 4px;
				margin: 0 4px;
				border-radius: 13px;
				background-color: transparent;
			}
			.add-post-btn {
				display: flex;
				background-color: var(--color-primary);
				padding: 4px 13px;
				color: white;
				// height: 44px;
				line-height: 1.42em;
			}
		}
		.page-main {
			padding: $uni-page-padding;
		}
	}
	
	.fresh-btn {
		position: fixed;
		right: 50rpx;
		bottom: 170rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: var(--color-primary);
		box-shadow: 2px 2px 12px 2px rgba(0, 0, 0, .1);
		transition: all .8s;
	}
</style>
