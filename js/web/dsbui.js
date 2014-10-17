var dsbui = {};

(function (global) {
	function requestFullScreen(element) {
		// Supports most browsers and their versions.
		var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

		if (requestMethod) { // Native full screen.
		    requestMethod.call(element);
		} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		    var wscript = new ActiveXObject("WScript.Shell");
		    if (wscript !== null) {
		        wscript.SendKeys("{F11}");
		    }
		}
	}

	function showCreateHandle(fabid) {
		$('#handlepopup').w2popup({
			title: '<span class="icon-flag"></span>&nbsp;Create Handle',
			buttons: '<button class="emph" id="btn_createhandle">Create</button><button>Cancel</button>',
			modal: false,
			showClose: true,
			width: 350,
			height: 200
		});

		$('#btn_createhandle').click(function(event) {
			w2popup.lock();
			dsb.createHandle(fabid, $('div#w2ui-popup #dsb_handlename')[0].value, function(data) {
				w2popup.close();
				//TODO Refresh sidebar.
			});
		});
	}

	function showCreateOracle(fabid) {
		$('#oraclepopup').w2popup({
			title: '<span class="icon-flag"></span>&nbsp;Create Oracle',
			buttons: '<button class="emph" id="btn_createoracle">Create</button><button>Cancel</button>',
			modal: false,
			showClose: true,
			width: 350,
			height: 250
		});

		$('#btn_createoracle').click(function(event) {
			w2popup.lock();
			dsb.createOracle(fabid, $('div#w2ui-popup #dsb_oraclename')[0].value, $('div#w2ui-popup #dsb_oraclegroup')[0].value, function(data) {
				w2popup.close();
				//TODO Refresh sidebar.
			});
		});
	}

	function showAddFabric() {
		$('#addfabpopup').w2popup({
			title: '<span class="icon-tree"></span>&nbsp;Add Fabric',
			buttons: '<button class="emph" id="btn_addfab">Add</button><button>Cancel</button>',
			modal: false,
			showClose: true,
			width: 350,
			height: 250
		});

		$('#btn_addfab').click(function(event) {
			var fabid = $('div#w2ui-popup #dsb_fabexisting')[0].value;
			var fabname = $('div#w2ui-popup #dsb_fabname')[0].value;
			w2popup.lock();

			if (fabid == "[new]") {
				dsb.createFabric(function(data) {
					dsb.addFabric(fabname,data.id, function(data) {
						w2popup.close();
						//TODO Refresh sidebar.
					});
				});
			}
		});
	}

	function showHandle(fabid, hname) {
		/*$('#viewhandlepopup').w2popup({
			title: '<span class="icon-flag"></span>&nbsp;Handle: "'+hname+'"',
			buttons: '<button>Close</button>',
			modal: false,
			showClose: true,
			width: 350,
			height: 200
		});

		w2popup.lock();
		dsb.getHandle(fabid, hname, function(val) {
			w2popup.unlock();
			$('div#w2ui-popup #dsb_handlevalue')[0].value = val;
		});*/

		$('#viewhandlewin').dsbWindow({ title: "group."+hname, type: "handle", width: 200, height: "auto" });
	}

	function showOracle(fabid, hname) {
		/*$('#vieworaclepopup').w2popup({
			title: '<span class="icon-flag"></span>&nbsp;Oracle: "'+hname+'"',
			buttons: '<button id="btn_saveoracle" class="emph">Save</button><button>Close</button>',
			modal: false,
			showClose: true,
			width: 350,
			height: 200
		});

		w2popup.lock();*/

		var win = $('#vieworaclewin').dsbWindow({ title: "group."+hname, type: "oracle", width: 220, height: "auto" });

		dsb.getOracle(fabid, hname, function(val) {
			//w2popup.unlock();
			win.getElement().find('#dsb_oraclevalue')[0].value = val;
		});

		win.getElement().find('#btn_saveoracle').click(function(event) {
			dsb.setOracle(fabid,hname,win.getElement().find('#dsb_oraclevalue')[0].value, function() {
				//w2popup.close();
			});
		});
	}

	function makeLayout() {
		$('#myLayout').w2layout({
		    name: 'myLayout',
		    panels: [ 
				{ type: 'top', size: 27 },
		        { type: 'left', size: 300, resizable: true, content: '<div class="sidebuttons"><button id="btn_dsbcreate" class="small"><span class="icon-plus"></span></button><button class="small"><span class="icon-minus"></span></button><button class="small"><span class="icon-pencil"></span></button><button class="small"><span class="icon-copy"></span></button></div><div id="mySidebar" style="height: 450px;"></div>' },
				{ type: 'main', content: "<div id=\"defaultview\"></div>" }
		    ]
		});

		$('#btn_dsbcreate').click(function(event) {
			if (w2ui['mySidebar'].selected.match(/^.*handles$/)) {
				showCreateHandle(w2ui['mySidebar'].get(w2ui['mySidebar'].selected).parent.fabid);
			} else if (w2ui['mySidebar'].selected.match(/^.*oracles$/)) {
				showCreateOracle(w2ui['mySidebar'].get(w2ui['mySidebar'].selected).parent.fabid);
			} else if (w2ui['mySidebar'].selected.match(/^fabric-level$/)) {
				showAddFabric();
			}
		});
	}

	function makeToolbar() {
		$('#myToolbar').w2toolbar({
		    name : 'myToolbar',
		    items: [
				{ type: 'menu', id: 'projectmenu', caption: '<span class="icon-notebook"></span>&nbsp;'+dsb.getProjectName(), items: [
						{ text: 'Hide Side-bar', id: "itemsb" },
						{ text: 'Full Screen', id: "itemfs"},
						{ text: 'Close All', id: "itemca" },
						{ text: 'Project Properties', id: 'itempp' },
						{ text: 'Release Mode', id: 'itemrm' }
					]},
				{ type: 'spacer' },
				{ type: 'menu', id: 'usermenu', caption: '<span class="icon-user"></span>&nbsp;'+dsb.getUsername(), items: [
						{ text: '<span class="icon-books"></span>&nbsp;Switch Project', id: 'userpro' },
						{ text: '<span class="icon-cog"></span>&nbsp;Preferences', id: 'userpref' },
						{ text: '<span class="icon-switch"></span>&nbsp;Log Out', id: 'userlogout' }
					]}
		    ],
			onClick: function(event) {
				console.log(event);
				if (event.target == "viewmenu:itemfs") {
					requestFullScreen($('#defaultview')[0]);
				}
			}
		});
	}

	function makeSidebar(prodata) {
		var mainnodes = [];
		var nodel1;
		var nodel2;
		var nodel3;
		var nodel4;
		var nodel5;
		var i;
		var j;

		nodel1 = { id: 'project-level', text: prodata.name, img: 'icon-notebook', expanded: true, nodes: [] };
		nodel2 = { id: 'fabric-level', text: "Fabrics", img: 'icon-folder', nodes: [] };
		nodel1.nodes.push(nodel2);

		for (i=0; i<prodata.fabrics.length; i++) {
			nodel3 = { id: 'fabric-'+i, index: i, fabid: prodata.fabrics[i].id, text: prodata.fabrics[i].name, img: 'icon-tree', nodes: [], onDblClick: function(event) {
				if (event.object.isopen != true) {
					new DSBWindow({ title: prodata.fabrics[event.object.index].name, type: "fabric", object: event.object });
					event.object.isopen = true;
				}
			}};

			nodel4 = { id: 'fabric-'+i+'handles', text: "Handles", img: 'icon-folder', nodes: [] };
			for (j=0; j<prodata.fabrics[i].handles.length; j++) {
				nodel5 = { id: 'fabric-'+i+'handle-'+j, text: prodata.fabrics[i].handles[j], img: 'icon-flag', onDblClick: function(event) {
					showHandle(event.object.parent.parent.fabid, event.object.text);
				}};
				nodel4.nodes.push(nodel5);
			}
			nodel3.nodes.push(nodel4);

			nodel4 = { id: 'fabric-'+i+'oracles', text: "Oracles", img: 'icon-folder', nodes: [] };
			for (j=0; j<prodata.fabrics[i].oracles.length; j++) {
				nodel5 = { id: 'fabric-'+i+'oracle-'+j, text: prodata.fabrics[i].oracles[j], img: 'icon-eye', onDblClick: function(event) {
					showOracle(event.object.parent.parent.fabid, event.object.text);
				}};
				nodel4.nodes.push(nodel5);
			}
			nodel3.nodes.push(nodel4);

			nodel2.nodes.push(nodel3);
		}

		nodel2 = { id: 'views-level', text: "Views", img: 'icon-folder', nodes: [] };
		nodel3 = { id: 'view-1', text: "View1", img: 'icon-screen', nodes: [], onDblClick: function(event) {
			if (event.object.isopen != true) {
				new DSBWindow({ title: "View1", type: "view", object: event.object });
				event.object.isopen = true;
			}
		}};
		nodel4 = { id: 'view-1-fabric', text: "fabric", img: 'icon-tree' };
		nodel3.nodes.push(nodel4);
		nodel4 = { id: 'view-1-actions', text: "actions", img: 'icon-folder', onDblClick: function(event) {
			console.log("ACTIONS");
		}};
		nodel3.nodes.push(nodel4);
		nodel2.nodes.push(nodel3);
		nodel1.nodes.push(nodel2);
		nodel2 = { id: 'workspace-level', text: "Workspaces", img: 'icon-folder', nodes: [] };
		nodel1.nodes.push(nodel2);

		mainnodes.push(nodel1);

		$('#mySidebar').w2sidebar({
		    name  : 'mySidebar',
		    img   : null,
		    nodes : mainnodes,
		    onClick: function (event) {
		        console.log(event.target);
		    }
		});
	}

	/*
	 * A project has been selected so download project data and then
	 * configure the screen.
	 */
	function setProject(proname) {
		dsb.setProject(proname, function(prodata) {
			makeLayout();
			makeToolbar();
			makeSidebar(prodata);
			//new DSBWindow({title: "My Workspace", type: "workspace"});
			//new DSBWindow({title: "View1"});
		});
	}

	function showProjects() {
		w2popup.open({
			title: '<span class="icon-books"></span>&nbsp;'+'Choose Project',
			body: '<div id="projectGrid" style="height: 300px"></div>',
			buttons: '<button class="emph" id="btn_playproject"><span class="icon-play2"></span>&nbsp;&nbsp;Play</button><button id="btn_loadproject"><span class="icon-pencil"></span>&nbsp;&nbsp;Edit</button><button id="btn_newproject"><span class="icon-plus"></span>&nbsp;&nbsp;New</button>',
			modal: true,
			width: 500,
			height: 350,
			showClose: false,
			keyboard: false
		});
		w2popup.lock('',true);

		$('#btn_loadproject').click(function() {
			w2popup.close();
			setProject(w2ui['projectGrid'].getSelection()[0]);
		});

		$('#btn_newproject').click(function() {
			showCreateProject("New Project");
		});

		dsb.getProjects(function(projects) {
			var items = [];
			var i;

			for (x in projects) {
				items.push({recid: x, sname: projects[x].name, sdesc: projects[x].description, sdate: projects[x].created});
			}

			w2popup.unlock();
			$('#projectGrid').w2grid({ 
				name   : 'projectGrid', 
				columns: [                
					{ field: 'sname', caption: 'Name', size: '40%' },
					{ field: 'sdesc', caption: 'Description', size: '50%' },
					{ field: 'sdate', caption: 'Date', size: '100px' }
				],
				records: items
			});
		});
	}

	/*
	 * Display a signup popup window with a signup button.
	 */
	function showSignup(title) {
		//Create the popup
		$('#signuppopup').w2popup({
			title: '<span class="icon-users"></span>&nbsp;'+title,
			buttons: '<button id="btn_signup2" class="emph">Sign-up</button>',
			modal: true,
			width: 350,
			height: 300,
			showClose: false,
			keyboard: false
		});

		//Check the username is alphanumeric and long enough
		$('div#w2ui-popup #dsb_susername').keyup(function() {
			if (this.value.search(/^[a-zA-Z0-9]+$/ig) == -1) {
				$(this).removeClass("valid").addClass("invalid");
			} else {
				$(this).removeClass("invalid").addClass("valid");
			}
		});

		//Check the password is long/complex enough
		$('div#w2ui-popup #dsb_spassword').keyup(function() {
			if (this.value.length < 8) {
				$(this).removeClass("valid").addClass("invalid");
			} else {
				$(this).removeClass("invalid").addClass("valid");
			}
		});

		//Check the confirm password is same as password
		$('div#w2ui-popup #dsb_sconfirm').keyup(function() {
			var password = $('div#w2ui-popup #dsb_spassword')[0].value;
			if (this.value != password) {
				$(this).removeClass("valid").addClass("invalid");
			} else {
				$(this).removeClass("invalid").addClass("valid");
			}
		});

		//Check the e-mail is an e-mail address
		$('div#w2ui-popup #dsb_semail').keyup(function() {
			if (this.value.search(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/ig) == -1) {
				$(this).removeClass("valid").addClass("invalid");
			} else {
				$(this).removeClass("invalid").addClass("valid");
			}
		});

		//When the sign-up button is clicked...
		$('#btn_signup2').click(function () {
			var username = $('div#w2ui-popup #dsb_susername')[0].value;
			var password = $('div#w2ui-popup #dsb_spassword')[0].value;
			var confirm = $('div#w2ui-popup #dsb_sconfirm')[0].value;
			var email = $('div#w2ui-popup #dsb_semail')[0].value;
			var first = $('div#w2ui-popup #dsb_sfirst')[0].value;
			var last = $('div#w2ui-popup #dsb_slast')[0].value;

			//Send request to server and check result
			dsb.signup(username,password,email,first,last, function(success,reason) {
				if (success == true) {
					showLogin("Sign-up Complete");
				} else {
					//Oops, try again
					showSignup(reason);
				}
			});
		});
	};

	/*
	 * Display a create project popup window.
	 */
	function showCreateProject(title) {
		//Create the popup
		$('#createprojectpopup').w2popup({
			title: '<span class="icon-notebook"></span>&nbsp;'+title,
			buttons: '<button id="btn_createproject" class="emph">Create</button><button id="btn_procancel">Cancel</button>',
			modal: true,
			width: 350,
			height: 200,
			showClose: false,
			keyboard: false
		});

		//Check the project name is long enough
		$('div#w2ui-popup #dsb_projectname').keyup(function() {
			if (this.value.length < 6) {
				$(this).removeClass("valid").addClass("invalid");
			} else {
				$(this).removeClass("invalid").addClass("valid");
			}
		});

		$('#btn_procancel').click(function () {
			showProjects();
		});

		//When the sign-up button is clicked...
		$('#btn_createproject').click(function () {
			var proname = $('div#w2ui-popup #dsb_projectname')[0].value;
			var prodesc = $('div#w2ui-popup #dsb_projectdesc')[0].value;

			//Send request to server and check result
			dsb.createProject(proname,prodesc, function(success,reason,projid) {
				if (success == true) {
					w2popup.close();
					setProject(projid);
					console.log(projid);
				} else {
					//Oops
					//Show error.
				}
			});
		});
	};

	function showLogin(title) {
		$('#loginpopup').w2popup({
			title: '<span class="icon-users"></span>&nbsp;'+title,
			buttons: '<button id="btn_login">Login</button><button id="btn_signup1" class="emph">Sign-up</button>',
			modal: true,
			width: 350,
			height: 200,
			showClose: false,
			keyboard: false
		});

		$('#btn_login').click(function() {
			var username = $('div#w2ui-popup #dsb_username')[0].value;
			var password = $('div#w2ui-popup #dsb_password')[0].value;

			//Do some validation checks before sending to server...

			dsb.login(username,password, function(success,reason) {
				if (success == true) {
					showProjects();
				} else {
					showLogin(reason);
				}
			});
		});

		$('#btn_signup1').click(function() {
			showSignup("Sign-up");
		});
	};

	// expose API
	global.showLogin = showLogin;
	global.showProjects = showProjects;
}(typeof dsbui !== 'undefined' ? dsbui : global));

