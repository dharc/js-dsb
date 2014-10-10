(function (global) {
	function DSB() {
		this.fabric = undefined;
		this.remote = "http://localhost:8888";
	};

	DSB.prototype.sendCommand = function(cmd,data,cb) {
		$.ajax({
			url: this.remote+cmd,
			dataType: "json",
			method: "POST",
			data: data,
			success: cb
		});
	};

	DSB.prototype.getFabrics = function(cb) {
		this.sendCommand("/fabrics","",cb);
	};

	// expose API
	global.DSB = DSB;
}(typeof window !== 'undefined' ? window : global));

