var nmon = require( __dirname + '/../lib/nmon.js' );

var mon = new nmon();

var params = {
	interval: 3000,
	name: 'file',
	url: 'http://localhost:3000/file'.replace( '3000', process.env['TEST_PORT'] ),
  forced_date: new Date( '1900' ),
  check_on_start: true
};

mon.create( 'http', params );

mon.on( 'file', function( o ) {
	console.log( 'file has been modified: %s', o.date );
});

mon.monitor();
