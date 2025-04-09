<template>
	<view>
		<image src="../../static/logo-1.png" class="logo" mode="widthFix"></image>
		<view class="logo-title">EMOS企业在线办公系统</view>
		<view class="logo-subtitle">by TanFangJie</view>
		<button class="login-btn" open-type="getUserInfo" @tap="login()">登录系统</button>
		<view class="register-container">
			没有账号？
			<text class="register" @tap="toRegister()">立刻注册</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toRegister:function (){
				uni.navigateTo({
					url:"../register/register"
				})
			},
			login:function(){
				let that  = this
				uni.login({
					provider: 'weixin',
					success: function (resp) {
						let code = resp.code;
						let data = {
							"code" : code
						}
						that.ajax(that.url.login , "POST" , data , function(resp){
							let permission = resp.data.permission
							that.param.permission = permission
							console.log("权限列表" + permission)
							uni.switchTab({
								url:"/pages/index/index"
							})
						});
					},
					fail:function(e) {
						console.log(e);
						uni.showToast({
							icon:"none",
							title:"执行异常"
						})
					},
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("login.less");
</style>
