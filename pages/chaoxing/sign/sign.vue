<template>
	<view class="page-container" ref="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar title="签到" bgColor="var(--bg-color)" autoBack placeholder />
		</u-navbar>
		<view class="page-main">
			<view class="sign-btn center" @click="signSubmit()">
				签到
			</view>
			
			<view class="tips">
				<view class="common-sign" v-if="body.typeCode<2">
					<text class="tip-text">直接点击签到即可</text>
				</view>
				<view class="location-sign"  v-if="body.typeCode==2">
					<view class="weidu flex">
						<text>纬度信息：</text> 
						<input type="text" v-model="body.locationLatitude">
					</view>
					<view class="jingdu flex">
						<text>经度信息：</text> 
						<input type="text" v-model="body.locationLongitude">
					</view>
					<view class="text flex">
						<text>地址描述信息：</text> 
						<input type="text" v-model="body.locationText">
					</view>
					<text v-if="isAllocate" class="tip-text">以上为教师设置的中心点信息\n您可以适当修改\n再提交你的位置信息</text>
					<text v-else class="tip-text" style="color:red">该签到未指定签到位置，请手动输入位置信息</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {locationInfo,sign} from '@/api/chaoxing.js';
	export default {
		data() {
			return {
				body: {
				  "activeId": "",
				  "classId": 0,
				  "courseId": "",
				  "locationLatitude": "",
				  "locationLongitude": "",
				  "locationText": "",
				  "typeCode": 0
				},
				isAllocate: true
			};
		},
		onLoad(e) {
			this.body = {...e}
			if (e.typeCode == 2) {
				this.getLocationInfo(e.activeId)
			}
		},
		methods: {
			async getLocationInfo(activeId) {
				let res = await locationInfo(activeId)
				if (res.data.locationText==null) {
					this.isAllocate = false // 该签到未指定位置
				}
				this.body = {...this.body,...res.data}
			},
			async signSubmit() {
				uni.showLoading()
				if (this.body.typeCode==2) {
					if (!(this.body.locationLatitude && this.body.locationLongitude && this.body.locationText)) {
						return this.$u.toast("请填写位置信息")
					}
				}
				let res = await sign(this.body)
				this.$u.toast(res.msg)
			}
		}
	}
</script>

<style lang="scss" scoped>
.sign-btn {
	height: 200rpx;
	width: 200rpx;
	margin: 80rpx auto;
	border-radius: 50%;
	background-color: #33adff;
	color: white;
	font-weight: 600;
	font-size: 32rpx;
}
.tips {
	color: var(--text-grey-color);
	text-align: center;
	font-size: 28rpx;
	.location-sign {
		padding: 0 60rpx;
		> view {
			margin: 40rpx;
			text {
				width: 8em;
			}
			input {
				flex: 1;
				border-bottom: 1px solid black;
			}
		}
	}
}
</style>
