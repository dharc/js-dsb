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

	DSB.prototype.getProjects = function(cb) {
		this.sendCommand("/projects","",cb);
	};

	DSB.prototype.getFabrics = function(cb) {
		this.sendCommand("/fabrics","",cb);
	};

	/*
	 * Register a new user signup.
	 * Does not automatically log in if successful.
	 */
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

	/*
	 * Check if we already have a valid session cookie.
	 * Get the username if we do...
	 */
	DSB.prototype.checkLogin = function(cb) {
		var me = this;

		this.sendCommand("/checklogin",undefined, function(data) {
			if (data.success == "true") {
				me.username = data.username;
				cb(data.username);
			} else {
				cb(undefined);
			}
		});
	}

	/*
	 * Send a login request to the service.
	 * This will automatically set a session cookie if valid.
	 */
	DSB.prototype.login = function(username, password, cb) {
		var me = this;

		this.sendCommand("/login?username="+username+"&password="+password,undefined, function(data) {
			if (data === undefined || data.success === undefined) {
				cb(false,"Unable to contact server");
			} else {
				if (data.success == "true") {
					me.username = username;
					cb(true,"");
				} else {
					me.username = "";
					cb(false,data.reason);
				}
			}
		});
	};

	// expose API
	global.DSB = DSB;
}(typeof window !== 'undefined' ? window : global));

