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
	
	
	var imageName = GET('imageName');
	var imagePath = GET('imagePath');
	var imageWidth = GET('imageWidth');
	var imageHeight = GET('imageHeight');
	
	$('#imageDescription #site span').html(GET('site'));
	$('#imageDescription #rock span').html(GET('rock'));
	$('#imageDescription #section span').html(GET('section'));
	
	
	IMAGE = new CanvasZoom({ canvas: document.getElementById('imageCanvas'),tilesFolder: imagePath, imageWidth: imageWidth, imageHeight: imageHeight, tilesSystem: 'zoomify', tileOverlap: 0 });
	IMAGE.imageName = imageName;
	FIGURES.load(imageName);
	CLASSIFICATOR.loadOptions();
	TOOLS.draw_helpers();
}


var ACTION_DATA = [
	{name: 'move_tool', 	title: 'Move canvas tool',	icon: ['all.png', 3, -98],	attributes: {}		, cursor: 'grab'},

	{name: 'select_square', title: 'Rectangle selection tool', 	icon: ['all.png', -50+4, 5],	attributes: {sensitivity: 55}		, cursor: 'crosshair'},
	{name: 'select_poly', title: 'Polygon selection tool', 	icon: ['all.png', -400+2, -50+3],	attributes: {sensitivity: 55}		, cursor: 'crosshair'},
	{name: 'magic_wand', 	title: 'Magic wand selection tool', 	icon: ['all.png', -150+1, -50+2],	attributes: {sensitivity: 55}	, cursor: 'crosshair'	},

	];