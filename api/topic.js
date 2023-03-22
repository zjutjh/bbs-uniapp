// 圈子种类
const base = '/topic'

// 查询单个
export const getTopicById = (topicId) => {
	return uni.$$get(`${base}/${topicId}`)
}

// 查询热门话题
export const getHotTopicList = (count = 10) => {
	return uni.$$get(`${base}/list/hot/${count}`)
}

// 查询最新话题
export const getNewTopicList = (count = 50) => {
	return uni.$$get(`${base}/list/new/${count}`)
}

// 分页查询话题
export const getTopicPage = (body) => {
	return uni.$$post(`${base}/list/page`,body)
}
// 查询推荐话题
export const getRecommendTopicList = (count = 10) => {
	return uni.$$get(`${base}/list/recommend/${count}`)
}

