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


var IMAGE = null;
var ACTION = 'move_tool';			///default action


HTTP_GET_VARS=new Array();
strGET=document.location.search.substr(1,document.location.search.length);
if(strGET!='')
{
    gArr=strGET.split('&');
    for(i=0;i<gArr.length;++i)
    {
        v='';vArr=gArr[i].split('=');
        if(vArr.length>1){v=vArr[1];}
        HTTP_GET_VARS[unescape(vArr[0])]=unescape(v);
    }
}
 
function GET(v)
{
	if(!HTTP_GET_VARS[v]){return '';}
	return HTTP_GET_VARS[v];
}


function setupImage(){

	var content = document.getElementById('center' );
	var imageCanvas = document.getElementById('imageCanvas');
	var overlayCanvas = document.getElementById('overlayCanvas');
	var toolCanvas = document.getElementById('toolCanvas');
	var figureHolder = document.getElementById('figureHolder');
	var groupHolder = document.getElementById('groupHolder');
	
	init_canvas = function(){
		var visible_w = parseInt(window.getComputedStyle(content,null).getPropertyValue('width'));// page_w - 60;
		var visible_h = parseInt(window.getComputedStyle(content,null).getPropertyValue('height'));// page_h - 60;	
			
		//console.log(visible_w +" x "+ visible_h);
		imageCanvas.width = visible_w;
		imageCanvas.height = visible_h;
		overlayCanvas.width = visible_w;
		overlayCanvas.height = visible_h;
		toolCanvas.width = visible_w;
		toolCanvas.height = visible_h;
		figureHolder.style.width = visible_w +"px";
		figureHolder.style.height = visible_h +"px";
		groupHolder.style.width = visible_w +"px";
		groupHolder.style.height = visible_h +"px";
		
		if(IMAGE)
			IMAGE.resize();
	}
	init_canvas();
	
	window.onresize = init_canvas;
	document.body.onload = init_canvas;
	
	// mouse handlers
	imageCanvas.onmousedown = CONTROL.mouse_click;	//mouse click
	imageCanvas.onmousemove = CONTROL.mouse_move;	//mouse move
	document.onmouseup = CONTROL.mouse_release;	//mouse resease
	imageCanvas.addEventListener("mousewheel", CONTROL.mouse_wheel_handler, false);	//mouse scroll
	imageCanvas.addEventListener("DOMMouseScroll", CONTROL.mouse_wheel_handler, false);	//mouse scroll
	imageCanvas.oncontextmenu = function(e) {return CONTROL.mouse_right_click(e); };	//mouse right click
	
	// load image details
	var imageName = GET('imageName');	
	var imageDetails = LOADER.loadImageDetails(imageName);
		
	var imagePath = imageDetails.folder;
	var imageWidth = imageDetails.width;
	var imageHeight = imageDetails.height;
	
	$('#imageDescription #site span').html(imageDetails.site);
	$('#imageDescription #rock span').html(imageDetails.rock);
	$('#imageDescription #section span').html(imageDetails.section);
	$('#imageDescription #author span').html(imageDetails.author);
	
	// setup image
	IMAGE = new CanvasZoom({ canvas: document.getElementById('imageCanvas'),tilesFolder: imagePath, imageWidth: imageWidth, imageHeight: imageHeight, tilesSystem: 'zoomify', tileOverlap: 0 });
	IMAGE.imageName = imageName;
	FIGURES.load(imageName);
	CLASSIFICATOR.loadOptions();
	TOOLS.draw_helpers();

	
	// figureID as GET-Parameter submitted -> zoom to figure
	if(GET('figureID')){
		// attach EventHandler, when Image fully loaded
		$(document).on("allImagesLoaded",function() {
			for(var i=0; i<FIGURES.figures.length; i++){
				if(FIGURES.figures[i].figureID == GET('figureID')){
					// zoom to figure		
					IMAGE.zoomWindow(FIGURES.figures[i].boundingBox.x1, FIGURES.figures[i].boundingBox.y1, FIGURES.figures[i].boundingBox.x2, FIGURES.figures[i].boundingBox.y2);
					// select figure
					$("#figureHolder .figureBox[figureid='" + GET('figureID') + "']" ).trigger('click');
				}
			}
		});
	}
	
	// groupID as GET-Parameter submitted -> zoom to group
	if(GET('groupID')){
		// attach EventHandler, when Image fully loaded
		$(document).on("allImagesLoaded",function() {
			for(var i=0; i<GROUPS.groups.length; i++){
				if(GROUPS.groups[i].groupID == GET('groupID')){
					// zoom to figure		
					IMAGE.zoomWindow(GROUPS.groups[i].boundingBox.x1, GROUPS.groups[i].boundingBox.y1, GROUPS.groups[i].boundingBox.x2, GROUPS.groups[i].boundingBox.y2);
					// select figure
					$("#groupHolder .groupBox[groupid='" + GET('groupID') + "']" ).trigger('click');
				}
			}
		});
	}
}


var ACTION_DATA = [
	{name: 'move_tool', 	title: 'Move canvas tool',	icon: ['all.png', 3, -98],	attributes: {}		, cursor: 'grab'},

	{name: 'select_square', title: 'Rectangle selection tool', 	icon: ['all.png', -50+4, 5],	attributes: {sensitivity: 55, lab_sensitivity: 35}		, cursor: 'crosshair'},
	{name: 'select_poly', title: 'Polygon selection tool', 	icon: ['all.png', -400+2, -50+3],	attributes: {sensitivity: 55, lab_sensitivity: 35}		, cursor: 'crosshair'},
	{name: 'magic_wand', 	title: 'Magic wand selection tool', 	icon: ['all.png', -150+1, -50+2],	attributes: {sensitivity: 55, lab_sensitivity: 35}	, cursor: 'crosshair'	},

	];