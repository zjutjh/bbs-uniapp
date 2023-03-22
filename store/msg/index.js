import {
	ChatItemList,deleteChatItem
} from '@/api/message.js'
import {
	systemNotificationItem,
	interactNotificationItem,
	readAllOfInteract,
	readAllOfSystem
} from '@/api/notification.js'
import Vue from 'vue';

const state = {
	chatItemList: [],
	systemItem: {},
	interactItem: {},
	chatInterval: 5000,
	systemInterval:6000 & 5,
	interactInterval: 6000 * 1,
	chatTimeout: null,
	systemTimeout: null,
	interactTimeout: null,
	filter: {
		chatIds: [],
		interactIds: [],
		systemIds: []
	}
}
const mutations = {
	CHANGE_CHAT_INTERVAL(state) {
		if (state.chatItemList.length==0 || state.chatItemList[0]==undefined) { // 没有聊天记录
			state.chatInterval = 60000 * 15 // 60分钟
			return 
		}
		let lastDate = +new Date(state.chatItemList[0].lastMessage.createdTime)
		let nowDate = +new Date()
		let gap = (nowDate - lastDate)
		let flag
		if ( gap/(60000*60*24) > 1) { // 最新聊天记录大于1天
			state.chatInterval = 60000 * 20 
			flag = '最新聊天记录大于1天'
		}
		else if ( gap/(60000*60) > 12) { // 最新聊天记录大于12小时
			state.chatInterval = 60000 * 15 
			flag = '最新聊天记录大于'
		}
		else if ( gap/(60000*60) > 1) { // 最新聊天记录大于1小时
			state.chatInterval = 60000 * 10 
			flag = '最新聊天记录大于1小时'
		}
		else if ( gap/60000 > 30) { // 最新聊天记录大于30分钟
			state.chatInterval = 60000 * 3
			flag = '最新聊天记录大于30分钟'
		}
		else if ( gap/60000 > 10) { // 最新聊天记录大于10分钟
			state.chatInterval = 60000 * 1
			flag = '最新聊天记录大于10分钟'
		}
		else if ( gap/60000 > 3) { // 最新聊天记录大于3分钟
			state.chatInterval = 60000 * 0.5
			flag = '最新聊天记录大于3分钟'
		}
		else { // 最新聊天记录小于3分钟
			state.chatInterval = 5000  
			flag = '最新聊天记录小于3分钟'
		}
		// console.log("chat: " + flag + " " + state.chatInterval);
	},
	CHANGE_SYSTEM_INTERVAL(state) {
		state.systemInterval = 60000 * 5
	},
	CHANGE_INTERACT_INTERVAL(state) {
		if (state.interactItem==null || JSON.stringify(state.interactItem)=='{}') { // 没有互动通知
			state.interactInterval = 60000 * 12 
			return 
		}
		let lastDate = +new Date(state.interactItem.date)
		let nowDate = +new Date()
		let gap = (nowDate - lastDate)
		let flag
		if ( gap/(60000*60*24) > 1) { // 最新记录大于1天
			state.interactInterval = 60000 * 10 
			flag = '最新记录大于1天'
		}
		else if ( gap/(60000*60) > 12) { // 最新记录大于12小时
			state.interactInterval = 60000 * 8 
			flag = '最新记录大于12小时'
		}
		else if ( gap/(60000*60) > 1) { // 最新记录大于1小时
			state.interactInterval = 60000 * 5
			flag = '最新记录大于1小时'
		}
		else if ( gap/60000 > 10) { // 最新记录大于10分钟
			state.interactInterval = 60000 * 2
			flag = '最新记录大于10分钟'
		}
		else if ( gap/60000 > 1){ // 最新记录大于1分钟
			state.interactInterval = 60000 * 1
			flag = '最新记录小于1分钟'
		}
		else { // 最新记录小于1分钟
			state.interactInterval = 60000 * 0.5
			flag = '最新记录小于0.5分钟'
		}
		// console.log("interact: " + flag+ " " + state.interactInterval);
	}
}

const actions = {
	ListenChat({commit,state}) {
		state.chatTimeout = setTimeout( () => {
			this.dispatch('msg/UpdateChatItemList') // 网络请求
			this.commit('msg/CHANGE_CHAT_INTERVAL') // 修改间隔时间
			this.dispatch('msg/ListenChat') // 重新运行自己
		}, state.chatInterval)
	},
	ListenSystem({commit,state}) {
		state.systemTimeout = setTimeout( () => {
			this.dispatch('msg/UpdateSystemNotification') // 网络请求
			this.commit('msg/CHANGE_SYSTEM_INTERVAL') // 修改间隔时间
			this.dispatch('msg/ListenSystem') // 重新运行自己
		}, state.systemInterval)
	},
	ListenInteract({commit,state}) {
		state.interactTimeout = setTimeout( () => {
			this.dispatch('msg/UpdateInteractNotification') // 网络请求
			this.commit('msg/CHANGE_INTERACT_INTERVAL') // 修改间隔时间
			this.dispatch('msg/ListenInteract') // 重新运行自己
		}, state.interactInterval)
	},
	UpdateAll({commit,state}) {
		this.dispatch('msg/UpdateChatItemList')
		this.dispatch('msg/UpdateInteractNotification')
		this.dispatch('msg/UpdateSystemNotification')
	},
	async UpdateChatItemList({commit,state}) {
		let data = (await ChatItemList()).data
		Vue.set(state, 'chatItemList', data)
		if (data!=null && data.length!=0 && data[0].unReadCount!=0) { // 有新的聊天通知
			// 重置间隔时间 监听
			clearTimeout(state.chatTimeout)
			state.chatInterval = 5000
			this.dispatch('msg/ListenChat')
			// console.log('新的聊天通知,重置chat ' + 5000);
			
			let filteredList = state.filter.chatIds
			if (filteredList.length!=0 && filteredList.indexOf(data[0].lastMessage.id) != -1) { // 该消息已被过滤
				return
			}
			else {
				state.filter.chatIds.push(data[0].lastMessage.id)
				var pages = getCurrentPages()
				if (pages[pages.length - 1].route == 'pages/message/chat-room/chat-room'
					||pages[pages.length - 1].route == 'pages/message/message') {
							return
				}
				// uni.createPushMessage({
				// 	title: data[0].user.nickName,
				// 	content: data[0].lastMessage.content,
				// 	icon: '_'+data[0].user.avatar,
				// })
				uni.vibrateLong()
			}
		}
		
	},
	async UpdateSystemNotification({commit,state}) {
		let data = (await systemNotificationItem()).data
		Vue.set(state, 'systemItem', data)
		if (data!=null && data.unReadCount!=null && data.unReadCount!=0) { // 有新的系统通知
			// 重置间隔时间 监听
			// console.log('新的系统通知,重置系统 ' + 60000*5);
			clearTimeout(state.systemTimeout)
			state.systemInterval = 60000 * 5
			this.dispatch('msg/ListenSystem')

			let filteredList = state.filter.systemIds
			let dateId = +new Date(data.date)
			if (filteredList.length!=0 && filteredList.indexOf(dateId) != -1) { // 该消息已被过滤
				return
			}
			else {
				state.filter.systemIds.push(dateId)
				var pages = getCurrentPages()
				if (pages[pages.length - 1].route == 'pages/message/chat-room/chat-room'
					||pages[pages.length - 1].route == 'pages/message/message') {
							return 
				}
				// uni.createPushMessage({title: "系统通知",content: data.title})
				uni.vibrateLong()
			}
		}
	},
	async UpdateInteractNotification({commit,state}) {
		let data = (await interactNotificationItem()).data
		Vue.set(state, 'interactItem', data)
		if (data!=null && data.unReadCount!=null && data.unReadCount!=0) { // 有新的互动通知
			// console.log('新的互动通知,重置互动 '+60000);
			// 重置间隔时间 监听
			clearTimeout(state.interactTimeout)
			state.interactInterval = 60000 * 1
			this.dispatch('msg/ListenInteract')
			
			let filteredList = state.filter.interactIds
			let dateId = +new Date(data.date)
			if (filteredList.length!=0 && filteredList.indexOf(dateId) != -1) { // 该消息已被过滤
				return
			}
			else {
				state.filter.interactIds.push(dateId)
				var pages = getCurrentPages() 
				if (pages[pages.length - 1].route == 'pages/message/chat-room/chat-room'
					||pages[pages.length - 1].route == 'pages/message/message') {
							return
				}
				// uni.createPushMessage({title: "互动通知",content: data.title})
				uni.vibrateLong()
			}
			
		}
	},
	DeleteChatItem({commit,state},{userId,index}) {
		let data = state.chatItemList
		data.splice(index,1)
		Vue.set(state, 'chatItemList', data)
		deleteChatItem(userId)
	},
	ReadAllOfSystem({commit,state}) {
		readAllOfSystem()
		Vue.set(state.systemItem, 'unReadCount', 0)
	},
	ReadAllOfInteract({commit,state}) {
		readAllOfInteract()
		Vue.set(state.interactItem, 'unReadCount', 0)
	}
}

const getters = {
	unReadCountSum(state) {
		let sum = 0;
		for (let chatItem of state.chatItemList) {
			sum += chatItem.unReadCount
		}
		if (state.systemItem!=null && state.systemItem.unReadCount!=undefined) {
			sum += state.systemItem.unReadCount
		}
		if (state.interactItem != null && state.interactItem.unReadCount!=undefined) {
			sum += state.interactItem.unReadCount
		}
		return sum
	}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
