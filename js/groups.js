var GROUPS = new GROUPS_CLASS();

function GROUPS_CLASS(){

	this.groups = new Array();
	this.selectedGroup = null;

	this.addFigure = function(groupID, figure){
		// group already existing ??
		for(var i=0; i< this.groups.length; i++){
			if (this.groups[i].groupID == groupID)
				break;
		}
		// add group
		if (i == this.groups.length){
			var newGroup = new Object();
			newGroup.groupID = groupID;
			newGroup.boundingBox = new Object();
			newGroup.boundingBox.x1 = Infinity;
			newGroup.boundingBox.y1 = Infinity;
			newGroup.boundingBox.x2 = null;
			newGroup.boundingBox.y2 = null;
			newGroup.figureIDs = new Array();
			this.groups.push(newGroup);
		}
		// figure not already in array
		if ($.inArray(figure.figureID, this.groups[i].figureIDs) == -1){
			this.groups[i].figureIDs.push(figure.figureID);
			// add boundingbox
			if (figure.boundingBox.x1 <= this.groups[i].boundingBox.x1)
				this.groups[i].boundingBox.x1 = figure.boundingBox.x1;
			if (figure.boundingBox.y1 <= this.groups[i].boundingBox.y1)
				this.groups[i].boundingBox.y1 = figure.boundingBox.y1;	
			if (figure.boundingBox.x2 >= this.groups[i].boundingBox.x2)
				this.groups[i].boundingBox.x2 = figure.boundingBox.x2;
			if (figure.boundingBox.y2 >= this.groups[i].boundingBox.y2)
				this.groups[i].boundingBox.y2 = figure.boundingBox.y2;	
		}
	}
	
	this.removeFigure = function(groupID, figureID){
		// group already existing ??
		for(var i=0; i< this.groups.length; i++){
			if (this.groups[i].groupID == groupID)
				break;
		}
		if (i< this.groups.length){
			// figure in array
			if ((j=$.inArray(figureID, this.groups[i].figureIDs)) > -1){
				this.groups[i].figureIDs.splice(j,1);
				// update bounding box
				this.groups[i].boundingBox.x1 = Infinity;
				this.groups[i].boundingBox.y1 = Infinity;
				this.groups[i].boundingBox.x2 = null;
				this.groups[i].boundingBox.y2 = null;
				for(var k=0; k< this.groups[i].figureIDs.length; k++){
					for(var l=0; l< FIGURES.figures.length; l++){
						if (this.groups[i].figureIDs[k] == FIGURES.figures[l].figureID){
							if (FIGURES.figures[l].boundingBox.x1 <= this.groups[i].boundingBox.x1)
								this.groups[i].boundingBox.x1 = FIGURES.figures[l].boundingBox.x1;
							if (FIGURES.figures[l].boundingBox.y1 <= this.groups[i].boundingBox.y1)
								this.groups[i].boundingBox.y1 = FIGURES.figures[l].boundingBox.y1;	
							if (FIGURES.figures[l].boundingBox.x2 >= this.groups[i].boundingBox.x2)
								this.groups[i].boundingBox.x2 = FIGURES.figures[l].boundingBox.x2;
							if (FIGURES.figures[l].boundingBox.y2 >= this.groups[i].boundingBox.y2)
								this.groups[i].boundingBox.y2 = FIGURES.figures[l].boundingBox.y2;
						}
					}
				}
			}
		}
	}
	
	this.clearGroup = function(groupID){
		// group existing ??
		for(var i=0; i< this.groups.length; i++){
			if (this.groups[i].groupID == groupID)
				break;
		}
		// empty group
		if (i < this.groups.length){
			this.groups[i].boundingBox.x1 = Infinity;
			this.groups[i].boundingBox.y1 = Infinity;
			this.groups[i].boundingBox.x2 = null;
			this.groups[i].boundingBox.y2 = null;
			this.groups[i].figureIDs = [];
		}
	}
	
	// draw the boundingboxes for all visible groups 
	this.draw = function(parent, W, H, offsetX, offsetY, scale){
		if (this.groups == null ||
			this.groups.length == 0) return;
		
		$(parent).empty(); // remove all childs
		
		for(var i=0; i< this.groups.length; i++){
			var group = this.groups[i];
			// part of bounding box within visible area
			if ((((-offsetX < (group.boundingBox.x1/scale) && (group.boundingBox.x1/scale) < (-offsetX + W)) || 	
				 (-offsetX < (group.boundingBox.x2/scale) && (group.boundingBox.x2/scale) < (-offsetX + W))) &&
				 ((-offsetY < (group.boundingBox.y1/scale) && (group.boundingBox.y1/scale) < (-offsetY + H)) ||
				 (-offsetY < (group.boundingBox.y2/scale) && (group.boundingBox.y2/scale) < (-offsetY + H))))){
					 
				  // create boundingbox
				  var div = document.createElement( "div" );
				  $(div).addClass('groupBox');
				  if(ACTION == 'move_tool')
				  		$(div).addClass('selectable');
				  $(div).css('top', (group.boundingBox.y1/scale) + offsetY);
				  $(div).css('left', (group.boundingBox.x1/scale) + offsetX);
				  $(div).css('width', (group.boundingBox.x2/scale) - (group.boundingBox.x1/scale));
				  $(div).css('height', (group.boundingBox.y2/scale) - (group.boundingBox.y1/scale));
				  //$(div).attr('id',$.toJSON(group.boundingBox));		// id from db
				  $(div).attr('groupID',group.groupID);
				  $(div).attr('title',group.groupID);	// tooltip
				  //$(div).text(group.groupID);	// show groupID in div
				  
				  $(div).click(function() {
					  // add group to grouped figures
					  if (CONTROL.shift_pressed){
					  
					  }
					  // select existing group
					  else{
					  	  $('.figureBox').removeClass('grouped');
						  //alert( $(this).attr('id') );
						  GROUPS.selectedGroup = $(this).attr('groupID');
						  FIGURES.groupedFigures = [];
						  
						  // highlight figures from selected group
						  for (var i in GROUPS.groups){
						  	  if (GROUPS.groups[i].groupID == GROUPS.selectedGroup){
							  	  for (var k=0; k<GROUPS.groups[i].figureIDs.length; k++){
								  	  $('div.figureBox[figureID=' + GROUPS.groups[i].figureIDs[k] + ']').addClass('grouped');
								  	  // already added ??
								  	  if ($.inArray(GROUPS.groups[i].figureIDs[k], FIGURES.groupedFigures) == -1)
								  	  		FIGURES.groupedFigures.push(GROUPS.groups[i].figureIDs[k]);
							  	  }
						  	  }
						  }
						  $('.figureBox').removeClass('selected');
						  SELECTION.clear();
						  FIGURES.selectedFigure=null;
						  IMAGE.redrawSelectionFull();
						  $('.groupBox').removeClass('selected');
						  $(this).addClass('selected');
						  GROUPSELECTOR.showDeleteExistingGroup();
					}
				  });
				  if (GROUPS.selectedGroup == $(div).attr('groupID'))
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
/*	this.removeClassificationData = function(){
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
*/
	
	this.checkMouseOver = function(event){
		$("#groupHolder>div").each(function() {
	       // check if clicked point (taken from event) is inside element
	       var mouseX = event.pageX;
	       var mouseY = event.pageY;
	       var offset = $(this).offset();
	       var width = this.offsetWidth;	//$(this).width();
	       var height = this.offsetHeight;	//$(this).height();
	
	       if (mouseX > offset.left && mouseX < offset.left+width 
	           && mouseY > offset.top && mouseY < offset.top+height
	           && !$('.figureBox').hasClass('hover')){
	         $("#groupHolder>div").removeClass('hover');
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
		$("#groupHolder>div").each(function() {
	       // check if clicked point (taken from event) is inside element
	       var mouseX = event.pageX;
	       var mouseY = event.pageY;
	       var offset = $(this).offset();
	       var width = this.offsetWidth;	//$(this).width();
	       var height = this.offsetHeight;	//$(this).height();
	
	       if (mouseX > offset.left && mouseX < offset.left+width 
	           && mouseY > offset.top && mouseY < offset.top+height
	           && FIGURES.selectedFigure == SELECTION.figureID
	           )//&& !CONTROL.alt_pressed && !CONTROL.shift_pressed)
	           {
	         $(this).click(); // force click event
	         return false;
	       }
	    });
	}
}