export function timeFormat(dateTimeStamp){
	if (dateTimeStamp==null || dateTimeStamp==undefined) {
		return ''
	}
	if (typeof(dateTimeStamp) == 'string') {
		dateTimeStamp = +new Date(dateTimeStamp)
	}
	let minute = 1000 * 60;     
	let hour = minute * 60;
	let day = hour * 24;
	let week = day * 7;
	let month = day * 30;

	let now = new Date().getTime();   //获取当前时间毫秒
	let diffValue = now - dateTimeStamp;//时间差

	if (diffValue < 0) { return; }

	let minC = diffValue / minute;  //计算时间差的分，时，天，周，月
	let hourC = diffValue / hour;
	let dayC = diffValue / day;
	let weekC = diffValue / week;
	let monthC = diffValue / month;
	let result
	if (monthC >= 1) {
	  result = "" + parseInt(monthC) + "月前";
	}
	else if (weekC >= 1) {
	  result = "" + parseInt(weekC) + "周前";
	}
	else if (dayC >= 1) {
	  result = "" + parseInt(dayC) + "天前";
	}
	else if (hourC >= 1) {
	  result = "" + parseInt(hourC) + "小时前";
	}
	else if (minC >= 1) {
	  result = "" + parseInt(minC) + "分钟前";
	} 
	else
	  result = "刚刚";
	return result;
}
