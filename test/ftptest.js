var nmon = require( __dirname + '/../lib/nmon.js' );

var mon = new nmon();

var params = {
	interval: 3000,
	name: 'file',
	path: '/pub/OpenBSD/snapshots/i386/SHA256',
	server: 'ftp3.usa.openbsd.org',
  forced_date: new Date( '1900' ),
  check_on_start: true
};

mon.create( 'ftp', params );

mon.on( 'file', function( o ) {
  console.log( 'file was modified %s', o.date );
});

mon.monitor();
