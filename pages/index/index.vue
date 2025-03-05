<template>
	<view class="page">
		<!-- 循环播放 变化轮播图时间间隔 变化图片花费时间 -->
		<swiper circular="true" interval="8000" duration="1000" class="swiper">
			<swiper-item>
				<image mode="widthFix" src="https://emos-1320704241.cos.ap-guangzhou.myqcloud.com/img/banner/swiper-1.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image mode="widthFix" src="https://emos-1320704241.cos.ap-guangzhou.myqcloud.com/img/banner/swiper-2.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image mode="widthFix" src="https://emos-1320704241.cos.ap-guangzhou.myqcloud.com/img/banner/swiper-3.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image mode="widthFix" src="https://emos-1320704241.cos.ap-guangzhou.myqcloud.com/img/banner/swiper-4.jpg"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less">
	@import url("index.less");
</style>
