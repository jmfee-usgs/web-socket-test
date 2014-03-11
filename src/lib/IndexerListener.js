#! /usr/bin/env node
'use strict';
/* global require, process, console */


// work from base directory
var path = require('path');
process.chdir(path.resolve(__dirname, '../..'));

// node module requires
var requirejs = require('requirejs'),
    ws = require('ws');

var LOG = function (message) {
	console.log(new Date().toJSON() + ' ' + message);
};
LOG('args = ' + JSON.stringify(process.argv) + '\n');


var WS_PUBLISH_URL = 'ws://localhost:8124';
var BASE_DIRECTORY = '/Users/jmfee/Desktop/pdl-client-examples/data/indexer_storage';
var BASE_URL = 'http://earthquake.usgs.gov/product';


var requirejs = require('requirejs');
requirejs.config({
	baseUrl: __dirname,
	nodeRequire: require
});


requirejs([
	'server/IndexerChange'
], function (
	IndexerChange
) {
	var action, message, socket;

	try {
		// parse arguments
		action = IndexerChange.parseArguments(process.argv,
				{
					directoryToUrl: true,
					baseDirectory: BASE_DIRECTORY,
					baseUrl: BASE_URL
				});
	} catch (e) {
		LOG('exception is ' + e);
		process.exit(1);
	}


	// convert to string
	message = JSON.stringify(action);
	LOG('message = ' + message);

	// publish message
	socket = new ws(WS_PUBLISH_URL);
	socket.addEventListener('open', function () {
		LOG('connected, sending');
		socket.send(message);
		socket.close();
	});
	socket.addEventListener('error', function (e) {
		LOG('socket error: ' + e.message);
		socket.close();
		process.exit(2);
	});
	socket.addEventListener('close', function () {
		LOG('done');
		process.exit(0);
	});

});
