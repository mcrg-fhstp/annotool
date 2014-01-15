var CONTROL = new CONTROLS_CLASS();

//keyboard handlers
document.onkeydown = function(e) {return CONTROL.on_keyboard_action(e); }
document.onkeyup = function(e) {return CONTROL.on_keyboardup_action(e); }



function CONTROLS_CLASS(){

	this.ctrl_pressed = false; //17
	this.alt_pressed = false; //18
	this.shift_pressed = false; //16
	this.cmd_pressed = false; //91
	this.esc_pressed = false; //27
	
	this.mouse;
	var autosize = true;
	var isDrag = false;
	var mouse_click_x = false;
	var mouse_click_y = false;
	var mouse_x_move_last = false;
	var mouse_y_move_last = false;
	var resize_all = false;
	var mouse_click_valid = false;
	
	var _mousedownTime = null,
		_doubleclickTime = 500;
	
	var mouse_x_release_last = false,
		mouse_y_release_last = false;
	
	
	//keyboard actions
	this.on_keyboard_action = function(event){
		k = event.keyCode;	//log(k);
				
		//up
		if(k == 38){

		}
		//down
		else if(k == 40){

		}
		//left
		else if(k == 39){

		}
		//right
		else if(k == 37){

		}
		//esc
		else if(k == 27){		
			this.esc_pressed = true;
			IMAGE.redrawSelectionFull();		
			TOOLS.reset();
		}
		//backspace
		else if(k == 8){		
			if(ACTION == "select_poly")
			{
				TOOLS.select_data.pop();		// remove last polypoint
				TOOLS.polygon_state = 'start';
				TOOLS[ACTION]('move', CONTROL.mouse, event);	// redraw polygon
			}
			event.preventDefault();
		}
		//z - undo
		else if(k == 90){
			//undo
			if(CONTROL.ctrl_pressed==true){
				
			}
		}
		//t - trim
		else if(k == 84){

		}
		//o - open
		else if(k == 79){
			
		}
		//s - save
		else if(k == 83){

		}
		//l - rotate left
		else if(k == 76){
		}
		//r - rotate right
		else if(k == 82){
		}
		//grid
		else if(k==71){
		}
		//del
		else if(k==46){
		}
		//shift
		else if(k==16){
			this.shift_pressed = true; 
			$('#shift_key_pressed').show();
		}
		//ctrl
		else if(k==17){
			this.ctrl_pressed = true; 
		}
		//alt
		else if(k==18){
			this.alt_pressed = true;
			$('#alt_key_pressed').show();
		}
		//cmd (OSX)
		else if(k==91){
			this.cmd_pressed = true;
		}
		//a
		else if(k==65){
			if(CONTROL.ctrl_pressed == true){
			}
		}
		//x
		else if(k==88){
		}
		//c
		else if(k==67){
		}
		//v
		else if(k==86){
		}		
	}
		
		
		
	//keyboard release
	this.on_keyboardup_action = function(event){
		k = event.keyCode;
		//shift
		if(k==16){
			this.shift_pressed = false;
			$('#shift_key_pressed').hide();
		}
		//ctrl
		else if(k==17){
			this.ctrl_pressed = false;
		}
		//alt
		else if(k==18){
			this.alt_pressed = false;
			$('#alt_key_pressed').hide();
		}
		//cmd (OSX)
		else if(k==91){
			this.cmd_pressed = false;
		}
		//esc
		else if(k == 27){		
			this.esc_pressed = false;
		}

	}
		
	
		
	this.get_mouse_position = function(event){
		var valid = true;
		if(event.offsetX) {
			mouse_x = event.offsetX;
			mouse_y = event.offsetY;
			}
		else if(event.layerX) {
			mouse_x = event.layerX;
			mouse_y = event.layerY;
			}
		else
			return false;
			
		if(event.target.id != "imageCanvas"){
			valid = false;
			/*if((mouse_x < 200 || mouse_y < 200) && event.target.id != "imageCanvas"){
				mouse_x = mouse_x - 109;
				mouse_y = mouse_y - 34;
				valid = false;
				}
			else if((mouse_x > IMAGE.width+1 || mouse_y > IMAGE.height+1) && event.target.id != "imageCanvas"){
				mouse_x = mouse_x - 109;
				mouse_y = mouse_y - 34;	
				valid = false;
				}
				
			/*if(ZOOM != 100 ){
				mouse_x = Math.floor(mouse_x / ZOOM * 100);
				mouse_y =  Math.floor(mouse_y / ZOOM * 100);
				}*/
			}
		//else
		//	valid = false;
		
		//save - other place will use it too
		CONTROL.mouse = {
			x: mouse_x, 
			y: mouse_y, 
			click_x: mouse_click_x,
			click_y: mouse_click_y,
			last_x: mouse_x_move_last,
			last_y: mouse_y_move_last,
			valid: valid,
			click_valid: mouse_click_valid,
			};
			//console.log(mouse_x_move_last+" "+mouse_y_move_last);
		}
		
		
		
	//mouse right click
	this.mouse_right_click = function(event){
		//if(POP != undefined && POP.active==true) return true;
		mouse_click_x = mouse_x;
		mouse_click_y = mouse_y;
		CONTROL.get_mouse_position(event);
		
		event.preventDefault();
		
		/*isDrag = true;
		isRightClick = true;
		// only if no selection in progress
		if(!TOOLS.selectionState)
			TOOLS.move_tool('click', CONTROL.mouse, event);
		/*for (i in TOOLS){
			if(i == ACTION){
				return TOOLS[i]('right_click', CONTROL.mouse, event);
				break;
				}
			}*/
	}
		
		
		
	//mouse click
	this.mouse_click = function(event){
		//if(POP != undefined && POP.active==true) return true;
		mouse_click_x = mouse_x;
		mouse_click_y = mouse_y;
		CONTROL.get_mouse_position(event);

		
		// left click
		if(event.which == 1) {
			if(CONTROL.mouse.valid == false)
				mouse_click_valid = false;
			else
				mouse_click_valid = true;
			isDrag = true;
		
			//check tools functions
			for (i in TOOLS){
				if(i == ACTION){
					TOOLS[i]('click', CONTROL.mouse, event);
					break;
					}
				}
		}
		// other mouse button and no selection in progress
		else if(event.which > 1 &&
				!TOOLS.selectionState)
			TOOLS.move_tool('click', CONTROL.mouse, event);			
				
		if(event.target.id == "canvas_preview") 
			CONTROL.calc_preview_by_mouse(CONTROL.mouse.x, CONTROL.mouse.y);	
		
	}
		
		
		
	//mouse move
	this.mouse_move = function(event){
		//if(POP != undefined && POP.active==true) return true;
		CONTROL.get_mouse_position(event);
		if(event.target.id == "canvas_preview" && isDrag==true)
			CONTROL.calc_preview_by_mouse(CONTROL.mouse.x, CONTROL.mouse.y);

		mouse_x_move_last = CONTROL.mouse.x;
		mouse_y_move_last = CONTROL.mouse.y;

		// left or no click
		if(event.which <= 1) {
			//check tools functions
			if(isDrag === false){
				for (i in TOOLS){
					if(i == ACTION){
						TOOLS[i]('move', CONTROL.mouse, event);
						break;
						}
					}
				}
			
			// remove pointer-events:auto from styles.css
			// change > to < in FIGURES.sort
			if (i == "move_tool")	
				FIGURES.checkMouseOver(event);
				
			if(isDrag === false) return false;	//only drag now		
			
			//check tools functions
			for (i in TOOLS){
				if(i == ACTION){
					TOOLS[i]('drag', CONTROL.mouse, event);
					//break;
					}
				}
		}
		// other mouse button and no selection in progress
		else if(event.which > 1 &&
				!TOOLS.selectionState)
			TOOLS.move_tool('drag', CONTROL.mouse, event);
			
		
	}
		
		
		
		
	//release mouse click
	this.mouse_release = function(event){
		//if(POP != undefined && POP.active==true) return true;
		var mouse = CONTROL.get_mouse_position(event);
		isDrag = false;
		//mouse_x_move_last = false
		//mouse_y_move_last = false;
		//if(TOOLS.select_square_action == '' && CONTROL.mouse.valid == true)
		//	TOOLS.select_data = false;
		
		//check tools functions
		toolCanvas.getContext('2d').clearRect(0, 0, IMAGE.width, IMAGE.height);
		//TOOLS.draw_selected_area();
		
		// left click
		if(event.which == 1){	
			if (_mousedownTime != null) {
				var now = (new Date()).getTime();
				//doubleclick
				if ((now - _mousedownTime < _doubleclickTime) &&
					( mouse_x_release_last == CONTROL.mouse.x && mouse_y_release_last == CONTROL.mouse.y)) {
					for (i in TOOLS){
						if(i == ACTION){
							TOOLS[i]('doubleclick', CONTROL.mouse, event);
							break;
						}
					}
				}
				//single click
				else{
					for (i in TOOLS){
						if(i == ACTION){
							TOOLS[i]('release', CONTROL.mouse, event);
							break;
						}
					}
					
					if (i == "move_tool" &&
						CONTROL.mouse.x == CONTROL.mouse.click_x && CONTROL.mouse.y == CONTROL.mouse.click_y)	
						FIGURES.checkClick(event);
				}
			}
			_mousedownTime = (new Date()).getTime();
		}
		// other mouse button and no selection in progress
		else if(event.which > 1 &&
				!TOOLS.selectionState)
			TOOLS.move_tool('release', CONTROL.mouse, event);
						
		mouse_x_release_last = CONTROL.mouse.x;
		mouse_y_release_last = CONTROL.mouse.y;
	}
	
	
	
		
	this.mouse_wheel_handler = function(event){	//return true;			
		CONTROL.get_mouse_position(event);

		var delta = 0;
				 
		if (event.wheelDelta) { /* IE/Opera. */
			delta = -(event.wheelDelta/120);
		} else if (event.detail) { /* Mozilla */
			delta = event.detail/3;
		}

		// no selection in progress
		if (delta && !TOOLS.selectionState)  {
			if (delta < 0) {
				IMAGE.zoomIn(CONTROL.mouse.x, CONTROL.mouse.y);
			}
			else {
				IMAGE.zoomOut(CONTROL.mouse.x, CONTROL.mouse.y);
			}
			IMAGE.redrawSelectionFull();
		}
		
		//disable page scroll if ctrl pressed
		event.preventDefault()
		return false;
		
	}

}