/* global define */
define([
	'mvc/Model',
	'mvc/Collection',
	'util/Util'
], function (
	Model,
	Collection,
	Util
) {
	'use strict';


	var RealtimeEvent = function (data) {
		Model.call(this);
		this.update(Util.extend({}, data));
	};

	RealtimeEvent.prototype = Object.create(Model.prototype);


	RealtimeEvent.prototype.update = function (data) {
		var product = null;
		if (data.hasOwnProperty('product')) {
			product = data.product;
			delete data.product;
		}
		if (product !== null) {
			this.addProduct(product, {silent: true});
		}
		this.set(data);
	};

	RealtimeEvent.prototype.addProduct = function (product, options) {
		var type = product.type,
		    products = this.get('products'),
		    typeProducts;
		if (products === null) {
			products = {};
			this.set({products: products});
		}
		typeProducts = products[type];
		if (typeof typeProducts === 'undefined') {
			typeProducts = products[type] = [];
		}
		typeProducts.push(product);
		// TODO: sort
		if (options && options.silent !== true) {
			this.trigger('change:products');
		}
	};


	return RealtimeEvent;
});