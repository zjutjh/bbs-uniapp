<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="我的资料" bgColor="var(--color-fff)" autoBack placeholder>
			<view slot="right">
				<view class="btn" @click="submit()">保存</view>
			</view>
		</u-navbar>
		<view class="page-main">
			<view class="item flex-between" @click="changeAvatar()">
				<text>头像</text>
				<view class="color-tip">
					<u-avatar :src="showBody.avatar"></u-avatar>
				</view>
			</view>
			<view class="item flex-between" @click="showInput('nickName')">
				<text>昵称</text>
				<text class="color-tip">{{showBody.nickName}}</text>
			</view>
			<view class="item flex-between" @click="genderPickerShow=true">
				<text>性别</text>
				<text class="color-tip">{{parseGender(showBody.gender)}}</text>
			</view>
			<view class="item flex-between" @click="birthdayShow=true">
				<text>生日</text>
				<text class="color-tip">{{+new Date(showBody.birthday)|date('yyyy-mm-dd')}}</text>
			</view>
			<view class="item flex-between" @click="showInput('hometown')">
				<text>家乡</text>
				<text class="color-tip">{{showBody.hometown}}</text>
			</view>
			<view class="item flex-between" @click="showInput('sign')">
				<text>个性签名</text>
				<text class="color-tip">{{showBody.sign}}</text>
			</view>
			<view class="item flex-between" @click="showInput('college')">
				<text>学院</text>
				<text class="color-tip">{{showBody.college}}</text>
			</view>
			<view class="item flex-between" @click="showInput('major')">
				<text>专业</text>
				<text class="color-tip">{{showBody.major}}</text>
			</view>
			<view class="item flex-between" @click="gradePickerShow=true">
				<text>年级</text>
				<text class="color-tip">{{showBody.grade}}</text>
			</view>
		</view>

		<u-datetime-picker :show="birthdayShow" v-model="showBody.birthday" mode="date" :minDate="1000" :maxDate="+new Date()"
			@cancel="birthdayShow=false" @confirm="birthdayConfirm" @close="birthdayShow=false" closeOnClickOverlay/>
				
		<u-picker :show="genderPickerShow" :columns="genderColumns" keyName="label" 
			@confirm="genderConfirm" @cancel="genderPickerShow=false" @close="genderPickerShow=false" closeOnClickOverlay/>
			
		<u-picker :show="gradePickerShow" :columns="gradeColumns"
			@confirm="gradeConfirm" @cancel="gradePickerShow=false" @close="gradePickerShow=false" closeOnClickOverlay/>
			
		<u-popup :show="inputShow" mode="center" @close="inputShow=false" closeOnClickOverlay round="16">
			<view class="popup-wrapper">
				<input type="text" v-model="inputValue">
				<view class="btn-wrapper flex">
					<view class="btn cancel" @click="inputCancel()">取消</view>
					<view class="btn ok" @click="inputOk()">确定</view>
				</view>
			</view>
		</u-popup>
		
		
	</view>
</template>

<script>
	import {updateUser} from '@/api/user.js'
	export default {
		data() {
			return {
				showBody: {
					avatar: '',
					avatarId: null,
					birthday: null,
					nickName: '',
					sign: '',
					gender: '',
					college: '',
					major: '',
					hometown: '',
					grade: 0
				},
				genderPickerShow: false,
				genderColumns: [[{label:'男',value:1},{label:'女',value:2},{label:'保密',value:0}]],
				gradePickerShow: false,
				gradeColumns: [[]],
				birthdayShow: false,
				inputValue: null,
				inputShow: false,
				inputKey: null
			};
		},
		mounted() {
			if (!this.isLogined) {
				uni.redirectTo({
					url:'/pages/profile/login/login'
				})
			}
			let year = new Date().getFullYear() + 1
			for (let i=0; i<10; ++i) {
				this.gradeColumns[0].push(year-i+'')
			}
			this.initBody()
		},
		methods: {
			async submit() {
				let res = await updateUser(this.showBody)
				this.$store.dispatch('user/UpdateUserInfo') // 更新用户信息
				this.$u.toast('成功')
				setTimeout(()=> {
					uni.navigateBack()
				},500)
			},
			genderConfirm(e) {
				this.showBody.gender = e.value[0].value
				this.genderPickerShow = false
			},
			birthdayConfirm(e) {
				this.showBody.birthday = e.value
				this.birthdayShow = false
			},
			gradeConfirm(e) {
				this.showBody.grade = e.value[0]
				this.gradePickerShow = false
			},
			showInput(inputKey) {
				this.inputKey = inputKey
				this.inputShow = true
				this.inputValue = this.showBody[inputKey]
			},
			inputOk() {
				this.showBody[this.inputKey] = this.inputValue
				this.inputCancel()
			},
			inputCancel() {
				this.inputValue = null
				this.inputKey = null
				this.inputShow = false
			},
			parseGender(code) {
				let arr = ['保密','男','女']
				return arr[parseInt(code)]
			},
			initBody() {
				this.showBody.avatar = this.userInfo.avatar
				this.showBody.nickName = this.userInfo.nickName
				this.showBody.gender = this.userInfo.gender
				this.showBody.birthday = +new Date(this.userInfo.birthday)
				this.showBody.hometown = this.userInfo.hometown
				this.showBody.sign = this.userInfo.sign
				this.showBody.college = this.userInfo.college
				this.showBody.major = this.userInfo.major
				this.showBody.grade = this.userInfo.grade
			},
			changeAvatar() {
				uni.closePreviewImage()
				// 选择头像
				uni.chooseImage({
					count: 1, 
					sizeType: ['original'], 
					sourceType: ['album'],
					success: (fileRes) => {
						// 上传头像
						uni.showLoading({title:'上传中...'})
						uni.uploadFile({
							url: this.$config.uploadImgUrl,
							filePath: fileRes.tempFilePaths[0],
							name: 'file', 
							header:{
								"token": uni.getStorageSync('token'),
							},
							success: (res) => {
								let result = JSON.parse(res.data)
								if (result.code == 2000) {
									this.showBody.avatar = fileRes.tempFilePaths[0]
									this.showBody.avatarId = result.data
								} else {
									uni.showToast({title: result.msg,icon:"error"})
								}
							},
							complete: () => {
								uni.hideLoading()
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>

.page-main {
	padding-top: 12rpx;
}
.item {
	font-size: 28rpx;
	padding: 38rpx 38rpx;
	border-bottom: 1px solid var(--color-eee);
	background-color: var(--bg-card-color);
	&:active {
		background-color: var(--color-ddd);
	}
}

.popup-wrapper {
	padding: 48rpx;
	padding-bottom: 24rpx;
	font-size: 28rpx;
	input {
		padding: 20rpx 28rpx;
		font-size: 28rpx;
		background-color: var(--color-eee);
		border-radius: 100rpx;
	}
	.btn-wrapper {
		font-weight: 700;
		margin-top: 40rpx;
		.btn {
			flex: 1;
			margin: 0 8rpx;
			background-color: var(--color-primary);
			text-align: center;
			padding: 12rpx 40rpx;
			border-radius: 100rpx;
			color: white;
		}
		.cancel {
			background-color: var(--color-eee);
			color: var(--color-primary);
		}
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
