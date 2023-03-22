<template>
	<view>
		<web-view :src="url">
		</web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			};
		},
		onLoad({url,openNew}) {
			this.url = url;
			if (openNew=='true' || openNew==null || openNew=='' || openNew=='undefined') {
				// #ifdef H5
					window.open(url)
					uni.navigateBack()
				// #endif
			}
		}
	}
</script>

<style lang="scss">
</style>
