// 动态
const base = '/comment'

// 查询
export const getCommentList = (commentQueryRequest) => {
	return uni.$$post(`${base}/page`, commentQueryRequest)
}

// 查询单条评论
export const getCommentById = (commentId) => {
	return uni.$$get(`${base}/${commentId}`)
}
	
// 查询某个动态的评论
export const getCommentPage = (commentQueryRequest) => {
	return uni.$$post(`${base}/page/of/post`,commentQueryRequest)
}	

// 查询登录用户的评论
export const getCommentOfMe = (PageRequest) => {
	return uni.$$post(`${base}/page/of/me`,PageRequest)
}	
	
// 查询回复
export const getReplyPage = (commentQueryRequest) => {
	return uni.$$post(`${base}/page/of/comment`,commentQueryRequest)
}	

// 添加评论
export const addComment = (CommentAddRequest) => {
	return uni.$$post(`${base}`, CommentAddRequest)
}

// 更新评论
export const updateComment = (CommentUpdateRequest) => {
	return uni.$$put(`${base}`, CommentUpdateRequest)
}

// 删除评论
export const deleteComment = (id) => {
	return uni.$$delete(`${base}/${id}`)
}

// 点赞评论
export const thumbComment = (commentId) => {
	return uni.$$get(`${base}/thumb/${commentId}`)
}

// 取消点赞评论
export const cancelThumbComment = (commentId) => {
	return uni.$$get(`${base}/cancelThumb/${commentId}`)
}
