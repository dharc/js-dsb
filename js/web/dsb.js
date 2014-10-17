var dsb = {};

(function (exports) {
	var fabric = undefined;
	var remote = "http://localhost:8888";
	var username = "";
	var project = undefined;
	var projects = {};

	function sendCommand(cmd,params,data,cb) {
		var qstring = "?";
		for (x in params) {
			if (qstring != "?") {
				qstring += "&";
			}
			qstring = qstring+x+"="+params[x];
		}

		$.ajax({
			type: "POST",
			url: remote+cmd+qstring,
			data: data,
			contentType: "application/json;charset=utf-8",
			success: cb,
			dataType: "jsonp"
		});
	}

	function getProjectName() {
		return project.name;
	}

	function getProjects(cb) {
		sendCommand(
		 "/projects",
		 {},
		 "",
		 function(data) {
			projects = data;
			cb(data);
		});
	}

	function setProject(projid, cb) {
		//project = projects[projid];
		sendCommand(
		 "/project/"+projid,
		 {}, undefined, function(data) {
			project = data;
			cb(data);
		});
	}

	function createProject(proname, prodesc, cb) {
		sendCommand(
		 "/projects/create",
		 {name: proname, description: prodesc},
		 undefined,
		 function(data) {
			if (data === undefined || data.success === undefined) {
				cb(false,"Unable to contact server");
			} else {
				if (data.success == "true") {
					projects[data.projectid] = {
						name: proname,
						description: prodesc,
						author: username,
						id: data.projectid
					};
					cb(true,"",data.projectid);
				} else {
					cb(false,data.reason,"");
				}
			}
		});
	}

	function getFabrics(cb) {
		sendCommand("/fabrics",{},"",cb);
	}

	/*
	 * Add a new named handle to a given fabric.
	 */
	function createHandle(fabid, hname, cb) {
		sendCommand(
			"/fabric/"+fabid+"/handles/create",
			{name: hname},
			undefined,
			cb
		);
	}

	/*
	 * Add a new named oracle to a given fabric.
	 */
	function createOracle(fabid, hname, cb) {
		sendCommand(
			"/fabric/"+fabid+"/oracles/create",
			{name: hname},
			undefined,
			cb
		);
	}

	function getOracle(fabid, hname, cb) {
		sendCommand(
			"/fabric/"+fabid+"/oracle/"+hname,
			{},
			undefined,
			cb
		);
	}

	function setOracle(fabid, hname, pvalue, cb) {
		sendCommand(
			"/fabric/"+fabid+"/oracle/"+hname,
			{value: pvalue},
			undefined,
			cb
		);
	}

	function getHandle(fabid, hname, cb) {
		sendCommand(
			"/fabric/"+fabid+"/handle/"+hname,
			{},
			undefined,
			cb
		);
	}

	/*
	 * Register a new user signup.
	 * Does not automatically log in if successful.
	 */
	function signup(name,pass,mail,firstn,lastn,cb) {
		sendCommand(
			"/signup",
			{username: name, password: pass, email: mail, first: firstn, last: lastn},
			undefined,
			function(data) {
				if (data === undefined || data.success === undefined) {
					cb(false,"Unable to contact server");
				} else {
					if (data.success == "true") {
						cb(true,"");
					} else {
						cb(false,data.reason);
					}
				}
			}
		);
	}

	/*
	 * Check if we already have a valid session cookie.
	 * Get the username if we do...
	 */
	function checkLogin(cb) {
		sendCommand("/checklogin",{},undefined, function(data) {
			if (data.success == "true") {
				username = data.username;
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
	function login(name, pass, cb) {
		sendCommand(
		 "/login",
		 {username: name, password: pass},
		 undefined,
		 function(data) {
			if (data === undefined || data.success === undefined) {
				cb(false,"Unable to contact server");
			} else {
				if (data.success == "true") {
					username = name;
					cb(true,"");
				} else {
					username = "";
					cb(false,data.reason);
				}
			}
		});
	}

	function getUsername() {
		return username;
	}

	// expose API
	exports.login = login;
	exports.signup = signup;
	exports.checkLogin = checkLogin;
	exports.getFabrics = getFabrics;
	exports.createProject = createProject;
	exports.setProject = setProject;
	exports.getProjects = getProjects;
	exports.getProjectName = getProjectName;
	exports.getUsername = getUsername;
	exports.createHandle = createHandle;
	exports.createOracle = createOracle;
	exports.getOracle = getOracle;
	exports.setOracle = setOracle;
	exports.getHandle = getHandle;
})(dsb);

