/* global define */
define([
	'mvc/Collection',
	'realtime/WebSocketClient',
	'realtime/RealtimeEvent'
], function (
	Collection,
	WebSocketClient,
	RealtimeEvent
) {
	'use strict';


	var RealtimeCatalog = function (options) {
		Collection.call(this);
		this._options = options;
		this._websocket = null;
		this._initialize();
	};

	RealtimeCatalog.prototype = Object.create(Collection.prototype);

	RealtimeCatalog.prototype._initialize = function () {
		var options,
		    websocket;

		this._onOpen = this._onOpen.bind(this);
		this._onMessage = this._onMessage.bind(this);
		this._onError = this._onError.bind(this);
		this._onClose = this._onClose.bind(this);

		options = this._options;
		websocket = new WebSocketClient(options.websocket);

		websocket.on('open', this._onOpen);
		websocket.on('message', this._onMessage);
		websocket.on('error', this._onError);
		websocket.on('close', this._onClose);
		this._websocket = websocket;
	};


	RealtimeCatalog.prototype._onOpen = function (/* ev */) {
	};

	RealtimeCatalog.prototype._onMessage = function (json, ev) {
		var id, ids, item, i, len;

		if (json === null) {
			return;
		}

		id = json.earthquake.id;
		json.id = id;
		json.timeStamp = ev.timeStamp;
		item = this.get(id);
		if (item === null) {
			ids = json.earthquake.ids;
			if (ids instanceof Array) {
				for (i = 0, len = ids.length; i < len; i++) {
					id = ids[i];
					item = this.get(id);
					if (item !== null) {
						break;
					}
				}
			}
		}
		if (item === null) {
			this.add(this._createEvent(json));
		} else {
			item.update(json);
		}
	};

	RealtimeCatalog.prototype._onError = function (/* ev */) {
	};

	RealtimeCatalog.prototype._onClose = function (/* ev */) {
	};

	RealtimeCatalog.prototype._createEvent = function (json) {
		var realtimeEvent = new RealtimeEvent(json);
		realtimeEvent.on('change',
				this.trigger.bind(this, 'change:event', realtimeEvent));
		return realtimeEvent;
	};


	return RealtimeCatalog;
});