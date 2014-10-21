var crypto = require('crypto');

var framers = {};

function Framer(framid, fab) {
	var me = this;

	this.fabric = fab;
	this.id = framid;
	this.relations = [];

	this.fabric.addGlobal('change', function(pa,pb) {
		var i;
		for (i=0; i<me.relations.length; i++) {
			if ((me.relations[i].a == pa) && (me.relations[i].b == pb)) {
				me.relations[i].c = me.fabric.get(pa,pb);
				return;
			}
		}
		me.relations.push({a: pa, b: pb, c: me.fabric.get(pa,pb)});
	});
}

Framer.prototype.dump = function() {
	return this.relations;
};

function create(fab) {
	var framid;
	framid = "w"+crypto.randomBytes(8).toString('hex');
	framers[framid] = new Framer(framid,fab);
	return framid;
}

function get(framid) {
	return framers[framid];
}

exports.create = create;
exports.get = get;
