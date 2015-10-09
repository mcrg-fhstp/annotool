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
			if (jqXHR.responseText!=undefined)
				images =  jqXHR.responseText;
			else
				images = errorThrown;
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
			if (jqXHR.responseText!=undefined)
				images =  jqXHR.responseText;
			else
				images = errorThrown;
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
			if (jqXHR.responseText!=undefined)
				figures =  jqXHR.responseText;
			else
				figures = errorThrown;
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
			if (jqXHR.responseText!=undefined)
				coords =  jqXHR.responseText;
			else
				coords = errorThrown;
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
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
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
			if (jqXHR.responseText!=undefined)
				classes =  jqXHR.responseText;
			else
				classes = errorThrown;
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
		  },
		  beforeSend: function( xhr, settings ) {
		    var checksum = CryptoJS.MD5(settings.data).toString();
		    //console.log(checksum);
		    settings.data=settings.data + "&checksum=" + checksum;
		  }
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error saving new figure: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
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
		  },
		  beforeSend: function( xhr, settings ) {
		    var checksum = CryptoJS.MD5(settings.data).toString();
		    //console.log(checksum);
		    settings.data=settings.data + "&checksum=" + checksum;
		  }
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error updating existing figure: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
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
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;			
	}
	
	
	this.loadClassificationOptions = function(){
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getClassificationOptions',
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading classification options: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
	
	
	this.loadClassificationOptionsWithQuantity = function(){
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getClassificationOptionsWithQuantity',
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading classification options with quantity: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
	
	
	this.loadImagesOfAllFiguresWithOption = function(optionIndex){
		var mask;
		$.ajax({
		  dataType: "json",
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
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
	
	this.loadImagesOfMyFiguresWithOption = function(optionIndex){
		var mask;
		$.ajax({
		  dataType: "json",
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
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
	
	this.saveGroup = function(figureIDs){
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=saveNewGroupForFigures&figureIDs=' + JSON.stringify(figureIDs),
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error saving new group: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
	
	this.updateGroup = function(groupID, figureIDs){
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=updateExistingGroupWithFigures&groupID=' + groupID + '&figureIDs=' + JSON.stringify(figureIDs),
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error updating existing group: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
	
	this.deleteGroup = function(groupID){
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=deleteExistingGroup&groupID=' + groupID,
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error deleting existing group: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}

	this.loadFiguresInGroupsWithQuantity = function(optionIndexes){
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getFiguresInGroupsWithQuantity&optionIndexes=' + JSON.stringify(optionIndexes),
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading figures in groups with quantity: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
	
	this.loadGroupsOfAllFiguresWithOptions = function(optionIndexes){
		var mask;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getGroupsOfAllFiguresWithOptions&optionIndexes=' + JSON.stringify(optionIndexes),
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading all groups with figures with options: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
	
	this.loadGroupsOfMyFiguresWithOptions = function(optionIndexes){
		var mask;
		$.ajax({
		  dataType: "json",
		  url: this.serverpath + 'interface.php?action=getGroupsOfMyFiguresWithOptions&optionIndexes=' + JSON.stringify(optionIndexes),
		  async: false
		  //data: data,
		  //success: success
		})
		.done(function(data) { 
			//console.log(data); 
			returndata = data;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			console.log( "Error loading your groups with figures with options: " + errorThrown );
			if (jqXHR.responseText!=undefined)
				returndata =  jqXHR.responseText;
			else
				returndata = errorThrown;
		});
		return returndata;
	}
}