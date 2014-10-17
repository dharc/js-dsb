/* Support draggables in jQuery */
(function($) {
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
	function DSBWindow(options) {
		var outer;
		var titlebar;
		var content;
		var typeicon;

		content = jQuery('<div/>', {
			class: "dsbwindow-content"
		});

		//Change icon depending upon window type
		switch (options.type) {
		case "view": typeicon = "icon-screen"; break;
		case "workspace": typeicon = "icon-lab"; break;
		case "fabric": typeicon = "icon-tree"; break;
		}

		titlebar = jQuery('<div/>', {
			class: "dsbwindow-title",
			html: "<table class=\"dsbtitlemenu\" cellpadding=\"1\" cellspacing=\"0\"><tr><td class=\"w2ui-tb-caption\" nowrap>"+'<span class="'+typeicon+'"></span>&nbsp;&nbsp;&nbsp;'+options.title+"&nbsp;&nbsp;</td><td class=\"w2ui-tb-down\" nowrap><div class=\"dsbdown\"></div></td></tr></table>"
		});

		var titbut = titlebar.find(".dsbtitlemenu");

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

		outer = jQuery('<div/>', {
			class: "dsbwindow-outer"
		});

		//Make draggable.
		outer.drags({handle: titlebar});

		content.appendTo(outer);
		titlebar.appendTo(outer);
		outer.appendTo('#defaultview');
	}

	global.DSBWindow = DSBWindow;
}(typeof window !== 'undefined' ? window : global));

