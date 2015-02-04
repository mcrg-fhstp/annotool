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