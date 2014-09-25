#!/usr/bin/env node

var path = require('path');
var express = require('express');
var contentDisposition = require('content-disposition');
var pkg = require( path.join(__dirname, 'package.json') );

var scan = require('./scan');


// Parse command line options

var program = require('commander');

program
	.version(pkg.version)
	.option('-p, --port <port>', 'Port on which to listen to (defaults to 3000)', parseInt)
	.parse(process.argv);

var port = program.port || 3000;


// Scan the directory in which the script was called. It will
// add the 'files/' prefix to all files and folders, so that
// download links point to our /files route

var tree = scan('.', 'files');


// Ceate a new express app

var app = express();

// Serve static files from the frontend folder

app.use('/', express.static(path.join(__dirname, 'frontend')));

// Serve files from the current directory under the /files route

app.use('/files', express.static(process.cwd(), {
	index: false,
	setHeaders: function(res, path){

		// Set header to force files to download

		res.setHeader('Content-Disposition', contentDisposition(path))

	}
}));

// This endpoint is requested by our frontend JS

app.get('/scan', function(req,res){
	res.send(tree);
});


// Everything is setup. Listen on the port.

app.listen(port);

console.log('Cute files is running on port ' + port);