var EventEmitter = require( 'events' ).EventEmitter,
	http = require( 'http' ),
	url = require( 'url' );

function httpGetter( opt, cos ) {
	this.url = opt.url;
	this.date = new Date();
	this.name = opt.name;
	this.type = opt.type;
	this.forced_date = opt.forced_date;
  this.check_on_start = cos;
  this.checks = 0;

	this.fn = opt.fn; 

	this.interval = opt.interval || 10 * 60000;

	return this;
}

httpGetter.prototype.doCheck = function() {
  var self = this, h;
  if ( typeof self.url === 'string' ) {
    self.url = url.parse( self.url );
  }

  h = http.get( self.url, function( res ) {
    var date = new Date( res.headers['last-modified'] );
    res.on( 'data', function() {
      res.destroy();
    });

    res.on( 'error', function( er ) {
      self.fn.call( null, er );
    });

    res.on( 'end', function() {
      if ( self.forced_date ) {
        self.date = self.forced_date;
        delete self.forced_date;
      }

      if ( date.getTime() > self.date.getTime() ) {
        self.date = date;
        self.fn.call( null, null, self );
      }
    });
  });

  h.on( 'error', function( e ) {
    console.log( e );
  });

};

httpGetter.prototype.start = function() {
	var self = this;

  if ( self.check_on_start ) {
    self.doCheck();
  }

	return setInterval( function() {
    self.doCheck();
	}, self.interval );
};

function nmon() {
	this.store = {};
	this.timers = {};
	this.count = 0;
	
	return this;
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
  var self = this,
  check_on_start = params.check_on_start || false;
	
	params.type = type;
	params.fn = function( e, o ) {
		if ( e ) {
			console.log( e );
			// throw e;
		} else {
			self.emit( o.name, o );
		}
	};

	self.store[ self.count ] = new httpGetter( params, check_on_start );

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
		self.timers[m] = s.start();
	}
};

exports = module.exports = nmon;
