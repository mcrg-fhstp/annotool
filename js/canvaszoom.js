/*
The MIT License

Copyright (c) 2012 Matthew Wilcoxson (www.akademy.co.uk)
Copyright (c) 2011 Peter Tribble (www.petertribble.co.uk) - Touch / gesture controls.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/*
CanvasZoom
By Matthew Wilcoxson

Description:    Zooming of very large images with Javascript, HTML5 and the canvas element (based on DeepZoom format and now the Zoomify format).
Website:        http://www.akademy.co.uk/software/canvaszoom/canvaszoom.php
Like it?:       http://www.akademy.co.uk/me/donate.php
Version:        1.1.4
*/
/* global ImageLoader, window */
function CanvasZoom( _settings, _tilesFolderDeprecated, _imageWidthDeprecated, _imageHeightDeprecated ) {

	"use strict";
	
	//var t = this; // make "this" accessible when out of "this" scope and minify
	var NULL=null, UNDEFINED, FALSE=false, TRUE=true, MATH=Math; // To minify
	
	var _debug = FALSE,
		_debugShowRectangle = FALSE; // Paint a rectangle rather than an image, adjust as needed!

	var _tileOverlap = 1, 
			_tileSize = 256,
			_fileType = "jpg",
			_tilesSystem = "deepzoom", // or "zoomify"
			_canvas,_drawBorder,_defaultZoom, _minZoom, _maxZoom, _tilesFolder, _imageWidth, _imageHeight;
			
	if( _settings.getContext === UNDEFINED ) {

		// settings
		_canvas = _settings.canvas;
		_tilesFolder = _settings.tilesFolder;
		_imageWidth = _settings.imageWidth;
		_imageHeight = _settings.imageHeight;

		_drawBorder = (_settings.drawBorder === UNDEFINED) ? TRUE : _settings.drawBorder;

		_defaultZoom = _settings.defaultZoom;//(_settings.defaultZoom === UNDEFINED) ? UNDEFINED : _settings.defaultZoom;
		_minZoom = _settings.minZoom;//(_settings.minZoom === UNDEFINED) ? UNDEFINED : _settings.minZoom;
		_maxZoom = _settings.maxZoom;//(_settings.maxZoom === UNDEFINED) ? UNDEFINED : _settings.maxZoom;
		
		_tilesSystem = (_settings.tilesSystem === UNDEFINED) ? _tilesSystem : _settings.tilesSystem;
		_tileOverlap = (_settings.tileOverlap === UNDEFINED) ? _tileOverlap : _settings.tileOverlap;
		_tileSize = (_settings.tileSize === UNDEFINED) ? _tileSize : _settings.tileSize;
		_fileType = (_settings.fileType === UNDEFINED) ? _fileType : _settings.fileType;
	}
	else {
		// canvas, old deprecated way for backward compatibility with tiles, width, height.
		_canvas = _settings;
		_tilesFolder = _tilesFolderDeprecated;
		_imageWidth = _imageWidthDeprecated;
		_imageHeight = _imageHeightDeprecated;
	}
	
	this.canvas = _canvas;
	this.offsetX = 0, this.offsetY = 0;
		
	var _zoomLevelMin = 0,
			_zoomLevelMax = 0,
			_zoomLevelFull = -1, // For painting a background image for all missing tiles.	
			_zoomLevel = -1,

		_lastscale = 1.0,
		
		_rotate = 0,
	
		_mouseX = 0,
			_mouseY = 0,
			_mouseDownX = 0,
			_mouseDownY = 0,
			_mouseMoveX = 0,
			_mouseMoveY = 0,

		_mouseIsDown = FALSE,
			_mouseLeftWhileDown = FALSE,

		_aGetWidth = 'w',
			_aGetHeight = 'h',
			_aGetTile = 't',
			_aGetWaiting = 'wt',
	
		_tileZoomArray = NULL,
			_imageLoader = NULL,

		_ctx = NULL,
		

		
		_canvasLeft = 0, 
		_canvasTop = 0,
		_canvasRight = _canvasLeft + _canvas.width,
		_canvasBottom = _canvasTop + _canvas.height,
		
		PI = MATH.PI,
		TWOPI = MATH.PI * 2,
		LN2 = MATH.LN2,
		
		mathMin = MATH.min,
		mathMax = MATH.max,
		mathSqrt = MATH.sqrt,
		mathCos = MATH.cos,
		mathSin = MATH.sin,
		mathFloor = MATH.floor,
		mathCeil = MATH.ceil,
		mathLog = MATH.log,
		mathATan2 = MATH.atan2,
		mathATan = MATH.atan
		;

		this.width = _canvas.width,
		this.height = _canvas.height;
			
	//mouse
	var _mousedownTime = null,
		_doubleclickTime = 500;


	this.getTileFile = function( zoom, column, row ) {
		
		var totalNumber, zooms = 0, _tiles = NULL, tileGroupNumber;
		
		if( _tilesSystem === "deepzoom" ) {
			return _tilesFolder + "/" + zoom + "/" + column + "_" + row + "." + _fileType;
		}
		else if( _tilesSystem === "zoomify" ) {
			totalNumber = (_tileZoomArray[zoom].length * row) + column;
			if ( zoom > 0 ) {
				for( zooms = zoom-1; zooms; zooms-- ) {
					_tiles = _tileZoomArray[zooms];
					totalNumber += _tiles.length * _tiles[0].length;
				}
			}
			
			tileGroupNumber = mathFloor( (totalNumber+1) / _tileSize );		// +1 because of problem with finding last file in folder generated by Adobe Photoshop
			return _tilesFolder + "/" + "TileGroup" + tileGroupNumber + "/" + zoom + "-" +  column + "-" + row + "." + _fileType;
		}
	}

	this.initialTilesLoaded = function() {
		
		var tileZoomLevel = _tileZoomArray[_zoomLevel],
			columns = tileZoomLevel.length,
			rows = tileZoomLevel[0].length,
			mouse='mouse', touch='touch', gesture='gesture', // extreme minify!
			iColumn = 0, iRow = 0, imageId = 0;
			
		for( iColumn = 0; iColumn < columns; iColumn++ ) {

			for( iRow = 0; iRow < rows; iRow++ ) {

				tileZoomLevel[iColumn][iRow][_aGetTile] = _imageLoader.getImageById( imageId++ );
			}
		}
		
		_tileZoomArray[_zoomLevelFull][0][0][_aGetTile] = _imageLoader.getImageById( imageId );
		
		//
		// Centre image
		//
		this.offsetX = (_canvas.width - tileZoomLevel[_aGetWidth]) / 2;
		this.offsetY = (_canvas.height - tileZoomLevel[_aGetHeight]) / 2;

		// 
		// Add mouse listener events
		//
		/*addEvent( mouse+'move', mouseMove, TRUE );
		addEvent( mouse+'down', mouseDown, TRUE );
		addEvent( mouse+'up', mouseUp, TRUE );
		
		addEvent( mouse+'out', mouseOut, TRUE );
		addEvent( mouse+'over', mouseOver, TRUE );*/
		//this.addEvent( 'DOMMouseScroll', this.mouseWheel, TRUE );
		//this.addEvent( mouse+'wheel', this.mouseWheel, TRUE );
		
		this.addEvent(touch+'start', this.touchDown );
		this.addEvent(touch+'end', this.touchDown );
		this.addEvent(touch+'move', this.touchDown );
				
		this.addEvent( gesture+'end', this.gestureEnd ); // gestures to handle pinch
		this.addEvent( gesture+'change', this.gestureChange, TRUE ); // don't let a gesturechange event propagate
		
		this.addEvent( mouse+'up', this.mouseUpWindow, FALSE, window );
		this.addEvent( mouse+'move', this.mouseMoveWindow, FALSE, window );
		
		_ctx = _canvas.getContext('2d');
		
		this.requestPaint();
	}
    
	this.addEvent = function( event, func, ret, obj ) {
		obj = obj || _canvas;
		obj.addEventListener( event, function(e){ func( e || window.event ); }, ret || FALSE );
	}
    
	this.mouseDown = function( event ) {
		_mouseIsDown = TRUE;
		_mouseLeftWhileDown = FALSE;
		
		_mouseMoveX = _mouseDownX = mousePosX(event);
		_mouseMoveY = _mouseDownY = mousePosY(event); 
	}
	
	this.mouseUp = function( event ) {
		_mouseIsDown = FALSE;
		_mouseLeftWhileDown = FALSE;
		
		_mouseX = mousePosX(event);
		_mouseY = mousePosY(event); 
	
		if( _mouseX === _mouseDownX &&
				_mouseY === _mouseDownY ) {
/*
			if (_mousedownTime != null) {
				var now = (new Date()).getTime();
				//doubleclick
				if (now - _mousedownTime < _doubleclickTime) {
					// Didn't drag so assume a click.
					zoomInMouse();
				}
				//single click
				else{
*/
					
					if(TOOLS.selectedTool == TOOLS.magic_wand){
						var scale = _imageWidth/_tileZoomArray[_zoomLevel][_aGetWidth];
						
						if( scale != 1){
							alert("please zoom in to maximum for selection!")
						}
						else{
							//document.body.style.cursor = "wait";
							$('#wait').show();
							
							setTimeout(function(){
								if (CONTROL.shift_pressed){
									var mask = TOOLS.magic_wand(_canvas.getContext('2d'), _canvas.width, _canvas.height, _mouseX, _mouseY, 50, Math.ceil(Math.abs(this.offsetX)), Math.ceil(Math.abs(this.offsetY)));	// liefert unsortierte koordinaten relativ zum bildursprung
									SELECTION.add(mask);
									CLASSIFICATOR.showSaveButton();
								}
								else if (CONTROL.alt_pressed){
									var mask = TOOLS.magic_wand(_canvas.getContext('2d'), _canvas.width, _canvas.height, _mouseX, _mouseY, 60, Math.ceil(Math.abs(this.offsetX)), Math.ceil(Math.abs(this.offsetY)));	// liefert unsortierte koordinaten relativ zum bildursprung
									SELECTION.subtract(mask);
									CLASSIFICATOR.showSaveButton();
								}
								else{
									FIGURES.selectedFigure = null;
									CLASSIFICATOR.reset();
									SELECTION.clear();
									$('.figureBox').removeClass('selected');
									var mask = TOOLS.magic_wand(_canvas.getContext('2d'), _canvas.width, _canvas.height, _mouseX, _mouseY, 50, Math.ceil(Math.abs(this.offsetX)), Math.ceil(Math.abs(this.offsetY)));	// liefert unsortierte koordinaten relativ zum bildursprung
									SELECTION.create(mask);
								}
		
								redrawSelection();
								
								CLASSIFICATOR.show();
								//document.body.style.cursor = "auto";
								$('#wait').hide();
							}, 20);
						}
					}
/*
				}
			}
			_mousedownTime = (new Date()).getTime();		
*/
		}
	}
	
	this.mouseMove = function(event) {
	
		_mouseX = mousePosX(event);
		_mouseY = mousePosY(event); 
		
		if( _mouseIsDown ) {

			var newOffsetX = this.offsetX + (_mouseX - _mouseMoveX),
				newOffsetY = this.offsetY + (_mouseY - _mouseMoveY),
				currentImageWidth = _tileZoomArray[_zoomLevel][_aGetWidth],
				currentImageHeight = _tileZoomArray[_zoomLevel][_aGetHeight];
			
			calculateNeededTiles( _zoomLevel, newOffsetX, newOffsetY );
			

			
			if (currentImageWidth > _canvas.width ||
				this.offsetX < 0){
				if (newOffsetX <= 0)
					this.offsetX = newOffsetX;
				else
					this.offsetX = 0;
				
				if (newOffsetX < (_canvas.width - currentImageWidth) &&
					(_mouseX - _mouseMoveX) < 0)
					this.offsetX = _canvas.width - currentImageWidth;
			}
			
			if (currentImageHeight > _canvas.height ||
				this.offsetY < 0){	
				if (newOffsetY <= 0)		
					this.offsetY = newOffsetY;
				else
					this.offsetY = 0;
				
				if (newOffsetY < (_canvas.height - currentImageHeight) &&
					(_mouseY - _mouseMoveY) < 0)
					this.offsetY = _canvas.height - currentImageHeight;
			}

			_mouseMoveX = _mouseX;
			_mouseMoveY = _mouseY;
						
			requestPaint();
		}
	}

	this.touchDown = function( event ) {
		
		event.preventDefault();
		_mouseIsDown = TRUE;
		_mouseLeftWhileDown = FALSE;

		_mouseDownX = touchPosX(event);
		_mouseDownY = touchPosY(event);

		_mouseMoveX = _mouseDownX;
		_mouseMoveY = _mouseDownY;
	}

	this.touchUp = function( event ) {
		
		var tolerence = 50;
		_mouseIsDown = FALSE;
		_mouseLeftWhileDown = FALSE;

		_mouseX = touchPosX(event);
		_mouseY = touchPosY(event);

		if( _mouseX >= _mouseDownX - tolerence && _mouseX <= _mouseDownX + tolerence &&
				_mouseY >= _mouseDownY - tolerence && _mouseY <= _mouseDownY + tolerence )
				//_mouseY === _mouseDownY )
		{
			// Didn't drag so assume a click.
			zoomInMouse();
		}
	}

	this.touchMove = function(event) {
		event.preventDefault();
		event.stopPropagation();
		_mouseX = touchPosX(event);
		_mouseY = touchPosY(event);

		if( _mouseIsDown )
		{
			var newOffsetX = this.offsetX + (_mouseX - _mouseMoveX),
				newOffsetY = this.offsetY + (_mouseY - _mouseMoveY);

			calculateNeededTiles( _zoomLevel, newOffsetX, newOffsetY );

			_mouseMoveX = _mouseX;
			_mouseMoveY = _mouseY;

			this.offsetX = newOffsetX;
			this.offsetY = newOffsetY;

			requestPaint();
		}
	}

	this.gestureEnd = function(event) {
		_lastscale = 1.0;
	}

	this.gestureChange = function(event) {
		var scale = event.scale;
		event.preventDefault();
		
		if (scale < 0.75*_lastscale) {
			zoomOutMouse();
			_lastscale = scale;
		}
		
		if (scale > 1.25*_lastscale) {
			zoomInMouse();
			_lastscale = scale;
		}
	}
	
	this.mousePosX = function( event ) {
		// Get the mouse position relative to the canvas element.
		var x = 0;
		
		if (event.layerX || event.layerX === 0) { // Firefox
			x = event.layerX;// - _canvas.offsetLeft;
		} else if (event.offsetX || event.offsetX === 0) { // Opera
			x = event.offsetX;
		}
		
		return x;
	}
	
	this.mousePosY = function( event ) {
		var y = 0;
		
		if (event.layerY || event.layerY === 0) { // Firefox
			y = event.layerY;// - _canvas.offsetTop;
		} else if (event.offsetY || event.offsetY === 0) { // Opera
			y = event.offsetY;
		}
		
		return y;
	}

	// touchend populates changedTouches instead of targetTouches
	this.touchPosX = function( event ) {
		// Get the mouse position relative to the canvas element.
		var x = 0;
		if (event.targetTouches[0]) {
			x = event.targetTouches[0].pageX - _canvas.offsetLeft;
		} else {
			x = event.changedTouches[0].pageX - _canvas.offsetLeft;
		}
		return x;
	}

	this.touchPosY = function( event ) {
		var y = 0;
		if (event.targetTouches[0]) {
			y = event.targetTouches[0].pageY - _canvas.offsetTop;
		} else {
			y = event.changedTouches[0].pageY - _canvas.offsetTop;
		}
		return y;
	}
    
	this.mouseOut = function( event ) {
		if( _mouseIsDown ) {
			_mouseLeftWhileDown = TRUE;
		}
	}
	
	this.mouseOver = function( event ) {
		// (Should be called mouseEnter IMO...)
		_mouseLeftWhileDown = FALSE;
	}
	
	this.mouseWheel = function( event ) {
		var delta = 0;
				 
		if (event.wheelDelta) { /* IE/Opera. */
			delta = -(event.wheelDelta/120);
		} else if (event.detail) { /* Mozilla */
			delta = event.detail/3;
		}

		if (delta)  {
			if (delta < 0) {
				this.zoomInMouse();
			}
			else {
				this.zoomOutMouse();
			}
		}
				 
		if (event.preventDefault) {
			event.preventDefault(); 
		}

		event.returnValue = FALSE;
	}
	
	// If mouseUp occurs outside of canvas while moving, cancel movement.
	this.mouseUpWindow = function( event ) {
		if( _mouseIsDown && _mouseLeftWhileDown ) {
			mouseUp( event );
		}
	}
	
	// keep track of mouse outside of canvas so movement continues.
	this.mouseMoveWindow = function(event) {
		if( _mouseIsDown && _mouseLeftWhileDown ) {
			mouseMove(event);
		}
	}
    
	// Zoom in a single level
	this.zoomIn = function( x, y ) {
		this.zoom( _zoomLevel*1 + 1, x, y );
		this.requestPaint();
	}
	
	// Zoom out a single level
	this.zoomOut = function( x, y ) {
		this.zoom( _zoomLevel - 1, x, y );
		this.requestPaint();
	}
	
    // Zoom in at mouse co-ordinates
	this.zoomInMouse = function() {
		this.zoomIn( _mouseX, _mouseY );
	}
	
	// Zoom out at mouse co-ordinates
	this.zoomOutMouse = function() {
		this.zoomOut( _mouseX, _mouseY );
	}
	
	this.setRotate = function( radians ) {
		_rotate = radians % TWOPI;
		
		this.calculateNeededTiles( _zoomLevel, this.offsetX, this.offsetY );
		this.requestPaint();
	}
	
	// Change the zoom level and update.
	this.zoom = function( zoomLevel, zoomX, zoomY ) {

		if( zoomLevel >= _zoomLevelMin && zoomLevel <= _zoomLevelMax ) {
			
			var newZoom = zoomLevel,
				currentZoom = _zoomLevel,
				scale = _tileZoomArray[newZoom][_aGetWidth] / _tileZoomArray[currentZoom][_aGetWidth],
				currentImageWidth = _tileZoomArray[currentZoom][_aGetWidth],
				currentImageHeight = _tileZoomArray[currentZoom][_aGetHeight];	
					
			// limit zoomout to full view of image		
			if (currentImageWidth < _canvas.width &&
				currentImageHeight < _canvas.height &&
				scale < 1)
				newZoom = currentZoom;	


												
			var currentImageX = zoomX - this.offsetX,
				currentImageY = zoomY - this.offsetY,
			
				newImageX = currentImageX * scale,
				newImageY = currentImageY * scale,
					
				newImageWidth = _tileZoomArray[newZoom][_aGetWidth],
				newImageHeight = _tileZoomArray[newZoom][_aGetHeight];
			
			
			var	newOffsetX = this.offsetX - (newImageX - currentImageX);

			// zooming out in middle pos when image smaller than canvas
			if (newImageWidth < _canvas.width)
				newOffsetX = (_canvas.width - newImageWidth) / 2;
			else if ((newImageWidth + newOffsetX) < _canvas.width)
				newOffsetX = _canvas.width - newImageWidth;
			else if (newOffsetX > 0)
				newOffsetX = 0;
			
			var	newOffsetY = this.offsetY - (newImageY - currentImageY);
	
			if (newImageHeight < _canvas.height)
				newOffsetY = (_canvas.height - newImageHeight) / 2;
			else if ((newImageHeight + newOffsetY) < _canvas.height)
				newOffsetY = _canvas.height - newImageHeight;
			else if (newOffsetY > 0)
				newOffsetY = 0;
			

					
			this.calculateNeededTiles( newZoom, newOffsetX, newOffsetY );
			
			_zoomLevel = newZoom;
			this.offsetX = newOffsetX;
			this.offsetY = newOffsetY;
			this.scale = _imageWidth/_tileZoomArray[_zoomLevel][_aGetWidth];
			
			$('#zoom_nr').html(Math.round( _zoomLevel/_zoomLevelMax * 1000)/10);
			$('#zoom_range').val(_zoomLevel);
		}
	}
	
	// Work out which of the tiles we need to download 
	this.calculateNeededTiles = function( zoom, offsetX, offsetY ) {

		//
		// Calculate needed tiles
		//
		
		// TODO: This needs to be threaded, particularly when we are rotated.
		
		var tileZoomLevelArray = _tileZoomArray[zoom],
		
			canvasLeft = _canvasLeft, 
			canvasTop = _canvasTop,
			canvasRight = _canvasRight,
			canvasBottom = _canvasBottom,
	
			tile = NULL,
			
			tileSize = _tileSize,
				tileOverlap = _tileOverlap,
				rotate = _rotate,
	
			zoomWidth = tileZoomLevelArray[_aGetWidth],
			zoomHeight = tileZoomLevelArray[_aGetHeight],
			
			imageMidX = offsetX + zoomWidth / 2,
			imageMidY = offsetY + zoomHeight / 2,
		
			columns = tileZoomLevelArray.length,
			rows = tileZoomLevelArray[0].length,
		
			iColumn, iRow,
			tileList = [],
			
			tileOverlapX = 0,
			tileOverlapY = 0,
			tileSizeX = tileSize - tileOverlapX,
			tileSizeY = tileSize - tileOverlapY,
			tileWidth, tileHeight,
			
			topleft, topright, bottomright, bottomleft,
			
			x1,y1,x2,y2,corners;
			
      
		for( iColumn = 0; iColumn < columns; iColumn++ ) {

			for( iRow = 0; iRow < rows; iRow++ ) {

				tile = tileZoomLevelArray[iColumn][iRow];
				
				if( (tile[_aGetTile] === NULL || tile[_aGetTile] === undefined) && tile[_aGetWaiting] === FALSE ) { // If not loaded or not loading
				
					x1 = (iColumn * tileSizeX) + offsetX;
					y1 = (iRow * tileSizeY) + offsetY;
					
					if( rotate ) {
					
						tileWidth = mathMin( tileSizeX, zoomWidth - (x1 - offsetX) );
						tileHeight = mathMin( tileSizeY, zoomHeight - (y1 - offsetY) );
						
						corners = rotateRect( x1 + tileWidth/2, y1 + tileHeight/2, tileWidth, tileHeight, imageMidX, imageMidY, rotate );
						
						x1 = mathMin( corners.tl.x, corners.tr.x, corners.br.x, corners.bl.x );
						x2 = mathMax( corners.tl.x, corners.tr.x, corners.br.x, corners.bl.x );
						y1 = mathMin( corners.tl.y, corners.tr.y, corners.br.y, corners.bl.y );
						y2 = mathMax( corners.tl.y, corners.tr.y, corners.br.y, corners.bl.y );
					}
					else {
						x2 = x1 + mathMin( tileSizeX, zoomWidth - (x1 - offsetX) );
						y2 = y1 + mathMin( tileSizeY, zoomHeight - (y1 - offsetY) );
					}
					
					if( !( x1 > canvasRight || y1 > canvasBottom || x2 < canvasLeft || y2 < canvasTop) ) {
						// request tile!
						tile[_aGetWaiting] = TRUE;
						tileList.push( { "name" : zoom + "_" + iColumn + "_" + iRow, "file" : IMAGE.getTileFile( zoom, iColumn, iRow ) } );
					}
				}
			}
		}
		
		this.getTiles( tileList );
	}

	// Load the tiles we need with ImageLoader
	this.getTiles = function( tileList ) {
		if( tileList.length > 0 ) {

			/*_imageLoader = */new ImageLoader( {
				"images": tileList,
				"onImageLoaded":function( name, tile ) { IMAGE.tileLoaded( name, tile ); }
			} );
		}
	}
	
	// Tile loaded, save it.
	this.tileLoaded = function( name, tile ) {

		var tileDetails = name.split("_");
		
		if( tileDetails.length === 3 ) {

			var tileInfo = _tileZoomArray[tileDetails[0]][tileDetails[1]][tileDetails[2]];
			tileInfo[_aGetTile] = tile;
			tileInfo[_aGetWaiting] = FALSE;
			
			this.requestPaint();
		}
	}
	
	this.rotateRect = function( rectCentreX, rectCentreY, rectWidth, rectHeight, rotateX, rotateY, rotate ) {
		// Rotate centre point
		var rectCentreRotated = rotatePoint( rectCentreX, rectCentreY, rotateX, rotateY, rotate );
		
		// Now find where new corners are relative to centre
		var hyper = mathSqrt( rectWidth*rectWidth + rectHeight*rectHeight ) / 2;
		var angles = [];
		
		if( rectWidth === rectHeight ) {
			// if square use these angles.
			angles.push( rotate + (TWOPI/8) );
			angles.push( angles[0] + (TWOPI/4) );
		}
		else {
			// end of row / column images which can be less than square.
			var angle = mathATan( rectHeight / rectWidth );
			angles.push( rotate + angle );
			angles.push( rotate + PI - angle );
		}
		
		var leftCornerXDistance = mathCos( angles[0] ) * hyper,
			leftCornerYDistance = mathSin( angles[0] ) * hyper,
			rightCornerXDistance = mathCos( angles[1] ) * hyper,
			rightCornerYDistance = mathSin( angles[1] ) * hyper;
			 
		return {
			tr: {
				x: rectCentreRotated.x + leftCornerXDistance,
				y: rectCentreRotated.y + leftCornerYDistance
			},
			tl: {
				x: rectCentreRotated.x + rightCornerXDistance,
				y: rectCentreRotated.y + rightCornerYDistance
			},
			bl: {
				x: rectCentreRotated.x - leftCornerXDistance,
				y: rectCentreRotated.y - leftCornerYDistance
			},
			br: {
				x: rectCentreRotated.x - rightCornerXDistance,
				y: rectCentreRotated.y - rightCornerYDistance
			}
		};
	}
	
	this.rotatePoint = function( xPos, yPos, midX, midY, rotate ) {
		var nx = xPos - midX,
			ny = yPos - midY,

			na = mathATan2( ny, nx ) + rotate,
			nh = mathSqrt( nx*nx + ny*ny );

		return {
			x: ( mathCos(na) * nh ) + midX,
			y: ( mathSin(na) * nh ) + midY
		};
	}

	this.requestPaint = function() {
		
		var animRequest = window.requestAnimationFrame;
		if( animRequest ) {
			try {
				animRequest( IMAGE.paint() );
			}catch(e){}
		} else {
			window.setTimeout( IMAGE.paint(), 1000 / 60 );	
		}
	}

	this.paintBorder = function( ctx ) {
		//ctx.strokeStyle = "#000";
		//ctx.strokeRect( 0, 0, _canvas.width, _canvas.height );
	}
	
	this.paint = function() {

		var tileZoomLevelArray = _tileZoomArray[_zoomLevel],
				
			offsetX = this.offsetX,
				offsetY = this.offsetY,
			tileSize = _tileSize,
				tileOverlap = _tileOverlap,

			zoomWidth = tileZoomLevelArray[_aGetWidth],
				zoomHeight = tileZoomLevelArray[_aGetHeight],
        
			imageMidX = offsetX + zoomWidth / 2,
			imageMidY = offsetY + zoomHeight / 2,

			rotate = _rotate,

			columns = tileZoomLevelArray.length,
				rows = tileZoomLevelArray[0].length,

			canvasLeft = _canvasLeft,
				canvasTop = _canvasTop,
				canvasRight = _canvasRight,
				canvasBottom = _canvasBottom,

			x1, x2, y1, y2,
				corners,
			
			tileOverlapX = 0, tileOverlapY = 0,
				tileCount = 0, 
				tile = NULL,
				
			tileSizeX = tileSize - tileOverlapX,
			tileSizeY = tileSize - tileOverlapY,
			tileWidth, tileHeight,
			
			overlap = false;

		// Clear area
		//
		_ctx.clearRect( 0, 0, _canvas.width, _canvas.height );

		
		/*if( 1 || _debug ) {
			canvasTop += 100;
			canvasLeft += 100;
			canvasRight -= 300;
			canvasBottom -= 200;
			
			_ctx.strokeStyle = "#f00";
			_ctx.strokeRect( canvasLeft, canvasTop, canvasRight-canvasLeft, canvasBottom-canvasTop ); 
		}*/
		


		if( rotate ) {
			// rotate
			//
			_ctx.save();
			_ctx.translate( imageMidX, imageMidY ); // TODO: needs to rotate at mid point of image part visible in canvas.
			_ctx.rotate( rotate );
			_ctx.translate( -imageMidX, -imageMidY );
		}
		
		//
		// Show images
		//
        
		// TODO: This pastes a low resolution copy on the background (It's a bit of a hack, a better solution might be to find a nearer zoom (if one is downloaded))
		var fullTile = _tileZoomArray[_zoomLevelFull][0][0][_aGetTile],
			iColumn = 0, iRow = 0;
		
		var rotated = [];
		
		// Paint background first
		if (fullTile != undefined)
			_ctx.drawImage( fullTile, offsetX, offsetY, zoomWidth, zoomHeight );
		
		// TODO: Improve this by working out the start / end column and row using the image position instead of looping through them all (still pretty fast though!)
		for( iColumn = 0; iColumn < columns; iColumn++ ) {

			for( iRow = 0; iRow < rows; iRow++ ) {

				x1 = (iColumn * tileSizeX) + offsetX;
				y1 = (iRow * tileSizeY) + offsetY;

				tileWidth = mathMin( tileSizeX, zoomWidth - (x1 - offsetX) );
				tileHeight = mathMin( tileSizeY, zoomHeight - (y1 - offsetY) );
				
				x2 = x1 + tileWidth;
				y2 = y1 + tileHeight;
					
				if( rotate ) {

					corners = rotateRect( x1 + tileWidth/2, y1 + tileHeight/2, tileWidth, tileHeight, imageMidX, imageMidY, rotate );
						
					overlap = !( 
						mathMin( corners.tl.x, corners.tr.x, corners.br.x, corners.bl.x ) > canvasRight || 
						mathMin( corners.tl.y, corners.tr.y, corners.br.y, corners.bl.y ) > canvasBottom || 
						mathMax( corners.tl.x, corners.tr.x, corners.br.x, corners.bl.x ) < canvasLeft || 
						mathMax( corners.tl.y, corners.tr.y, corners.br.y, corners.bl.y ) < canvasTop     
					);

					if( _debug ) {
						rotated.push( [ corners.tr, corners.tl, corners.bl, corners.br, iColumn, iRow ] );
					}
				}
				else {

					overlap = !( x1 > canvasRight || x2 < canvasLeft || y1 > canvasBottom || y2 < canvasTop );
				}
				
				if( overlap ) {

					tile = tileZoomLevelArray[iColumn][iRow][_aGetTile];
										
					if( tile !== NULL && tile !== undefined ) {
						// Draw tile
						_ctx.drawImage( tile, x1, y1 );
					}
					/*else {
						
						// Tile still loading - draw something else.
						_ctx.beginPath();
					
						_ctx.moveTo( x1, y1 );
						_ctx.lineTo( x2, y1 );
						_ctx.lineTo( x2, y2 );
						_ctx.lineTo( x1, y2 );
						_ctx.closePath();

						_ctx.save();
						_ctx.clip();
					
						// TODO: Fill with a lower zoom image. (or possible use combination of higher zooms??)
						// but scaling images in canvas still VERY SLOW.
						// THIS NOTABLY SLOWS DOWN PANNING WHEN IMAGES ARE NOT YET LOADED ON SOME BROWSERS.
						_ctx.drawImage( fullTile, offsetX, offsetY, zoomWidth, zoomHeight );
						
						
						_ctx.restore();
					}*/
					
					if( _debug ) {
						_ctx.fillStyle = "#666";
						_ctx.font = "normal 12px Arial";
						_ctx.fillText( "test", x1+10, y1+10 );
						
						if( _debugShowRectangle && tile === NULL ) {
							
							_ctx.fillStyle = "#999";
							_ctx.fillRect( x1, y1, x2 - x1, y2 - y1 );
						}
						
						// Draw tile border.
						_ctx.strokeRect( x1, y1, tileSize, tileSize );
						tileCount++;
					}
				}
			}
		}
		
		this.debugPaint( _ctx, offsetX, offsetY, zoomWidth, zoomHeight, tileCount );

		if( rotate ) {
			_ctx.restore();
		}
		
		this.debugPaintTilePoints( rotated );

		if( _drawBorder ) {
			this.paintBorder( _ctx );
		}
		
		// redraw selected area
		//this.redrawSelectionOutline();
		
		// redraw existing figures
		FIGURES.draw(figureHolder,_canvas.width, _canvas.height, Math.ceil(this.offsetX), Math.ceil(this.offsetY), _imageWidth/zoomWidth);

	}
	
	this.debugPaintTilePoints = function( rotated ) {
	
		if( _debug ) {
			
			for( var r = 0; r < rotated.length; r++ ) {
				
				var topleft = rotated[r][0],
					topright = rotated[r][1],
					bottomright = rotated[r][2],
					bottomleft = rotated[r][3];
				
				_ctx.strokeStyle = "#ff0";
				_ctx.beginPath();
				_ctx.moveTo( topleft.x, topleft.y );
				_ctx.lineTo( bottomright.x, bottomright.y );
				_ctx.stroke();

				_ctx.strokeStyle = "#0ff";
				_ctx.beginPath();
				_ctx.moveTo( topright.x, topright.y );
				_ctx.lineTo( bottomleft.x, bottomleft.y );
				_ctx.stroke();

				_ctx.font = "normal 12px Arial";
				_ctx.fillText( rotated[r][4] + " : " + rotated[r][5], topleft.x, topleft.y );
			}
		}
	}
	
	this.debugPaint = function( ctx, imageLeft, imageTop, zoomWidth, zoomHeight, tileCount ) {
		
		if( _debug ) {

			// 
			// DEBUG!
			//
			ctx.strokeStyle = "#ff0";
			ctx.strokeRect( _canvasLeft, _canvasTop, _canvas.width, _canvas.height );
			ctx.strokeStyle = "#f0f";
			ctx.strokeRect( imageLeft, imageTop, zoomWidth, zoomHeight );
		
			ctx.fillStyle = "#0f0";
			ctx.font = "normal 12px Arial";

			// Text
			ctx.fillText( _mouseX + "," + _mouseY + " | " + this.offsetX + "," + this.offsetY + " | " + tileCount, 0, 20 );

			// Grid
			ctx.strokeStyle = "#f00";
			var x,y;
			for( y = 0; y < _canvas.height; y += _tileSize ) {
				for( x = 0; x < _canvas.width; x += _tileSize ) {	
					ctx.strokeRect( x, y, _tileSize, _tileSize ); 
				}
			}
		}
	}
	
	//Zoom in at the centre of the canvas
	this.zoomInCentre = function () {
		this.zoomIn( _canvas.width / 2, _canvas.height / 2 );
	};
	
	//Zoom out at the centre of the canvas
	this.zoomOutCentre = function () {
		this.zoomOut( _canvas.width / 2, _canvas.height / 2);
	};
	
	//Zoom at the centre of the canvas
	this.zoomCentre = function (zl) {
		this.zoom( zl, _canvas.width / 2, _canvas.height / 2);
		this.requestPaint();
	};
	
	//Zoom at specific window
	this.zoomWindow = function (x1, y1, x2, y2){
		var zoomLevel = _zoomLevelMax;
		while(Math.abs(x2-x1) > _canvas.width ||
			  Math.abs(y2-y1) > _canvas.height){
			zoomLevel--;
			x1/=2;
			x2/=2;
			y1/=2;
			y2/=2;
		}
		var midX = (x2+x1)/Math.pow(2,zoomLevel - _zoomLevel + 1);
		var midY = (y2+y1)/Math.pow(2,zoomLevel - _zoomLevel + 1);
		this.zoom( zoomLevel, midX + this.offsetX, midY + this.offsetY );
		this.requestPaint();
	}
	
	this.rotateClockwise = function () {
		this.setRotate( _rotate + TWOPI/32 );
	};
	
	this.rotateAnticlockwise = function () {
		this.setRotate( _rotate - TWOPI/32 );
	};
	
	this.setPositionXY = function(newOffsetX, newOffsetY){
		
		this.calculateNeededTiles( _zoomLevel, newOffsetX, newOffsetY );
				
		if (newOffsetX <= 0)
			this.offsetX = newOffsetX;
		else
			this.offsetX = 0;
			
		if (newOffsetY <= 0)		
			this.offsetY = newOffsetY;
		else
			this.offsetY = 0;
		
		this.requestPaint();
	};


	
	this.moveXY = function(deltaX, deltaY){
		
		var newOffsetX = this.offsetX + (deltaX - _mouseMoveX),
			newOffsetY = this.offsetY + (deltaY - _mouseMoveY),
			currentImageWidth = _tileZoomArray[_zoomLevel][_aGetWidth],
			currentImageHeight = _tileZoomArray[_zoomLevel][_aGetHeight];
		
		this.calculateNeededTiles( _zoomLevel, newOffsetX, newOffsetY );
		
		if (currentImageWidth > _canvas.width ||
			this.offsetX < 0){
			if (newOffsetX <= 0)
				this.offsetX = newOffsetX;
			else
				this.offsetX = 0;
			
			if (newOffsetX < (_canvas.width - currentImageWidth) &&
				(deltaX - _mouseMoveX) < 0)
				this.offsetX = _canvas.width - currentImageWidth;
		}
		
		if (currentImageHeight > _canvas.height ||
			this.offsetY < 0){	
			if (newOffsetY <= 0)		
				this.offsetY = newOffsetY;
			else
				this.offsetY = 0;
			
			if (newOffsetY < (_canvas.height - currentImageHeight) &&
				(deltaY - _mouseMoveY) < 0)
				this.offsetY = _canvas.height - currentImageHeight;
		}		

		_mouseMoveX = _mouseX;
		_mouseMoveY = _mouseY;
					
		this.requestPaint();
	}


	
	this.resize = function(){
		_canvasLeft = 0, 
		_canvasTop = 0,
		_canvasRight = _canvasLeft + _canvas.width,
		_canvasBottom = _canvasTop + _canvas.height,
		
		this.width = _canvas.width,
		this.height = _canvas.height;

		this.paint();
	}
	
	function redrawSelectionOutline(){
		var scale = _imageWidth/_tileZoomArray[_zoomLevel][_aGetWidth];
		
		SELECTION.drawBorder(overlayCanvas.getContext('2d'),_canvas.width, _canvas.height, Math.ceil(this.offsetX), Math.ceil(this.offsetY), scale);
	}
	this.redrawSelectionOutline = redrawSelectionOutline;


	this.redrawSelectionFull = function(){
		var scale = _imageWidth/_tileZoomArray[_zoomLevel][_aGetWidth];
		
		SELECTION.fillRegion(overlayCanvas.getContext('2d'),_canvas.width, _canvas.height, Math.ceil(this.offsetX), Math.ceil(this.offsetY), scale);
	}

	//(function() { // setup
		if( _tilesSystem === "deepzoom" ) {
			_zoomLevelMax = mathCeil( mathLog( mathMax( _imageWidth, _imageHeight ))/LN2 );
		}
		else if( _tilesSystem === "zoomify" ) {
			_zoomLevelMax = mathCeil( mathLog( mathMax( _imageWidth, _imageHeight ))/LN2 ) - mathLog( _tileSize )/LN2;
		}
		_tileZoomArray = [];

		var reducingWidth = _imageWidth,
				reducingHeight = _imageHeight,
			zoomLevelStart = -1,
			iZoom = 0, iColumn = 0, iRow = 0,
				columns = -1, rows = -1;
        
		for( iZoom = _zoomLevelMax;  iZoom >= _zoomLevelMin; iZoom-- ) {
		
			columns = mathCeil( reducingWidth / _tileSize );
			rows = mathCeil( reducingHeight / _tileSize );

			if( _zoomLevelFull === -1 && 
					reducingWidth <= _tileSize && reducingHeight <= _tileSize ) {
				// Largest full image inside single tile.
				_zoomLevelFull = iZoom;
			}
			
			if( //zoomLevelStart === -1 && 
					reducingWidth >= _canvas.width || reducingHeight >= _canvas.height ) {
				// Largest image that fits fully inside canvas.
				zoomLevelStart = iZoom-1;
			}

			// Create array for tiles
			_tileZoomArray[iZoom] = [];
			for( iColumn = 0; iColumn < columns; iColumn++ ) {
				_tileZoomArray[iZoom][iColumn] = []; 
			}
			
			// Set defaults
			// TODO: Test width - possibly to short, maybe not including last tile width...
			_tileZoomArray[iZoom][_aGetWidth] = reducingWidth;
			_tileZoomArray[iZoom][_aGetHeight] = reducingHeight;
			
			for( iColumn = 0; iColumn < columns; iColumn++ ) {
			
				for( iRow = 0; iRow < rows; iRow++ ) {
				
					_tileZoomArray[iZoom][iColumn][iRow] = [];
					
					_tileZoomArray[iZoom][iColumn][iRow][_aGetTile] = NULL;
					_tileZoomArray[iZoom][iColumn][iRow][_aGetWaiting] = FALSE;
				}
			}
			
			reducingWidth /= 2;
			reducingHeight /= 2;
		}
		
		if( _defaultZoom === UNDEFINED ) {
			_defaultZoom = zoomLevelStart;
		}
		_zoomLevel = _defaultZoom;

		if( _minZoom > _zoomLevelMin ) {
			_zoomLevelMin = _minZoom;
		}
		if( _maxZoom < _zoomLevelMax ) {
			_zoomLevelMax = _maxZoom;
		}

		if( _zoomLevelMin > _zoomLevelMax ) {
			var zoomMinTemp = _zoomLevelMin;
			_zoomLevelMin = _zoomLevelMax;
			_zoomLevelMax = zoomMinTemp;
		}
		
		//
		// Initial tile load
		//
		var imageList = [],imageId = 0;
		
		columns = _tileZoomArray[_zoomLevel].length;
		rows = _tileZoomArray[_zoomLevel][0].length;
		
		for( iColumn = 0; iColumn < columns; iColumn++ ) {
		
			for( iRow = 0; iRow < rows; iRow++ ) {
			
				imageList.push( { "id" : imageId++, "file": this.getTileFile( _zoomLevel, iColumn, iRow  ) } );
			}
		}
		
		imageList.push( { "id" : imageId, "file": this.getTileFile( _zoomLevelFull, 0, 0  ) } );

		_imageLoader = new ImageLoader( {
			"images": imageList,
			"onAllLoaded":function() { IMAGE.initialTilesLoaded(); $.event.trigger({type: "allImagesLoaded"});},
		} );
		
		this.scale = _imageWidth/_tileZoomArray[_zoomLevel][_aGetWidth];
        $('#zoom_nr').html(Math.round( _zoomLevel/_zoomLevelMax * 1000)/10);
		$('#zoom_range').attr('max',_zoomLevelMax);

	//}());
	
	this.zoomTimer = null;
	this.zoomTimeOutFunction = function() { IMAGE.redrawSelectionFull();};
	this.zoomTimeOut = 500;
}