import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

//声明全局路径
let baseUrl = "http://localhost:8080"
Vue.prototype.url = {
	register : baseUrl + "/user/register",
	login : baseUrl + "/user/login"
}

//声明ajex统一处理方法
Vue.prototype.ajax = function(url , method , data , fun) {
	console.log(url);
	console.log(method);
	console.log(data);
	uni.request({
		"url":url,
		"method":method,
		"data":data,
		"header": {
			"token" :  uni.getStorage("token")
		},
		success:function(resp){
			console.log("登录成功")
			if(resp.statusCode == 401){
				uni.redirectTo({
					url:"/pages/login/login"
				})
			} else if (resp.statusCode == 200 && resp.data.code == 200 ){
				let data = resp.data
				if (data.hasOwnProperty("token")){
					let token = data.token
					console.log(token)
					uni.setStorage("token" , token)
				}
				fun(resp)
			} else {
				uni.showToast({
					icon:"none",
					title:resp.data
				})
			}
		}
		
	})
}

