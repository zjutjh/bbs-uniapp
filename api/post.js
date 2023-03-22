// 动态
const base = '/post'


// 查询
export const getPostList = (postQueryRequest) => {
	return uni.$$post(`${base}/list/page`, postQueryRequest)
}

// 查询某个动态
export const getPostVoById = (postId) => {
	return uni.$$get(`${base}/${postId}`)
}


// 获取关注用户的动态
export const getFollowUserPostPage = ({max, offset,count}) => {
	return uni.$$get(`${base}/of/followUser?max=${max}&offset=${offset}&count=${count}`)
}
	
// 获取TOP10
export const getTop10 = () => {
	return uni.$$get(`${base}/top10`)
}

// 获取当前用户加入圈子的动态
export const getCirclePostPage = ({max, offset,count}) => {
	return uni.$$get(`${base}/of/circle?max=${max}&offset=${offset}&count=${count}`)
}	

// 获取某用户的动态
export const getPostListByUid = (postQueryRequest) => {
	return uni.$$post(`${base}/of/user`,postQueryRequest)
}

// 话题下的动态列表
export const postListByTopic = (PostQueryByTopicRequest) => {
	return uni.$$post(`${base}/of/topic`,PostQueryByTopicRequest)
}	

// 点赞动态列表
export const postListOfLiked = (ScoreRequest) => {
	return uni.$$post(`${base}/of/liked`,ScoreRequest)
}	

// 添加动态
export const addPost = (postAddRequest) => {
	return uni.$$post(`${base}`, postAddRequest)
}

// 更新动态
export const updatePost = (postUpdateRequest) => {
	return uni.$$put(`${base}`, postUpdateRequest)
}
// 增加浏览量
export const addReadCount = (postId) => {
	return uni.$$put(`${base}/addCount/${postId}`)
}

// 删除动态
export const deletePost = (id) => {
	return uni.$$put(`${base}/${id}`)
}


// 点赞评论
export const thumbPost = (postId) => {
	return uni.$$get(`${base}/thumb/${postId}`)
}

// 取消点赞评论
export const cancelThumbPost = (postId) => {
	return uni.$$get(`${base}/cancelThumb/${postId}`)
}

// ====== 数据

// 关注用户未读动态数
export const unReadCountOfFollowPerson = () => {
	return uni.$$get(`${base}/unReadCount/followPerson`)
}

// 加入圈子的未读消息数
export const unReadCountOfJoinCircle = () => {
	return uni.$$post(`${base}/unReadCount/circle/list`)
}

// 清空圈子未读数
export const readAllOfCircle = (circleId) => {
	return uni.$$get(`${base}/readAll/circle/${circleId}`)
}
// 清空关注用户动态未读数
export const readAllOfFollowPerson = () => {
	return uni.$$get(`${base}/readAll/followPerson`)
}


// ==== end 数据




