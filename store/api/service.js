import http from '../../commons/http.js'

const AUTH_TOKEN = "X-Auth-Token";
const aUrl = "api/";
const fUrl = "func/";

http.setBaseUrl("http://localhost:8088/book");
//http.header['comp'] = "cjx913"
if (uni.getStorageSync(AUTH_TOKEN)) {
	http.header[AUTH_TOKEN] = uni.getStorageSync(AUTH_TOKEN);
}

http.beforeResponseFilter = function (res) {
	//X-Auth-Token
	if (res.header) {
		var respXAuthToken = res.header[AUTH_TOKEN.toLocaleLowerCase()];
		if (respXAuthToken) {
			uni.setStorageSync(AUTH_TOKEN, respXAuthToken);
			http.header[AUTH_TOKEN] = respXAuthToken;
		}
	}
	return res;
}

export default {
	getRequest(url, cb, fnFailCb) {
		http.get(url, {
			success: function(res) {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					console.info(res.data);
					cb(res.data);
				}
			},
			fail: function(res) {
				if (fnFailCb) {
					fnFailCb(res.errMsg);
				}
			}
		})
		//.then((res) => {
		//	if(res.statusCode >= 200 && res.statusCode < 300) {
		//		console.info(res.data);
		//		cb(res.data);
		//	}
		//})
		//.catch((error) => {
		//	if (fnFailCb){
		//		fnFailCb(error);
		//	}
		//})
	},

	postRequest(url, oData, cb, fnFailCb) {
		http.post(url, oData)
		.then(function (res) {
			if(res.statusCode >= 200 && res.statusCode < 300) {
				console.info(res.data);
				cb(res.data);
			}
		})
		.catch(function (error) {
			if (fnFailCb){
				fnFailCb(error);
			}
		});
	},

	putRequest(url, oData, cb, fnFailCb) {
		http.put(url, oData)
		.then(function (res) {
			if(res.statusCode >= 200 && res.statusCode < 300) {
				console.info(res.data);
				cb(res.data);
			}
		})
		.catch(function (error) {
			if (fnFailCb){
				fnFailCb(error);
			}
		});
	},

	deleteRequest(url, oData, cb) {
		http.delete(url, oData)
		.then(function (res) {
			if(res.statusCode >= 200 && res.statusCode < 300) {
				console.info(res.data);
				cb(res.data);
			}
		})
		.catch(function (error) {
			return Promise.reject(error)
		});
	},

	getCategories(cb) {
		const requestUrl = aUrl + 'categories';
		return this.getRequest(requestUrl, cb);
	},

	getCategoryProducts(oCategory, cb) {
		const requestUrl = aUrl + 'categories(' + oCategory.id + ')?_expand=' + oCategory.expands;
		return this.getRequest(requestUrl, cb);
	},

	getProducts(cb) {
		const requestUrl = aUrl + 'products';
		return this.getRequest(requestUrl, cb);
	},

	getProduct(oProduct, cb) {
		const requestUrl = aUrl + 'products(' + oProduct.id + ')?_expand=' + oProduct.expands;
		return this.getRequest(requestUrl, cb);
	}

}