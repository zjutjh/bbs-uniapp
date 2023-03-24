<template>
    <view :show="show">
		<InfoPopup :show="show" title="⭐更新通知" mode="bottom" :okText="okText" @submit="downWgt()" @cancel="show=false">
			<view slot="bottom">
				<view class="detail space-pre-wrap" v-if="res.code">
					{{res.data.detail}}
				</view>
				<view class="bottom" v-if="schedule.progress">
					<u-line-progress :percentage="schedule.progress" activeColor="#4B86FE"></u-line-progress>
					<view class="down-prog">{{schedule.totalBytesWritten}}/{{schedule.totalBytesExpectedToWrite}}</view>
				</view>
			</view>
		</InfoPopup>
    </view>
</template>

<script>
import {updateApp} from '@/api/system.js'
import filters from '@/common/filters.js'
import InfoPopup from '@/components/info-pupup/info-pupup.vue'
export default {
	name: 'update',
	components: {
		InfoPopup
	},
    data() {
        return {
            versionNum:'',
            schedule:{},
            downloadTask:null,
            time:10,
            isCheck:false,
			version: null,
			show: false,
			res: {} // 调用更新接口返回的结果
        };
    },
	computed: {
		okText() {
			if (this.res.code)
				return '更新 '+ filters.sizeMB(this.res.data.size)
			return ''
		}
	},
	mounted() {
		this.version = this.$config.appVersion
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=> {
		    this.version = widgetInfo.version;
		});
		console.log('当前版本：'+this.version);
		this.checkWgtFun()
		// #endif
	},
    methods:{
        // 检查补丁更新
        checkWgtFun() {
            updateApp().then(res => {
				let result = res.data.version
				if(this.version.substr(0, 3) * 1 > result.substr(0, 3) * 1){
					if(this.verShow){
						this.$toast('当前为最新版本');
					}
					return
				} 
				if(this.version.replace(/\./g, "") * 1 >= result.replace(/\./g, "") * 1){
					if(this.verShow){
						this.$toast('当前为最新版本');
					}
					return
				}
				this.show = true
				this.res = res
            })
        },
        // 下载补丁
        downWgt() {
            let _this=this
            this.downloadTask = uni.downloadFile({
                url:_this.res.data.url,
                success: (downloadResult) => {
                    if (downloadResult.statusCode === 200) {  
                        plus.runtime.install(downloadResult.tempFilePath, {force: true}, ()=> {
                            plus.nativeUI.toast('最新版本下载完成')
                            plus.runtime.restart();  
                        }, (e)=> { 
                            plus.nativeUI.toast("失败:"+e.message)
                        });  
                    }
                },
                fail: (err) => {
                    plus.nativeUI.toast("补丁下载失败")
                }
            })
            this.downloadTask.onProgressUpdate((res) => {
                // 当前下载进度
                if(this.time%10==0){
                    this.schedule=res
                    this.schedule.totalBytesExpectedToWrite=filters.sizeMB(res.totalBytesExpectedToWrite)
                    this.schedule.totalBytesWritten=filters.sizeMB(res.totalBytesWritten)
                }
                this.time+=1
            });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>