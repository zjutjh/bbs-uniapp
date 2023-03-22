<template>
	<view class="aa">
		<web-view src="http://localhost:8080/#/"></web-view>
	</view>
</template>

<script>
	export default {
		created(e) {
		}
	}
</script>

<style lang="scss">
	.aa {
		position: fixed;
		top: 0;
		bottom: 0;
		height: 100%;
		overflow: scroll;
	}
</style>