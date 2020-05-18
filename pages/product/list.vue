<template>
	<view class="content">
		<view class="navbar" :style="{position:sHeaderPosition, top:sHeaderPosition}">
			<view class="nav-item" :class="{current: iFilterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: iFilterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: iFilterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: iPriceOrder === 1 && iFilterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: iPriceOrder === 2 && iFilterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
		<view class="goods-list">
			<view 
				v-for="(item, index) in aGoodsList" :key="index"
				class="goods-item"
				@click="navToProduct(item)"
			>
				<view class="image-wrapper">
					<image :src="item.image1url | generateUrl()" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.name}}</text>
				<view class="price-box">
					<text class="price">{{item.baseprice}}</text>
					<text>已售 {{item.salespoint}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="sLoadingType"></uni-load-more>
		
		<view class="cate-mask" :class="iCateMaskState === 0 ? 'none' : iCateMaskState === 1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.name}}</view>
						<view 
							v-for="tItem in item.child" :key="tItem.id" 
							class="cate-item b-b" 
							:class="{active: tItem.id==iCateId}"
							@click="changeCate(tItem)">
							{{tItem.name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				iCateMaskState: 0, //分类面板展开状态
				sHeaderPosition:"fixed",
				sHeaderPosition:"0px",
				sLoadingType: 'more', //加载更多状态
				iFilterIndex: 0, 
				iCateId: 1, //已选分类id
				iPriceOrder: 0, //1 价格从低到高 2价格从高到低
				aGoodsList: [],
				aProducts: []
			};
		},
		
		onLoad(options) {
			// #ifdef H5
			this.sHeaderPosition = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.iCateId = options.cId;
			this.loadData();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop>=0) {
				this.sHeaderPosition = "fixed";
			} else {
				this.sHeaderPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		computed: {
			...mapState({
				cateList: state => {
					let aCategories = [];
					if (state.categories) {
						let aList = state.categories;
						aCategories = aList.filter(item => item.level == '1');
						
						aCategories.forEach(item => {
							let aTempList = aList.filter(val=>val.parentid == item.id);
							item.child = aTempList;
						})
					}
					return aCategories;
				}
			}),
		},
		methods: {
			//加载分类
			//async loadCateList(fid, sid) {
			//	let list = await this.$api.json('cateList');
			//	let cateList = list.filter(item => item.pid == fid);
			
			//	cateList.forEach(item => {
			//		let tempList = list.filter(val=>val.pid == item.id);
			//		item.child = tempList;
			//	})
			//	this.cateList = cateList;
			//},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type='add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.sLoadingType === 'nomore') {
						return;
					}
					this.sLoadingType = 'loading';
				} else {
					this.sLoadingType = 'more';
				}
				
				await this.$store.dispatch('getCategoryProducts', {
					"id": this.iCateId
				}).then((oCateProducts) => {
					this.aProducts = oCateProducts.products;
				});
				//let aGoodsList = await this.$api.json('aGoodsList');
				if (type === 'refresh') {
					this.aGoodsList = [];
				}
				//排序
				if (this.iFilterIndex === 1) {
					this.aProducts.sort((a,b) => b.salespoint - a.salespoint)
				}
				if (this.iFilterIndex === 2) {
					this.aProducts.sort((a,b) => {
						if (this.iPriceOrder == 1) {
							return a.price - b.price;
						}
						return b.price - a.price;
					})
				}
				if (this.aProducts.length - this.aGoodsList > 6) {
					this.aGoodsList = this.aGoodsList.concat(this.aProducts.slice(this.aGoodsList.length, this.aGoodsList.length + 6));
				} else {
					this.aGoodsList = this.aGoodsList.concat(this.aProducts.slice(this.aGoodsList.length));
				}
				
				//判断是否还有下一页，有是more，没有是nomore
				this.sLoadingType  = this.aGoodsList.length === this.aProducts.length ? 'nomore' : 'more';
				if (type === 'refresh') {
					if (loading == 1) {
						uni.hideLoading()
					} else {
						uni.stopPullDownRefresh();
					}
				}
			},
			//筛选点击
			tabClick(index) {
				if (this.iFilterIndex === index && index !== 2) {
					return;
				}
				this.iFilterIndex = index;
				if (index === 2) {
					this.iPriceOrder = this.iPriceOrder === 1 ? 2: 1;
				} else {
					this.iPriceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.iCateMaskState = 2;
				setTimeout(()=>{
					this.iCateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item) {
				this.iCateId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//详情
			navToProduct(item) {
				//测试数据没有写id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page, .content {
		background: $page-color-base;
	}
	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current {
				color: $base-color;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}
		.p-box {
			display: flex;
			flex-direction: column;
			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active {
					color: $base-color;
				}
			}
			.xia {
				transform: scaleY(-1);
			}
		}
		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none {
			display: none;
		}
		&.show {
			background: rgba(0,0,0,.4);
			
			.cate-content {
				transform: translateX(0);
			}
		}
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 100%;
		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
 			font-size: 28upx;
			color: #555;
			position: relative;
		}
		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}
		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display:flex;
		flex-wrap:wrap;
		padding: 20upx 30upx 0;
		background: #fff;
		.goods-item {
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}
		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}
		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}
	

</style>
