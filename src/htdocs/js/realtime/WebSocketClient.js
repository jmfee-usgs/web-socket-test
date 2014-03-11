/* global define */
define([
	'util/Events'
], function (
	Events
) {
	'use strict';


	var WebSocketClient = function (options) {
		Events.call(this);
		this._options = options;
		this._socket = null;
		this._initialize();
	};

	WebSocketClient.prototype = Object.create(Events.prototype);


	WebSocketClient.prototype._initialize = function () {
		this.onOpen = this.onOpen.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.onError = this.onError.bind(this);
		this.onClose = this.onClose.bind(this);

		if (this._options.deferConnect === true) {
			return;
		}
		this.connect();
	};


	WebSocketClient.prototype.connect = function () {
		var socket;
		
		if (this._socket !== null) {
			this.disconnect();
		}

		this._socket = socket = new WebSocket(this._options.url);
		socket.addEventListener('open', this.onOpen);
		socket.addEventListener('message', this.onMessage);
		socket.addEventListener('error', this.onError);
		socket.addEventListener('close', this.onClose);

		this.trigger('connect', this);
	};

	WebSocketClient.prototype.disconnect = function () {
		var socket;

		if (this._socket === null) {
			return;
		}

		socket = this._socket;
		socket.removeAllListeners();
		socket.close(1000, 'disconnect');
		this._socket = null;

		this.trigger('disconnect', this);
	};

	WebSocketClient.prototype.onOpen = function (ev) {
		this.trigger('open', ev);
	};

	WebSocketClient.prototype.onMessage = function (ev) {
		var json;
		try {
			json = JSON.parse(ev.data);
		} catch (e) {
			json = null;
		}
		this.trigger('message', json, ev);
	};

	WebSocketClient.prototype.onError = function (ev) {
		this.trigger('error', ev);
	};

	WebSocketClient.prototype.onClose = function (ev) {
		this.trigger('close', ev);
	};


	return WebSocketClient;
});
