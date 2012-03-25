var nmon = require( __dirname + '/../lib/nmon.js' );
var mon = new nmon();
var srs = [
	{ 
		interval: 1000,
		name: 'file1',
		url: 'http://localhost:3000/file1',
	},

	{ 
		interval: 1000,
		name: 'file2',
		url: 'http://localhost:3000/file2',
	},
];


var i = 0, l = srs.length;
for ( ; i < l; i++ ) {
	var a = srs[i]
	mon.create( 'http', a );
	mon.on( a.name, function( o ) {
		console.log( 'TEST', o.name, o.date );
	});
}

mon.monitor();
