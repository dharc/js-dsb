var crypto = require('crypto');

var projects = {};

function Project(name, description, author) {
	this.name = name;
	this.description = description;
	this.created = new Date();
	this.author = author;
	this.fabrics = {};
	this.views = {};
	this.layouts = {};
	this.workspaces = {};
}

Project.prototype.addFabric = function (name, fab) {
	this.fabrics[name] = fab;
};

Project.prototype.listFabrics = function() {
	var res = [];
	for (x in this.fabrics) {
		res.push({
			name: x,
			id: this.fabrics[x].id,
			handles: this.fabrics[x].listHandles(),
			oracles: this.fabrics[x].listOracles()
		});
	}
	return res;
};

function create(name, description, author) {
	var projid;
	projid = "p"+crypto.randomBytes(8).toString('hex');
	projects[projid] = new Project(name, description, author);
	return projid;
}

function get(projid) {
	return projects[projid];
}

function list() {
	var res = {};
	for (x in projects) {
		res[x] = {
			name: projects[x].name,
			description: projects[x].description,
			created: projects[x].created,
			author: projects[x].author,
		};
	}
	return res;
}

exports.create = create;
exports.list = list;
exports.get = get;
