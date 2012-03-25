var http = require( 'http' ),
	fs = require( 'fs' ),
	server;

function send( f, res ) {
	f = f.replace( '/', '' );
	res.writeHead( 200 );
	fs.readFile( f, function( d ) {
		res.end( d );
	});
}

server = http.createServer( function( req, res ) {
	send( req.url, res );
}).listen( 3000 );
