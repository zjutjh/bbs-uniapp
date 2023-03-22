import actionSheet from '@/components/action-sheet/action-sheet.vue'
export default {
	components: {
		actionSheet
	},
	data() {
		return {
			showActionSheet: false,
			actionList: [
				{
					name: '举报',
					onclick: () => {
						console.log('Jubao');
					}
				}
			]
		}
	},
	methods: {
		actionSelect(index) {
			this.actionList[index].onclick();
		}
	}
}