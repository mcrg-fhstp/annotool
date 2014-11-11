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
}


var ACTION_DATA = [
	{name: 'move_tool', 	title: 'Move canvas tool',	icon: ['all.png', 3, -98],	attributes: {}		, cursor: 'grab'},

	{name: 'select_square', title: 'Rectangle selection tool', 	icon: ['all.png', -50+4, 5],	attributes: {sensitivity: 55, lab_sensitivity: 35}		, cursor: 'crosshair'},
	{name: 'select_poly', title: 'Polygon selection tool', 	icon: ['all.png', -400+2, -50+3],	attributes: {sensitivity: 55, lab_sensitivity: 35}		, cursor: 'crosshair'},
	{name: 'magic_wand', 	title: 'Magic wand selection tool', 	icon: ['all.png', -150+1, -50+2],	attributes: {sensitivity: 55, lab_sensitivity: 35}	, cursor: 'crosshair'	},

	];