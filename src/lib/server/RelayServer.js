/* global define */
define([
	'server/WebSocketServer'
], function (
	WebsocketServer
) {
	'use strict';


	var RelayServer = function (options) {
		this._options = options;
		this._initialize();
	};


	RelayServer.prototype._initialize = function () {
		var options = this._options,
		    subscribe = new WebsocketServer(options.subscribe),
		    publish = new WebsocketServer(options.publish);

		if (options.broadcastOnly === true) {
			subscribe.onClientMessage = function (e) {
				e.target.close(4403, 'broadcast only');
			};
		}

		subscribe.onClientError = function (e) {
			e.target.close(4400, 'client error "' + e + '"');
		};

		publish.onClientMessage = function (e) {
			subscribe.broadcast(e.data);
		};

		this._subscribe = subscribe;
		this._publish = publish;
	};


	return RelayServer;
});
