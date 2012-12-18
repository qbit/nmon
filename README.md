# Nmon
Fire events when the http 'last-modified' header is changed for a file.

 [![Build Status](https://secure.travis-ci.org/qbit/nmon.png)](http://travis-ci.org/qbit/nmon)

 Currently only http is supported

## Usage

### Install

	npm install nmon

## Examples

### Monitoring a single file

```javascript

var nmon = require( 'nmon' );
var mon = new nmon();

mon.create( 'http', {
	interval: 1000,
	name: 'potato',
  // server: 'localhost', \_________ Ftp optoins
  // path: '/awesome',    /
	url: 'http://localhost:3000/file'
});

mon.on( 'potato', function( obj ) {
	console.log( 'potato has been updated: %s', obj.date );
});

mon.monitor();
```

## Monitoring multiple files 

```javascript

var nmon = require( 'nmon' );
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

  /*
  {
    interval: 1000,
    name: 'ftp1',
    server: 'localhost',
    path: '/awesome'
  }
  */
];


var i = 0, l = srs.length;
for ( ; i < l; i++ ) {
	var a = srs[i], type;

  if ( a.server ) {
    type = 'ftp';
  } else {
    type = 'http';
  }

	mon.create( type, a );
	mon.on( a.name, function( o ) {
		console.log( 'TEST', o.name, o.date );
	});
}

mon.monitor();
```
