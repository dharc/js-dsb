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

	DSBUI.prototype.updateFabrics = function() {
		this.dsb.getFabrics(function (data) {
				document.getElementById('casmoutput').innerHTML = JSON.stringify(data);
				console.log(data);
		});
	};

	// expose API
	global.DSBUI = DSBUI;
}(typeof window !== 'undefined' ? window : global));

