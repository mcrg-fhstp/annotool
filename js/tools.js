/**
�* AnnoTool, a Multiuser Annotation Webtool for large 2D graphics
�* 
�* Copyright (C) 2012-2015 Media Computing Research Group [http://mc.fhstp.ac.at]
 * Institute for Creative \Media/ Technologies (IC\M/T)
 * St. Poelten, University of Applied Sciences (FHSTP)
�* 
�* This file is part of AnnoTool [https://github.com/mcrg-fhstp/annotool]. 
 * It was originally developed by viliusle under GPL for miniPaint [https://github.com/viliusle/miniPaint] 
 * and modified for AnnoTool.
�* 
�* AnnoTool is free software: you can redistribute it and/or modify it under the terms of the
�* GNU General Public License as published by the Free Software Foundation, either version 3 of the
�* License, or (at your option) any later version.
�* 
�* AnnoTool is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
�* without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
�* 
�* See the GNU General Public License for more details. You should have received a copy of the GNU
�* General Public License along with AnnoTool. If not, see <http://www.gnu.org/licenses/>.
�* 
 * Modified by:	    Ewald Wieser
�*/


/**
�* miniPaint, Online graphics editing tool use HTML5 technologies like Canvas, Offline support, Drag and Drop. 
�* 
�* Copyright (C) viliusle [https://github.com/viliusle/miniPaint]
�* 
�* This file is part of miniPaint.
�* 
�* miniPaint is free software: you can redistribute it and/or modify it under the terms of the
�* GNU General Public License as published by the Free Software Foundation, either version 3 of the
�* License, or (at your option) any later version.
�* 
�* miniPaint is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
�* without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
�* 
�* See the GNU General Public License for more details. You should have received a copy of the GNU
�* General Public License along with miniPaint. If not, see <http://www.gnu.org/licenses/>.
�* 
�* Author: viliusle
�*/


var TOOLS = new TOOLS_CLASS();

function TOOLS_CLASS(){
	this.select_square_action = '';
	this.select_data = false;
	this.polygon_state = 'start';
	this.selectionState = null;
	

	this.draw_helpers = function(){
		//left menu
		var html = '';
		for(var i=0; i < ACTION_DATA.length; i++){
			html += '<a title="'+ACTION_DATA[i].title+'"';
			//html += ' style="background: #989898 url(\'img/'+ACTION_DATA[i].icon[0]+'\') no-repeat '+ACTION_DATA[i].icon[1]+'px '+ACTION_DATA[i].icon[2]+'px;"';
			html += ' style="background-position: '+ACTION_DATA[i].icon[1]+'px '+ACTION_DATA[i].icon[2]+'px;"';
			if(ACTION_DATA[i].name==ACTION){
				html += ' class="active"';
				// cursor f�r default action
				if (ACTION_DATA[i].cursor != undefined)
					TOOLS.set_cursor(this.action_data().cursor);
				else
					TOOLS.set_cursor('auto');
			}
			html += ' onclick="return TOOLS.action(\''+ACTION_DATA[i].name+'\');"';
			html += ' id="'+ACTION_DATA[i].name+'"';
			html += ' href="#"></a>'+"\n";
			}
		document.getElementById("tools").innerHTML = html;
	}
	
	
	this.action = function(key){
		if(ACTION == key) return false;
		
		//change
		if(ACTION != '')
			document.getElementById(ACTION).className = "";
		ACTION = key;
		document.getElementById(key).className = "active";
		
		//this.show_action_attributes();
		
		if(ACTION == 'move_tool')
			$('.figureBox').addClass('selectable');
		else
			$('.figureBox').removeClass('selectable');
		
		// cursor f�r action
		if (this.action_data().cursor != undefined)
			TOOLS.set_cursor(this.action_data().cursor);
		else
			TOOLS.set_cursor('auto');
		
		this.selectionState = null;
	
		return false;
	}

			
	this.action_data = function(){	
		for(var i in ACTION_DATA){
			if(ACTION_DATA[i].name == ACTION)
				return ACTION_DATA[i];
		}
	}

	
	this.set_cursor = function(string){
		object = document.getElementById('imageCanvas');
		
		object.style.cursor = "-moz-" + string;			// tested on firefox 3.6
		if (object.style.cursor != "-moz-" + string) {
			object.style.cursor = "-webkit-" + string;		// tested on safari 5 and chrome 12
			if (object.style.cursor != "-webkit-" + string) {
				object.style.cursor = "-ms-" + string;
				if (object.style.cursor != "-ms-" + string) {		// missing, not sure if it works
					object.style.cursor = "-khtml-" + string;
					if (object.style.cursor != "-khtml-" + string) {		// missing, not sure if it works
						object.style.cursor = string;
						//if (object.style.cursor != string){
						//	object.style.cursor = "pointer";
						//}
					}
				}
			}
		}
	}	
	
	
	
	this.reset = function(){
		this.select_square_action = '';
		this.select_data = false;
		this.polygon_state = 'start';
		this.selectionState = null;	
		var ctx = toolCanvas.getContext('2d');
		ctx.clearRect(0, 0, IMAGE.width, IMAGE.height);	
		$('#lab_checkbox').attr('checked', false);
	}
	
	
	
	//type = click, right_click, drag, move, release, doubleclick
	this.move_tool = function(type, mouse, event){
		if(mouse.valid == false) return true;
		//if(mouse.click_valid == false) return true;
		if(event.target.id == "canvas_preview") return true;
		
		this.select_data = false;
		
		if(type == 'click'){
			TOOLS.set_cursor("grabbing");
		}
		else if(type == 'move'){
			TOOLS.set_cursor('grab');
		}
		else if(type == 'drag'){

			var deltaX = mouse.x - mouse.last_x,
				deltaY = mouse.y - mouse.last_y;
			//console.log(deltaX +" "+ deltaY);

			IMAGE.moveXY(deltaX, deltaY);
			IMAGE.redrawSelectionOutline();
		}
		else if(type == 'release'){
			if(mouse.valid == false || mouse.click_x === false) return false;
			TOOLS.set_cursor("grab");
			IMAGE.redrawSelectionFull();
			if(mouse.x - mouse.click_x == 0 || mouse.y - mouse.click_y == 0) return false;	
		}
	}
		
			

	this.magic_wand = function(type, mouse, event){
		if(mouse.valid == false) return true;
		
		this.select_data = false;
		
		if(type == 'move'){
			TOOLS.set_cursor("crosshair");
		}
		else if(type == 'click'){
			if (IMAGE.scale > 1) { alert("Please zoom in to maximum zoomlevel for selection!"); return false;}
	
			$('#wait').show();
			this.selectionState = 'running';
			SELECTION.push();	// save old selection
							
			setTimeout(function(){
				var sel;
				if (CONTROL.shift_pressed)	sel = 'add';
				else if (CONTROL.alt_pressed) sel = 'sub';
				else{
					FIGURES.selectedFigure = null;
					CLASSIFICATOR.reset();
					SELECTION.clear();
					$('.figureBox').removeClass('selected');
					sel = 'create';
				}
			
				//create mask
				var context = IMAGE.canvas.getContext('2d');
				var sensitivity = TOOLS.action_data().attributes.sensitivity;
				var x = mouse.x, y = mouse.y;
				var offsetX = -Math.ceil(IMAGE.offsetX), offsetY = -Math.ceil(IMAGE.offsetY);
				var img = context.getImageData(0, 0, IMAGE.width, IMAGE.height);
				var imgData = img.data;
				var k = ((y * (img.width * 4)) + (x * 4));
				var dx = [-1,  0, +1, -1, +1, -1,  0, +1];
				var dy = [-1, -1, -1,  0,  0, +1, +1, +1];
				var color_to = {
					r: 255,
					g: 0,
					b: 0,
					a: 1,
					}
				var color_from_mid = {
					r: imgData[k+0],
					g: imgData[k+1],
					b: imgData[k+2],
					a: imgData[k+3],
					};
				//console.log(RGB_HSV(color_from_mid));
				var color_from_darkest = color_from_mid;
				var color_from_lightest = color_from_mid;
				for (var i=0;i<dx.length;i++){
					var k = (((y+dy[i]) * (img.width * 4)) + ((x+dx[i]) * 4));
					var color_from_temp = {
						r: imgData[k+0],
						g: imgData[k+1],
						b: imgData[k+2],
						a: imgData[k+3],
					};
					if (RGB_HSV(color_from_temp).v < RGB_HSV(color_from_darkest).v){
						color_from_darkest = color_from_temp;
					}
					else if (RGB_HSV(color_from_temp).v > RGB_HSV(color_from_darkest).v){
						color_from_lightest = color_from_temp;
					}
				}
					
				var Tested = [];
				for (var i=0;i<IMAGE.width;i++)
					Tested[i] = [];
					
				var mask = [];	
					
				if(color_from_mid.r == color_to.r && 
				  color_from_mid.g == color_to.g && 
				  color_from_mid.b == color_to.b && 
				  color_from_mid.a == color_to.a) 
					return false;
					
				var k = (y * IMAGE.width + x) * 4;
				if (Math.abs(imgData[k+0] - 255) <= sensitivity &&
					Math.abs(imgData[k+1] - 255) <= sensitivity &&
					Math.abs(imgData[k+2] - 255) <= sensitivity){
					alert("white area cannot be selected!");
					$('#wait').hide();
					TOOLS.selectionState = null;
					return false;
				}
				
				// using LAB-colorcheck
				if($('#lab_checkbox').prop('checked')){
					var darkest_pixel_lab = rgb2lab(color_from_darkest);
					var lightest_pixel_lab = rgb2lab(color_from_lightest);
					var lab_sensitivity = TOOLS.action_data().attributes.lab_sensitivity;
					
					// subtract
					if (CONTROL.alt_pressed) lab_sensitivity += 5;
					// else
					else lab_sensitivity -= 5;
				}
				
				var orig_sensitivity = sensitivity;
				// subtract
				if (CONTROL.alt_pressed) sensitivity += 5;
				// else
				else sensitivity -= 5;
					
				var stack = [];
				stack.push(x);
				stack.push(y);
				if (mask[x+offsetX] == undefined)
					mask[x+offsetX] = [];
				mask[x+offsetX][y+offsetY] = true;
				
				while (stack.length > 0){
					var curPointY = stack.pop();
					var curPointX = stack.pop();
					Tested[curPointX][curPointY] = true;
					
					for (var i = 0; i < dx.length; i++){
						var nextPointX = curPointX + dx[i];
						var nextPointY = curPointY + dy[i];
						if (nextPointX < 0 || nextPointY < 0 || nextPointX >= IMAGE.width || nextPointY >= IMAGE.height) 
							continue;
						var k = (nextPointY * IMAGE.width + nextPointX) * 4;
						
						// using LAB-colorcheck
						if($('#lab_checkbox').prop('checked')){
							var pixel_lab = rgb2lab({r:imgData[k+0] ,g:imgData[k+1] ,b:imgData[k+2] });
						
							//check clicked pixel
							if(((Math.abs(pixel_lab.a - lightest_pixel_lab.a) <= lab_sensitivity &&
							  Math.abs(pixel_lab.b - lightest_pixel_lab.b) <= lab_sensitivity) ||
							  // darkest pixel
							 (Math.abs(pixel_lab.a - darkest_pixel_lab.a) <= lab_sensitivity &&
							  Math.abs(pixel_lab.b - darkest_pixel_lab.b) <= lab_sensitivity)) &&
							  // pixel not white
							 (Math.abs(imgData[k+0] - 255) > orig_sensitivity ||
							  Math.abs(imgData[k+1] - 255) > orig_sensitivity ||
							  Math.abs(imgData[k+2] - 255) > orig_sensitivity) &&
							  !Tested[nextPointX][nextPointY]){
								
								if (mask[nextPointX+offsetX] == undefined)
									mask[nextPointX+offsetX] = [];
								mask[nextPointX+offsetX][nextPointY+offsetY] = true;
					
								stack.push(nextPointX);
								stack.push(nextPointY);
							}
						}
						// using RGB-colorcheck
						else{
							//check lightest pixel
							if(((Math.abs(imgData[k+0] - color_from_lightest.r) <= sensitivity &&
							  Math.abs(imgData[k+1] - color_from_lightest.g) <= sensitivity &&
							  Math.abs(imgData[k+2] - color_from_lightest.b) <= sensitivity &&
							  Math.abs(imgData[k+3] - color_from_lightest.a) <= sensitivity) ||
							  // darkest pixel
							 (Math.abs(imgData[k+0] - color_from_darkest.r) <= sensitivity &&
							  Math.abs(imgData[k+1] - color_from_darkest.g) <= sensitivity &&
							  Math.abs(imgData[k+2] - color_from_darkest.b) <= sensitivity &&
							  Math.abs(imgData[k+3] - color_from_darkest.a) <= sensitivity)) &&
							  // pixel not white
							 (Math.abs(imgData[k+0] - 255) > orig_sensitivity ||
							  Math.abs(imgData[k+1] - 255) > orig_sensitivity ||
							  Math.abs(imgData[k+2] - 255) > orig_sensitivity) &&
							  !Tested[nextPointX][nextPointY]){
								
								if (mask[nextPointX+offsetX] == undefined)
									mask[nextPointX+offsetX] = [];
								mask[nextPointX+offsetX][nextPointY+offsetY] = true;
					
								stack.push(nextPointX);
								stack.push(nextPointY);
							}
						}
					}
				}
				// create selection
				if (sel == 'add') SELECTION.add(mask);
				else if (sel == 'sub') SELECTION.subtract(mask);
				else if (sel == 'create') SELECTION.create(mask);

				IMAGE.redrawSelectionFull();						
				CLASSIFICATOR.show();
				TOOLS.selectionState = null;
				
				$('#wait').hide();
			}, 20);
		}
	}



	this.select_square = function(type, mouse, event){
		if(Object.prototype.toString.call(this.select_data) != '[object Object]' &&
			this.select_data != false)
			this.select_data = false;
		if(mouse.valid == false) return true;
			
		if(type == 'move'){
			if (TOOLS.select_data.x != undefined){
				var ctx = toolCanvas.getContext('2d');
				ctx.clearRect(0, 0, IMAGE.width, IMAGE.height);
				HELPER.dashedRect(ctx, TOOLS.select_data.x, TOOLS.select_data.y, TOOLS.select_data.x + TOOLS.select_data.w, TOOLS.select_data.y + TOOLS.select_data.h);
				TOOLS.set_cursor("url('img/pipette.png') 1 15, crosshair");
			}
			else
				TOOLS.set_cursor("crosshair");
		}
		else if(type == 'click'){
			if (IMAGE.scale > 1) { 
				alert("Please zoom in to maximum zoomlevel for selection!"); 
				$(document).trigger('mouseup'); // to prevent select-rect being drawn
				return false;
			}
		}
		else if(type == 'drag'){
			if(mouse.x < 0) mouse.x = 0;
			if(mouse.y < 0) mouse.y = 0;
			if(mouse.x >= IMAGE.width) mouse.x = IMAGE.width-1;
			if(mouse.y >= IMAGE.height) mouse.y = IMAGE.height-1;
			if(mouse.click_x >= IMAGE.width) mouse.click_x = IMAGE.width-1;
			if(mouse.click_y >= IMAGE.height) mouse.click_y = IMAGE.height-1;

			TOOLS.set_cursor("crosshair");
			TOOLS.selectionState = 'dragging';
			var ctx = toolCanvas.getContext('2d');
			ctx.clearRect(0, 0, IMAGE.width, IMAGE.height);
			HELPER.dashedRect(ctx, mouse.click_x, mouse.click_y, mouse.x, mouse.y);
			TOOLS.select_data = false;
		}
		else if(type == 'release'){
			if (TOOLS.select_data == false){
				if(mouse.x < 0) mouse.x = 0;
				if(mouse.y < 0) mouse.y = 0;
				if(mouse.x >= IMAGE.width) mouse.x = IMAGE.width-1;
				if(mouse.y >= IMAGE.height) mouse.y = IMAGE.height-1;
				if(mouse.click_x >= IMAGE.width) mouse.click_x = IMAGE.width-1;
				if(mouse.click_y >= IMAGE.height) mouse.click_y = IMAGE.height-1;
	
				if(mouse.x != mouse.click_x && mouse.y != mouse.click_y){
					TOOLS.select_data = {
						x: 	Math.min(mouse.x, mouse.click_x),
						y: 	Math.min(mouse.y, mouse.click_y),
						w: 	Math.abs(mouse.x - mouse.click_x),
						h: 	Math.abs(mouse.y - mouse.click_y)
					};
				}
				var ctx = toolCanvas.getContext('2d');
				ctx.clearRect(0, 0, IMAGE.width, IMAGE.height);
				HELPER.dashedRect(ctx, TOOLS.select_data.x, TOOLS.select_data.y, TOOLS.select_data.x + TOOLS.select_data.w, TOOLS.select_data.y + TOOLS.select_data.h);
				TOOLS.set_cursor("url('img/pipette.png') 1 15, crosshair");
				TOOLS.selectionState = 'released';
			}
			else if (TOOLS.select_data.x != undefined){
				$('#wait').show();				
				setTimeout(function(){
					// create mask	
					var context = IMAGE.canvas.getContext('2d');
					var sensitivity = TOOLS.action_data().attributes.sensitivity;
					var x = mouse.x, y = mouse.y;
					var offsetX = -Math.ceil(IMAGE.offsetX), offsetY = -Math.ceil(IMAGE.offsetY);
					var img = context.getImageData(0, 0, IMAGE.width, IMAGE.height);
					var imgData = img.data;
					var dx = [-1,  0, +1, -1, +1, -1,  0, +1];
					var dy = [-1, -1, -1,  0,  0, +1, +1, +1];
					
					var k = ((y * (img.width * 4)) + (x * 4));
					var color_from_mid = {
						r: imgData[k+0],
						g: imgData[k+1],
						b: imgData[k+2],
						a: imgData[k+3],
					};
					//console.log(RGB_HSV(color_from_mid));
					var color_from_darkest = color_from_mid;
					var color_from_lightest = color_from_mid;
					for (var i=0;i<dx.length;i++){
						var k = (((y+dy[i]) * (img.width * 4)) + ((x+dx[i]) * 4));
						var color_from_temp = {
							r: imgData[k+0],
							g: imgData[k+1],
							b: imgData[k+2],
							a: imgData[k+3],
						};
						if (RGB_HSV(color_from_temp).v < RGB_HSV(color_from_darkest).v){
							color_from_darkest = color_from_temp;
						}
						else if (RGB_HSV(color_from_temp).v > RGB_HSV(color_from_darkest).v){
							color_from_lightest = color_from_temp;
						}
					}
						
					var k = (y * IMAGE.width + x) * 4;
					if (Math.abs(imgData[k+0] - 255) <= sensitivity &&
						Math.abs(imgData[k+1] - 255) <= sensitivity &&
						Math.abs(imgData[k+2] - 255) <= sensitivity){
						alert("white area cannot be selected!");
						$('#wait').hide();
						TOOLS.selectionState = null;
						return false;
					}
					
					// using LAB-colorcheck
					if($('#lab_checkbox').prop('checked')){
						var darkest_pixel_lab = rgb2lab(color_from_darkest);
						var lightest_pixel_lab = rgb2lab(color_from_lightest);
						var lab_sensitivity = TOOLS.action_data().attributes.lab_sensitivity;
						
						// subtract
						if (CONTROL.alt_pressed) lab_sensitivity += 5;
						// else
						else lab_sensitivity -= 5;
					}
					
					var orig_sensitivity = sensitivity;
					// subtract
					if (CONTROL.alt_pressed) sensitivity += 5;
					// else
					else sensitivity -= 5;
				
					var mask = [];
					
					for (var i=TOOLS.select_data.x; i<TOOLS.select_data.x+TOOLS.select_data.w; i++){
						for (var j=TOOLS.select_data.y; j<TOOLS.select_data.y+TOOLS.select_data.h; j++){
							var k = (j * IMAGE.width + i) * 4;
							
							// using LAB-colorcheck
							if($('#lab_checkbox').prop('checked')){
								var pixel_lab = rgb2lab({r:imgData[k+0] ,g:imgData[k+1] ,b:imgData[k+2] });
							
								//check clicked pixel
								if(((Math.abs(pixel_lab.a - lightest_pixel_lab.a) <= lab_sensitivity &&
								  Math.abs(pixel_lab.b - lightest_pixel_lab.b) <= lab_sensitivity) ||
								  // darkest pixel
								 (Math.abs(pixel_lab.a - darkest_pixel_lab.a) <= lab_sensitivity &&
								  Math.abs(pixel_lab.b - darkest_pixel_lab.b) <= lab_sensitivity)) &&
								  // pixel not white
								 (Math.abs(imgData[k+0] - 255) > orig_sensitivity ||
								  Math.abs(imgData[k+1] - 255) > orig_sensitivity ||
								  Math.abs(imgData[k+2] - 255) > orig_sensitivity)){
									
									if (mask[i+offsetX] == undefined)
										mask[i+offsetX] = [];
									mask[i+offsetX][j+offsetY] = true;
								}
							}
							// using RGB-colorcheck
							else{
								//check lightest pixel
								if(((Math.abs(imgData[k+0] - color_from_lightest.r) <= sensitivity &&
								  Math.abs(imgData[k+1] - color_from_lightest.g) <= sensitivity &&
								  Math.abs(imgData[k+2] - color_from_lightest.b) <= sensitivity &&
								  Math.abs(imgData[k+3] - color_from_lightest.a) <= sensitivity) ||
								  // darkest pixel
								 (Math.abs(imgData[k+0] - color_from_darkest.r) <= sensitivity &&
								  Math.abs(imgData[k+1] - color_from_darkest.g) <= sensitivity &&
								  Math.abs(imgData[k+2] - color_from_darkest.b) <= sensitivity &&
								  Math.abs(imgData[k+3] - color_from_darkest.a) <= sensitivity)) &&
								  // pixel not white
								 (Math.abs(imgData[k+0] - 255) > orig_sensitivity ||
								  Math.abs(imgData[k+1] - 255) > orig_sensitivity ||
								  Math.abs(imgData[k+2] - 255) > orig_sensitivity)){
								  
									if (mask[i+offsetX] == undefined)
										mask[i+offsetX] = [];
									mask[i+offsetX][j+offsetY] = true;
								}
							}
						}
					}
					SELECTION.push();	// save old selection
					// create selection
					if (CONTROL.shift_pressed)	SELECTION.add(mask);
					else if (CONTROL.alt_pressed) SELECTION.subtract(mask);
					else{
						FIGURES.selectedFigure = null;
						CLASSIFICATOR.reset();
						SELECTION.clear();
						$('.figureBox').removeClass('selected');
						SELECTION.create(mask);
					}
					
					IMAGE.redrawSelectionFull();			
					CLASSIFICATOR.show();
					TOOLS.select_data = false;
					TOOLS.set_cursor("crosshair");
					TOOLS.selectionState = null;
					
					$('#wait').hide();
				}, 50);	
			}
		}
	}
		
		
		
	this.select_poly = function(type, mouse, event){	
		if(Object.prototype.toString.call(this.select_data) != '[object Array]'){
			this.select_data = [];
			this.polygon_state = 'start'
		}
		if(mouse.valid == false) return true;
			
		//if(mouse.click_valid == false) return true;
		if(type == 'release'){
			if (IMAGE.scale > 1) { alert("Please zoom in to maximum zoomlevel for selection!"); return false;}
			if(mouse.x < 0) mouse.x = 0;
			if(mouse.y < 0) mouse.y = 0;
			if(mouse.x >= IMAGE.width) mouse.x = IMAGE.width-1;
			if(mouse.y >= IMAGE.height) mouse.y = IMAGE.height-1;

			if (this.polygon_state == 'start')
			{
				// end polygon			
				if ((this.select_data.length >= 1) &&	
					( mouse.x >= this.select_data[0][0] - 2 ) &&
					( mouse.x <= this.select_data[0][0] + 2 ) &&
					( mouse.y >= this.select_data[0][1] - 2 ) &&
					( mouse.y <= this.select_data[0][1] + 2 )){
						this.polygon_state = 'end';	
						TOOLS.set_cursor("url('img/pipette.png') 1 15, crosshair");
						this.select_data.push([this.select_data[0][0], this.select_data[0][1]]);
						this.selectionState = 'polygon closed';
				}
				// add polygon point
				else{
					this.select_data.push([mouse.x, mouse.y]);
					var ctx = toolCanvas.getContext('2d');
					for(i=0; i < this.select_data.length-1; i++){
						HELPER.dashedLine(ctx, this.select_data[i][0], this.select_data[i][1], this.select_data[i+1][0], this.select_data[i+1][1]);
					}
				}
				
			}	
			else
			{
				$('#wait').show();				
				setTimeout(function(){
					// create mask	
					var context = IMAGE.canvas.getContext('2d');
					var sensitivity = TOOLS.action_data().attributes.sensitivity;
					var x = mouse.x, y = mouse.y;
					var offsetX = -Math.ceil(IMAGE.offsetX), offsetY = -Math.ceil(IMAGE.offsetY);
					var img = context.getImageData(0, 0, IMAGE.width, IMAGE.height);
					var imgData = img.data;
					var dx = [-1,  0, +1, -1, +1, -1,  0, +1];
					var dy = [-1, -1, -1,  0,  0, +1, +1, +1];
				
					var k = ((y * (img.width * 4)) + (x * 4));
					var color_from_mid = {
						r: imgData[k+0],
						g: imgData[k+1],
						b: imgData[k+2],
						a: imgData[k+3],
					};
					//console.log(RGB_HSV(color_from_mid));
					var color_from_darkest = color_from_mid;
					var color_from_lightest = color_from_mid;
					for (var i=0;i<dx.length;i++){
						var k = (((y+dy[i]) * (img.width * 4)) + ((x+dx[i]) * 4));
						var color_from_temp = {
							r: imgData[k+0],
							g: imgData[k+1],
							b: imgData[k+2],
							a: imgData[k+3],
						};
						if (RGB_HSV(color_from_temp).v < RGB_HSV(color_from_darkest).v){
							color_from_darkest = color_from_temp;
						}
						else if (RGB_HSV(color_from_temp).v > RGB_HSV(color_from_darkest).v){
							color_from_lightest = color_from_temp;
						}
					}
						
					var k = (y * IMAGE.width + x) * 4;
					if (Math.abs(imgData[k+0] - 255) <= sensitivity &&
						Math.abs(imgData[k+1] - 255) <= sensitivity &&
						Math.abs(imgData[k+2] - 255) <= sensitivity){
						alert("white area cannot be selected!");
						$('#wait').hide();
						TOOLS.selectionState = null;
						return false;
					}
					
					// using LAB-colorcheck
					if($('#lab_checkbox').prop('checked')){
						var darkest_pixel_lab = rgb2lab(color_from_darkest);
						var lightest_pixel_lab = rgb2lab(color_from_lightest);
						var lab_sensitivity = TOOLS.action_data().attributes.lab_sensitivity;
						
						// subtract
						if (CONTROL.alt_pressed) lab_sensitivity += 5;
						// else
						else lab_sensitivity -= 5;
					}
									
					var orig_sensitivity = sensitivity;	
					// subtract
					if (CONTROL.alt_pressed) sensitivity += 5;
					// else
					else sensitivity -= 5;
						
					var mask = [];

					// process polygon
					// algorithm from: http://alienryderflex.com/polygon/		
					// efficiency improvement with precalculation by Patrick Mullen			
					var j=TOOLS.select_data.length-2,
					constant = [],
					multiple = [],
					maxX = 0, 
					maxY = 0,
					minX = Number.MAX_VALUE,
					minY = Number.MAX_VALUE ;
					
					// precalculate
					for(var i=0; i<TOOLS.select_data.length-1; i++) {
						if(TOOLS.select_data[j][1]==TOOLS.select_data[i][1]) {
							constant[i]=TOOLS.select_data[i][0];
							multiple[i]=0; 
						}
						else {
							constant[i]=TOOLS.select_data[i][0]-(TOOLS.select_data[i][1]*TOOLS.select_data[j][0])/(TOOLS.select_data[j][1]-TOOLS.select_data[i][1])+(TOOLS.select_data[i][1]*TOOLS.select_data[i][0])/(TOOLS.select_data[j][1]-TOOLS.select_data[i][1]);
							multiple[i]=(TOOLS.select_data[j][0]-TOOLS.select_data[i][0])/(TOOLS.select_data[j][1]-TOOLS.select_data[i][1]); 
						}
						j=i; 
						
						//determine min/max of x/y
						if (TOOLS.select_data[i][0] < minX) minX = TOOLS.select_data[i][0];
						if (TOOLS.select_data[i][0] > maxX) maxX = TOOLS.select_data[i][0];
						if (TOOLS.select_data[i][1] < minY) minY = TOOLS.select_data[i][1];
						if (TOOLS.select_data[i][1] > maxY) maxY = TOOLS.select_data[i][1];
					}
					// compare
					for (var jj = minY; jj <= maxY; jj++){ // minY->maxY
						for (var ii = minX; ii <= maxX; ii++){ // minX->maxX
							var oddNodes=false ;
							var x = ii, y = jj;
							
							for (var i=0; i<TOOLS.select_data.length-1; i++) {
								if ((TOOLS.select_data[i][1]< y && TOOLS.select_data[j][1]>=y
								||   TOOLS.select_data[j][1]< y && TOOLS.select_data[i][1]>=y)) {
									oddNodes^=(y*multiple[i]+constant[i]<x); 
								}
								j=i; 
							}
							// within sensitivity?
							var k = (jj * IMAGE.width + ii) * 4;
							
							// using LAB-colorcheck
							if($('#lab_checkbox').prop('checked')){
								var pixel_lab = rgb2lab({r:imgData[k+0] ,g:imgData[k+1] ,b:imgData[k+2] });
							
								//check clicked pixel
								if(((Math.abs(pixel_lab.a - lightest_pixel_lab.a) <= lab_sensitivity &&
								  Math.abs(pixel_lab.b - lightest_pixel_lab.b) <= lab_sensitivity) ||
								  // darkest pixel
								 (Math.abs(pixel_lab.a - darkest_pixel_lab.a) <= lab_sensitivity &&
								  Math.abs(pixel_lab.b - darkest_pixel_lab.b) <= lab_sensitivity)) &&
								  // pixel not white
								 (Math.abs(imgData[k+0] - 255) > orig_sensitivity ||
								  Math.abs(imgData[k+1] - 255) > orig_sensitivity ||
								  Math.abs(imgData[k+2] - 255) > orig_sensitivity) &&
								  oddNodes){
									
									if (mask[ii+offsetX] == undefined)
										mask[ii+offsetX] = [];
									mask[ii+offsetX][jj+offsetY] = true;
								}
							}
							// using RGB-colorcheck
							else{
								//check lightest pixel
								if(((Math.abs(imgData[k+0] - color_from_lightest.r) <= sensitivity &&
								  Math.abs(imgData[k+1] - color_from_lightest.g) <= sensitivity &&
								  Math.abs(imgData[k+2] - color_from_lightest.b) <= sensitivity &&
								  Math.abs(imgData[k+3] - color_from_lightest.a) <= sensitivity) ||
								  // darkest pixel
								 (Math.abs(imgData[k+0] - color_from_darkest.r) <= sensitivity &&
								  Math.abs(imgData[k+1] - color_from_darkest.g) <= sensitivity &&
								  Math.abs(imgData[k+2] - color_from_darkest.b) <= sensitivity &&
								  Math.abs(imgData[k+3] - color_from_darkest.a) <= sensitivity)) &&
								  // pixel not white
								 (Math.abs(imgData[k+0] - 255) > orig_sensitivity ||
								  Math.abs(imgData[k+1] - 255) > orig_sensitivity ||
								  Math.abs(imgData[k+2] - 255) > orig_sensitivity) &&
								  oddNodes){
	
									if (mask[ii+offsetX] == undefined)
										mask[ii+offsetX] = [];
									mask[ii+offsetX][jj+offsetY] = true;
								}	
							}					  
						}
					}

					SELECTION.push();	// save old selection
					// create selection
					if (CONTROL.shift_pressed)	SELECTION.add(mask);
					else if (CONTROL.alt_pressed) SELECTION.subtract(mask);
					else{
						FIGURES.selectedFigure = null;
						CLASSIFICATOR.reset();
						SELECTION.clear();
						$('.figureBox').removeClass('selected');
						SELECTION.create(mask);
					}
					
					IMAGE.redrawSelectionFull();			
					CLASSIFICATOR.show();	
					TOOLS.select_data = [];	
					TOOLS.set_cursor("crosshair");	
					TOOLS.polygon_state = 'start';
					TOOLS.selectionState = null;
				
					$('#wait').hide();
				}, 50);	
			}
				
		}
		else if(type == 'doubleclick'){
			if (this.polygon_state == 'start')
			{
				// end polygon
				this.polygon_state = 'end';	
				TOOLS.set_cursor("url('img/pipette.png') 1 15, crosshair");
				this.select_data.push([this.select_data[0][0], this.select_data[0][1]]);
				this.selectionState = 'polygon closed';
			}
		}
		else if(type == 'move'){
			if(mouse.x < 0) mouse.x = 0;
			if(mouse.y < 0) mouse.y = 0;
			if(mouse.x >= IMAGE.width) mouse.x = IMAGE.width-1;
			if(mouse.y >= IMAGE.height) mouse.y = IMAGE.height-1;
			
			var ctx = toolCanvas.getContext('2d');
			ctx.clearRect(0, 0, IMAGE.width, IMAGE.height);
			
			if (this.polygon_state == 'start')
				TOOLS.set_cursor("crosshair");
			else if (this.polygon_state == 'end')
				TOOLS.set_cursor("url('img/pipette.png') 1 15, crosshair");

			var i=0;
			
			if (this.select_data.length >= 2)	
				for(i=0; i < this.select_data.length-1; i++){
					HELPER.dashedLine(ctx, this.select_data[i][0], this.select_data[i][1], this.select_data[i+1][0], this.select_data[i+1][1]);
				}
			if (this.select_data.length >= 1){
				this.selectionState = 'polygon select';
				if(this.polygon_state != 'end'){	
					// floating end
					HELPER.dashedLine(ctx, this.select_data[i][0], this.select_data[i][1], mouse.x, mouse.y);
					if (( mouse.x >= this.select_data[0][0] - 2 ) &&
						( mouse.x <= this.select_data[0][0] + 2 ) &&
						( mouse.y >= this.select_data[0][1] - 2 ) &&
						( mouse.y <= this.select_data[0][1] + 2 ))
						TOOLS.set_cursor("cell");
					else
						TOOLS.set_cursor("crosshair");
				}
				else{
					// close polygon
					HELPER.dashedLine(ctx, this.select_data[i][0], this.select_data[i][1], this.select_data[0][0], this.select_data[0][1]);
				}
			}
		}
	}

}