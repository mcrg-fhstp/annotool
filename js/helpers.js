// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


// Array.clone for multidimensional array
Array.prototype.clone = function() {
  console.log(Object.prototype.toString.call($(this).first()));
  if (Object.prototype.toString.call($(this).first()) == '[object Object]'){
	  var r = [];
	  for (var i = 0; i < this.length; i++){
	  		if (this[i] != undefined)
	  			r[i] = this[i].slice(0);
	  }
	  return r;
  }
  else return this.slice(0);
};



var HELPER = new HELPER_CLASS();

function HELPER_CLASS(){

	//dashed objects
	this.dashedRect = function(canvas, x1, y1, x2, y2, dashLen, color) {
		HELPER.dashedLine(canvas, x1, y1, x2, y1, dashLen, color);
		HELPER.dashedLine(canvas, x2, y1, x2, y2, dashLen, color);
		HELPER.dashedLine(canvas, x2, y2, x1, y2, dashLen, color);
		HELPER.dashedLine(canvas, x1, y2, x1, y1, dashLen, color);
		};
		
	this.dashedLine = function(canvas, x1, y1, x2, y2, dashLen, color) {
		x1 = x1 + 0.5;
		y1 = y1 + 0.5;
		x2 = x2 + 0.5;
		y2 = y2 + 0.5;
		//canvas.strokeStyle = color;
		if (dashLen == undefined) dashLen = 4;
		//canvas.beginPath();
		//canvas.moveTo(x1, y1);
		var dX = x2 - x1;
		var dY = y2 - y1;
		var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
		var dashX = dX / dashes;
		var dashY = dY / dashes;
		var q = 0;
		while (q++ < dashes){
			canvas.beginPath();
			canvas.moveTo(x1, y1);
			x1 += dashX;
			y1 += dashY;
			//canvas[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
			canvas.strokeStyle = (q % 2 == 0 ? '#000' : '#fff');
			canvas.lineTo(x1,y1);
			canvas.stroke();
			canvas.closePath();
			}
		//canvas[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
		canvas.beginPath();
		canvas.moveTo(x1, y1);
		//canvas[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
		canvas.strokeStyle = (q % 2 == 0 ? '#000' : '#fff');
		canvas.lineTo(x2,y2);
		canvas.stroke();
		canvas.closePath();
	};	
}




// Helper function for detecting onappend event
/*(function($) {
    var origAppend = $.fn.append;

    $.fn.append = function () {
        return origAppend.apply(this, arguments).trigger("append");
    };
})(jQuery);*/




// Bugfix for jQuery .clone function
// https://github.com/spencertipping/jquery.fix.clone/blob/master/jquery.fix.clone.js

// Textarea and select clone() bug workaround | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Motivation.
// jQuery's clone() method works in most cases, but it fails to copy the value of textareas and select elements. This patch replaces jQuery's clone() method with a wrapper that fills in the
// values after the fact.

// An interesting error case submitted by Piotr Przyby?: If two <select> options had the same value, the clone() method would select the wrong one in the cloned box. The fix, suggested by Piotr
// and implemented here, is to use the selectedIndex property on the <select> box itself rather than relying on jQuery's value-based val().

(function (original) {
  jQuery.fn.clone = function () {
    var result           = original.apply(this, arguments),
        my_textareas     = this.find('textarea').add(this.filter('textarea')),
        result_textareas = result.find('textarea').add(result.filter('textarea')),
        my_selects       = this.find('select').add(this.filter('select')),
        result_selects   = result.find('select').add(result.filter('select'));

    for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
    for (var i = 0, l = my_selects.length;   i < l; ++i) result_selects[i].selectedIndex = my_selects[i].selectedIndex;

    return result;
  };
}) (jQuery.fn.clone);

// Generated by SDoc 
