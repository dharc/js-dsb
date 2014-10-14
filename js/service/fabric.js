var crypto = require('crypto');

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


/* ========== Handle ========== */

function Handle(fabric, rela, relb) {
	this.fabric = fabric;
	this.rela = rela;
	this.relb = relb;
	this.oracles = [];
	//Add trigger
}

Handle.prototype.addOracle = function(oracle) {
	this.oracles.push(oracle);
};

Handle.prototype.notify = function(value) {
	var i;
	for (i=0; i<this.oracles.length; i++) {
		this.oracles[i].notify(value);
	}
};

/* ========== Oracle ========== */

function Oracle(fabric, rela, relb) {
	this.fabric = fabric;
	this.rela = rela;
	this.relb = relb;
	this.handles = [];
}

Oracle.prototype.addHandle = function(handle) {
	this.handles.push(handle);
};

Oracle.prototype.notify = function(value) {
	this.fabric.set(this.rela,this.relb,value);
};


/* ========== Fabric ========== */

function Fabric(id, ssf) {
	this.id = id;
	this.relations = {};
	this.handles = {};
	this.oracles = {};
	this.serverside = ssf;
	this.firstfree = [100,0];
}

Fabric.prototype.createNode = function() {
	//Return a new node id
	return "0:0";
};

Fabric.prototype.createOracle = function(name, rela, relb) {
	var prela = rela;
	var prelb = relb;
	if (prela === undefined) {
		prela = this.createNode();
	}
	if (prelb === undefined) {
		prelb = this.createNode();
	}
	this.oracles[name] = new Oracle(this, prela, prelb);
};

Fabric.prototype.createHandle = function(name, rela, relb) {
	var prela = rela;
	var prelb = relb;
	if (prela === undefined) {
		prela = this.createNode();
	}
	if (prelb === undefined) {
		prelb = this.createNode();
	}
	this.handles[name] = new Handle(this, prela, prelb);
};

Fabric.prototype.listOracles = function() {
	var res = [];
	for (x in this.oracles) {
		res.push(x);
	}
	return res;
};

Fabric.prototype.listHandles = function() {
	var res = [];
	for (x in this.handles) {
		res.push(x);
	}
	return res;
};

Fabric.prototype.getHandle = function(name) {
	return this.handles[name];
};

Fabric.prototype.getOracle = function(name) {
	return this.oracles[name];
};

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
	var res = [];
	for (x in fabrics)
	{
		res.push(x);
	}
	return res;
}

function get(fabid) {
	return fabrics[fabid];
}

function create() {
	var fabid;
	fabid = "f"+crypto.randomBytes(8).toString('hex');
	fabrics[fabid] = new Fabric(fabid);
	return fabid;
}

function connect(handle, oracle) {
	handle.addOracle(oracle);
	oracle.addHandle(handle);
}

//exports.Fabric = Fabric;
exports.list = list;
exports.get = get;
exports.create = create;
exports.connect = connect;
