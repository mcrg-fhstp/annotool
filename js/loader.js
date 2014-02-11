var LOADER = new LOADER_CLASS();

function LOADER_CLASS(){
	this.serverpath = "./";
	
	
	this.loadImages = function(){
		var images;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getImages',
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			images = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading images: " + errorThrown );
		});
		return images;
	}
	
	
	this.loadImageDetails = function(imageName){
		var images;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getImageDetails&imageName=' + imageName,
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			images = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading imageDetails: " + errorThrown );
		});
		return images;
	}
	
	
	this.loadFiguresForImage = function(imageName){
		var figures;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getFiguresForImage&imageName=' + imageName,
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			figures = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading figures for image: " + errorThrown );
		});
		return figures;
	}
	
	
	this.loadCoordinatesOfFigure = function(imageName, boundingBox){
		var coords;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getCoordinatesForFigure&imageName=' + imageName 
		  									+ '&boundingBox=' + boundingBox,
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			coords = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading figure coordinates: " + errorThrown );
		});
		return coords;
	}
	
	
	this.loadMaskOfFigure = function(figureID){
		var mask;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getMaskForFigure&figureID=' + figureID,
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading figure mask: " + errorThrown );
			returndata =  jqXHR.responseText;
		});
		return returndata;
	}
	
	
	this.loadClassificationDataOfFigure = function(figureID){
		var classes;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'classes.php',
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			classes = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading classification data of figure: " + errorThrown );
		});
		return classes;
	}

	
	this.saveNewFigure = function(imageName, boundingBox, classes, superimposition, figure_incomplete, figure_damaged, tracing_incomplete, maskBase64){
		var returndata;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=saveNewFigure&imageName=' + imageName,// + '&boundingBox=' + boundingBox,// + '&classes=' + classes,
		  async: false,
		  type: 'POST',
		  data: {
		  	//action: 'saveNewFigure',
		  	//imageName: imageName,
		  	boundingBox: JSON.stringify(boundingBox),
		  	classes: classes,
		  	superimposition: superimposition,
		  	figure_incomplete: figure_incomplete,
		  	figure_damaged: figure_damaged,
		  	tracing_incomplete: tracing_incomplete,
		  	maskBase64: maskBase64
		  }
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error saving new figure: " + errorThrown );
			returndata =  jqXHR.responseText;
		});
		return returndata;		
	}
	
	
	this.updateExistingFigure = function(figureID, boundingBox, classes, superimposition, figure_incomplete, figure_damaged, tracing_incomplete, maskBase64){
		var returndata;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=updateExistingFigure&figureID=' + figureID,
		  async: false,
		  type: 'POST',
		  data: {
		  	//action: 'saveNewFigure',
		  	//imageName: imageName,
		  	boundingBox: JSON.stringify(boundingBox),
		  	classes: classes,
		  	superimposition: superimposition,
		  	figure_incomplete: figure_incomplete,
		  	figure_damaged: figure_damaged,
		  	tracing_incomplete: tracing_incomplete,
		  	maskBase64: maskBase64
		  }
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error updating existing figure: " + errorThrown );
			returndata =  jqXHR.responseText;
		});
		return returndata;		
	}
		
	
	this.deleteClassificationDataOfFigure = function(figureID){
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=deleteFigure&figureID=' + figureID,
		  async: false,
		  type: 'POST',
		  data: {
		  	//action: 'saveNewFigure',
		  	//imageName: imageName,
		  }
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error deleting existing figure: " + errorThrown );
			returndata =  jqXHR.responseText;
		});
		return returndata;			
	}
	
	
	this.loadClassificationOptions = function(){
		var options;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getClassificationOptions',
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			options = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading classification options: " + errorThrown );
			returndata =  jqXHR.responseText;
		});
		return options;
	}
	
	
	this.loadClassificationOptionsWithQuantity = function(){
		var options;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getClassificationOptionsWithQuantity',
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			options = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading classification options with quantity: " + errorThrown );
			returndata =  jqXHR.responseText;
		});
		return options;
	}
	
	
	this.loadImagesOfAllFiguresWithOption = function(optionIndex){
		var mask;
		$.ajax({
		  dataType: "json",
		  //url: this.serverpath + 'coords.php',
		  url: this.serverpath + 'interface.php?action=getImagesForAllFiguresWithOption&optionIndex=' + optionIndex,
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading all images for figures with option: " + errorThrown );
			returndata =  jqXHR.responseText;
		});
		return returndata;
	}
	
	this.loadImagesOfMyFiguresWithOption = function(optionIndex){
		var mask;
		$.ajax({
		  dataType: "json",
		  //url: this.serverpath + 'coords.php',
		  url: this.serverpath + 'interface.php?action=getImagesForMyFiguresWithOption&optionIndex=' + optionIndex,
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading your images for figures with option: " + errorThrown );
			returndata =  jqXHR.responseText;
		});
		return returndata;
	}

}