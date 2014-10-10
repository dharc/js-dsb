(function (global) {
	function DSB() {
		this.fabric = undefined;
		this.remote = "http://localhost:8888";
		this.username = "";
	};

	DSB.prototype.sendCommand = function(cmd,data,cb) {
		$.ajax({
			url: this.remote+cmd,
			dataType: "jsonp",
			method: "POST",
			data: data,
			success: cb
		});
	};

	DSB.prototype.getSessions = function(cb) {
		this.sendCommand("/user/"+this.username+"/sessions","",cb);
	};

	DSB.prototype.getFabrics = function(cb) {
		this.sendCommand("/fabrics","",cb);
	};

	DSB.prototype.login = function(username, password, cb) {
		this.sendCommand("/login","{username: \""+username+"\", password: \""+password+"\"}", function(data) {
			console.log(data);
			if (data === undefined || data.success === undefined) {
				cb(false,"Unable to contact server");
			} else {
				if (data.success == "true") {
					this.username = username;
					cb(true,"");
				} else {
					cb(false,data.reason);
				}
			}
		});
	};

	// expose API
	global.DSB = DSB;
}(typeof window !== 'undefined' ? window : global));

