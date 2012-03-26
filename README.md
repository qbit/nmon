# Nmon
Fire events when the http 'last-modified' header is changed for a file.

 [![Build Status](https://secure.travis-ci.org/qbit/nmon.png)](http://travis-ci.org/qbit/nmon)

 Currently only http is supported

## Usage

	npm install nmon
	
	var nmon = require( 'nmon' );
	var mon = new nmon();

	mon.create( 'http', {
		interval: 1000,
		name: 'potato',
		url: 'http://localhost:3000/file'
	});

	mon.on( 'potato', function( date ) {
		console.log( 'potato has been updated: %s', date );
	});

	mon.monitor();
