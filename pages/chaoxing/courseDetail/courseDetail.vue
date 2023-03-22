<template>
	<view class="page-container" ref="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar title="活动列表" bgColor="var(--bg-color)" autoBack placeholder />
		</u-navbar>
		<view class="page-main">
			<view class="active-list" v-if="activeList&&activeList.length>0">
				<view class="active-item flex-start" v-for="active in activeList" :key="active.activeId" 
					@click="activeClick(active.name,active.activeId)">
					<u-image showLoading :src="active.logo" width="50px" height="50px" radius="4" />
					<view class="right flex-column ml-8">
						<text class="active-name u-line-2">{{active.name}}</text>
						<text class="active-endTime">{{'结束时间：'+active.endTimeFriendly}}</text>
					</view>
				</view>
			</view>
			<view class="no-more">没有更多了~</view>
		</view>
	</view>
</template>

<script>
	import {courseActive} from '@/api/chaoxing.js';
	export default {
		data() {
			return {
				body: {
					classId: null,
					courseId: null,
					fid: 0
				},
				activeList: []
			};
		},
		onLoad({classId,courseId,fid}) {
			this.body.classId = classId
			this.body.courseId = courseId
			this.body.fid = fid
		},
		async mounted() {
			uni.showLoading()
			let res = await courseActive(this.body)
			this.activeList = res.data
		},
		methods: {
			activeClick(activeName,activeId) {
				if (activeName.indexOf('签到') == -1) {
					return this.$u.toast('不支持的签到类型')
				}
				let typeCode = 0
				if (activeName=='位置签到') {
					typeCode = 2
				}
				if (activeName=='二维码签到') {
					typeCode = 3
				}
				this.toChaoxingSign({...this.body,activeId,typeCode})
			}
		}
	}
</script>

<style lang="scss" scoped>

.active-list {
	.active-item {
		padding: 16rpx 24rpx;
		background-color: var(--color-white);
		.active-name {
			font-size: 30rpx;
			margin-bottom: 8rpx;
		}
		.active-endTime {
			font-size: 24rpx;
			color: var(--color-999);
		}
	}
}
.no-more {
	text-align: center;
	padding: 22rpx;
	font-size: 22rpx;
	color: var(--text-tips-color);
}
</style>
