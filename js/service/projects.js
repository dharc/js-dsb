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

function create(name, description, author) {
	projects[name] = new Project(name, description, author);
}

function list() {
	var res = [];
	for (x in projects) {
		res.push({
			name: x,
			description: projects[x].description,
			created: projects[x].created,
			author: projects[x].author,
		});
	}
	return res;
}

exports.create = create;
exports.list = list;
