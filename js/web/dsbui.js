(function (global) {
	function DSBUI(dsb) {
		this.dsb = dsb;
	};

	DSBUI.prototype.makeLayout = function() {
		$('#myLayout').w2layout({
		    name: 'myLayout',
		    panels: [ 
				{ type: 'top', size: 30, content: "<div id=\"myToolbar\"></div>" },
		        { type: 'left', size: 200, resizable: true, content: "<div id=\"mySidebar\" style=\"height: 450px;\"></div>" },
				{ type: 'main', content: "<div id=\"defaultview\">DSB</div>" }
		    ]
		});
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

	DSBUI.prototype.session = function() {
		w2popup.close();
		this.makeLayout();
		this.makeToolbar();
		this.makeSidebar();
	};

	DSBUI.prototype.showSessions = function() {
		var me = this;

		w2popup.open({
			title: 'Choose Session',
			body: '<div id="sessionGrid" style="height: 300px"></div>',
			buttons: '<button onclick="dsbui.session();">Load</button><button class="emph">New</button>',
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

	/*
	 * Display a signup popup window with a signup button.
	 */
	DSBUI.prototype.showSignup = function(title) {
		var me = this;

		//Create the popup
		$('#signuppopup').w2popup({
			title: title,
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
			me.dsb.signup(username,password,email,first,last, function(success,reason) {
				if (success == true) {
					me.showLogin("Sign-up Complete");
				} else {
					//Oops, try again
					me.showSignup(reason);
				}
			});
		});
	};

	DSBUI.prototype.showLogin = function(title) {
		var me = this;

		$('#loginpopup').w2popup({
			title: title,
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

			me.dsb.login(username,password, function(success,reason) {
				if (success == true) {
					me.showSessions();
				} else {
					me.showLogin(reason);
				}
			});
		});

		$('#btn_signup1').click(function() {
			me.showSignup("Sign-up");
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

