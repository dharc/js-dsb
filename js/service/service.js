var http = require("http");
var url = require("url");
var fabric = require("./fabric");

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
		
		if (components[1] == "fabrics") {
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "http://localhost:8000"
			});
			response.write(callback+"(");
			response.write(JSON.stringify(fabric.list()));
			response.write(");");
		}
		else if (components[1] == "fabric") {
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "http://localhost:8000"
			});

			response.write(callback+"(");

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

			response.write(");");
		} else if (components[1] == "user") {
			var username = components[2];
			if (components[3] == "sessions") {
				response.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "http://localhost:8000"
				});
				response.write(callback+'([{"name": "Autosaved"}]);');
			}
		} else if (components[1] == "login") {
			response.writeHead(200, {
				"Set-Cookie": "usercode=dummycode; httponly",
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "http://localhost:8000"
			});

			//Always login
			response.write(callback+'({"success": "true"});');
		} else {
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "http://localhost:8000"
			});
			response.write(callback+"({});");
		}
		
		response.end();
	}

	http.createServer(onRequest).listen(8888);
}

exports.start = start;

