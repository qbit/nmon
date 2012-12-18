var EventEmitter = require( 'events' ).EventEmitter,
  Ftp = require( 'jsftp' ),
  http = require( 'http' ),
	url = require( 'url' );

function ftpGetter( opt, cos ) {
  if ( ! opt.server || ! opt.path ) {
    throw new Error( 'ftp needs server and path defined' );
  }
  this.server = opt.server;
  this.path = opt.path;
  this.user = opt.user;
  this.pass = opt.pass;
  this.port = opt.port || 21;
  this.date = new Date();
  this.name = opt.name; 
  this.type = opt.typek

	this.forced_date = opt.forced_date;
  this.check_on_start = cos;
  this.checks = 0;

	this.fn = opt.fn; 

	this.interval = opt.interval || 10 * 60000;

	return this;
}
ftpGetter.prototype.doCheck = function() {
  var self = this, f;
  f = new Ftp({
    host: self.server,
    port: self.port,
    user: self.user,
    pass: self.pass
  });

  f.ls( self.path, function( err, data ) {
    if ( err ) {
      self.fn.call( null, err );
    }
    var date = new Date( data[0].time );
    f.raw.quit( function() {
      if ( self.forced_date ) {
        self.date = self.forced_date;
        delete self.forced_date
      }

      if ( date.getTime() > self.date.getTime() ) {
        self.date = date;
        self.fn.call( null, null, self );
      }
    });
  });
};
ftpGetter.prototype.start = function() {
	var self = this;

  if ( self.check_on_start ) {
    self.doCheck();
  }

	return setInterval( function() {
    self.doCheck();
	}, self.interval );
};

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

  if ( type === 'http' ) {
    self.store[ self.count ] = new httpGetter( params, check_on_start );
  }

  if ( type === 'ftp' ) {
    self.store[ self.count ] = new ftpGetter( params, check_on_start );
  }

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
