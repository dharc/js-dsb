var fabrics = {};

function Relation(a,b) {
	this.a = a;
	this.b = b;
	this.c = undefined;
	this.definition = undefined;
	this.outofdate = false;
	this.dependants = new Array();
	this.significance = 0.0;
}

Relation.prototype.dependency = function(dep) {
	this.dependants.push(dep);
}

Relation.prototype.trigger = function() {
	var i;
	
	this.outofdate = true;
	
	for (i=0; i<this.dependants.length; i++) {
		this.dependants[i].trigger();
	}
	this.dependants = new Array();
}

Relation.prototype.getvalue = function() {
	if (this.outofdate == true) {
		this.c = this.evaluate(this.definition);
	}
	return this.c;
}

Relation.prototype.setvalue = function(value) {
	this.c = value;
	if (this.definition !== undefined) {
		this.definition = undefined;
	}
	this.trigger();
	this.outofdate = false;
}

function Fabric(name, descr) {
	this.name = name;
	this.description = descr;
	this.relations = {};
	
	fabrics[name] = this;
}

Fabric.prototype.query = function (a,n) {
	var node = this.relations[a];
	var count = n;
	var res = new Array();
	
	for (x in node) {
		res.push(x);
		count--;
		if (count <= 0) break;
	}
	return res;
}

Fabric.prototype.lookup = function(a,b) {
	var tmp = this.relations[a];
	if (tmp !== undefined) {
		return tmp[b];
	}
	return undefined;
}

Fabric.prototype.get = function(a,b) {
	var rel = this.lookup(a,b);
	if (rel !== undefined) {
		return rel.getvalue();
	} else {
		return "null";
	}
}

Fabric.prototype.set = function(a,b,c) {
	var rel = this.lookup(a,b);
	if (rel === undefined) {
		rel = new Relation(a,b);
		if (this.relations[a] === undefined) {
			this.relations[a] = {};
		}
		this.relations[a][b] = rel;
	}
	rel.setvalue(c);
}

function list() {
	var res = {};
	for (x in fabrics)
	{
		res[x] = fabrics[x].description;
	}
	return res;
}

function get(name) {
	return fabrics[name];
}

function create(name,descr) {
	new Fabric(name,descr);
}

exports.Fabric = Fabric;
exports.list = list;
exports.get = get;
