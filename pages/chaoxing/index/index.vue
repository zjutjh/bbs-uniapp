<template>
	<view class="page-container" ref="page-container" :data-theme="theme">
		<!-- navbar部分 -->
		<u-navbar title="超星签到助手" bgColor="var(--color-white)" autoBack placeholder />
		</u-navbar>
		<view class="page-main">
			<view class="course-wrap" v-show="tabIndex==0">
				<view class="course-list" v-if="courseList&&courseList.length>0">
					<view class="course-item flex-start" v-for="course in courseList" :key="course.id"
						@click="toCourseDetail(course)">
						<u-image showLoading :src="course.courseCover" width="100px" height="60px" radius="6" />
						<view class="right flex-column ml-12">
							<text class="course-name">{{course.courseName}}</text>
							<text class="course-teacher-name">{{course.teacherName}}</text>
						</view>
					</view>
				</view>
				<view class="no-more">没有更多了~</view>
			</view>
			<view class="account-wrap" v-show="tabIndex==2">
				<view class="card">
					<view v-if="cxUser.name==null" @click="loginShow=true">点击登录</view>
					<view v-else>
						<view>{{cxUser.name}}</view>
						<view style="font-size: 22rpx;color: var(--color-aaa)">{{cxUser.xuehao}}</view>
					</view>
				</view>
				<view class="card card-help">
					<u-collapse :border="false">
						<u-collapse-item title="获取用户信息失败,怎么办？">
							<text class="u-collapse-content">点击下方按钮，重新登录一下</text>
						</u-collapse-item>
						<u-collapse-item title="课程信息加载不出来怎么办？">
							<text class="u-collapse-content">请返回，重新进入课程页面\n如果还不行就点下方退出按钮，重新登录下</text>
						</u-collapse-item>
						<u-collapse-item title="支持的签到类型有哪些？">
							<text class="u-collapse-content">目前支持普通签到、手势签到、签到码签到、位置签到。
							\n\n位置签到默认是教师设置的中心点的位置信息，也可以手动设置位置信息。
							\n\n目前暂时不支持二维码签到，如果人多的话，我可能会考虑添加一下。
							\n\n签到过期也是可以签到的，你们可以多试试。
							</text>
						</u-collapse-item>
						<u-collapse-item title="可以挂机自动签到吗？">
							<text class="u-collapse-content">去群里多多唠唠嗑，提醒我一下，等我有时间再开发吧（人数多的话）~\n目前是建议打开超星通知，有签到消息后再打开本软件进行签到\n即使过期了也可以尝试签到</text>
						</u-collapse-item>
						<u-collapse-item title="账号密码信息是如何保存的？">
							<text class="u-collapse-content">账号密码不进行保存，只保存cookie值，cookie会自动过期，过期后需要再次输入账号密码登录\n超星账号密码与本软件的账号密码不挂钩，所以你也可以帮助其他同学签到</text>
						</u-collapse-item>
						
					</u-collapse>
				</view>
				<view class="card" v-if="cxUser.name!=null">
					<view @click="logoutCx()">退出登录</view>
				</view>
			</view>
		</view>
		<view class="page-bottom center">
			<text @click="tabIndex=0" :class="{active:tabIndex==0}">课程</text>
			<text @click="toWebview('http://mooc1-api.chaoxing.com/work/stu-work')">作业</text>
			<text @click="tabIndex=2" :class="{active:tabIndex==2}">账号</text>
		</view>
		<!-- 登录账号 -->
		<u-popup :show="loginShow" mode="center" round="16" closeOnClickOverlay @close="loginShow=false">
			<view class="loginPopup">
				<view class="title">
					登录超星账号
				</view>
				<u-input v-model="loginBody.phone" placeholder="账号(手机号)" prefixIcon="account" color="var(--color-111)" fontSize="16px" placeholderStyle="color:var(--color-111)"
					prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
				<u-input v-model="loginBody.password" placeholder="密码" type="password" prefixIcon="lock" color="var(--color-111)" fontSize="16px" placeholderStyle="color:var(--color-111)"
					prefixIconStyle="font-size: 24px;margin:0 12rpx;color:var(--color-111);"></u-input>
				<view class="choose flex-start">
					<u-switch v-model="save" size="14"></u-switch>
					<text>保存密码到本地</text>
				</view>
				<view class="btn" @click="login()">登录</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		courseLists,
		cxLogin,
		cxUserInfo
	} from '@/api/chaoxing.js';
	export default {
		data() {
			return {
				tabIndex: 0,
				courseList: [],
				loginShow: false,
				loginBody: {
					phone: null,
					password: null
				},
				cxUser: {
					xuehao: null,
					name: null
				},
				save: true
			};
		},
		async mounted() {
			// #ifndef APP-PLUS
			this.$u.toast('请下载客户端查看')
			setTimeout(() => {
				uni.navigateBack()
			},1000)
			// #endif
			
			// #ifdef APP-PLUS
			this.init()
			// #endif
			
		},
		methods: {
			async getCourseLists() {
				uni.showLoading()
				// #ifdef APP-PLUS
				uni.request({
					url: 'http://mooc1-api.chaoxing.com/mycourse/backclazzdata',
					header: {
						'Cookie': uni.getStorageSync('cx-cookie')
					},
					success: (res) => {
						let list = res.data.channelList
						console.log('list',list);
						for(let item of list) {
							console.log(item.key);
							if (item.cataName!='课程' || (''+item.key).startsWith("tea") ) {
								continue
							}
							console.log('item',item);
							let course = {
								classId: item.content.id,
								className: item.content.name,
								courseCover: item.content.course.data[0].imageurl,
								courseId: item.content.course.data[0].id,
								courseName: item.content.course.data[0].name,
								teacherName: item.content.course.data[0].teacherfactor
							}
							this.courseList.push(course)
						}
						uni.hideLoading()
					}
				})
				// #endif
				
				// #ifndef APP-PLUS
				let res = await courseLists()
				this.courseList = res.data
				// #endif
				
			},
			async login() {
				if (this.save) {
					let config = uni.getStorageSync('config')
					if (!config) {
						config = {}
					} else {
						config = JSON.parse(config)
					}
					if (!config.chaoxing) {
						config.chaoxing = {}
					}
					console.log(config);
					config.chaoxing.phone = this.loginBody.phone
					config.chaoxing.password = this.loginBody.password
					config.chaoxing.save = this.save
					uni.setStorageSync('config',JSON.stringify(config))
				}
				let res = await cxLogin(this.loginBody)
				uni.setStorageSync('cx-cookie', res.data)
				this.init()
			},
			logoutCx() {
				uni.removeStorageSync('cx-cookie')
				uni.removeStorageSync('cx-user')
				this.back()
			},
			async init() {
				this.loginShow = false
				let cxCookie = uni.getStorageSync('cx-cookie')
				if (cxCookie) {
					this.getCourseLists()
					if (!uni.getStorageSync('cx-user')) {
						let res = await cxUserInfo()
						this.cxUser.name = res.data.name
						this.cxUser.xuehao = res.data.xuehao
						uni.setStorageSync('cx-user',JSON.stringify(this.cxUser))
					} else {
						this.cxUser = JSON.parse(uni.getStorageSync('cx-user'))
					}
				} else {
					this.loginShow = true
				}
			}
		},
		watch: {
			loginShow(value) {
				if (value) {
					let config = uni.getStorageSync('config')
					if (config) {
						config = JSON.parse(config)
						if (config.chaoxing) {
							this.loginBody.phone = config.chaoxing.phone
							this.loginBody.password = config.chaoxing.password
							this.sve = config.chaoxing.save
						}
					} 
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$page-bottom-height: 50px;

	.page-main {
		padding-bottom: $page-bottom-height;
	}


	.course-list {
		.course-item {
			padding: 22rpx;

			.course-name {
				font-size: 30rpx;
				font-weight: 700;
				margin-bottom: 10rpx;
			}

			.course-teacher-name {
				font-size: 24rpx;
				color: var(--color-888);
			}
			&:active {
				background-color: var(--color-ddd);
			}
		}
	}

	.account-wrap {
		padding: 34rpx;

		.card {
			font-size: 32rpx;
			box-shadow: 0 0 6px 1px rgba(0, 0, 0, .08);
			padding: 24rpx;
			margin-bottom: 38rpx;
			border-radius: 20rpx;
			background-color: var(--color-white);
		}
		.card-help {
			padding: 0;
		}
	}

	.page-bottom {
		box-sizing: border-box;
		box-shadow: 0 0 8px 1px var(--color-eee);
		padding: 18rpx;
		height: $page-bottom-height;
		width: 100%;
		background-color: var(--color-white);
		position: fixed;
		bottom: 0;
		z-index: 999;
	
	text {
			font-size: 32rpx;
			flex: 1;
			text-align: center;
			color: var(--color-aaa);
		}

		text.active {
			color: var(--color-333);
		}
	}

	.loginPopup {
		padding: 20rpx 48rpx;
		background-color: var(--color-white);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 0 6px 0px rgb(242,242,242);
		.title {
			font-size: 28rpx;
			color: var(--color-111);
			text-align: center;
			margin: 28rpx 0;
		}
		.choose {
			font-size: 22rpx;
			text {
				margin-left: 12rpx;
			}
			margin-bottom: 18rpx;
			padding: 0 18rpx;
			color: var(--color-666);
		}
		.btn {
			line-height: 38rpx;
			width: 100%;
			font-size: 28rpx;
			border-radius: 40rpx;
			padding: 18rpx 0;
			background-color: var(--color-primary);
			text-align: center;
			font-weight: 700;
			color: #eee;
			margin: 12rpx 0 28rpx 0;
		}
		.u-input {
			background-color: transparent;
			font-size: 28rpx;
			height: 80rpx;
			border-radius: 60rpx;
			margin: 18rpx 0;
			border: none;
			/deep/.u-input__content {
				padding-bottom: 8px;
				border-bottom: 1px solid var(--color-aaa);
			}
		}
	}
	.no-more {
		text-align: center;
		padding: 22rpx;
		font-size: 22rpx;
		color: var(--text-tips-color);
	}
	/deep/ .u-cell__title-text {
		color: var(--color-111);
	}
</style>
