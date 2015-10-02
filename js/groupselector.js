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


var GROUPSELECTOR = new GROUPSELECTOR_CLASS();

function GROUPSELECTOR_CLASS(){



	// show groupSelector in interface
	this.show = function(){
		$('#groupSelector').show();
	}
	
	
	// hide groupSelector from interface
	this.hide = function(){
		$('#groupSelector').hide();
	}
	
	this.showCreateNewGroup = function(){
		$('#groupSelector #createGroup').removeAttr("disabled"); 
		$('#groupSelector #updateGroup').attr("disabled", "disabled"); 
		$('#groupSelector #deleteGroup').attr("disabled", "disabled");
		this.show();
	}
	
	this.showUpdateExistingGroup = function(){
  		$('#groupSelector #createGroup').attr("disabled", "disabled"); 
  		$('#groupSelector #updateGroup').removeAttr("disabled"); 
  		$('#groupSelector #deleteGroup').removeAttr("disabled");
  		this.show();
  	}
  	
  	this.showDeleteExistingGroup = function(){
  		$('#groupSelector #createGroup').attr("disabled", "disabled"); 
  		$('#groupSelector #updateGroup').attr("disabled", "disabled"); 
  		$('#groupSelector #deleteGroup').removeAttr("disabled");
  		this.show();
  	}
  	
  	this.createNewGroup = function(){
	  	$('#wait').show();					
		setTimeout(function(){
	  		var groupID = LOADER.saveGroup(FIGURES.groupedFigures);
	  		// show success/error message
	  		if(!parseInt(groupID)){
				CLASSIFICATOR.showError(groupID);
			}
			else{
				CLASSIFICATOR.showResponse("Group " + groupID + " saved successfully!");
				// add to GROUPS.groups
				for (var i=0; i<FIGURES.groupedFigures.length; i++){
					for (var j=0; j<FIGURES.figures.length; j++){
						if (FIGURES.groupedFigures[i] == FIGURES.figures[j].figureID)
							GROUPS.addFigure(groupID, FIGURES.figures[j]);
					}
				}
				$('.figureBox').removeClass('grouped'); 
				GROUPS.selectedGroup = null; 
				FIGURES.groupedFigures = []; 
				$('.groupBox').removeClass('selected'); 
				$('#groupSelector').hide();
				IMAGE.resize();
			}
			$('#wait').hide();
		},50);
  	}
  	
  	this.updateExistingGroup = function(){
	  	$('#wait').show();					
		setTimeout(function(){
	  		var groupID = LOADER.updateGroup(GROUPS.selectedGroup, FIGURES.groupedFigures);
	  		// show success/error message
	  		if(!parseInt(groupID)){
				CLASSIFICATOR.showError(groupID);
			}
			else{
				CLASSIFICATOR.showResponse("Group " + groupID + " updated successfully!");
				// update in GROUPS.groups
				// delete all figures from group
				GROUPS.clearGroup(groupID);
				for (var i=0; i<FIGURES.groupedFigures.length; i++){
					for (var j=0; j<FIGURES.figures.length; j++){
						if (FIGURES.groupedFigures[i] == FIGURES.figures[j].figureID){
							// delete figure from old group
							for (var k=0; k<GROUPS.groups.length; k++){
								if ($.inArray(FIGURES.groupedFigures[i], GROUPS.groups[k].figureIDs)> -1 ){
									GROUPS.removeFigure(GROUPS.groups[k].groupID, FIGURES.groupedFigures[i]);
								}
							}
							// add all selected figures to group
							GROUPS.addFigure(groupID, FIGURES.figures[j]);
						}
					}
				}
				$('.figureBox').removeClass('grouped'); 
				GROUPS.selectedGroup = null; 
				FIGURES.groupedFigures = []; 
				$('.groupBox').removeClass('selected'); 
				$('#groupSelector').hide();
				IMAGE.resize();
			}
			$('#wait').hide();
		},50);
  	}
  	
  	this.deleteExistingGroup = function(){
	  	$('#wait').show();					
		setTimeout(function(){
	  		var groupID = LOADER.deleteGroup(GROUPS.selectedGroup);
	  		// show success/error message
	  		if(!parseInt(groupID)){
				CLASSIFICATOR.showError(groupID);
			}
			else{
				CLASSIFICATOR.showResponse("Group " + groupID + " deleted successfully!");
				// remove from GROUPS.groups
				for (var i=0; i<GROUPS.groups.length; i++){
					if (GROUPS.groups[i].groupID == groupID)
						GROUPS.groups.splice(i,1);
				}
				$('.figureBox').removeClass('grouped'); 
				GROUPS.selectedGroup = null; 
				FIGURES.groupedFigures = []; 
				$('.groupBox.selected').remove();
				$('#groupSelector').hide();
				IMAGE.resize;
			}
			$('#wait').hide();
		},50);
  	}
}