<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in aImgList" :key="index">
					<view class="image-wrapper">
						<image :src="item | generateUrl()" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{oProduct.intro}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{dPrice}}</text>
				<text class="m-price" v-if="oProduct.marketprice && oProduct.marketprice>0">¥{{oProduct.marketprice}}</text>
				<text class="coupon-tip" v-if="oProduct.discount">{{oProduct.discount}}折</text>
			</view>
			<view class="bot-row">
				<text>销量: {{oProduct.salespoint}}</text>
				<text>库存: {{iInventory}}</text>
				<text>浏览量: 768</text>
			</view>
		</view>
		
		<!--  分享 -->
		<view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
			
		</view>
		
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">选择规格</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in aSpecSelected" :key="sIndex">
						{{sItem.value}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>
		
		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>(86)</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view class="eva-box">
				<image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					<view class="bot">
						<text class="attr">购买类型：XL 红色</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
<!--			<rich-text :nodes="desc"></rich-text>-->
			<div style="d-content">
				<div v-for="(item, index) in oProduct.details" :key="index">
					<img :src="item.imageurl | generateUrl()"/>
				</div>
			</div>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: bFavorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn">加入购物车</button>
			</view>
		</view>
		
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="sSpecClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="aImgList[0] | generateUrl()"></image>
					<view class="right">
						<text class="price">¥{{dPrice}}</text>
						<text class="stock">库存：{{iDetailInv}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in aSpecSelected" :key="sIndex">
								{{sItem.value}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item, index) in aSpecs" :key="index" class="attr-list">
					<text>{{item.specname}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in item.specs" v-if="childItem.pid === item.id"
							  :key="childIndex" class="tit" :class="{disabled: childItem.disabled, selected: childItem.selected}"
							  @click="!childItem.disabled && selectSpec(childIndex, index)">
							{{childItem.value}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="aShareList"
		></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	export default{
		components: {
			share
		},
		data() {
			return {
				oProduct: {},
				dPrice: 0.0,
				iInventory: 0,
				iDetailInv: 0,
				bFavorite: true,
				aShareList: [],
				aImgList: [],
				aSpecs: [],
				sSpecClass: 'none',
				aSpecSelected: [],
				aInventories: []
/*
				desc: `
					<div style="width:100%">
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i4/479184430/O1CN01nCpuLc1iaz4bcSN17_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd2.alicdn.com/imgextra/i2/479184430/O1CN01gwbN931iaz4TzqzmG_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i3/479184430/O1CN018wVjQh1iaz4aupv1A_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd4.alicdn.com/imgextra/i4/479184430/O1CN01tWg4Us1iaz4auqelt_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd1.alicdn.com/imgextra/i1/479184430/O1CN01Tnm1rU1iaz4aVKcwP_!!479184430.jpg_400x400.jpg" />
					</div>
				`,
				specList: [
					{
						id: 1,
						name: '尺寸',
					},
					{	
						id: 2,
						name: '颜色',
					},
				],
				specChildList: [
					{
						id: 1,
						pid: 1,
						name: 'XS',
					},
					{
						id: 2,
						pid: 1,
						name: 'S',
					},
					{
						id: 3,
						pid: 1,
						name: 'M',
					},
					{
						id: 4,
						pid: 1,
						name: 'L',
					},
					{
						id: 5,
						pid: 1,
						name: 'XL',
					},
					{
						id: 6,
						pid: 1,
						name: 'XXL',
					},
					{
						id: 7,
						pid: 2,
						name: '白色',
					},
					{
						id: 8,
						pid: 2,
						name: '珊瑚粉',
					},
					{
						id: 9,
						pid: 2,
						name: '草木绿',
					},
				]
*/
			};
		},
		async onLoad(options){

			//接收传值, id里面放的是标题, 因为测试数据并没写id 
			let id = options.id;
//			if(id){
//				this.$api.msg(`点击了${id}`);
//			}

			//let that = this; //for debug
			await this.$store.dispatch('getProduct', {
				"id": id
			}).then((oProduct) => {
				this.oProduct = oProduct;
				if (oProduct.image1url && oProduct.image1url !== '') this.aImgList.push(oProduct.image1url);
				if (oProduct.image2url && oProduct.image2url !== '') this.aImgList.push(oProduct.image2url);
				if (oProduct.image3url && oProduct.image3url !== '') this.aImgList.push(oProduct.image3url);
				if (oProduct.image4url && oProduct.image4url !== '') this.aImgList.push(oProduct.image4url);
				if (oProduct.image5url && oProduct.image5url !== '') this.aImgList.push(oProduct.image5url);
				if (oProduct.marketprice && oProduct.marketprice !== 0 && oProduct.baseprice !== oProduct.marketprice)
					this.oProduct.discount = (oProduct.baseprice / oProduct.marketprice * 10).toFixed(1);
				this.dPrice = oProduct.baseprice;
				this.iInventory = oProduct.inventory;
				if (!oProduct.details) this.oProduct.details[0].imageurl = this.aImgList[0];
			});

			//库存
			if (this.oProduct.inventories && this.oProduct.inventories.length > 0) {
				let iCountInv = 0;
				for (let oInv of this.oProduct.inventories) {
					let oInventory = {aSpecs: [], iInventory: 0};
					if (oInv.inventory > 0) {
						oInventory.aSpecs = oInv.productspecs.split(",").sort();
						oInventory.iInventory = oInv.inventory;
						this.aInventories.push(oInventory);
						iCountInv += oInv.inventory;
					}
				}
				this.iInventory = iCountInv === 0 ? this.iInventory : iCountInv;
				this.iDetailInv = this.iInventory;
			}

			//规格
			if (this.oProduct.specs && this.oProduct.specs.length > 0) {
				let i = 0;
				let iSpecID = this.oProduct.specs[0].specid;
				this.aSpecs[i] = {};
				this.aSpecs[i].specid = iSpecID;
				this.aSpecs[i].specname = this.oProduct.specs[0].specname;
				this.aSpecs[i].specs = [];
				for (let oSpec of this.oProduct.specs) {
					if (oSpec.specid !== iSpecID) {
						i++;
						iSpecID = oSpec.specid;
						this.aSpecs[i] = {};
						this.aSpecs[i].specid = iSpecID;
						this.aSpecs[i].specname = oSpec.specname;
						this.aSpecs[i].specs = [];
					}
					let bHasInv = true;
					if (this.aInventories.length > 0) {
						for (let oInv of this.aInventories) {
							for (let sSpecId of oInv.aSpecs) {
								bHasInv = false;
								if (sSpecId == oSpec.id) {
									bHasInv = true;
									break;
								}
							}
							if (bHasInv) break;
						}
					}
					if (bHasInv) {
						this.$set(oSpec, 'disabled', false);
						this.$set(oSpec, 'hasinventory', true);
					} else {
						this.$set(oSpec, 'disabled', true);
						this.$set(oSpec, 'hasinventory', false);
					}
					this.$set(oSpec, 'selected', false);
					this.aSpecs[i].specs.push(oSpec);
				}
			}
//			this.specList.forEach(item=>{
//				for (let cItem of this.specChildList) {
//					if (cItem.pid === item.id) {
//						this.$set(cItem, 'selected', true);
//						this.aSpecSelected.push(cItem);
//						break; //forEach不能使用break
//					}
//				}
//			})

			//分享
			this.aShareList = await this.$api.json('aShareList');
		},
		methods:{
			//规格弹窗开关
			toggleSpec() {
				if (this.sSpecClass === 'show'){
					this.sSpecClass = 'hide';
					setTimeout(() => {
						this.sSpecClass = 'none';
					}, 250);
				} else if (this.sSpecClass === 'none') {
					this.sSpecClass = 'show';
				}
			},
			//选择规格
			selectSpec(iValueIndex, iSpecIndex){
				let aList = this.aSpecs[iSpecIndex].specs;
				let i = 0;
				for (i; i < aList.length; i++){
					if (aList[i].selected === true) {
						this.$set(aList[i], 'selected', false);
						for (let j = 0; j < this.aSpecSelected.length; j++) {
							if (aList[i].id === this.aSpecSelected[j].id) {
								this.aSpecSelected.splice(j, 1);
								break;
							}
						}
						this.dPrice = this.dPrice - aList[i].price;
						break; //单选
					}
				}
				if (i !== iValueIndex) {
					this.$set(aList[iValueIndex], 'selected', true);
					this.dPrice = this.dPrice + aList[iValueIndex].price;
					this.aSpecSelected.push(aList[iValueIndex]);
				}
				if (this.oProduct.marketprice && this.oProduct.marketprice !== 0 && this.dPrice !== this.oProduct.marketprice) {
					this.oProduct.discount = (this.dPrice / this.oProduct.marketprice * 10).toFixed(1);
				} else {
					this.oProduct.discount = 0;
				}

				let iCountInv = 0;
				//按选择规格重算库存
				if (this.aInventories.length > 0) {
					if (this.aSpecSelected.length === 0) {
						this.aSpecs.forEach(aSpec=>{
							aSpec.specs.forEach(item=>{
								if (item.hasinventory === true) {
									this.$set(item, 'disabled', false);
								}
							})
						})
						for (let oInv of this.aInventories) {
							iCountInv = iCountInv + oInv.iInventory;
						}
					} else {
						let iSelectedInv = [];
						let bHasInv = true;
						i = 0;
						for (let oInv of this.aInventories) {
							let bHasInv = true;
							for (let oSpec of this.aSpecSelected) {
								if (!oInv.aSpecs.includes(oSpec.id.toString())) {
									bHasInv = false;
									break;
								}
							}
							if (bHasInv) {
								iSelectedInv.push(i);
								iCountInv = iCountInv + oInv.iInventory;
							}
							i++;
						}
						this.aSpecs.forEach(aSpec=>{
							aSpec.specs.forEach(item=>{
								if (item.hasinventory === true) {
									if (item.selected !== true) {
										bHasInv = false;
										for (let iIndex of iSelectedInv) {
											for (let sSpecId of this.aInventories[iIndex].aSpecs) {
												if (item.id == sSpecId) {
													bHasInv = true;
													break;
												}
											}
											if (bHasInv) break;
										}
										if (bHasInv) this.$set(item, 'disabled', false);
										else this.$set(item, 'disabled', true);
									}
								}
							})
						})
					}
				}
				this.iDetailInv = iCountInv === 0 ? this.iDetailInv : iCountInv;
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			//收藏
			toFavorite(){
				this.bFavorite = !this.bFavorite;
			},
			buy(){
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			stopPrevent(){}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/* 详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
		.d-content{
			width: 100%;
			img{
				width: 100%;
				display: block;
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eeeeee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.disabled{
				background: #fbebee;
				color: $uni-color-disabled;
			}
			.selected{
				background: #dddddd;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
