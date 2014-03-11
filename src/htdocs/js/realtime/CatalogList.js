/* global define */
define ([
	'mvc/View',
	'util/Util'
], function (
	View,
	Util
) {
	'use strict';


	var CatalogList = function (options) {
		this._options = Util.extend({}, options);
		View.call(this, options);
	};
	CatalogList.prototype = Object.create(View.prototype);


	CatalogList.prototype._initialize = function () {
		var catalog = this._options.catalog;

		catalog.on('add', this.render, this);
		catalog.on('change:event', this.render, this);

		this._lastRender = Infinity;
		this.render();
	};

	CatalogList.prototype.render = function () {
		var actions = this._options.catalog.data(),
		    action,
		    buf = [], i;
		buf.push('<ol>');
		for (i = actions.length - 1; i >= 0; i--) {
			action = actions[i];
			buf.push(this.renderOne(action));
		}
		buf.push('</ol>');
		buf.push('Updated at ' + JSON.stringify(new Date()));
		this._el.innerHTML = buf.join('');
		this._lastRender = new Date().getTime();
	};

	CatalogList.prototype.renderOne = function (item) {
		var lastRender = this._lastRender,
		    attrs = '',
		    action = item.get('action'),
		    eq = item.get('earthquake'),
		    //products = item.get('products'),
		    timestamp = item.get('timeStamp');

		if (timestamp > lastRender) {
			attrs = ' class="updated"';
		}

		return [
			'<li', attrs, '>',
				eq.time, '<br/>',
				'M = ', eq.magnitude, '<br/>',
				'lat/lng = ', eq.latitude, '/', eq.longitude, '<br/>',
				'depth = ', eq.depth, '<br/>',
				item.id, '<br/>',
				'<small>',
					action, ' at ', new Date(timestamp).toJSON(),
				'</small>',
			'</li>'
		].join('');
	};


	return CatalogList;
});