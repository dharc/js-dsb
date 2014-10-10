(function (global) {
	function DSBUI(dsb) {
		this.dsb = dsb;
	};

	DSBUI.prototype.makeToolbar = function() {
		$('#myToolbar').w2toolbar({
		    name : 'myToolbar',
		    items: [
		        { type: 'check',  id: 'item1', caption: 'Check', img: 'icon-add', checked: true },
		        { type: 'break' },
		        { type: 'menu',   id: 'item2', caption: 'Fabric', img: 'icon-folder', 
		            items: [
		                { text: 'Connect', img: 'icon-page' }, 
		                { text: 'Disconnect', img: 'icon-page' }, 
		                { text: 'Item 3', img: 'icon-page' }
		            ]
		        },
		        { type: 'break' },
		        { type: 'radio',  id: 'item3',  group: '1', caption: 'Radio 1', img: 'icon-page' },
		        { type: 'radio',  id: 'item4',  group: '1', caption: 'Radio 2', img: 'icon-page' },
		        { type: 'spacer' },
		        { type: 'button',  id: 'item5',  caption: 'Item 5', img: 'icon-save' }
		    ]
		});
	};

	DSBUI.prototype.makeSidebar = function() {
		$('#mySidebar').w2sidebar({
		    name  : 'mySidebar',
		    img   : null,
		    nodes : [ 
		        { id: 'level-1', text: 'Workspaces', img: 'icon-folder', expanded: true, 
		            nodes: [ 
		                { id: 'level-1-1', text: 'My agent 1', img: 'icon-page' },
		                { id: 'level-1-2', text: 'Auto Agent 1', img: 'icon-page' }
		             ]
		        },
		        { id: 'level-2', text: 'Views', img: 'icon-folder',
		            nodes: [ 
		                { id: 'level-2-1', text: 'Level 2.1', img: 'icon-folder', 
		                    nodes: [
		                        { id: 'level-2-1-1', text: 'Level 2.1.1', img: 'icon-page' },
		                        { id: 'level-2-1-2', text: 'Level 2.1.2', img: 'icon-page' },
		                        { id: 'level-2-1-3', text: 'Level 2.1.3', img: 'icon-page' }
		                     ]
		                 },
		                { id: 'level-2-2', text: 'Level 2.2', img: 'icon-page' },
		                { id: 'level-2-3', text: 'Level 2.3', img: 'icon-page' }
		            ]
		        },
		        { id: 'level-3', text: 'Controls', img: 'icon-folder',
		            nodes: [
		                { id: 'level-3-1', text: 'Level 3.1', img: 'icon-page' },
		                { id: 'level-3-2', text: 'Level 3.2', img: 'icon-page' },
		                { id: 'level-3-3', text: 'Level 3.3', img: 'icon-page' }
		            ]
		        }
		    ],
		    onClick: function (event) {
		        console.log(event.target);
		    }
		});
	};

	DSBUI.prototype.login = function() {
		var username = $('#dsb_username')[0].value;
		var password = $('#dsb_password')[0].value;
		var me = this;

		//Do some validation checks before sending to server...

		this.dsb.login(username,password, function(success,reason) {
			if (success == true) {
				me.showSessions();
			} else {
				w2popup.open({title: reason});
			}
		});
	};

	DSBUI.prototype.showSessions = function() {
		var me = this;

		w2popup.open({
			title: 'Choose Session',
			body: '<div id="sessionGrid" style="height: 300px"></div>',
			buttons: '<button>Load</button><button>New</button>',
			modal: true,
			width: 400,
			height: 350,
			showClose: false,
			keyboard: false
		});
		w2popup.lock('',true);

		this.dsb.getSessions(function(sessions) {
			var items = [];
			var i;

			for (i=0; i<sessions.length; i++) {
				items.push({recid: i+1, sname: sessions[i].name, sdesc: '', sdate: ''});
			}

			w2popup.unlock();
			$('#sessionGrid').w2grid({ 
				name   : 'sessionGrid', 
				columns: [                
					{ field: 'sname', caption: 'Name', size: '40%' },
					{ field: 'sdesc', caption: 'Description', size: '50%' },
					{ field: 'sdate', caption: 'Date', size: '100px' }
				],
				records: items
			});
		});
	};

	DSBUI.prototype.showSignup = function() {
		w2popup.open({
			title: 'Sign-up',
			body: 'Username: <input type="text"><br/>Password: <input type="password">',
			buttons: '<button onclick="dsbui.signup();">Sign-up</button>',
			modal: true,
			width: 300,
			height: 200,
			showClose: false,
			keyboard: false
		});
	};

	DSBUI.prototype.showLogin = function() {
		w2popup.open({
			title: 'Login',
			body: '<div class="loginform"><div class="loginlabel">Username:</div> <input class="login" id="dsb_username" type="text"><br/><div class="loginlabel">Password:</div> <input id="dsb_password" type="password"></div>',
			buttons: '<button onclick="dsbui.login();">Login</button><button onclick="dsbui.showSignup();" class="emph">Sign-up</button>',
			modal: true,
			width: 350,
			height: 200,
			showClose: false,
			keyboard: false
		});
	};

	DSBUI.prototype.updateFabrics = function() {
		this.dsb.getFabrics(function (data) {
				document.getElementById('casmoutput').innerHTML = JSON.stringify(data);
				console.log(data);
		});
	};

	// expose API
	global.DSBUI = DSBUI;
}(typeof window !== 'undefined' ? window : global));

