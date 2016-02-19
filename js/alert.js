var keyCode = {
		ENTER: 13, ESC: 27, END: 35, HOME: 36,
		SHIFT: 16, TAB: 9,
		LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
		DELETE: 46, BACKSPACE:8
	};
var alertMsg = {
	_boxId: "#alertMsgBox",
	_bgId: "#alert-model-bg",
	_closeTimer: null,
	_boxHtml:'<div class="model-bg" id="alert-model-bg"><div id="alertMsgBox" class="alertBox"><div class="content">#message#</div><div class="btnFoot">#buttons#</div></div></div>',
	_butsHtml: '<a class="button" onclick="alertMsg.close()" href="javascript:">#butMsg#</a>',
	_infoHtml:'<div id="alertMsgInfo" class="alertInfo #infoClass#"><a href="javascript:;" onclick="alertMsg.closeinfo()">#message#</a>#close#</div>',
	_closeIcon: '<i ontouchstart="alertMsg.closeinfo()" class="iconfont icon-close"></i>',
	
	_keydownOk: function(event){
		if (event.keyCode == keyCode.ENTER) event.data.target.trigger("click");
		return false;
	},
	_keydownEsc: function(event){
		if (event.keyCode == keyCode.ESC) event.data.target.trigger("click");
	},
	/**
	 * 
	 * @param {Object} type
	 * @param {Object} msg
	 * @param {Object} buttons [button1, button2]
	 */
	_open: function(msg, buttons){
		$(this._boxId).remove();
		var butsHtml = "";
		if (buttons) {
			var ll = buttons.length;
			for (var i = 0; i < ll; i++) {
				butsHtml += this._butsHtml.replace("#butMsg#", buttons[i].name);
			}
		}
		var boxHtml = this._boxHtml.replace("#message#", msg).replace("#buttons#", butsHtml);
		$(boxHtml).appendTo("body");
		var box = $(this._boxId);
		box.find('a.button').hovTap().css('width',100/ll);
		$(this._bgId).fadeIn(200);
		setTimeout(function(){box.addClass('show');},10);
		
		//用于屏蔽点击回车，触发click事件，再次打开alert
		//$('<input type="text" style="width:0;height:0;" name="_alertFocusCtr"/>').appendTo(this._boxId).focus().hide();
		
		//用于按下回车和ESC的操作
		var jButs = $(this._boxId).find("a.button");
		var jDoc = $(document);
		
		for (var i = 0; i < buttons.length; i++) {
			if (buttons[i].call)
				jButs.eq(i).click(buttons[i].call);
			if (buttons[i].keyCode == keyCode.ENTER) {
				jDoc.bind("keydown",{target:jButs.eq(i)}, this._keydownOk);
			}
			if (buttons[i].keyCode == keyCode.ESC) {
				jDoc.bind("keydown",{target:jButs.eq(i)}, this._keydownEsc);
			}
		}
		$('body').bind('touchmove', function (e){
			e.preventDefault();
		}, false);
	},
	close: function(){
		//接触键盘操作
		$(document).unbind("keydown", this._keydownOk).unbind("keydown", this._keydownEsc);
		$(this._bgId).fadeOut(100,function(){
			$(this).remove();
		});
		$("body").unbind("touchmove");	
	},
	closeinfo: function(){
		$("#alertMsgInfo").removeClass('show');
		setTimeout(function(){$("#alertMsgInfo").remove()},200);
	},
	info: function(msg, option) {
		$("#alertMsgInfo").remove();
		var infoClass = '' || option.type;
		var infoHtml = this._infoHtml.replace("#message#", msg).replace("#infoClass#",infoClass).replace('#close#',this._closeIcon);
		$(infoHtml).appendTo("body");
		setTimeout(function(){$("#alertMsgInfo").addClass('show');},10);
		if (this._closeTimer) {
			clearTimeout(this._closeTimer);
			this._closeTimer = null;
		}
		if(option.autoclose)
			this._closeTimer = setTimeout(function(){alertMsg.closeinfo();}, 3000 || option.delay);	
	},
	
	alert: function(msg, options) {
		var op = {okName:'确定', okCall:null};
		$.extend(op, options);
		var buttons = [
			{name:op.okName, call: op.okCall, keyCode:keyCode.ENTER},
		];
		this._open(msg, buttons);
	},
	/**
	 * 
	 * @param {Object} msg
	 * @param {Object} options {okName, okCal, cancelName, cancelCall}
	 */
	confirm: function(msg, options) {
		var op = {cancelName:'取消', cancelCall:null, okName:'确定', okCall:null};
		$.extend(op, options);
		var buttons = [
		    {name:op.cancelName, call: op.cancelCall, keyCode:keyCode.ESC},
			{name:op.okName, call: op.okCall, keyCode:keyCode.ENTER}
		];
		this._open(msg, buttons);
	}
};