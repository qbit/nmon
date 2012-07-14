var http = require( 'http' ),
	fs = require( 'fs' ),
	server;

function send( f, res ) {
  console.log( f );
	f = f.replace( '/', '' );
	res.writeHead( 200 );
  console.log( __dirname + '/' + f );
	fs.readFile( __dirname + '/' + f, function( d ) {
    if ( d ) {
      res.end( d );
    }
	});
}

server = http.createServer( function( req, res ) {
	send( req.url, res );
}).listen( process.env['TEST_PORT'] );

console.log( 'listening on : ' + process.env['TEST_PORT'] );
