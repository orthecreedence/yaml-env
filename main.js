var fs = require('fs');
var yaml = require('js-yaml');

exports.load = function(prefix, yaml_file) {
	if(!yaml_file) throw new Error('invalid yaml file given');
	var contents = fs.readFileSync(yaml_file);
	var config_obj = yaml.safeLoad(contents);

	function check_env(path, default_val) {
		var key = (prefix+'_'+path.join('_')).toUpperCase();
		var val = process.env[key];
		if(typeof(val) == 'undefined') {
			val = default_val;
		}
		return val;
	}

	function walk_obj(obj, path) {
		var whole_val = check_env(path, null);
		if(whole_val) {
			try {
				return JSON.parse(whole_val);
			} catch(e) {}
		}
		if(Array.isArray(obj)) {
			for(var i = 0; i < obj.length; i++) {
				obj[i] = walk_obj(obj[i], path.concat([i]));
			}
		} else if(obj !== null && typeof(obj) == 'object') {
			Object.keys(obj).forEach(function(key) {
				obj[key] = walk_obj(obj[key], path.concat([key]));
			});
		} else {
			obj = check_env(path, obj);
		}
		return obj;
	}
	config_obj = walk_obj(config_obj, []);
	return config_obj;
};

