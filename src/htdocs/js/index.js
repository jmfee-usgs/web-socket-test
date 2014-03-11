var catalogList;


require.config({
	baseUrl: 'js',
	paths: {
		'mvc': '/hazdev-webutils/src/mvc',
		'util': '/hazdev-webutils/src/util'
	},
	shim: {
	}
});


require([
	'realtime/RealtimeCatalog',
	'realtime/CatalogList'
], function (
	RealtimeCatalog,
	CatalogList
) {
	'use strict';


	catalogList = new CatalogList({
		el: document.createElement('div'),
		catalog: new RealtimeCatalog({
			websocket: {
				url: 'ws://127.0.0.1:8123'
			}
		})
	});

	document.querySelector('body').appendChild(catalogList._el);

});
