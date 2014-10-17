/* Support draggables in jQuery */
(function($) {
	$.fn.dsbWindow = function(opt) {
		var win = new DSBWindow(opt);
		win.setContent(this.html());
		return win;
	};

    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = opt.handle;//this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);

(function (global) {
	var dsbwindows = {};

	function DSBWindow(options) {
		this.outer = undefined;
		this.titlebar = undefined;
		this.content = undefined;
		var typeicon;
		var dwidth = 300;
		var dheight = 250;

		if (options.name !== undefined) {
			dsbwindows[options.name] = this;
		}

		if (options.width !== undefined) {
			dwidth = options.width;
		}
		if (options.height !== undefined) {
			dheight = options.height;
		}

		this.content = jQuery('<div/>', {
			class: "dsbwindow-content"
		});

		//Change icon depending upon window type
		switch (options.type) {
		case "view": typeicon = "icon-screen"; break;
		case "workspace": typeicon = "icon-lab"; break;
		case "fabric": typeicon = "icon-tree"; break;
		case "handle": typeicon = "icon-flag"; break;
		case "oracle": typeicon = "icon-eye"; break;
		}

		this.titlebar = jQuery('<div/>', {
			class: "dsbwindow-title",
			html: "<table class=\"dsbtitlemenu\" cellpadding=\"1\" cellspacing=\"0\"><tr><td class=\"w2ui-tb-caption\" nowrap>"+'<span class="'+typeicon+'"></span>&nbsp;&nbsp;&nbsp;'+options.title+"&nbsp;&nbsp;</td><td class=\"w2ui-tb-down\" nowrap><div class=\"dsbdown\"></div></td></tr></table>"
		});

		var titbut = this.titlebar.find(".dsbtitlemenu");

		//Display a menu when title is clicked.
		titbut.click(function(e) {
			$(this).w2menu({
				items: [
					{ id: 1, text: "Maximize" },
					{ id: 2, text: "<span class='icon-close'></span>&nbsp;&nbsp;Close"}
				],
				onSelect: function(event) { options.object.isopen = false; outer.remove(); }
			});
		});
		titbut.mouseenter(function() {
			$(this).addClass("dsbhover");
		});
		titbut.mouseleave(function() {
			$(this).removeClass("dsbhover");
		});
		titbut.mousedown(function(e) {
			e.stopPropagation();
		});
		titbut.css("cursor","default");

		this.outer = jQuery('<div/>', {
			class: "dsbwindow-outer",
			//style: "width="+dwidth+"px; height="+dheight+"px"
			width: dwidth,
			height: dheight
		});

		//Make draggable.
		this.outer.drags({handle: this.titlebar});

		this.titlebar.appendTo(this.outer);
		this.content.appendTo(this.outer);
		this.outer.appendTo('#defaultview');
	}

	DSBWindow.prototype.getElement = function() {
		return this.outer;
	};

	DSBWindow.prototype.setContent = function(c) {
		this.content.html(c);
	};

	global.DSBWindow = DSBWindow;
	global.dsbwindows = dsbwindows;
}(typeof window !== 'undefined' ? window : global));

