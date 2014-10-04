var fs = require('fs');


module.exports = function scan(dir, alias){

	return {
		name: alias,
		type: 'folder',
		path: alias,
		items: walk(dir, alias)
	};

};


function walk(dir, prefix){

	prefix = prefix || '';

	if(!fs.existsSync(dir)){
		return [];
	}

	return fs.readdirSync(dir).filter(function(f){

		return f && f[0] != '.'; // Ignore hidden files

	}).map(function(f){

		var p = (dir + '/' + f).replace('./', ''),
			stat = fs.statSync(p);

		if(stat.isDirectory()){

			return {
				name: f,
				type: 'folder',
				path: prefix + '/' + p,
				items: walk(p, prefix)
			};

		}

		return {
			name: f,
			type: 'file',
			path: prefix + '/' + p,
			size: stat.size
		}

	});

};