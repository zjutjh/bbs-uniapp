<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar title="" bgColor="var(--bg-color)" autoBack placeholder>
			<view slot="right">
				<view class="btn" @click="submit()">发布</view>
			</view>
		</u-navbar>
		<view class="page-main">
			<textarea placeholder="说些什么叭..." :auto-height="true" maxlength="1200" v-model="content"
				class="content-display"></textarea>
			<!-- 上传图片 -->
			<block>
				<u-upload :fileList="mediaList" @afterRead="afterRead" @delete="deletePic" name="1" multiple
					:maxCount="9">
				</u-upload>
			</block>
			<view class="choose">
				<view class="choose-item" @click="toChooseCircle()">
					<view class="left flex-start">
						<u-icon name="moments" size="20"></u-icon>
						<view class="title">圈子</view>
					</view>
					<view class="right flex-end">
						<view class="active" v-if="circle">{{circle.name}}</view>
						<u-icon name="arrow-right" size="20"></u-icon>
					</view>
				</view>
				<view class="choose-item" @click="toChooseTopic()">
					<view class="left flex-start">
						<u-icon name="grid" size="20"></u-icon>
						<view class="title">话题</view>
					</view>
					<view class="right flex-end">
						<view class="active" v-for="topic in topicList">{{topic.name}}</view>
						<u-icon name="arrow-right" size="20"></u-icon>
					</view>
				</view>
				<view class="choose-item" @click="showEmoji=!showEmoji">
					<view class="left flex-start">
						<u-icon name="heart" size="20"></u-icon>
						<view class="title">表情</view>
					</view>
					<view class="right flex-end">
						<!-- <view class="active" v-for="topic in topicList">{{topic.name}}</view> -->
						<u-icon :name="showEmoji?'arrow-down':'arrow-right'" size="20"></u-icon>
					</view>
					<view class="emoji-section">
						<!-- 表情 -->
						<view v-show="showEmoji" class="emoji">
							<view v-for="(emojiRow,i1) in emojiList" :key="i1" class="emoji-row">
								<view v-for="(emoji,i2) in emojiRow" :key="i2" class="emoji-item" @click.stop="clickEmoji(emoji)">
									{{emoji}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		addPost
	} from '@/api/post.js';
	export default {
		data() {
			return {
				btnStyle: {
					color: "#fff",
					backgroundColor: '#333333'
				},
				content: '',
				circle: null,
				topicList: [],
				mediaList: [],
				imageBlobList: [],
				showEmoji: false,
				emojiList: [
					['😀','😅','☺️','🤣','😆','😗️','😙️'],
					['😁','😎','😋️','🤔','🤩','🙂','🥲️'],
					['😢','😭','😩️','🙄','😶','🤨️','😐'],
					['😡','😤','😖️','😞','🤐','😯','😫'],
					['😪','😴','😔️','🤤','😒','😵️','🤡️'],
					['🎉','🎁','♥️','💔','🌹','🌷','⭐️'],
				],
			};
		},
		onLoad(e) {
			let body = JSON.parse(e.data)
			this.circle = body.circle
			this.topicList = body.topicList==null?[]:body.topicList
			if (!this.isLogined) {
				uni.redirectTo({
					url: '/pages/profile/login/login'
				})
			}
		},
		methods: {
			// 删除图片
			deletePic(event) {
				this.mediaList.splice(event.index, 1)
				this.imageBlobList.splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				console.log(event);
				for(let file of event.file) {
					if (file.size > 5242880) {
						this.$u.toast('图片超过5M')
					} else {
						this.imageBlobList.push(file)
					}
				}
				this.mediaList = this.imageBlobList.map(blobFile => {
					return {
						url: blobFile.url
					}
				})
			},
			async submit() {
				if (this.content.trim() == '') {
					return this.$u.toast('内容不能为空')
				}
				if (!this.circle && this.topicList.length == 0) {
					return this.$u.toast('请至少选择一个圈子或一个话题')
				}
				let imageLength = this.imageBlobList.length
				let objectIds = []
				if (imageLength > 0) { //需要上传图片
					uni.showLoading({title: `图片上传中...`})
					for (let i = 0; i < imageLength; ++i) {
						let file = this.imageBlobList[i]
						uni.uploadFile({
							url: this.$config.uploadImgUrl, //文件服务器地址
							filePath: file.thumb, //文件路径
							name: 'file', // 参数名
							timeout: 100000,
							header: {
								"token": uni.getStorageSync('token'),
							},
							success: (res) => {
								let result = JSON.parse(res.data)
								objectIds.push(result.data)
								if (objectIds.length == imageLength) {
									this.addPostF(objectIds)
								}
							}
						});
						let beginTime = +new Date()
						let gap = beginTime
						while (gap < 400) {
							let nowTime = +new Date()
							gap = nowTime - beginTime
						}
					}
					uni.hideLoading()
				} else { // 不需要上传图片
					this.addPostF(objectIds)
				}
			},
			async addPostF(objectIds) {
				uni.showLoading()
				let postAddBody = {
					circleId: this.circle == null ? 0 : this.circle.id,
					topicIds: this.topicList.map(e => e.id),
					userId: this.userInfo.userId,
					type: '00',
					content: this.content + `[imgs]${objectIds.join(',')}[imgs]`
				}
				let res = await addPost(postAddBody)
				if (res.code == 2000) {
					this.$u.toast('成功')
					uni.reLaunch({
						url:'/pages/home/home'
					})
				} else {
					this.$u.toast(res.msg)
				}
				uni.hideLoading()
			},
			toChooseCircle() {
				uni.navigateTo({
					url: '/pages/post/add-post/choose-circle'
				})
			},
			toChooseTopic() {
				uni.navigateTo({
					url: `/pages/post/add-post/choose-topic?chooseListJson=${JSON.stringify(this.topicList)}`
				})
			},
			clickEmoji(emoji) {
				this.content += emoji
			},
		}
	};
</script>

<style lang="scss" scoped>
	.page-container {
		padding: 48rpx;
		padding-top: 44px;
		box-sizing: border-box;
	}

	.content-display {
		width: 100%;
		min-height: 200rpx;
		margin: 20rpx 0;
	}

	/deep/.u-upload__button {
		background-color: var(--color-eee-ddd);
		border-radius: 16rpx;
		.uicon-camera-fill {
			color: var(--color-555) !important;
		}
	}

	.choose {
		margin: 50rpx 0;
	}

	.choose-item {
		font-size: 28rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 32rpx 20rpx;
		width: 100%;
		border-bottom: .8px solid var(--color-ccc);
		box-sizing: border-box;
		
		
		&:last-child {
			border: 0;
		}

		.left {
			.title {
				padding-left: 20rpx;
			}
		}

		.right {
			margin-left: auto;
		}
		
		.emoji-section {
			width: 100%;
			padding: 12rpx 0;
			.emoji {
				display: flex;
				flex-direction: column;
				.emoji-row {
					display: flex;
					justify-content: space-around;
					.emoji-item {
						font-size: 20px;
						padding: 4px 6px;
						margin: 4px;
						background-color: var(--color-eee-ddd);
						border-radius: 20rpx;
						&:active {
							background-color: var(--color-ddd);
						}
					}
				}
			}
		}
	}

	.active {
		font-size: 22rpx;
		padding: 4rpx 12rpx;
		background-color: #eaeaea;
		border: 1px solid #ddd;
		box-sizing: border-box;
		border-radius: 8rpx;
		margin-right: 8rpx;
		color: black;
		min-width: 3em;
	}

	.button-style {
		color: #F4F4F5;
	}
	.btn {
		border-radius: 12rpx;
		font-size: 30rpx;
		padding: 8rpx 14rpx;
		color: white;
		background-color: var(--color-primary);
	}
</style>
