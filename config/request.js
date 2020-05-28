export default class request {
	constructor(options) {
		//请求公共地址
		this.baseUrl = options.baseUrl || "";
		//公共文件上传请求地址
		this.fileUrl = options.fileUrl || "";
		//默认请求头
		this.headers = options.headers || {};
		this.websocketUrl = options.websocket
		this.loading = true;

	}
	setLoading(boo){
		this.loading = boo
	}
	get(url = '', data = {}, options = {}){
		
		return this.ajax("GET",url, data, options)

	}
	post(url = '', data = {}, options = {}){
		return this.ajax("POST",url, data, options)
	}
	put(url = '', data = {}, options = {}){
		return this.ajax("PUT",url, data, options)
	}
	delete(url = '', data = {}, options = {}){
		return this.ajax("DELETE",url, data, options)
	}
	uploudFile(url, file){
		return new Promise((resolve, reject) =>{
			let  Authorization=uni.getStorageSync('token');
			uni.uploadFile({
				url:  this.baseUrl + url, //仅为示例，非真实的接口地址
				filePath: file.path,
				header:{
					Authorization
				},
				file:file,
				name: 'file',
				success: (res) => {
					resolve(res.data)
				},
		            fail: (err) => {
						console.log(err)
		                reject(err)
		            }
			})
		})

	}
	async websocket(method="GET", url = '', data = {}, options = {}){
		this.headers.Authorization=uni.getStorageSync('token');
		let h = Object.assign({...this.headers},options)
			var socketTask =await uni.connectSocket({
			    url: this.websocketUrl + url,
			    data() {
			        return {
			            x: '',
			            y: ''
			        };
			    },
			    header: {
					...h
			    },
			    method: method,
				success:()=>{
					 console.log('WebSocket连接已打开！')
				}
			});
			return socketTask
	
	}
	
	ajax(method="GET", url = '', data = {}, options = {}){
		this.headers.Authorization=uni.getStorageSync('token');
		let h = Object.assign({...this.headers},options)
		return new Promise((resolve, reject) => {
				if(this.loading){
					uni.showLoading({
						title: '加载中'
					});
				}
		        uni.request({
		            url: this.baseUrl + url,
					data: data,
					method: method,
					dataType:"json",
					header:{
						...h
					},
		            success: (res) => {
		                resolve(res.data);
		            },
		            fail: (err) => {
						console.log(err)
		                reject(err)
		            },
					complete: () => {
						if(this.loading){
							uni.hideLoading();	
						}
						
					}
		        });
		    })
	}
}
