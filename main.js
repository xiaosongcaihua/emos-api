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
	login : baseUrl + "/user/login",
	checkin: baseUrl + "/checkin/checkin",
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	searchTodayCheckin: baseUrl + "/checkin/searchTodayCheckin",
	searchUserSummary: baseUrl + "/user/searchUserSummary"
}
Vue.prototype.param = {
	token : "",
	permission : "",
}
Vue.prototype.checkPermission = function(perms) {
	let permission = this.param.permission
	let result = false;
	for (let one of perms) {
		if (permission.indexOf(one) != -1) {
			result = true;
			break;
		}
	} 
	return result;
}

//声明ajex统一处理方法
Vue.prototype.ajax = function(url , method , data , fun) {
	let that = this
	console.log(url);
	console.log(method);
	console.log(data);
	console.log(that.param.token)
	uni.request({
		"url":url,
		"method":method,
		"data":data,
		"header": {
			"token" :  that.param.token
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
					that.param.token = token
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

