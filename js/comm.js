(function($){
	$.fn.extend({
		switchTab: function(){
			function tab_display(){
				var cur = $(event.currentTarget);
				var tab = cur.closest('.tab');
				cur.addClass('current').siblings().removeClass('current');
				tab.find('.tab-content:first').children().hide();
				var show = tab.find('.tab-content:first').children().eq(cur.index());
				if(typeof(cur.attr('data-src'))!='undefined')
				{
					show.empty();
					$.get(cur.attr('data-src'),{},function(html){
						show.html(html).initTool();
					},'html');
				}
				show.show();
			}
			return this.each(function(){
				var tab = $(this);
				tab.find('.tab-content:first').children().hide().eq(0).show();
				tab.find('.tab-header:first aside').hovClass().bind('click',tab_display);
			});
		},
		hovClass: function(){
			return this.each(function(){
				$(this).bind('touchstart',function(){
					$(this).addClass('hover');
				}).bind('touchend touchmove',function(){
					$(this).removeClass('hover');
				});
			});
		},
		hovTap : function(opt){
			return this.each(function(){
				var ths = $(this);
				var call = true;
				
				var down = typeof(ths.attr('touchstart'))=='undefined'? tap_down : ths.attr('touchstart');
				var move = typeof(ths.attr('touchmove'))=='undefined'? tap_move : ths.attr('touchmove');
				var up = typeof(ths.attr('touchend'))=='undefined'? tap_up : ths.attr('touchend');
				var callback = typeof(ths.attr('callback'))=='undefined'? null : ths.attr('callback');
				
				var option = $.extend({'tap_down':down,'tap_up':up,'tap_move':move,'callback':callback},opt);
				ths.bind('touchstart',function(){
					call = true;
					var tp_down = eval('(' + option.tap_down + ')');
					tp_down(ths);
				}).bind('touchmove',function(){
					call = false;
					var tp_move = eval('(' + option.tap_move + ')');
					tp_move(ths);
				}).bind('touchend',function(){
					var tp_up = eval('(' + option.tap_up + ')');
					var callback = option.callback==null? null : eval('(' + option.callback + ')');
					tp_up(ths);
					if(call)
					{
						if(callback!=null)
							callback(ths);
					}
				});
			});
		},
		initTool: function(){
			return this.each(function(){
				initTool(this);
			});
		}
	});
})(jQuery);
function initTool(_box){
	var $p = $(_box || document);
	$('a, .tap',$p).hovClass();
	$('.tab',$p).switchTab();
}
function tap_down(obj){
	obj.addClass('hover');
}
function tap_up(obj){
	obj.removeClass('hover');
}
function tap_move(obj){
}
function stop_scroll(e){
	e.preventDefault();
}
$(function(){
	window.scrollTo(0,0);
	FastClick.attach(document.body);
	initTool();
	$('header').bind('click',function(){
		$(window).scrollTop(0);
	});
	$(document.body).append('<a id="btn-top" href="javascript:;"><i class="iconfont icon-top"></i></a>');
	$(window).scroll(function(){
		$('#btn-top').css('display',document.body.scrollTop>100?"block":"none").hovClass().bind('click',function(){
			setTimeout(function(){
				window.scrollTo(0,0);
				$(this).css('display','none');
			},100);
		});
	});
});