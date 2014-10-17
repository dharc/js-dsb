var http = require("http");
var url = require("url");
var fabric = require("./fabric");
var users = require("./users");
var projects = require("./projects");

var current_user;


/* ========== User service hooks ========== */

function h_user(query, vars, data, response) {
	var username = vars[0];
}


/* ========== Project service hooks ========== */

/*
 * Respond with a json hash of all projects in the following form:
 *		{
 *			<project id>: {
 *				id: <id>,
 *				name: <name>,
 *				description: <description>,
 *				author: <author>,
 *				created: <date>
 *			}, ...
 *		}
 */
function h_projects(query, vars, data, response) {
	response.write(JSON.stringify(projects.list()));
}

function h_project(query, vars, data, response) {
	var pro = projects.get(vars[0]);
	if (pro === undefined) {
		response.write("false");
		return;
	}
	response.write(JSON.stringify(pro.details()));
}

/*
 * Create a new project and return the unique id for it.
 *		name:			The projects name
 *		description:
 * Automatically sets the author to the authorised user and the creation date
 * to the current date/time.
 */
function h_projects_create(query, vars, data, response) {
	//Perform checks on parameters!!

	var projid = projects.create(query.name,query.description,current_user);

	//Initialise with a model fabric
	projects.get(projid).addFabric("model",fabric.get(fabric.create()));

	response.write('{"success": "true", "id": "'+projid+'"}');
}

function h_project_fabrics(query, vars, data, response) {
	var pro = projects.get(vars[0]);
	console.log(vars[0]);
	if (pro !== undefined) {
		response.write(JSON.stringify(pro.listFabrics()));
	} else {
		response.write("false");
	}
}

function h_project_fabrics_add(query, vars, data, response) {
	var pro = projects.get(vars[0]);
	var fab = fabric.get(query.fid);
	if (pro !== undefined && fab !== undefined) {
		pro.addFabric(query.name, fab);
		response.write('{"success": "true"}');
	} else {
		response.write('{"success": "false"}');
	}
}

function h_project_views(query, vars, data, response) {

}

function h_project_wspaces(query, vars, data, response) {

}

function h_project_layouts(query, vars, data, response) {

}


/* ========== Fabric service hooks ========== */

function h_fabric(query, vars, data, response) {

}

function h_fabrics(query, vars, data, response) {
	response.write(JSON.stringify(fabric.list()));
}

function h_fabrics_create(query, vars, data, response) {
	var fabid = fabric.create();
	response.write('{"success": "true", "id": "'+fabid+'"}');
}

function h_fabric_handles(query, vars, data, response) {
	var fab = fabric.get(vars[0]);
	if (fab === undefined) {
		response.write("false");
	} else {
		response.write(JSON.stringify(fab.listHandles()));
	}
}

function h_fabric_handles_create(query, vars, data, response) {
	var fab = fabric.get(vars[0]);
	if (fab === undefined) {
		response.write('{"success": "false"}');
	} else {
		fab.createHandle(query.name,query.rela,query.relb);
		response.write('{"success": "true"}');
	}
	
}

function h_fabric_handle(query, vars, data, response) {
	var fab = fabric.get(vars[0]);
	if (fab === undefined) {
		response.write("undefined");
	} else {
		var han = fab.getHandle(vars[1]);
		if (han === undefined) {
			response.write("undefined");
		} else {
			response.write(JSON.stringify(han.get()));
		}
	}
}

function h_fabric_oracles(query, vars, data, response) {
	response.write(JSON.stringify(fabric.get(vars[0]).listOracles()));
}

function h_fabric_oracles_create(query, vars, data, response) {
	var fab = fabric.get(vars[0]);
	if (fab === undefined) {
		response.write('{"success": "false"}');
	} else {
		fab.createOracle(query.name,query.rela,query.relb);
		response.write('{"success": "true"}');
	}
}

function h_fabric_oracle(query, vars, data, response) {
	var fab = fabric.get(vars[0]);
	if (fab === undefined) {
		response.write("undefined");
	} else {
		var han = fab.getOracle(vars[1]);
		if (han === undefined) {
			response.write("undefined");
		} else {
			if (query.value !== undefined) {
				han.set(query.value);
			}
			response.write(JSON.stringify(han.get()));
		}
	}
}


/* ========== Hooks Table ========== */

/* All registered service hooks, corresponding to the URL given */
var hooks = {
	"projects":			{ hook: h_projects, children: {
		"create":		{ hook: h_projects_create }
	}},
	"project":			{ hook: h_project, vars: 1, children: {
		"fabrics":		{ hook: h_project_fabrics, children: {
			"add":		{ hook: h_project_fabrics_add }
		}},
		"views":		{ hook: h_project_views },
		"wspaces":		{ hook: h_project_wspaces },
		"layouts":		{ hook: h_project_layouts }
	}},
	"fabrics":			{ hook: h_fabrics, children: {
		"create":		{ hook: h_fabrics_create }
	}},
	"fabric":			{ hook: h_fabric, vars: 1, children: {
		"handles":		{ hook: h_fabric_handles, children: {
			"create":	{ hook: h_fabric_handles_create }
		}},
		"oracles":		{ hook: h_fabric_oracles, children: {
			"create":	{ hook: h_fabric_oracles_create }
		}},
		"handle":		{ hook: h_fabric_handle, vars: 1 },
		"oracle":		{ hook: h_fabric_oracle, vars: 1 }
		//"get":		{ hook: h_fabric_get, vars: 2 },
		//"query":	{ hook: h_fabric_query, vars: 1 },
		//"handles":
			//"create":
		//"oracles":
			//"create":
		//"labels":
			//"create":
		//"label":
		//"relations":
		//"unique":
		//"set":
		//"handle":
			//"set":
		//"oracle":
			//"set":
	}},
	"user":			{ hook: h_user, vars: 1 }
};


/* ========== Main Service Functions ========== */

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
};

function start() {
	function onRequest(request, response) {
		var rurl = url.parse(request.url,true);
		var pathname = rurl.pathname;
		var callback = rurl.query.callback;
		var components = pathname.split('/');
		var vars = [];

		if (components[1] == "login") {
			var res = users.login(rurl.query.username,rurl.query.password);

			if (res.success == true) {
				response.writeHead(200, {
					"Set-Cookie": "dsbsessid="+res.sessid+"; httponly",
					"Content-Type": "application/json"
				});

				//Always login
				response.write(callback+'({"success": "true"});');
			} else {
				response.writeHead(200, {
					"Content-Type": "application/json"
				});
				response.write(callback+'({"success": "false", "reason": "'+res.reason+'"});');
			}
		} else if (components[1] == "signup") {
			var res = users.signup(rurl.query.username,
						rurl.query.password,
						rurl.query.email,
						rurl.query.first,
						rurl.query.last);

			if (res.success == true) {
				response.writeHead(200, {
					"Content-Type": "application/json"
				});

				response.write(callback+'({"success": "true"});');
			} else {
				response.writeHead(200, {
					"Content-Type": "application/json"
				});
				response.write(callback+'({"success": "false", "reason": "'+res.reason+'"});');
			}
		} else if (components[1] == "checklogin") {
			current_sessid = parseCookies(request).dsbsessid;

			response.writeHead(200, {
				"Content-Type": "application/json"
			});
			response.write(callback+"(");

			if (current_sessid === undefined || users.isLoggedIn(current_sessid) == false) {
					response.write('{"success": "false"}');
			} else {
					current_user = users.getName(current_sessid);
					response.write('{"success": "true", "username": "'+current_user+'"}');
			}

			response.write(");");
		} else {
			current_sessid = parseCookies(request).dsbsessid;

			if (current_sessid === undefined || users.isLoggedIn(current_sessid) == false) {
				response.writeHead(401, {});
				response.end();
				return;
			}

			current_user = users.getName(current_sessid);

			if (components[1] === undefined) {
				response.writeHead(404, {});
			} else {
				var curhook = hooks[components[1]];

				if (curhook === undefined) {
					response.writeHead(404, {});
				} else {
					var curid = 2;
					while (components[curid] !== undefined) {
						if (curhook.vars !== undefined) {
							var i;
							for (i=0; i<curhook.vars; i++) {
								vars.push(decodeURIComponent(components[curid]));
								curid++;
							}
						}
						if (components[curid] !== undefined) {
							if (curhook.children === undefined) {
								curhook = undefined;
								break;
							} else {
								curhook = curhook.children[components[curid]];
								curid++;
							}
						}
					}
					if (curhook === undefined) {
						response.writeHead(404, {});
					} else {
						response.writeHead(200, {
							"Content-Type": "application/json"
						});
						if (callback !== undefined) {
							response.write(callback+"(");
						}
						curhook.hook(rurl.query, vars, {}, response);
						if (callback !== undefined) {
							response.write(");");
						}
					}
				}
			}
		}
		
		response.end();
	}

	http.createServer(onRequest).listen(8888);
}

exports.start = start;

