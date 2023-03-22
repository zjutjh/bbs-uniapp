<template>
	<view class="page-container" :data-theme="theme">
		<PostList :list="list"/>
		<u-loadmore :status="loadStatus" />
	</view>
</template>

<script>
	import PostList from '@/components/post-list/post-list.vue';
	import {readAllOfFollowPerson} from '@/api/post.js'
	export default {
		components: {
			PostList
		},
		props: {
			list: Array,
			loadStatus: String
		},
		mounted() {
			readAllOfFollowPerson()
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>

</style>
