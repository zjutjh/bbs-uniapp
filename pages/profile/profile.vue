<template>
	<view class="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar placeholder :bgColor="style.navBarBgColor">
			<view slot="left"></view>
			<view class="navbar-right flex hide" slot="right">
				<u-icon class="mr-12" name="edit-pen" color="var(--color-444)" size="26"></u-icon>
				<u-icon name="setting" color="var(--color-444)" size="24"></u-icon>
			</view>
		</u-navbar>
		<view class="page-main">
			<!-- 用户信息区域 -->
			<view class="user-info-section flex">
				<u-avatar size="62" :src="userInfo.avatar" @click="previewAvatar()"></u-avatar>
				<view class="flex-column flex-1 ml-12" @click="clickAvatar()">
					<template v-if="userInfo.nickName">
						<text class="name">{{userInfo.nickName}}</text>
						<text class="tips">{{'uid:'+userInfo.userId}}</text>
					</template>
					<text v-else class="name">点击登录</text>
					<view class="rank-section hide">
						<view class="progress">
							<view class="progress-bar"></view>
						</view>
						<view class="flex-between">
							<text>{{userInfo.levelName}}</text>
							<text>还差1501经验升级</text>
						</view>
					</view>
				</view>
				<view v-if="signBtnShow" class="sign-btn" @click.stop="signClick()">签到</view>
			</view>
			<!-- 用户各类数据 -->
			<view class="user-data-section flex">
				<view class="data-card flex-column">
					<text>{{userInfo.coinCount}}</text>
					<text>积分</text>
				</view>
				<view class="data-card flex-column" @click="toFollowList()">
					<text>{{userInfo.followCount}}</text>
					<text>关注</text>
				</view>
				<view class="data-card flex-column" @click="toFanList()">
					<text>{{userInfo.fanCount}}</text>
					<text>粉丝</text>
				</view>
				<view class="data-card flex-column">
					<text>{{userInfo.postCount}}</text>
					<text>动态</text>
				</view>
			</view>
			
			<view class="card-section">
				<!-- <view class="title-section flex-between">
					<text class="title">创作者中心</text>
					<text>></text>
				</view> -->
				<view class="menu-section flex">
					<view class="menu-item flex-column custom" @click="toCoinRecord()">
						<u-icon name="rmb-circle" color="#f7bab0" size="37"/>
						<text>我的积分</text>
					</view>
					<view class="menu-item flex-column" @click="toLikedPostList()">
						<u-icon name="thumb-up" color="#a5c5d9" size="42"/>
						<text>点赞记录</text>
					</view>
					<view class="menu-item flex-column" @click="toMyCommentList()">
						<u-icon name="order" color="#46A6EA" size="42"/>
						<text>我的回复</text>
					</view>
					<view class="menu-item flex-column" @click="historyClick()">
						<u-icon name="clock" color="#e5a23d" size="37"/>
						<text>浏览记录</text>
					</view>
				</view>
			</view>
			<view class="card-section hide">
				<!-- <view class="title-section flex-between">
					<text class="title">创作者中心</text>
					<text>></text>
				</view> -->
				<view class="menu-section flex">
					<view class="menu-item flex-column" v-for="i in 9" :key="i">
						<u-icon name="photo" size="42"/>
						<text>签到</text>
					</view>
				</view>
			</view>
			<view class="row-section" v-if="userInfo.status==2">
				<view class="row-item flex" @click="toUserActive()">
					<text>⭐激活账号</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
			</view>
			
			<view class="row-section">
				<view class="row-item flex"  @click="inviteUser()">
					<text>邀请好友</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
				<view class="row-item flex" @click="toSetting()">
					<text>设置</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
				<view class="row-item flex hide">
					<text>认证</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
				<view class="row-item flex" @click="getQqGroupId()">
					<text>QQ交流群</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
			</view>
			<view class="row-section">
				<view class="row-item flex" @click="changeTheme()">
					<text>切换主题</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
				<view class="row-item flex" @click="toPersonEdit()">
					<text>我的</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
				<view class="row-item flex" @click="historyClick()">
					<text>帮助</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
				<!-- #ifdef H5 -->
				<view class="row-item flex" @click="toDownload()">
					<text>下载APP</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
				<!-- #endif -->
				<view class="row-item flex" @click="logOut()">
					<text>退出登录</text>
					<u-icon name="arrow-right" style="margin-left: auto;"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {sign,updateUser} from '@/api/user.js'
	export default {
		data() {
			return {
				style: {
					navBarBgColor: 'transparent'
				},
				signBtnShow: false
			};
		},
		mounted() {
			this.changeSignBtnShow()
		},
		onShow() {
			this.$store.dispatch('user/UpdateUserInfo') // 更新用户信息
		},
		methods: {
			clickAvatar() {
				if (this.isLogined) {
					this.toPersonDetail(this.userInfo.userId)
				} else {
					this.toLogin()
				}
			},
			changeTheme() {
				this.$store.dispatch('theme/toggle_theme')
			},
			logOut() {
				this.$store.commit('user/LOG_OUT')
				uni.navigateTo({
					url: '/pages/profile/login/login'
				})
			},
			async signClick() {
				try {
					let res = await sign()
					this.$u.toast('签到成功')
					uni.setStorageSync('lastSignDate',JSON.stringify(+new Date()))
					this.changeSignBtnShow()
				} catch(err) {
					if (err.msg == '您已签到过了') {
						uni.setStorageSync('lastSignDate',JSON.stringify(+new Date()))
						this.changeSignBtnShow()
					}
				}
			},
			historyClick() {
				this.$u.toast('开发中...')
			},
			changeSignBtnShow() {
				let lastDate = uni.getStorageSync('lastSignDate')
				if (!lastDate) {
					return this.signBtnShow = true
				}
				let last = new Date(parseInt(lastDate))
				let now = new Date()
				this.signBtnShow = now.getDate()!=last.getDate()
			},
			previewAvatar() { // 预览头像
				uni.previewImage({
					urls: [this.userInfo.avatar],
					longPressActions: {
						itemList: ['修改头像', '保存图片'],
						success: (data) => {
							switch (data.tapIndex){
								case 0: // 修改头像
									this.changeAvatar()
									break;
								case 1: // 保存图片到系统相册
									uni.saveImageToPhotosAlbum({
										filePath: this.userInfo.avatar,
										success: () => {
											this.$u.toast('保存成功')
										}
									});
									break;
								default: break;
							}
						},
						fail: (err) => {
							this.$u.toast(err.errMsg)
						}
					}
				});
			},
			changeAvatar() {
				uni.closePreviewImage()
				// 选择头像
				uni.chooseImage({
					count: 1, 
					sizeType: ['original'], 
					sourceType: ['album'],
					success: (res) => {
						// 上传头像
						uni.showLoading({title:'上传中...'})
						uni.uploadFile({
							url: this.$config.uploadImgUrl,
							filePath: res.tempFilePaths[0],
							name: 'file', 
							header:{
								"token": uni.getStorageSync('token'),
							},
							success: (res) => {
								let result = JSON.parse(res.data)
								if (result.code == 2000) {
									this.changeAvatarSubmit(result.data)
									this.$u.toast('修改成功')
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
			},
			async changeAvatarSubmit(newAvatar) {
				let body = {
					avatarId: newAvatar
				}
				let res = await updateUser(body)
				this.$store.dispatch('user/UpdateUserInfo') // 更新用户信息
			},
			getQqGroupId() {
				uni.setClipboardData({
					data: '717610616',
					showToast: false,
					success: () => {
						this.$u.toast('已复制群号')
					}
				});
			},
			inviteUser() {
				// #ifndef APP-PLUS
				uni.setClipboardData({ // h5端
					data: this.$config.downloadUrl,
					showToast: false,
					success: () => {
						this.$u.toast('已复制分享链接')
					}
				});
				// #endif
				
				// #ifdef APP-PLUS
				// uni.shareWithSystem({ // 手机端
				//   summary: '你下了这个么？',
				//   href: this.$config.h5Url + 'pages/download/download',
				// })
				uni.showLoading()
				uni.downloadFile({
				    url: this.$config.downloadPosterUrl,
				    success: (downloadResult) => {
				        if (downloadResult.statusCode === 200) {  
				            downloadResult.tempFilePath  
							uni.saveImageToPhotosAlbum({
								filePath: downloadResult.tempFilePath,
								success: () => {
									uni.shareWithSystem({
										type:'image',
										href: this.$config.downloadUrl,
										imageUrl: downloadResult.tempFilePath
									})
									uni.hideLoading()
								}
							})
				        }
				    },
				    fail: (err) => {
				        plus.nativeUI.toast("分享图片下载失败")
				    }
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-container {
	.page-main {
		padding: $uni-navbar-padding;
	}
}
.navbar-right {
	
}
.user-info-section {
	padding: 16rpx 8rpx;
	position: relative;
	.u-avatar {
		border: 2px solid #fff;
		background-color: var(--bg-card-color);
	}
	.name {
		font-size: 34rpx;
	}
	.tips {
		margin: 8rpx 0;
		color: var(--text-content-color);
	}
	.rank-section {
		margin-top: 8rpx;
		padding: 0 4rpx;
		font-size: 20rpx;
		.progress {
			margin: 4rpx 0;
			height: 8rpx;
			border-radius: 8rpx;
			background-color: var(--bg-card-color);
			overflow: hidden;
			.progress-bar {
				width: 60%;
				height: 100%;
				background-color: var(--color-444);
			}
		}
	}
	.sign-btn {
		font-size: 28rpx;
		font-weight: 700;
		position: absolute;
		right: 16rpx;
		top: 50%;
		padding: 10rpx 16rpx;
		transform: translateY(-50%);
		background-color: var(--color-primary);
		color: white;
		border-radius: 16rpx;
	}
}
.user-data-section {
	margin: 42rpx 0;
	.data-card {
		width: 25%;
		align-items: center;
		text {
			&:nth-child(1) {
				font-size: 30rpx;
			}
			&:nth-child(2) {
				color: var(--text-content-color);
			}
		}
	}
}
.card-section {
	padding: 28rpx 0;
	margin-bottom: 32rpx;
	background-color: var(--bg-card-color);
	border-radius: $uni-border-radius-xxlg;
	.title-section {
		padding: 8rpx 32rpx;
		color: var(--text-content-color);
		.title {
			color: var(--color-000);
		}
	}
	.menu-section {
		flex-wrap: wrap;
		justify-content: flex-start;
		.u-icon{
			height: 42px;
		}
		text {
			margin-top: 6rpx;
		}
		.menu-item {
			min-width: 25%;
			max-width: 25%;
			align-items: center;
			box-sizing: border-box;
		}
		.custom {
			padding-top: 5px;
		}
	}
}
.row-section {
	margin-bottom: 32rpx;
	background-color: var(--bg-card-color);
	border-radius: $uni-border-radius-xxlg;
	overflow: hidden;
	.row-item {
		border-bottom: .4px solid var(--color-eee);
		padding: 28rpx;
		font-size: 30rpx;
		&:active {
			background-color: var(--color-eee);
		}
	}
}
</style>
