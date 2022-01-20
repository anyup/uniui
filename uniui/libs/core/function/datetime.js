export function formatTime(timestamp = null, fmt = 'yyyy-MM-dd') {
	// 其他更多是格式化有如下:
	// yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
	timestamp = parseInt(timestamp)
	// 如果为null,则格式化当前时间
	if (!timestamp) timestamp = Number(new Date())
	// 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
	if (timestamp.toString().length == 10) timestamp *= 1000
	let date = new Date(timestamp)
	let ret
	let opt = {
		'y+': date.getFullYear().toString(), // 年
		'M+': (date.getMonth() + 1).toString(), // 月
		'd+': date.getDate().toString(), // 日
		'h+': date.getHours().toString(), // 时
		'm+': date.getMinutes().toString(), // 分
		's+': date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	}
	for (let k in opt) {
		ret = new RegExp('(' + k + ')').exec(fmt)
		if (ret) {
			fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
		}
	}
	return fmt
}

/**
* 时间戳转为多久之前
* @param String timestamp 时间戳
* @param String | Boolean format 如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；
* 如果为布尔值false，无论什么时间，都返回多久以前的格式
*/
export function pastTime(timestamp = null, format = 'yyyy-MM-dd') {
	if (timestamp == null) timestamp = Number(new Date())
	timestamp = parseInt(timestamp)
	// 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
	if (timestamp.toString().length == 10) timestamp *= 1000
	var timer = new Date().getTime() - timestamp
	timer = parseInt(timer / 1000)
	// 如果小于5分钟,则返回"刚刚",其他以此类推
	let tips = ''
	switch (true) {
		case timer < 300:
			tips = '刚刚'
			break
		case timer >= 300 && timer < 3600:
			tips = parseInt(timer / 60) + '分钟前'
			break
		case timer >= 3600 && timer < 86400:
			tips = parseInt(timer / 3600) + '小时前'
			break
		case timer >= 86400 && timer < 2592000:
			tips = parseInt(timer / 86400) + '天前'
			break
		default:
			// 如果format为false，则无论什么时间戳，都显示xx之前
			if (format === false) {
				if (timer >= 2592000 && timer < 365 * 86400) {
					tips = parseInt(timer / (86400 * 30)) + '个月前'
				} else {
					tips = parseInt(timer / (86400 * 365)) + '年前'
				}
			} else {
				tips = formatTime(timestamp, format)
			}
	}
	return tips
}

export function getDate(day = 0, fmt = 'yyyy-MM-dd') {
	var d = new Date()
	var t = d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * Number(day))
	return formatTime(t, fmt)
}
