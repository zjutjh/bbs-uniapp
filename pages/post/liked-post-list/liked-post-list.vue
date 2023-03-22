<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="点赞列表" bgColor="var(--bg-color)" autoBack placeholder></u-navbar>
		<view class="post-wrapper">
			<PostList :list="dataList"/>
		</view>
	</view>
</template>

<script>
	import {postListOfLiked} from '@/api/post.js'
	import PostList from '@/components/post-list/post-list.vue';
	export default {
		components: {
			PostList
		},
		data() {
			return {
				dataList: [],
			};
		},
		onLoad() {
			this.nextPage()
		},
		onReachBottom() {
			// this.nextPage()
		},
		methods: {
			async nextPage() {
				let body
				let length = this.dataList.length
				if (length==0) {
					body = {min: 0, max: +new Date()}
				} else {
					let max = +new Date(this.dataList[length-1].createdTime)
					body = {min: 0, max:max}
				}
				let res = await postListOfLiked(body)
				if (res.data.length==0) {
					return
				}
				this.dataList = [ ...this.dataList ,...res.data]
			}
		}
	}
</script>

<style lang="scss" scoped>

.post-wrapper {
	padding: 26rpx;
}
</style>
