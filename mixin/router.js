
export default {
	methods: {
		back() {
			uni.navigateBack()
		},
		toCircleDetail(circleId) {
			uni.navigateTo({
				url: `/pages/circle/circle-detail/circle-detail?circleId=${circleId}`
			})
		},
		toTopicDetail(topicId) {
			uni.navigateTo({
				url: `/pages/topic/topic-detail/topic-detail?topicId=${topicId}`
			})
		},
		toFindCircle(tabIndex) {
			uni.navigateTo({
				url: `/pages/circle/find-circle/find-circle?tabIndex=${tabIndex}`
			})
		},
		toPostDetail(postId) {
			uni.navigateTo({
				url: `/pages/post/post-detail/post-detail?postId=${postId}`
			})
		},
		toCommentDetail(commmentId,postUserId,postId,focus,showToPost) {
			uni.navigateTo({
				url: `/pages/post/commentDetail/commentDetail?commentId=${commmentId}&postUserId=${postUserId}&postId=${postId}&focus=${focus}&showToPost=${showToPost}`,
				animationType: 'slide-in-bottom'
			})
		},
		toPersonDetail(uid) {
			uni.navigateTo({
				url: `/pages/profile/person-detail/person-detail?uid=${uid}`
			})
		},
		toChaoxingIndex() {
			uni.navigateTo({
				url: `/pages/chaoxing/index/index`
			})
		},
		toCourseDetail({courseId,classId}) {
			uni.navigateTo({
				url: `/pages/chaoxing/courseDetail/courseDetail?courseId=${courseId}&classId=${classId}`
			})
		},
		toChaoxingSign(body) {
			uni.navigateTo({
				url: `/pages/chaoxing/sign/sign${this.$u.queryParams(body)}`
			})
		},
		
		toAddPost(circle,topicList) {
			let body = {circle,topicList}
			uni.navigateTo({
				url: `/pages/post/add-post/add-post?data=${JSON.stringify(body)}`
			})
		},
		toLikedPostList() {
			uni.navigateTo({
				url: '/pages/post/liked-post-list/liked-post-list'
			})
		},
		toMyCommentList() {
			uni.navigateTo({
				url: '/pages/post/my-comment-list/my-comment-list'
			})
		},
		toSystemNotification() {
			uni.navigateTo({
				url: '/pages/message/system-notification/system-notification'
			})
		},
		toInteractNotification() {
			uni.navigateTo({
				url: '/pages/message/interact-notification/interact-notification'
			})
		},
		toChatRoom(sendUserId,sendUserName,chatItemIndex) {
			uni.navigateTo({
				url: `/pages/message/chat-room/chat-room?sendUserId=${sendUserId}&sendUserName=${sendUserName}&chatItemIndex=${chatItemIndex}`
			})
		},
		toSearch() {
			uni.navigateTo({
				url: `/pages/search/search`
			})
		},
		toFollowList(userId) {
			uni.navigateTo({
				url: `/pages/profile/follow-list/follow-list?userId=${userId}`
			})
		},
		toFanList(userId) {
			uni.navigateTo({
				url: `/pages/profile/fan-list/fan-list?userId=${userId}`
			})
		},
		toWebview(url,openNew=true) {
			uni.navigateTo({
				url: `/pages/webview/webview?url=${url}&openNew=${openNew}`
			})
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/profile/login/login'
			})
		},
		toPersonEdit() {
			uni.navigateTo({
				url: '/pages/profile/person-edit/person-edit'
			})
		},
		toSetting() {
			uni.navigateTo({
				url: '/pages/setting/index/index'
			})
		},
		toUserActive() {
			uni.navigateTo({
				url: '/pages/profile/user-active/user-active'
			})
		},
		
		// 
		toClassTable() {
			uni.navigateTo({
				url: '/pages/school/class-table/class-table'
			})
		},
		toScore() {
			uni.navigateTo({
				url: '/pages/school/score/score'
			})
		},
		toCoinRecord() {
			uni.navigateTo({
				url: '/pages/profile/coin-record/coin-record'
			})
		},
		toDownload() {
			uni.navigateTo({
				url: '/pages/download/download'
			})
		}
	}
}