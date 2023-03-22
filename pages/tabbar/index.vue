<!-- tabbar首页面 -->
<template>
	<view>
		<view class="main">
			<Home v-show="pageIndex==0"/>
			<Square v-show="pageIndex==1"/>
			<Message v-show="pageIndex==2"/>
			<Profile v-show="pageIndex==3"/>
		</view>
		<u-tabbar :value="pageIndex" @change="index => pageIndex = index" class="tabbar">
			<u-tabbar-item v-for="page in pageList" :text="page.text" :icon="page.icon" :badge="page.badge" />
		</u-tabbar>
	</view>
</template>

<script>
	import Home from '@/pages/home/home.vue';
	import Square from '@/pages/square/square.vue';
	import Message from '@/pages/message/message.vue';
	import Profile from '@/pages/profile/profile.vue';
	export default {
		components:{
			Home,Square,Message,Profile
		},
		data() {
			return {
				pageIndex:0,
				pageList: [
					{text: '首页',icon: 'home'},
					{text: '广场',icon: 'order'},
					{text: '信息',icon: 'grid', badge: 0},
					{text: '我的',icon: 'account'},
				],
			}
		},
		onReachBottom(){
			console.log('tabbar onReachBottom');
		},
		mounted() {
			
		},
	}
</script>

<style>
	
</style>
<style lang="scss" scoped>
.main {
	// height: 100vh;
	border: 1px solid red;
	overflow: auto;
}
</style>
