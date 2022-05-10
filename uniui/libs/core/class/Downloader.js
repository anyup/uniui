/**
 * 下载类
 * @author qiaomingxing
 */
class Builder {
	constructor(url) {
		this.url = url
		this.tempFilePath = null
	}

	start({ success, fail, progress }) {
		if (this.tempFilePath) {
			progress(100)
			return success(this.tempFilePath)
		}
		let percent = 0
		uni.downloadFile({
			url: this.url,
			success: (res) => {
				if (res.statusCode === 200) {
					progress(100)
					this.tempFilePath = res.tempFilePath
					success(res.tempFilePath)
				} else {
					fail()
				}
			},
			fail: (e) => {
				fail(e)
			}
		}).onProgressUpdate((res) => {
			if (percent !== res.progress) {
				percent = res.progress
				progress(res.progress)
			}
		});
	}
}
// 下载基类
class Downloader {
	static Builder = Builder
	constructor() { }
}

export { Downloader }
