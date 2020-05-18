<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in aFirstLevel" :key="item.id" class="f-item b-b" :class="{active: item.id === iCurrentId}" @click="tabtap(item)">
				<image :src="item.imageurl | generateUrl()"></image>
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="item in aFirstLevel" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text class="s-item">{{item.name}}</text>
				<view class="t-list">
					<view @click="navToProductList(titem.id)" v-if="titem.parentid === item.id" class="t-item" v-for="titem in aSecondLevel" :key="titem.id">
						<image :src="titem.imageurl | generateUrl()"></image>
						<text>{{titem.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				bSizeCalcState: false,
				iTabScrollTop: 0,
				iCurrentId: 1,
				//fList: [],
				//sList: [],
				//tList: [],
			}
		},
		onLoad() {
			//this.loadData();
		},
		computed: {
			...mapState({
				aFirstLevel: state => {
					let aCategories = [];
					if (state.categories) {
						for (let oCategory of state.categories) {
							if (oCategory.level == 1) {
							  aCategories.push(oCategory);
							}
						}
					}
					return aCategories;
				},
				aSecondLevel: state => {
					let aCategories = [];
					if (state.categories) {
						for (let oCategory of state.categories) {
							if (oCategory.level == 2) {
							  aCategories.push(oCategory);
							}
						}
					}
					return aCategories;
				}
			}),
		},
		methods: {
			//async loadData() {
			//	let list = await this.$api.json('cateList');
			//	list.forEach(item => {
			//		if (!item.pid) {
			//			this.fList.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
			//		} else if (!item.picture) {
			//			this.sList.push(item); //没有图的是2级分类
			//		} else {
			//			this.tList.push(item); //3级分类
			//		}
			//	}) 
			//},
			//一级分类点击
			tabtap(item) {
				if (!this.bSizeCalcState) {
					this.calcSize();
				}
				
				this.iCurrentId = item.id;
				let index = this.aFirstLevel.findIndex(sitem => sitem.id === item.id);
				this.iTabScrollTop = this.aFirstLevel[index].top;
			},
			//右侧栏滚动
			asideScroll(e) {
				if (!this.bSizeCalcState) {
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.aFirstLevel.filter(item => item.top <= scrollTop).reverse();
				if (tabs.length > 0) {
					this.iCurrentId = tabs[0].id;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.aFirstLevel.forEach(item => {
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.bSizeCalcState = true;
			},
			navToProductList(cId) {
				uni.navigateTo({
					url: `/pages/product/list?cId=${cId}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 100upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active {
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
		
		image {
			width: 68rpx;
			height: 68rpx;
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item {
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image {
			width: 140upx;
			height: 140upx;
		}
	}
</style>
