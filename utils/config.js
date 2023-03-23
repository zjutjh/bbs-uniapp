const appName = "工大论坛"; //分享时的标题
const h5Url = "http://zjut.xgcode.cn/#/"; // 前端页面

// api接口地址配置
// const baseUrl = "localhost:8080"; // 本地测试
const baseUrl = "www.xgcode.cn:8090"; // 上线
// const baseUrl = "902e207.r8.cpolar.top"; // 内网穿透

const domain = `http://${baseUrl}/`; 
const domainNoLine = `http://${baseUrl}`; 
const uploadImgUrl = `http://${baseUrl}/file/uploadImg` // 上传帖子图片，头像
// const webSocketUrl = `ws://${baseUrl}/websocket?token=`


const downloadUrl = h5Url + 'pages/download/download'  // 软件的下载地址或网页地址（分享软件时需要）
const downloadPosterUrl = 'http://cdn.xgcode.cn/zjutLive/system/zjut-live-poster-two.png' // 软件宣传海报图片


export default {
	baseUrl: baseUrl,
	domain: domain,
	domainNoLine,
	appName: appName,
	h5Url: h5Url,
	downloadUrl,
	downloadPosterUrl,
	uploadImgUrl,
	// webSocketUrl
}
