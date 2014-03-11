#! /usr/bin/env node
'use strict';


var requirejs = require('requirejs');
requirejs.config({
	baseUrl: __dirname,
	nodeRequire: require
});


requirejs([
	'server/RelayServer'
], function (
	RelayServer
) {

	function startsWith(haystack, needle) {
		return haystack.lastIndexOf(needle, 0) === 0;
	}

	var argv = process.argv,
	    publishPort = 8124,
	    subscribePort = 8123,
	    i, len, arg;

	for (i = 2, len = argv.length; i < len; i++) {
		arg = argv[i];
		if (startsWith(arg, '--publishPort=')) {
			publishPort = parseInt(arg.replace('--publishPort=', ''), 10);
		} else if (startsWith(arg, '--subscribePort=')) {
			subscribePort = parseInt(arg.replace('--subscribePort=', ''), 10);
		} else {
			console.log('Unexpected argument "' + arg + '"\n' +
					'Expected arguments:\n\n' +
					'[--publishPort=8124]\n' +
					'\tsend messages to this port\n' +
					'[--subscribePort=8123]\n' +
					'\tclients receive messages sent to the publish port');
			process.exit(1);
		}
	}

	new RelayServer({
		// send messages
		publish: {
			name: 'publish',
			port: publishPort
		},
		// broadcast messages to clients
		subscribe: {
			name: 'subscribe',
			port: subscribePort,
			broadcastOnly: true
		}
	});

});
