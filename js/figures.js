var FIGURES = new FIGURES_CLASS();

function FIGURES_CLASS(){

	this.figures = null;
	this.selectedFigure = null;

	// load figures for image from db
	this.load = function(imageName){
		this.figures = LOADER.loadFiguresForImage(imageName);
		this.sort()	;
	}
	
	// sort array descending the size of bounding box to make smaller boundingbox overlay a large one
	this.sort = function(){
		for(var i=0; i< this.figures.length; i++){
			if (!this.figures[i].area){
				this.figures[i].area = (this.figures[i].boundingBox.x2 - this.figures[i].boundingBox.x1) * (this.figures[i].boundingBox.y2 - this.figures[i].boundingBox.y1);
			}
		}
		for(var i=0; i< this.figures.length; i++){
			for(var j=i; j< this.figures.length; j++){
				if(this.figures[j].area < this.figures[i].area){
					var temp = this.figures[j];
					this.figures[j] = this.figures[i];
					this.figures[i] = temp;
				}
			}
		}
	}
	
	// draw the boundingboxes for all visible figures 
	this.draw = function(parent, W, H, offsetX, offsetY, scale){
		if (this.figures == null ||
			this.figures.length == 0) return;
		
		$(parent).empty(); // remove all childs
		
		for(var i=0; i< this.figures.length; i++){
			var figure = this.figures[i];
			// part of bounding box within visible area
			if ((((-offsetX < (figure.boundingBox.x1/scale) && (figure.boundingBox.x1/scale) < (-offsetX + W)) || 	
				 (-offsetX < (figure.boundingBox.x2/scale) && (figure.boundingBox.x2/scale) < (-offsetX + W))) &&
				 ((-offsetY < (figure.boundingBox.y1/scale) && (figure.boundingBox.y1/scale) < (-offsetY + H)) ||
				 (-offsetY < (figure.boundingBox.y2/scale) && (figure.boundingBox.y2/scale) < (-offsetY + H))))){
					 
				  // create boundingbox
				  var div = document.createElement( "div" );
				  $(div).addClass('figureBox');
				  if(ACTION == 'move_tool')
				  		$(div).addClass('selectable');
				  $(div).css('top', (figure.boundingBox.y1/scale) + offsetY);
				  $(div).css('left', (figure.boundingBox.x1/scale) + offsetX);
				  $(div).css('width', (figure.boundingBox.x2/scale) - (figure.boundingBox.x1/scale));
				  $(div).css('height', (figure.boundingBox.y2/scale) - (figure.boundingBox.y1/scale));
				  //$(div).attr('id',$.toJSON(figure.boundingBox));		// id from db
				  $(div).attr('figureID',figure.figureID);
				  $(div).attr('title',figure.id);	// tooltip
				  //$(div).text(figure.figureID);	// show figureID in div
				  
				  $(div).click(function() {
					  //alert( $(this).attr('id') );
					  FIGURES.selectedFigure = $(this).attr('figureID');
					  $('#wait').show();
							
					  setTimeout(function(){
					  	  SELECTION.clear();
					  	  CLASSIFICATOR.show();
						  SELECTION.load( FIGURES.selectedFigure );
						  CLASSIFICATOR.showDeleteButton();
						  //FIGURES.loadClassificationData( FIGURES.selectedFigure );
						  IMAGE.redrawSelectionFull();
						  $('#wait').hide();
					  },50);
					  $('.figureBox').removeClass('selected');
					  $(this).addClass('selected');
				  });
				  if (FIGURES.selectedFigure == $(div).attr('figureID'))
				  	$(div).addClass('selected');
				  	
				  $(parent).append(div);
			  }
		}
	}
	
	// load classification data for existing figure from db
	/*this.loadClassificationData = function(figureID){
		//alert(figureID);
		var data = LOADER.loadClassificationDataOfFigure(figureID);
		CLASSIFICATOR.fill(data);
	}*/
	
	// remove classification data for existing figure from db
	this.removeClassificationData = function(){
		var resp = LOADER.deleteClassificationDataOfFigure(FIGURES.selectedFigure);
		if (parseInt(resp)){
			CLASSIFICATOR.reset();
			CLASSIFICATOR.showResponse("Figure " + resp + " deleted successfully!")
			// remove from FIGURES.figures
			for(var i=0; i< FIGURES.figures.length; i++){
				if (FIGURES.figures[i].figureID == SELECTION.figureID){
					FIGURES.figures.splice(i,1);
				}
			}
			SELECTION.clear();
			IMAGE.resize();
		}
		else{
			CLASSIFICATOR.hide();
			CLASSIFICATOR.showError(resp);
		}
	}

	
	this.checkMouseOver = function(event){
		$("#figureHolder>div").each(function() {
	       // check if clicked point (taken from event) is inside element
	       var mouseX = event.pageX;
	       var mouseY = event.pageY;
	       var offset = $(this).offset();
	       var width = this.offsetWidth;	//$(this).width();
	       var height = this.offsetHeight;	//$(this).height();
	
	       if (mouseX > offset.left && mouseX < offset.left+width 
	           && mouseY > offset.top && mouseY < offset.top+height){
	         $("#figureHolder>div").removeClass('hover');
	         $(this).addClass('hover'); // force click event
	         TOOLS.set_cursor('pointer');
	         return false;
	       }
	       else{
	         $(this).removeClass('hover');
	       }
	    });
	}
	
	
	this.checkClick = function(event){
		$("#figureHolder>div").each(function() {
	       // check if clicked point (taken from event) is inside element
	       var mouseX = event.pageX;
	       var mouseY = event.pageY;
	       var offset = $(this).offset();
	       var width = this.offsetWidth;	//$(this).width();
	       var height = this.offsetHeight;	//$(this).height();
	
	       if (mouseX > offset.left && mouseX < offset.left+width 
	           && mouseY > offset.top && mouseY < offset.top+height){
	         $(this).click(); // force click event
	         return false;
	       }
	    });
	}
}