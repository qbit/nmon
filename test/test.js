var nmon = require( __dirname + '/../lib/nmon.js' );

var mon = new nmon();

var params = {
	interval: 1000,
	name: 'file',
	url: 'http://localhost:3000/file',
};

mon.create( 'http', params );

mon.on( 'file', function( o ) {
	console.log( 'file has been modified: %s', o.date );
});

mon.monitor();
