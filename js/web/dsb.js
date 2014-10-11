(function (global) {
	function DSB() {
		this.fabric = undefined;
		this.remote = "http://localhost:8888";
		this.username = "";
	};

	DSB.prototype.sendCommand = function(cmd,data,cb) {
		$.ajax({
			type: "POST",
			url: this.remote+cmd,
			data: data,
			contentType: "application/json;charset=utf-8",
			success: cb,
			dataType: "jsonp"
		});
	};

	DSB.prototype.getSessions = function(cb) {
		this.sendCommand("/user/"+this.username+"/sessions","",cb);
	};

	DSB.prototype.getFabrics = function(cb) {
		this.sendCommand("/fabrics","",cb);
	};

	DSB.prototype.signup = function(username,password,email,first,last,cb) {
		this.sendCommand("/signup?username="+username+"&password="+password+"&email="+email+"&first="+first+"&last="+last,undefined, function(data) {
			if (data === undefined || data.success === undefined) {
				cb(false,"Unable to contact server");
			} else {
				if (data.success == "true") {
					cb(true,"");
				} else {
					cb(false,data.reason);
				}
			}
		});
	};

	DSB.prototype.login = function(username, password, cb) {
		this.sendCommand("/login?username="+username+"&password="+password,undefined, function(data) {
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

