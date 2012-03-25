var EventEmitter = require( 'events' ).EventEmitter,
	http = require( 'http' ),
	url = require( 'url' )

function checkHttp( u, fn ) {
	if ( typeof u === 'string' ) {
		u = url.parse( u );
	}

	http.get( u, function( res ) {
		var date = new Date( res.headers['last-modified'] );
		res.on( 'data', function() {
			res.destroy();
		});

		res.on( 'error', function( er ) {
			fn.call( null, er );
		});

		res.on( 'end', function() {
			fn.call( null, null, date );
		});
	});
}

String.prototype.minutes = function( s ) {
	return parseInt( s, 10 ) * 1000;
}

function nmon() {
	this.store = {};
	this.count = 0;
}

nmon.prototype.__proto__ = EventEmitter.prototype;

var on = EventEmitter.prototype.on;

nmon.prototype.on = function( event ) {
	return on.apply( this, arguments );
};

/**
 * Create a new monitor wity type and params
 * @param {String} type
 * @param {Object} params
 * @param {Function} fn
 * @api public
*/
nmon.prototype.create = function( type, params, fn ) {
	var self = this;

	self.store[ self.count ] = {
		interval: params.interval || '10'.minutes,
		name: params.name || type,
		type: type,
		url: params.url,
		date: new Date(),
	};

	self.count++;
};

/**
 * Start monitoring
 * @api public
 */
nmon.prototype.monitor = function() {
	var self = this;
	var m;
	for ( m in self.store ) {
		var s = self.store[ m ];

		setInterval( function() {
			if ( s.type === 'http' ) {
				checkHttp( s.url, function( er, date ) {
					if ( er ) {
						throw er;
					}

					if ( date.getTime() > s.date.getTime() ) {
						self.emit( s.name, date );
						s.date = date;
					}

				});
			}
		}, s.interval );
	}
};

exports = module.exports = nmon;
