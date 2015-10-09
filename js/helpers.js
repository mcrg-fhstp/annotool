/**
 * AnnoTool, a Multiuser Annotation Webtool for large 2D graphics
 *
 * It was developed in the 3D-PITOTI project [http://www.3d-pitoti.eu] for the annotation of
 * large tracings of prehistoric rock art.
 * 
 * Copyright (C) 2012-2015 Media Computing Research Group [http://mc.fhstp.ac.at]
 * Institute for Creative \Media/ Technologies (IC\M/T)
 * St. Poelten, University of Applied Sciences (FHSTP) [http://www.fhstp.ac.at]
 * 
 * This file is part of AnnoTool [https://github.com/mcrg-fhstp/annotool].
 * 
 * AnnoTool is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * AnnoTool is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * 
 * See the GNU General Public License for more details. You should have received a copy of the GNU
 * General Public License along with AnnoTool. If not, see <http://www.gnu.org/licenses/>.
 * 
 * Author: Ewald Wieser
 */



// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


// Array.clone for multidimensional array
Array.prototype.clone = function() {
  //console.log(Object.prototype.toString.call($(this).first()));
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



/**
 * miniPaint, Online graphics editing tool use HTML5 technologies like Canvas, Offline support, Drag and Drop. 
 * 
 * Copyright (C) viliusle [https://github.com/viliusle/miniPaint]
 * 
 * This file is part of miniPaint.
 * 
 * miniPaint is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * miniPaint is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * 
 * See the GNU General Public License for more details. You should have received a copy of the GNU
 * General Public License along with miniPaint. If not, see <http://www.gnu.org/licenses/>.
 * 
 * Author: viliusle
 */


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




// color conversion
// from: https://github.com/bebraw/colorjs/blob/master/src/color.js

var RGB_HSV = function(rgb) {
    // http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r = rgb.r;
    var g = rgb.g;
    var b = rgb.b;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    } else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: h,
        s: s,
        v: v
    };
};

var RGB_HSL = function(rgb) {
    // based on CamanJS
    var r = rgb.r;
    var g = rgb.g;
    var b = rgb.b;

    var max = Math.max(r, g, b), min = Math.min(r, g, b), 
        h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {h: h, s: s, l: l};
};



// more color conversion
// from https://github.com/harthur/color-convert/blob/master/conversions.js

function rgb2xyz(rgb) {
  var r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);
  
  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return {x:x * 100, y:y *100, z:z * 100};
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz.x,
        y = xyz.y,
        z = xyz.z,
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);
  
  return {l:l, a:a, b:b};
}
