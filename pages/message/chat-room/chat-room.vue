<template>
	<view class="page-container" :data-theme="theme">
		<u-navbar :title="sendUserName" bgColor="var(--bg-color)" autoBack rightIcon="more-dot-fill" @rightClick="showActionSheetEvent()" />
		<scroll-view class="msg-list" v-if="messageList.length>0" @click="closeBottomMenu()" scroll-y  :scroll-into-view="scrollToView" 
			refresher-enabled refresher-background="rgba(244, 244, 244, 1)" @refresherrefresh="refresherrefresh" :refresher-triggered="loadingNextPage">
			<view class="status-bar-height"></view>
			<view class="nav-bar-height"></view>
			<!-- 消息列表 -->
			<view v-for="(item,index) in messageList" class="msg-item" :class="{'msg-item-me':userInfo.userId==item.user.userId}" :id="'msg-'+item.id" :key="item.id">
				<text class="datetime">{{showMsgTime(index)}}</text>
				<view class="msg-body">
					<view class="user-avatar" @click="toPersonDetail(item.user.userId)">
						<u-avatar size="38" :src="item.user.avatar"/>
					</view>
					<view class="msg">
						<text class="user-name">{{item.user.sname}}</text>
						<!-- 文字消息 -->
						<view v-if="item.type==0" class="msg-content msg-content-text">{{item.content}}</view>
						<!-- 图片消息 -->
						<view v-if="item.type==1" class="msg-content msg-content-img">
							<u--image @click="clickMsgImg(item.content)" :src="item.content" :fade="false" mode="aspectFill"/>
						</view>
					</view>
				</view>
			</view>
			<!-- 填充底部菜单高度 -->
			<view class="safe-height safe-bottom-height" id="msg-bottom" :style="{height: bottomMenuHeight+10+'px'}"/>
		</scroll-view>
		<!-- 菜单选项 -->
		<actionSheet :show="showActionSheet" :actions="actionList" @close="showActionSheet=false" @select="actionSelect" />
		
		<!-- 添加消息区域 -->
		<view class="page-bottom" id="page-bottom">
			<view class="send-section">
				<input v-model="sendMsgValue" class="uni-input send-input" :adjust-position="true" cursor-spacing="30"/> 
				<!-- 表情按钮 -->
				<view class="input-card" @click="showBottomMenuEven('showEmoji')" :class="{'card-active':bottomShowSwitch.showEmoji}">
					😀
				</view>
				<!-- 附件按钮 -->
				<view v-show="sendMsgValue==''" :class="{popIn:sendMsgValue!='','card-active':bottomShowSwitch.showAttachment}"  class="input-card" @click="showBottomMenuEven('showAttachment')" >
					<u-icon name="plus-circle" size="20"></u-icon>
				</view>
				<!-- 发送按钮 -->
				<view v-show="sendMsgValue!=''" :class="{popIn:sendMsgValue!=''}" class="input-card send-btn" @click="sendTextMsg()">
					发送
				</view>
			</view>
			<!-- 底部菜单 -->
			<view v-show="showBottomMenu" class="menu-section">
				<!-- 表情 -->
				<view v-show="bottomShowSwitch.showEmoji" class="emoji">
					<view v-for="(emojiRow,i1) in emojiList" :key="i1" class="emoji-row">
						<view v-for="(emoji,i2) in emojiRow" :key="i2" class="emoji-item" @click="clickEmoji(emoji)">
							{{emoji}}
						</view>
					</view>
				</view>
				<!-- 附件 -->
				<view v-show="bottomShowSwitch.showAttachment" class="attach">
					<view class="attach-row">
						<view class="attach-item" @click="sendPhoto()">
							<u-icon name="photo" size="32" color="#000"/>
							<text>图片</text>
						</view>
					</view>
				</view>
			</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {sendMessage,messagePage,readAll} from '@/api/message.js'
	import {addBlock,deleteBlock,isBlocked} from '@/api/block.js'
	import {mapActions,mapState} from 'vuex';
	import actionSheet from '@/components/action-sheet/action-sheet.vue'
	export default {
		components: {
			actionSheet
		},
		data() {
			return {
				sendUserId: 1,
				sendUserName: '',
				chatItemIndex: 0,
				messageList: [],
				scrollToView:null,
				emojiList: [
					['😀','😅','☺️','🤣','😆','😗️','😙️'],
					['😘️','☺️','🤗','🤔','😏','🥳️','🤤️'],
					['😁','😎','😋️','🤔','🤩','🙂','🥲️'],
					['😢','😭','😩️','🙄','😶','🤨️','😐'],
					['😡','😤','😖️','😞','🤐','😯','😫'],
					['😪','😴','😔️','🤤','😒','😵️','🤡️'],
					['😱','🥵','🥶️','😳','😰','🤪','🤢️'],
					['🤬','🤧','👻️','🤮','🙃','😺','😸️'],
					['😹','😻','😼️','😽','🙀','😿','😾️'],
					['🎉','🎁','♥️','💔','🌹','🌷','⭐️'],
				],
				sendMsgValue:'',
				bottomMenuHeight: 50,
				bottomShowSwitch:{
					showEmoji: false,
					showAttachment: false,
				},
				myNo: this.$store.state.user.userInfo.no,
				loadingNextPage: false,
				isBlocked: false,
				showActionSheet: false,
				actionList: [
					{
						name: '',
						onclick: async () => {
							let res
							if (this.isBlocked) {
								res = await deleteBlock(this.sendUserId)
								this.actionList[0].name = '拉黑'
							} else {
								res = await addBlock(this.sendUserId)
								this.actionList[0].name = '取消拉黑'
							}
							this.$forceUpdate()
							this.$u.toast(res.msg)
							this.showActionSheet = false
						}
					},
					{
						name: 'TA的信息',
						onclick: () => {
							this.toPersonDetail(this.sendUserId)
						}
					}
				]
			};
		},
		async onLoad({sendUserId,sendUserName,chatItemIndex}) {
			this.sendUserId = sendUserId
			this.sendUserName = sendUserName
			this.chatItemIndex = chatItemIndex
			this.nextPage()
			this.$watch(
				() => { return this.$store.state.msg.chatItemList[this.chatItemIndex].unReadCount} ,
				(nValue, oldValue) => {  // 新来了一条消息
					if (oldValue < nValue) {
						this.reload()
						this.scrollToBottom()
						this.readAll()
					}
				}
			)
		},
		mounted() {
			uni.showLoading()
			this.scrollToBottom()
			this.readAll()
		},
		methods: {
			showMsgTime(index) { // 时间显示
				let nowMsgTime = new Date(this.messageList[index].createdTime)
				if (index == 0) return uni.$u.timeFormat(+nowMsgTime,'yyyy-mm-dd hh:MM')
				let lastMsgTime = new Date(this.messageList[index-1].createdTime)
				if (lastMsgTime.getDate() != nowMsgTime.getDate()) { // 日期不同
					return uni.$u.timeFormat(+nowMsgTime,'mm-dd hh:MM')
				}
				if (lastMsgTime.getFullYear() != nowMsgTime.getFullYear()) { // 年份不同
					return uni.$u.timeFormat(+nowMsgTime,'yyyy-mm-dd hh:MM')
				}
				let gap= 3*60*1000 // 3分钟
				return (nowMsgTime-lastMsgTime >= gap) ? uni.$u.timeFormat(+nowMsgTime,'hh:MM'):null;
			},
			refresherrefresh() { // 自定义下拉刷新被触发
				this.loadingNextPage = true
				this.nextPage(true)
			},
			async nextPage(autoScroll) { //加载下一页数据
				let page
				let size = 14;
				let length = this.messageList.length
				let tempInt = parseInt(length/size)
				page = length%size==0 ? tempInt : tempInt+1
				
				let body = {
				  "pageNum": page+1,
				  "pageSize": size,
				  "sendUserId": this.sendUserId,
				  "receiveUserId": this.userInfo.userId
				}
				let res = await messagePage(body)
				this.messageList = [ ...res.data.records.reverse(),...this.messageList ]
				if (autoScroll && res.data.records.length>=2) {
					this.$nextTick( ()=> {
						this.scrollToView = 'msg-'+this.messageList[size-2].id
					})
				}
				if (res.data.records.length==0) {
					this.$u.toast('没有更多消息了~')
				}
				setTimeout(()=>{
					this.loadingNextPage = false
				},200) 
			},

			// 发送消息
			async sendMsg(type,content){
				uni.showLoading()
				let body = {
				  "content": content,
				  "receiveUserId": this.sendUserId,
				  "type": type,
				}
				let res = await sendMessage(body)
				this.messageList.push(res.data)
				this.$u.toast('发送成功')
				this.sendMsgValue = ''
				this.scrollToBottom()
			},
			sendTextMsg(){
				this.closeBottomMenu()
				this.sendMsg(0,this.sendMsgValue)
			},
			// 发送图片消息
			sendImageMsg(url){
				this.closeBottomMenu()
				this.sendMsg(1,url)
			},
			sendPhoto() {
				// 选择图片
				uni.chooseImage({
					count: 1,  
					success: (res) => {
						uni.showLoading({title:'发送中...'})
						uni.uploadFile({
							url: this.$config.uploadImgUrl,
							filePath: res.tempFilePaths[0],
							name: 'file', 
							header:{
								"token": uni.getStorageSync('token'),
							},
							success: (res) => {
								let result = JSON.parse(res.data)
								this.sendImageMsg(result.data)
							},
							complete: () => {
								uni.hideLoading()
							}
						});
					}
				});
			},
			scrollToBottom() { // 滚动到最后一条消息
				this.scrollToView = ''
				setTimeout(()=> {
					this.scrollToView = 'msg-bottom'
				},60)
			},
			clickMsgImg(url) {
				uni.previewImage({urls:[url]})
			},
			clickEmoji(emoji) { 
				this.sendMsgValue += emoji
			},
			closeBottomMenu() { // 关闭底部所有内容
				for (let flag in this.bottomShowSwitch) {
					this.bottomShowSwitch[flag] = false
				}
			},
			showBottomMenuEven(name) { // 显示底部
				let oldFlag = this.bottomShowSwitch[name]
				this.closeBottomMenu()
				this.bottomShowSwitch[name] = !oldFlag
			},
			updateBottomHeight() {
				this.$nextTick( ()=> {
					const query = uni.createSelectorQuery()
					query.select('#page-bottom').boundingClientRect(data => {
						this.bottomMenuHeight = data.height
					}).exec();
				})
			},
			async readAll() {
				await readAll(this.sendUserId)
				this.$store.state.msg.chatItemList[this.chatItemIndex].unReadCount = 0
			},
			reload() {
				this.messageList = []
				this.nextPage()
			},
			actionSelect(index) {
				this.actionList[index].onclick();
			},
			async showActionSheetEvent() {
				this.showActionSheet = true
				let res = await isBlocked(this.sendUserId)
				this.isBlocked = res.data
				if (this.isBlocked) {
					this.actionList[0].name = '取消拉黑'
				} else {
					this.actionList[0].name = '拉黑'
				}
				
			}
		},
		computed: {
			// 计算是否显示菜单，同时更新底部高度
			showBottomMenu() {
				this.updateBottomHeight()
				for (let flag in this.bottomShowSwitch) 
					if (this.bottomShowSwitch[flag]) 
						return true	
				return false
			},
		},

		
	}
</script>

<style>
	
</style>
<style lang="scss" scoped>
$page-bottom-height: 50px;
$menu-section-height: 280px;
/deep/.u-navbar {
	.u-navbar__content {
		border-bottom: 0.5px solid var(--color-ddd);
	}
}
.page-container {
	// margin-top: var(--status-bar-height);
	// height: calc( 100vh - var(--status-bar-height) - 50px);
	height: 100%;
}
.safe-height {
	transition: height .2s;
}
.status-bar-height {
	height: var(--status-bar-height);
}
.nav-bar-height {
	height: 44px;
}
/deep/.uni-scroll-view {
	// height: calc( 100vh - 50px);
	.uni-scroll-view-refresher {
		background-color: var(--bg-color) !important;
	}
}

.msg-list {
	height: 100%;
	box-sizing: border-box;
	transition: all .3s;
	.msg-item {
		display: flex;
		flex-direction: column;
		padding: 12rpx 28rpx;
		margin: 10rpx 0;
		.datetime {
			text-align: center;
			font-size: 24rpx;
			color: var(--color-ccc);
		}
		.msg-body {
			font-size: 32rpx;
			display: flex;
			.msg {
				max-width: 62%;
				display: flex;
				flex-direction: column;
				margin: 0 32rpx;
				.user-name {
					font-size: 24rpx;
					color: #888;
				}
				.msg-content {
					max-width: 100%;
					border-radius: 18rpx;
					background-color: white;
					margin-top: 12rpx;
					overflow: hidden;
					line-height: 1.5em;
					background-color: var(--bg-card-color);
					border: 1px solid rgba(0, 0, 0, .07);
				}
				.msg-content-text {
					padding: 12rpx 20rpx;
				}
			}
		}
	}
	.msg-item-me {
		.msg-body {
			flex-direction: row-reverse;
			.msg {
				align-items: flex-end;
				.msg-content {
					color: white;
					background-color: var(--color-primary);
				}
			}
		}
	}
}
.page-bottom {
	position: fixed;
	bottom: 0;
	background-color: #eee;
	width: 100%;
	/*上方发送行*/
	.send-section {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: $page-bottom-height;
		padding: 8px 0 10px 8px;
		border-top: 1px solid var(--color-ccc);
		border-bottom: 1px solid var(--color-ccc);
		background-color: var(--bg-card-color);
		.send-input {
			flex: 1;
			background-color: var(--color-eee);
			height: 100%;
			padding: 4px;
			font-size: 30rpx;
			padding-left: 8px;
			box-sizing: border-box;
			border-radius: 20rpx;
			margin-right: 6px;
		}
		.input-card {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 38px;
			height: 100%;
			background-color: var(--color-eee);
			border-radius: 20rpx;
			margin-right: 8px;
			font-size: 16px;
		}
		.send-btn {
			width: auto;
			background-color: #19be6b;
			color: white;
			padding: 0 6px;
			font-size: 14px;
			border-radius: 20rpx;
		}
		.card-active {
			background-color: #d2e1ff;
		}
	}
	/*下方菜单模块*/
	.menu-section {
		background-color: var(--bg-card-color);
		height: $menu-section-height;
		box-sizing: border-box;
		padding: 12px 6px 48px 6px;
		overflow: auto;
		transition: height .2s;
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
					background-color: #f1f1f1;
					border-radius: 20rpx;
				}
			}
		}
		.attach {
			display: flex;
			flex-direction: column;
			.attach-row {
				height: 68px;
				display: flex;
				padding: 12px;
				.attach-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 100%;
					width: 25%;
					font-size: 9px;
					color: #666;
					.u-icon {
						background-color: #f2f2f2;
						border-radius: 20rpx;
						box-shadow: 0 0 1px 1px 1px #000;
						padding: 10px;
						margin-bottom: 1px;
					}
					
				}
			}
		}
	}
}
</style>
