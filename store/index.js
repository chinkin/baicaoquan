import Vue from 'vue'
import Vuex from 'vuex'
import service from './api/service'
import * as types from './types'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		categories: [],
		products: []
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
					key: 'userInfo',  
					data: provider  
			}) 
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
					key: 'userInfo'  
			})
		},
		[types.RECEIVE_CATEGORIES](state, { oCategories }) {
			state.categories = oCategories;
		},
		[types.RECEIVE_PRODUCTS](state, { oProducts }) {
			state.products = oProducts;
		}
	},
	getters: {
		categories: state => state.categories,
		cateProducts: state => state.cateProducts,
		products: state => state.products
	},
	actions: {
		getCategories({ commit }) {
			service.getCategories(oCategories => {
				commit(types.RECEIVE_CATEGORIES, { oCategories });
			})
		},

		getCategoryProducts({ commit }, oParam) {
			if (!oParam.id || oParam.id === '') return;
			oParam.expands = 'products';
			return new Promise((resolve, reject) => {
				service.getCategoryProducts(oParam, oCateProducts => {
					resolve(oCateProducts);
				})
			})
		},

		getProducts({ commit }) {
			service.getProducts(oProducts => {
				commit(types.RECEIVE_PRODUCTS, { oProducts });
			})
		},

		getProduct({ commit }, oParam) {
			if (!oParam.id || oParam.id === '') return;
			oParam.expands = 'productdetails,productspecs';
			return new Promise((resolve, reject) => {
				service.getProduct(oParam, oProduct => {
					resolve(oProduct);
				})
			})
		}

	}
})

export default store
