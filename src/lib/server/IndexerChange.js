/* global define */
define([], function () {
	'use strict';


	function startsWith (haystack, needle) {
		return haystack.lastIndexOf(needle, 0) === 0;
	}

	function endsWith (haystack, needle) {
		var pos = haystack.length - needle.length;
		return haystack.indexOf(needle, pos) === pos;
	}

	function fixArguments (args) {
		var arg,
		    partial = null,
		    fixed = [],
		    i,
		    len;

		for (i = 0, len = args.length; i < len; i++) {
			arg = args[i];
			if (partial !== null) {
				partial = partial + ' ' + arg;
				if (!endsWith(partial, '"')) {
					// still parsing an arg
					continue;
				}
				arg = partial;
				partial = null;
			} else if (startsWith(arg, '"') && !endsWith(arg, '"')) {
				partial = arg;
			}

			if (startsWith(arg, '"') && endsWith(arg, '"')) {
				arg = arg.substr(1, arg.length - 2);
			}

			fixed.push(arg);
		}
		if (partial !== null) {
			throw new Error('unbalanced quoted arguments, leftover=' + partial);
		}
		return fixed;
	}


	var IndexerChange = function (change) {
		change = change || {};
		this.action = change.action || null;
		this.product = change.product || null;
		this.earthquake = change.earthquake || null;
	};


	IndexerChange.getIndexerChange = function (argv, options) {
		return new IndexerChange(IndexerChange.parseArguments(argv, options));
	};

	IndexerChange.parseArguments = function (argv, options) {
		var i, len, arg, r, product, props, links, earthquake, directory;
		options = options || {};
		r = {
			action: null,
			product: {
				links: {},
				properties: {}
			},
			earthquake: {}
		};
		product = r.product;
		links = product.links;
		props = product.properties;
		earthquake = r.earthquake;

		argv = fixArguments(argv);

		for (i = 0, len = argv.length; i < len; i++) {
			arg = argv[i];
			if (startsWith(arg, '--source=')) {
				product.source = arg.replace('--source=', '');
			} else if (startsWith(arg, '--type=')) {
				product.type = arg.replace('--type=', '');
			} else if (startsWith(arg, '--code=')) {
				product.code = arg.replace('--code=', '');
			} else if (startsWith(arg, '--updateTime=')) {
				product.updateTime = new Date(arg.replace('--updateTime=', ''));
			} else if (startsWith(arg, '--status=')) {
				product.status = arg.replace('--status=', '');
			} else if (startsWith(arg, '--content')) {
				// TODO?
			} else if (startsWith(arg, '--contentType=')) {
				// TODO?
			} else if (startsWith(arg, '--directory=')) {
				// TODO?
				directory = arg.replace('--directory=', '');
				if (options.directoryToUrl === true) {
					product.url = directory.replace(options.baseDirectory, options.baseUrl);
				} else {
					//TODO?
				}
			} else if (startsWith(arg, '--signature=')) {
				// TODO?
			} else if (startsWith(arg, '--property-')) {
				arg = arg.replace('--property-', '');
				arg = arg.split('=');
				props[arg[0]] = arg.slice(1).join('=');
			} else if (startsWith(arg, '--link-')) {
				arg = arg.replace('--link-', '');
				arg = arg.split('=');
				if (!links.hasOwnProperty(arg[0])) {
					links[arg[0]] = [];
				}
				links[arg[0]].push(arg.slice(1).join('='));
			} else if (startsWith(arg, '--action=')) {
				r.action = arg.replace('--action=', '');
			} else if (startsWith(arg, '--preferred-eventid=')) {
				earthquake.id = arg.replace('--preferred-eventid=', '');
			} else if (startsWith(arg, '--preferred-eventsource=')) {
				earthquake.source = arg.replace('--preferred-eventsource=', '');
			} else if (startsWith(arg, '--preferred-eventsourcecode=', '')) {
				earthquake.sourceCode = arg.replace('--preferred-eventsourcecode=', '');
			} else if (startsWith(arg, '--eventids=')) {
				earthquake.ids = arg.replace('--eventids=', '').split(',');
			} else if (startsWith(arg, '--preferred-magnitude=')) {
				earthquake.magnitude = parseFloat(arg.replace('--preferred-magnitude=', ''));
			} else if (startsWith(arg, '--preferred-latitude=')) {
				earthquake.latitude = parseFloat(arg.replace('--preferred-latitude=', ''));
			} else if (startsWith(arg, '--preferred-longitude=')) {
				earthquake.longitude = parseFloat(arg.replace('--preferred-longitude=', ''));
			} else if (startsWith(arg, '--preferred-depth=')) {
				earthquake.depth = parseFloat(arg.replace('--preferred-depth=', ''));
			} else if (startsWith(arg, '--preferred-eventtime=')) {
				earthquake.time = new Date(arg.replace('--preferred-eventtime=', ''));
			}
		}

		return r;
	};


	return IndexerChange;
});
