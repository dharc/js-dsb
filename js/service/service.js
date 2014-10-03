var http = require("http");
var url = require("url");
var fabric = require("./fabric");

function start() {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		var components = pathname.split('/');
		
		response.writeHead(200, {"Content-Type": "application/json"});
		
		if (components[1] == "fabrics") {
			response.write(JSON.stringify(fabric.list()));
		}
		else if (components[1] == "fabric") {
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
		}
		
		response.end();
	}

	http.createServer(onRequest).listen(8888);
}

exports.start = start;

