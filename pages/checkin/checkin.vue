<template>
	<view>
		<camera device-position="back" flash="on" class="camera" @error="error" v-if="showCamera"></camera>
		<image mode="widthFix" class="image" :src="photoPath" v-if="showImage"></image>
		<view class="operate-container">
			<button type="primary" class="btn" @tap="clickBtn" :disabled="!canCheckin">{{ btnText }}</button>
			<button type="warn" class="btn" @tap="afresh" :disabled="!canCheckin">重拍</button>
		</view>
		<view class="notice-container">
			<text class="notice">注意事项</text>
			<text class="desc">拍照签到的时候， 必须要拍摄自己的正面照片， 侧面照片会导致无法识别。 另外， 拍照的时候不要戴墨镜或者帽子， 避免影响拍照签到的准确度。</text>
		</view>
	</view>
</template>

<script>
	var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
	var qqmapsdk;
	export default {
		data() {
			return {
				canCheckin: true,
				photoPath: "",
				btnText: '拍照',
				showCamera: true,
				showImage: false
			}
		},
		onLoad: function() {
			qqmapsdk = new QQMapWX({
				key: '6NPBZ-HZ4C5-G2YIB-I7CNT-YA4QF-72B73'
			});
		},
		onShow: function() {
			let that = this;
			that.ajax(that.url.validCanCheckIn, 'GET', null, function(resp) {
			let msg = resp.data.msg;
			if (msg != '可以考勤') {
				setTimeout(function() {
					uni.showToast({
						title: msg,
						icon: 'none'
					});
					}, 1000);
					that.canCheckin = false;
				}
				// uni.redirectTo({
				// 	url:"../check_result/check_result"
				// })
			});
		},
		methods: {
			clickBtn:function(){
				let that = this;
				if(that.btnText == "拍照") {
					let ctx = uni.createCameraContext();
					ctx.takePhoto({
						quality:'high',
						success:function(resp) {
							console.log(resp.tempImagePath)
							that.photoPath = resp.tempImagePath
							that.showImage = true;
							that.showCamera = false;
							that.btnText = "签到"
						}
					})
					uni.showToast({
						title: '拍照成功',     
						icon: 'none'
					});
				} else {
					uni.showLoading({
						title: '签到中请稍后'
					});
					
					setTimeout(function() {
						uni.hideLoading();
					}, 30000);
					uni.getLocation({
						type: 'wgs84',
						success: function (res) {
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							var latitude = res.latitude;
							var longitude = res.longitude;
							qqmapsdk.reverseGeocoder({
								location: {
									latitude: latitude,
									longitude: longitude
								},
								success: function(resp) {
									let address = resp.result.address;
									let addressComponent = resp.result.address_component;
									let nation = addressComponent.nation;
									let province = addressComponent.province;
									let city = addressComponent.city;
									let district = addressComponent.district;
									uni.uploadFile({
										url: that.url.checkin,
										filePath: that.photoPath,
										name: 'photo',
										header: {
											token: that.param.token
										},
										formData: {
											address: address,
											country: nation,
											province: province,
											city: city,
											district: district,
										},
										success: function(resp){
											if (resp.statusCode == 500 && resp.data == "不存在人脸模型") {
												uni.hideLoading();
												uni.showModal({
													title: "提示信息",
													content: "EMOS系统中不存在你的人脸模型，是否用当前照片作为人脸识别模型？",
													success: function(res){
														if (res.confirm) {
															//上传头像图片
															uni.uploadFile({
																url: that.url.createFaceModel,
																filePath: that.photoPath,
																name: 'photo',
																header: {
																	token : that.param.token
																},
																success:function(resp){
																	if(resp.statusCode == 500){
																		uni.showToast({
																			title:resp.data,
																			icon:'none'
																		});
																	} else if (resp.statusCode == 200) {
																		uni.showToast({
																			title: '人脸建模成功',
																			icon:'none'
																		});
																	}
																}
															})
														}
													}
												})
											} else if (resp.statusCode == 200) {
												console.log("存在人脸模型")
												let data = JSON.parse(resp.data);
												let code = data.code;
												let msg = data.msg;
												if (code == 200) {
													uni.hideLoading();
													// 签到成功
													uni.showToast({
														title:"签到成功",
														complete:function(){
															uni.redirectTo({
																url:"../check_result/check_result"
															})
														}
													});
												}
											} else if (resp.statusCode == 500) {
												uni.showToast({
													title:resp.data,
													icon:'none'
												});
											}
										}
									})
								}
								,fail:function(e){
									console.log(e)
								}
							})
						},
						fail:function(e){
							console.log(e)
						}
					});
				}
			},
			afresh:function(){
				this.showImage = false;
				this.showCamera = true;
				this.btnText = "拍照"
			},
			
		}
	}
</script>

<style lang="less">
	@import url("checkin.less");
</style>