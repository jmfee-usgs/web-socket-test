/* global define */

var ws = require('ws');


define([], function () {
	'use strict';


	/**
	 * Create a WebSocketServer.
	 *
	 * @param options {Object}
	 *        options passed to ws.Server
	 * @param options.broadcastOnly
	 */
	var WebSocketServer = function (options) {
		this._options = options;
		this._initialize();
	};


///////////////////////////////////////////////////////////////////////////////
// Public methods

	/**
	 * Broadcast a message to all clients.
	 *
	 * @param message {Object}
	 *        the message, stringified for broadcast.
	 */
	WebSocketServer.prototype.broadcast = function (message) {
		var options = this._options,
		    name = options.name || 'server',
		    clients = this._server.clients,
		    i;

		this._log(name, 'broadcast ' + message);
		for (i in clients) {
			this._send(clients[i], message);
		}
		this._log(name, 'broadcast complete');
	};


///////////////////////////////////////////////////////////////////////////////
// Private methods

	/**
	 * Initialize the server.
	 */
	WebSocketServer.prototype._initialize = function () {
		var server = this._server = new ws.Server(this._options);

		this._connect = this._connect.bind(this);
		this.onServerError = this.onServerError.bind(this);
		this.onClientMessage = this.onClientMessage.bind(this);
		this.onClientError = this.onClientError.bind(this);
		this.onClientClose = this.onClientClose.bind(this);

		server.on('error', this.onServerError);
		server.on('connection', this._connect);

		this._log('server started', JSON.stringify(this._options));
	};

	/**
	 * Called when a connection is received.
	 */
	WebSocketServer.prototype._connect = function (target) {
		var socket = target._socket;
		target.name = '[' + socket.remoteAddress + ':' + socket.remotePort + '->' +
			socket.localAddress + ':' + socket.localPort + ']';
		target.addEventListener('message', this.onClientMessage);
		target.addEventListener('error', this.onClientError);
		target.addEventListener('close', this.onClientClose);
		this.onClientConnect({target:target});
	};

	/**
	 * Send one message
	 */
	WebSocketServer.prototype._send = function (target, message) {
		var onClientError = this.onClientError;
		target.send(message, function (error) {
			if (typeof error !== 'undefined' && error !== null) {
				onClientError({
					target: target,
					message: message,
					error: error
				});
			}
		});
	};

	/**
	 * Log a message.
	 *
	 * @param ev {String|{target:ws.WebSocket}}
	 * @param message {String}
	 *        message to log.
	 */
	WebSocketServer.prototype._log = function (ev, message) {
		console.log([
			new Date().toJSON(),
			' ', (typeof ev.target === 'object' ? ev.target.name : ev), ' ',
			message
		].join(''));
	};


///////////////////////////////////////////////////////////////////////////////
// "Protected" methods, to be overridden in subclasses or instances


	/**
	 * Called when server has an error.
	 */
	WebSocketServer.prototype.onServerError = function (error) {
		this._log('Server Error', error);
	};

	/**
	 * Called when a client connects.
	 *
	 * @param ev {Object}
	 * @param ev.target {ws.WebSocket}
	 *        client that connected.
	 */
	WebSocketServer.prototype.onClientConnect = function (ev) {
		this._log(ev, 'connect');
	};

	/**
	 * Called when a client message is received.
	 *
	 * @param ev {Object}
	 * @param ev.target {ws.WebSocket}
	 *        client that sent message.
	 * @param ev.data {Binary|String}
	 *        message
	 * @param ev.flags {Object}
	 */
	WebSocketServer.prototype.onClientMessage = function (ev) {
		if (this._options.broadcastOnly) {
			ev.target.close(4403, 'broadcast only');
			return;
		}
		this._log(ev, 'message ' + ev.data);
	};

	/**
	 * Called when the client has an error (sending or receiving).
	 *
	 * @param ev {Object}
	 *        the error
	 * @param ev.target {ws.WebSocket}
	 *        client that sent message.
	 */
	WebSocketServer.prototype.onClientError = function (ev) {
			this._log(ev, 'error ' + ev);
	};

	/**
	 * Called when the client connection is closed.
	 *
	 * @param ev {Object}
	 * @param ev.target {ws.WebSocket}
	 *        client that sent message.
	 * @param ev.code   {Number}
	 *        error code
	 * @param ev.reason {String}
	 *        error description
	 */
	WebSocketServer.prototype.onClientClose = function (ev) {
			this._log(ev, 'close (' + ev.code + ': ' + ev.reason + ')');
	};


	return WebSocketServer;
});
