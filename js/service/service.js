var http = require("http");
var url = require("url");
var fabric = require("./fabric");
var users = require("./users");

function h_fabrics(query, vars, data, response) {
	response.write(JSON.stringify(fabric.list()));
}

/*function hook_fabric(rurl, components, content, response) {
	if (components[3] == "create") {
		new fabric.Fabric(components[2],"");
		response.write(JSON.stringify(fabric.get(components[2])));
	} else {
		var fab = fabric.get(components[2]);
		if (fab !== undefined) {
			if (components[3] == "get") {
				response.write(fab.get(components[4],components[5]));
			} else if (components[3] == "set") {
				fab.set(components[4],components[5],components[6]);
				response.write(components[6]);
			} else if (components[3] == "query") {
				response.write(JSON.stringify(fab.query(components[4],10)));
			}
		}
	}
}*/

function h_fabric_create(query, vars, data, response) {
	new fabric.Fabric(vars[0],"");
	response.write(JSON.stringify(fabric.get(vars[0])));
}

function h_user(query, vars, data, response) {
	var username = vars[0];
}

/*
 * Provide a list of saved sessions for a given user.
 *    /user/<username>/sessions
 */
function h_sessions(query, vars, data, response) {
	var username = vars[0];
	response.write('[{"name": "Autosaved"}]');
}

function h_fabric(query, vars, data, response) {

}

/* All registered service hooks, corresponding to the URL given */
var hooks = {
	"fabrics":		{ hook: h_fabrics },
	"fabric":		{ hook: h_fabric, vars: 1, children: {
		//"get":		{ hook: h_fabric_get, vars: 2 },
		//"query":	{ hook: h_fabric_query, vars: 1 },
		"create":	{ hook: h_fabric_create }
	}},
	"user":			{ hook: h_user, vars: 1, children: {
		"sessions": { hook: h_sessions }
	}}
};

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
					"Set-Cookie": "usercode="+res.sessid+"; httponly",
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
		} else {
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
								vars.push(components[curid]);
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
						response.write(callback+"(");
						curhook.hook(rurl.query, vars, {}, response);
						response.write(");");
					}
				}
			}
		}
		
		response.end();
	}

	http.createServer(onRequest).listen(8888);
}

exports.start = start;

