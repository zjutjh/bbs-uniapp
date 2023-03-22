export function parseContent(content) {
	let regs = [
		{
			// 处理九宫格图片 [imgs]视频直链[/imgs]
			reg: /([/s/S]*)\[imgs\]([\s\S]*?)\[\/imgs\]([/s/S]*)/g,
			target: '<video poster controls src="$2"></video>',
		},
	]
	let result = content
	for (let i = 0; i < regs.length; ++i) {
		result = result.replace(regs[i].reg, regs[i].target)
	}
	return result
	parseContent(content) {
		let reg = /([\s\S]*?)\[imgs\]([\s\S]*?)\[imgs\]/g
		let arr = reg.exec(content)
		this.imageList = arr[2].split(',')
		return content.replace(reg,'$1')
	}
}
