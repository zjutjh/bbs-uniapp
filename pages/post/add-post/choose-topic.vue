<template>
	<view class="page-container height-auto" :data-theme="theme">
		<u-navbar title="选择话题" bgColor="var(--bg-color)" autoBack placeholder>
			<view slot="right">
				<view class="btn" @click="ok()">确定</view>
			</view>
		</u-navbar>
		<view class="search-input-wrapper">
			<input :maxlength="1000" v-model="searchValue" @input="search()" placeholder="搜索话题 (至少输入2个字符)" type="text"
				name="find-circle" class="search-circle-input" :adjust-position="true" cursor-spacing="30">
		</view>
		<view class="list">
			<view v-if="searchValue.trim().length>=2">
				<text v-if="searchTopicList.length>0">搜索到的话题</text>
				<view class="item" v-for="(item,index) in searchTopicList" @click="chooseSearchTopic({index,id:item.id,name:item.name})" :class="{active:item.isActive}" :key="'s'+item.id">
					<view class="name u-line-1">{{'# '+item.name}}</view>
					<view class="des">{{item.postCount+' 动态'}}</view>
				</view>
			</view>
			
			<view v-if="searchValue.trim().length<2">
				<text>最新话题</text>
				<view class="item" @click="chooseNewTopic({index,id:item.id,name:item.name})" :class="{active:item.isActive}"
					v-for="item,index in newTopicList" :key="'new'+item.id">
					<view class="name u-line-1">{{'# '+item.name}}</view>
					<view class="des">{{item.postCount+' 动态'}}</view>
				</view>
			</view>
			<view v-if="searchValue.trim().length<2">
				<text>热门话题</text>
				<view class="item" @click="chooseHotTopic({index,id:item.id,name:item.name})" :class="{active:item.isActive}"
					v-for="item,index in hotTopicList" :key="'hot'+item.id">
					<view class="name u-line-1">{{'# '+item.name}}</view>
					<view class="des">{{item.postCount+' 动态'}}</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		getHotTopicList,
		getNewTopicList,
		getTopicPage
	} from '@/api/topic.js'
	export default {
		data() {
			return {
				hotTopicList: [],
				newTopicList: [],
				searchTopicList: [],
				chooseList: [],
				searchValue: '',
			};
		},
		created() {
			this.loadHotTopickList()
			this.loadNewTopickList()
		},
		onLoad({
			chooseListJson
		}) {
			this.chooseList = JSON.parse(chooseListJson)
		},
		methods: {
			async loadHotTopickList() {
				let res = await getHotTopicList()
				this.hotTopicList = res.data
				this.hotTopicList.forEach(e => {
					let find = this.chooseList.find(chooseItem => chooseItem.id == e.id)
					if (find) {
						e.isActive = true
					}
				})

			},
			async loadNewTopickList() {
				let res = await getNewTopicList()
				this.newTopicList = res.data
				this.newTopicList.forEach(e => {
					let find = this.chooseList.find(chooseItem => chooseItem.id == e.id)
					if (find) {
						e.isActive = true
					}
				})
			},
			chooseSearchTopic({index,id,name}) {
				if (this.searchTopicList[index].isActive) { // 若已选择
					this.searchTopicList[index].isActive = false // 置未未选状态
					this.chooseList = this.chooseList.filter(item => item.id != id) // 删除
				} else {
					this.searchTopicList[index].isActive = true // 置未已选状态
					this.chooseList = this.chooseList.filter(item => item.id != id) // 删除
					this.chooseList.push({id,name})
				}
				this.$forceUpdate()
			},
			chooseHotTopic({index,id,name}) {
				if (this.hotTopicList[index].isActive) { // 若已选择
					this.hotTopicList[index].isActive = false // 置未未选状态
					this.chooseList = this.chooseList.filter(item => item.id != id) // 删除
				} else {
					this.hotTopicList[index].isActive = true // 置未已选状态
					this.chooseList = this.chooseList.filter(item => item.id != id) // 删除
					this.chooseList.push({id,name})
				}
				this.$forceUpdate()
			},
			chooseNewTopic({index,id,name}) {
				if (this.newTopicList[index].isActive) { // 若已选择
					this.newTopicList[index].isActive = false // 置未未选状态
					this.chooseList = this.chooseList.filter(item => item.id != id) // 删除
				} else {
					this.newTopicList[index].isActive = true // 置未已选状态
					this.chooseList = this.chooseList.filter(item => item.id != id) // 删除
					this.chooseList.push({id,name})
				}
				this.$forceUpdate()
			},
			async search() {
				if (this.searchValue.trim().length < 2) {
					return
				}
				let body = {
					"name": this.searchValue,
					"pageNum": 0,
					"pageSize": 10
				}
				let res = await getTopicPage(body);
				this.searchTopicList = res.data.records
				this.searchTopicList.forEach(e => {
					let find = this.chooseList.find(chooseItem => chooseItem.id == e.id)
					if (find) {
						e.isActive = true
					}
				})
			},
			ok() {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.topicList = this.chooseList.slice(0,3)
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.search-input-wrapper {
		position: fixed;
		z-index: 99;
		right: 0;
		left: 0;
		padding: 12rpx 24rpx;
		background-color: white;
		height: 100rpx;
		box-sizing: border-box;
		background-color: var(--bg-card-color);

		.search-circle-input {
			font-size: 26rpx;
			color: var(--color-000);
			background-color: var(--bg-light-color);
			padding: 16rpx 12rpx;
			border-radius: 4px;
		}
	}

	.list {
		margin-top: 100rpx;

		text {
			display: block;
			padding: 24rpx 0 16rpx 24rpx;
			// margin-top: 20rpx;
		}
	}

	.item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 23rpx 32rpx;
		background-color: var(--bg-card-color);

		.name {
			font-size: 28rpx;
			color: var(--color-444);
		}

		.des {
			font-size: 24rpx;
			margin-top: 8rpx;
			color: var(--text-grey-color);
		}

		&:active {
			background-color: var(--color-eee);
		}
	}

	.active {
		background-color: var(--color-primary);

		.name {
			color: white;
		}

		.des {
			color: #ececec;
		}
	}
	.btn {
		border-radius: 12rpx;
		font-size: 30rpx;
		padding: 8rpx 14rpx;
		color: white;
		background-color: var(--color-primary);
	}
</style>
