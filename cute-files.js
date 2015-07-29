#!/usr/bin/env node

var spawn  = require('child_process').spawn;
var bin = 'google-chrome';
var os = require('os');
var fs     = require('fs');

var path = require('path');
var express = require('express');
var contentDisposition = require('content-disposition');
var pkg = require( path.join(__dirname, 'package.json') );

var scan = require('./scan');

var darwinBin = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      , '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
      , '/opt/homebrew-cask/Caskroom/google-chrome/stable-channel/Google Chrome.app/Contents/MacOS/Google Chrome'
      , '/opt/homebrew-cask/Caskroom/google-chrome/latest/Google Chrome.app/Contents/MacOS/Google Chrome'
];
var linuxBin = [
        '/usr/bin/google-chrome'
      , '/usr/bin/chromium-browser'
      , '/usr/bin/chromium'
];

if (os.platform() == 'darwin') {
  bin = darwinBin.reduce(function (p, c) {
    if (p)
        return p;
      return fs.existsSync(c) && c;
  }, null);

  if (!bin)
      throw(new Error('Chrome or Canary were not found'));
}

if (os.platform() == 'linux') {
  bin = linuxBin.reduce(function (p, c) {
    if (p)
        return p;
      return fs.existsSync(c) && c;
  }, null);

  if (!bin)
      throw(new Error('Chrome or Chromium were not found'));
}

// Parse command line options

var program = require('commander');

program
	.version(pkg.version)
	.option('-p, --port <port>', 'Port on which to listen to (defaults to 3000)', parseInt)
	.parse(process.argv);

var port = program.port || 3000;

var args   = [
        '--app=http://localhost:' + port
      , '--disk-cache-size 0'
      , '--no-proxy-server'
];


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

if (process.env.HOME)
    args.push('--user-data-dir=' + path.join(process.env.HOME, '.cute-files'));

if (fs.existsSync(bin)) 
    spawn(bin, args)
        .on('exit', process.exit.bind(process, 0))
        .stderr.pipe(process.stderr);


