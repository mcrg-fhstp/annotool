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


var SELECTION = new SELECTION_CLASS();

function SELECTION_CLASS(){
	
	this.current = null;
	this.border = null;
	this.boundingBox = null;
	this.figureID = null;
	this.changed = null;
	
	this.undoStack = [{},{},{}];
	this.redoStack = {};
	this.stackCounter = 0;


	this.push = function(){
		this.stackCounter = 0;
		// shift 2->3, 1->2
		for(var i=this.undoStack.length; i > 1; i--){
			this.undoStack[i-1].current = this.undoStack[i-2].current;
			this.undoStack[i-1].border = this.undoStack[i-2].border;
			this.undoStack[i-1].boundingBox = this.undoStack[i-2].boundingBox;
		} 
		// new->1
		if (this.current != null)
			this.undoStack[0].current = this.current.clone();
		this.undoStack[0].border = this.border;
		this.undoStack[0].boundingBox = this.boundingBox;
		
		$('#undo_tool').removeClass('inactive');
		$('#redo_tool').addClass('inactive');
	}
	
	this.undo = function(){
		if(this.stackCounter == 0){
			this.redoStack.current = this.current;
			this.redoStack.border = this.border;
			this.redoStack.boundingBox = this.boundingBox;
		}
		if (this.stackCounter < this.undoStack.length){
			this.stackCounter ++;
			//this.current.clear();
			
			this.current = this.undoStack[this.stackCounter-1].current;
			this.border = this.undoStack[this.stackCounter-1].border;
			this.boundingBox = this.undoStack[this.stackCounter-1].boundingBox;
		}
		IMAGE.redrawSelectionFull();
		
		$('#redo_tool').removeClass('inactive');
		if(this.stackCounter == this.undoStack.length)
			$('#undo_tool').addClass('inactive');
	}
	
	this.redo = function(){
		if(this.stackCounter == 1){
			this.current = this.redoStack.current;
			this.border = this.redoStack.border;
			this.boundingBox = this.redoStack.boundingBox;
			this.stackCounter = 0;
		}
		if (this.stackCounter > 1){
			this.stackCounter --;
			this.current = this.undoStack[this.stackCounter-1].current;
			this.border = this.undoStack[this.stackCounter-1].border;
			this.boundingBox = this.undoStack[this.stackCounter-1].boundingBox;
		}
		IMAGE.redrawSelectionFull();
		
		$('#undo_tool').removeClass('inactive');
		if(this.stackCounter == 0)
			$('#redo_tool').addClass('inactive');
	}


	// make a new selection
	this.create = function(mask){
		if (mask == null) return;
		this.current = mask;
		this.calculateBorder();
	}
	
	// delete current selection
	this.clear = function(){
		this.current = null;
		this.border = null;
		this.boundingBox = null;
		this.figureID = null;
		this.changed = null;
		CLASSIFICATOR.hide();
		$('.figure').removeClass('selected');
	}
	
	// add region to current selection
	this.add = function(mask){
		if (mask == null) return;
		if(this.current == null)
			this.current = [];
		//console.log(mask);
		for(var i=0; i < mask.length; i++){
			if (mask[i] == undefined)
				continue;
			for(var j=0; j < mask[i].length; j++){
				if (mask[i][j] == undefined)
					continue;
				if (this.current[i] == undefined)
					this.current[i] = [];
				this.current[i][j] = true;
			}		
		}	
		this.calculateBorder();
		this.changed = true;
		CLASSIFICATOR.showSaveButton();
	}
	
	// remove region from current selection
	this.subtract = function(mask){
		if (mask == null) return;	
		if (this.current == null) return;
			
		for(var i=0; i < mask.length; i++){
			if (mask[i] == undefined)
				continue;
			for(var j=0; j < mask[i].length; j++){
				if (mask[i][j] == undefined)
					continue;
				if (this.current[i] == undefined)
					continue;
				this.current[i][j] = false;
			}		
		}	
		this.calculateBorder();		
		this.changed = true;
		CLASSIFICATOR.showSaveButton();
	}
	
	// load existing figure from db as selection
	this.load = function(figureID){
		var data = LOADER.loadMaskOfFigure(figureID);
		if (data.maskBase64 && data.classes && data.superimposition && data.figure_incomplete && data.figure_damaged && data.tracing_incomplete){
			var mask = window.disassembleOneBitBitmap(data.maskBase64, data.boundingBox);
			this.create(mask);
			CLASSIFICATOR.fill(data.classes, data.superimposition, data.figure_incomplete, data.figure_damaged, data.tracing_incomplete);
					$('#classificator #classifier_data #figureid').text(figureID);
					$('#classificator #classifier_data #classified_by').text(data.classified_by);
					$('#classificator #classifier_data #classified_on').text(data.classified_on);
			this.figureID = data.figureID;
		}
		else{
			CLASSIFICATOR.hide();
			CLASSIFICATOR.showError(data);
		}
	}
	
	this.serialize = function(){
		var mask = this.current;
		if (mask == null) return null;
		
		//var Istart = Number.MAX_VALUE,
		//	Jstart = Number.MAX_VALUE;
		
		var XYarray = [];
		for(var i=0; i < mask.length; i++){
			if(mask[i] == undefined)
				continue;
			
			for(var j=0; j < mask[i].length; j++){
				if(mask[i][j] == undefined)
					continue;
				if(mask[i][j] == true){
					//if (i < Istart) Istart = i;
					//if (j < Jstart) Jstart = j;
					//if (i == Istart && j == Jstart)
						XYarray.push([i,j]);
					//else
					//	XYarray.push([i-Istart,j-Jstart]);
				}
			}
		}
		return $.toJSON(XYarray);
	}
	
	this.unserialize = function(XYarray){
		if (XYarray == null) return null;
		var mask = [];
		for (var i = 0; i < XYarray.length; i++){
			if (mask[XYarray[i][0]] == undefined)
				mask[XYarray[i][0]] = [];
			if (mask[XYarray[i][0]][XYarray[i][1]] == undefined)
				mask[XYarray[i][0]][XYarray[i][1]] = true;
		}
		return mask;
	}
	
	
	
	this.calculateBorder = function(){
		var mask = this.current;
		var border = [];
		
		var Xmin = Number.MAX_VALUE,
			Xmax = 0,
			Ymin = Number.MAX_VALUE,
			Ymax = 0;
		
		// get rise and fall
		for(var i=0; i < mask.length; i++){
			if(mask[i] == undefined)
				continue;
			for(var j=0; j < mask[i].length; j++){
				if(mask[i][j] == undefined)
					continue;
				if((mask[i][j] && (mask[i][j+1] == undefined)) ||					// vert. falling edge
				  (mask[i][j] && !mask[i][j+1]) ||
				  (mask[i][j] && (mask[i][j-1] == undefined)) ||					// vert. rising edge
				  (mask[i][j] && !mask[i][j-1]) ||
				  (mask[i][j] && (mask[i+1] == undefined)) ||					// hor. falling edge
				  (mask[i][j] && !mask[i+1][j]) ||
				  (mask[i][j] && (mask[i-1] == undefined)) ||					// hor. rising edge
				  (mask[i][j] && !mask[i-1][j]))
					border.push([i,j]);
				if (mask[i][j]){
					if(j<Ymin) Ymin = j;
					if(j>Ymax) Ymax = j;
					if(i<Xmin) Xmin = i;
					if(i>Xmax) Xmax = i; 
				}
			}
		}
		
		this.boundingBox = [[Xmin, Ymin],[Xmax, Ymax]];
		this.border = border;
	}


	this.drawBorder = function(context, W, H, offsetX, offsetY, scale){
		var border = this.border;
		if (border != null){
			var img = context.createImageData(W,H);
			var imgData = img.data;
			
			for(var i=0; i < border.length; i++){
				//pixel within visible area?
				if ((border[i][0]/scale) > -offsetX &&
					(border[i][0]/scale) < (-offsetX + W) &&
					(border[i][1]/scale) > -offsetY &&
					(border[i][1]/scale) < (-offsetY + H)){
					// draw pixel
					var k = ((Math.ceil(border[i][1]/scale)+offsetY) * W + (Math.ceil(border[i][0]/scale)+offsetX)) * 4;
					imgData[k+0] = 255;	// r
					imgData[k+1] = 255; 	// g
					imgData[k+2] = 0; 	// b
					imgData[k+3] = 255;	// a
				}
			}
			
			context.putImageData(img,0,0);
		}
		else
			context.clearRect(0,0,W,H);
	}



	this.fillRegion = function(context, W, H, offsetX, offsetY, scale){
		var mask = this.current;
		if (mask != null){
			var img = context.createImageData(W,H);
			var imgData = img.data;
		
			// get rise and fall
			for(var i=0; i < mask.length; i++){
				if(mask[i] == undefined)
					continue;
				for(var j=0; j < mask[i].length; j++){
					if((mask[i][j] == undefined) ||
						(mask[i][j] == false))
						continue;
					//pixel within visible area?
					if ((i/scale) > -offsetX &&
						(i/scale) < (-offsetX + W) &&
						(j/scale) > -offsetY &&
						(j/scale) < (-offsetY + H)){
						// draw pixel
						var k = ((Math.ceil(j/scale)+offsetY) * W + (Math.ceil(i/scale)+offsetX)) * 4;
						imgData[k+0] = 255;	// r
						imgData[k+1] = 255; 	// g
						imgData[k+2] = 0; 	// b
						imgData[k+3] = 255;	// a
					}
				}
			}
			
			context.putImageData(img,0,0);
		}
		else
			context.clearRect(0,0,W,H);
		//console.log(offsetX+" "+offsetY);
	}
		
	
	this.getBoundingBox = function(mask){
		return this.boundingBox;
	}	
	
	
	// save classification data for selected figure to db
	this.saveClassificationData = function(){
		$('#wait').show();					
		setTimeout(function(){
			//generateBitmap(this.current, this.boundingBox);
			if (SELECTION.figureID == null || SELECTION.changed){
				var maskBase64 = window.generateOneBitBitmapDataURL(SELECTION.current, SELECTION.boundingBox);
				var figure = new Object();
				figure.boundingBox = {x1: SELECTION.boundingBox[0][0], y1: SELECTION.boundingBox[0][1], x2: SELECTION.boundingBox[1][0], y2: SELECTION.boundingBox[1][1] };
			}
			else{
				var maskBase64 = null;
				var figure = new Object();
				//figure.boundingBox = "";
			}

			
			// new figure
			if (SELECTION.figureID == null){
				var classificationData = CLASSIFICATOR.getSelectedClasses();
				figure.figureID = LOADER.saveNewFigure(IMAGE.imageName, 
									figure.boundingBox, 
									classificationData.classes, 
									classificationData.superimposition,
									classificationData.figure_incomplete,
									classificationData.figure_damaged,
									classificationData.tracing_incomplete, 
									maskBase64);
				if(!parseInt(figure.figureID)){
					CLASSIFICATOR.showError(figure.figureID);
				}
				else{
					CLASSIFICATOR.showResponse("Figure " + figure.figureID + " saved successfully!");
					figure.imageName = IMAGE.imageName;
					// add to FIGURES.figures
					FIGURES.figures.push(figure);
				}
			}
			// existing figure
			else{
				var classificationData = CLASSIFICATOR.getSelectedClasses();
				var response = LOADER.updateExistingFigure(SELECTION.figureID, 
											figure.boundingBox, 
											classificationData.classes, 
											classificationData.superimposition, 
											classificationData.figure_incomplete,
											classificationData.figure_damaged,
											classificationData.tracing_incomplete,
											maskBase64);
				if(!parseInt(response)){
					CLASSIFICATOR.showError(response);
				}
				else{
					// update in FIGURES.figures
					for(var i=0; i< FIGURES.figures.length; i++){
						if (FIGURES.figures[i].figureID == SELECTION.figureID){
							FIGURES.figures[i].boundingBox.x1 = SELECTION.boundingBox[0][0];
							FIGURES.figures[i].boundingBox.y1 = SELECTION.boundingBox[0][1];
							FIGURES.figures[i].boundingBox.x2 = SELECTION.boundingBox[1][0];
							FIGURES.figures[i].boundingBox.y2 = SELECTION.boundingBox[1][1];
						}
					}
					CLASSIFICATOR.showResponse("Figure " + response + " updated successfully!");
				}
			}
			SELECTION.clear();
			IMAGE.resize();
			$('.figureBox').removeClass('selected');
			FIGURES.selectedFigure = null;
			$('#wait').hide();
		},50);
	}
}