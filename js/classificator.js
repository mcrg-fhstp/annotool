var CLASSIFICATOR = new CLASSIFICATOR_CLASS();

function CLASSIFICATOR_CLASS(){

	this.classificationOptions = null;
	this.changed = null;


	// show classificator in interface
	this.show = function(){
		$('#classificator').show();
	}
	
	
	// hide classificator from interface
	this.hide = function(){
		$('#classificator').hide();
		this.hideSaveButton();
	}
	
	
	// load classificator content from db
	this.loadOptions = function(){
		var options = LOADER.loadClassificationOptions();
		this.classificationOptions = options;

		this.reset();
	}
	
	
	// resets the classificator
	this.reset = function(){
		var options = this.classificationOptions;
		this.changed = null;
		$('#optionHolder').empty();
		$('#classificator #superimposition select').val("");
		$('#classificator #figure_incomplete select').val("");
		$('#classificator #figure_damaged select').val("");
		$('#classificator #tracing_incomplete select').val("");
		this.hideSaveButton();
		this.hideResponse();
		
		var typology = null;
		// look for root nodes
		for(var i=0; i<options.length; i++){
			if (options[i].parentIndex == 0){
				// add new typology
				typology = new TYPOLOGY_CLASS(options[i].typology, options, i);
				$('#optionHolder').append(typology);
				
			}
		}
		
		if (typology == null)
			console.log('could not find a root option');
	}	
	
	
	this.fill = function(options, superimposition, figure_incomplete, figure_damaged, tracing_incomplete){
		$('#optionHolder').empty();
		this.changed = null;
		this.hideSaveButton();
		$('#classificator #classificationHint').hide();
		this.hideResponse();

		// create typologies & classificationsets
		var typology = null;
		while (options.length > 0){
			// look for root nodes
			for(var i=0; i<options.length; i++){
				if (options[i].parentIndex == 0){
				
					// test if typology already exists
					var typology = $("[id='"+options[i].typology+"'].typology", '#optionHolder');
					
					// find same option in full list
					for(var j=0; j<this.classificationOptions.length; j++){
						if(options[i].index == this.classificationOptions[j].index &&
							options[i].parentIndex == this.classificationOptions[j].parentIndex && 
							options[i].typology == this.classificationOptions[j].typology)
							break;
					}
					
					var confidence = options[i].confidence;
					options.remove(i);
					if (i>0)
						i--;
					
					if (typology.length == 0){
						// add new typology, if not
						typology = new TYPOLOGY_CLASS(this.classificationOptions[j].typology, this.classificationOptions, j, options, confidence);
						$('#optionHolder').append(typology);
					}
					else{
						var classificationSet = new CLASSIFICATIONSET_CLASS( this.classificationOptions, j, options, confidence);						
						typology.append(classificationSet);
						if ($('.classificationSet', typology).length == 1)
							$('.removeButton', typology).addClass('hidden');
					}
					
					// call change on last select to add confidence-slider
					var select = $('.classificationSet select', typology).last();
					// trigger change, pass param to determine from user-change
					select.trigger('change', 'auto');
					break;
				}
			}
		}
		
		
		// add new typologies
		for(var j=0; j<this.classificationOptions.length; j++){
			if(this.classificationOptions[j].parentIndex == 0 &&							// root node
				$('#classificator .typology[id="' + CLASSIFICATOR.classificationOptions[j].typology + '"]').length == 0){		// typology not exists in #classificator
					// add new typology
					typology = new TYPOLOGY_CLASS(CLASSIFICATOR.classificationOptions[j].typology, this.classificationOptions, j);
					$('#optionHolder').append(typology);
					$('#classificator #classificationHint').show();
			}
		}

		
		// set dropdown for superimposition
		$('#classificator #superimposition select').val(superimposition);
		// set dropdown for incomplete
		$('#classificator #figure_incomplete select').val(figure_incomplete);
		$('#classificator #figure_damaged select').val(figure_damaged);
		$('#classificator #tracing_incomplete select').val(tracing_incomplete);
		
		if (typology == null)
			console.log('could not find a root option');
	}
	

	this.showButtons = function(){
		$('#classificator #save').removeAttr("disabled");
		$('#classificator #delete').removeAttr("disabled");
	}

	
	this.hideButtons = function(){
		$('#classificator #save').attr("disabled", "disabled");
		$('#classificator #delete').attr("disabled", "disabled");
	}

	
	this.showSaveButton = function(){
		// loop through all selectors and check if all are selected
		var selected = true;
		$('#classificator select').each(function(){
			if(this.selectedIndex == 0)
				selected = false;
		});
		
		var sum = 0;
		$('#classificator .sumConfidence span').each(function(){
			sum += (this.innerHTML)*1;
		});
		var anz = $('#classificator .sumConfidence').length;
		
		// all are selected and total confidences are all 1
		if ((selected == true) &&
			(sum == anz)){
			$('#classificator #save').removeAttr("disabled");
			$('#classificator #classificationHint').hide();
		}
		else{
			this.hideSaveButton();
		}
	}
	
	
	this.hideSaveButton = function(){
		$('#classificator #save').attr("disabled", "disabled");
		$('#classificator #classificationHint').show();
	}

	
	this.showDeleteButton = function(){
		$('#classificator #delete').removeAttr("disabled");
	}

	
	this.hideDeleteButton = function(){
		$('#classificator #delete').attr("disabled", "disabled");
	}
	

	this.getSelectedClasses = function(){
		if (this.changed){
			var classes = new Array;
	
			// typologies
			$('#classificator .typology').each( function(){
				var typology = this.id;
			
				// classificationsets
				$('.classificationSet', this).each( function(index){
				
					var classificationset = index;
					// confidenceSlider
					var confidence;
					$('.confidenceSlider',this).each( function(){
						confidence = this.value;
					});
							
					// optionSelects
					$('select', this).each( function(index){
						// root node
						if (index == 0){
							var oneclass = new Object();
							//oneclass.name = $(this).attr('name');
							//oneclass.parentName = "";
							oneclass.index = $(this).attr('index');
							oneclass.mutuallyExclusive = 1;
							oneclass.typology = typology;
							oneclass.confidence = confidence;
							oneclass.classificationset = classificationset;
							classes.push(oneclass);
						}
					
						var oneclass = new Object();
						//oneclass.name = this.value;
						//oneclass.parentName = $(this).attr('parentname');
						oneclass.index = this.value;
						oneclass.typology = typology;
						oneclass.confidence = confidence;
						oneclass.classificationset = classificationset;
						// TODO: zwischennodes für nicht mutually exclusive fehlen!!!!
			
						oneclass.mutuallyExclusive = $('option:selected',this).attr('mutuallyExclusive');	// nicht von select, sondern option
						classes.push(oneclass);
					});
					
				});
			});
		
			var superimposition = $('#classificator #superimposition select').val();
			var figure_incomplete = $('#classificator #figure_incomplete select').val();
			var figure_damaged = $('#classificator #figure_damaged select').val();
			var tracing_incomplete = $('#classificator #tracing_incomplete select').val();
			
			
			return {
				classes: classes, 
				superimposition: superimposition,
				figure_incomplete: figure_incomplete,
				figure_damaged: figure_damaged,
				tracing_incomplete: tracing_incomplete
			};
		}
		else
			//console.log('classificator not changed');
			return {
				classes: null, 
				superimposition: null,
				figure_incomplete: null,
				figure_damaged: null,
				tracing_incomplete: null
			};
	}
	
	this.showError = function(errorString){
		$('#responseBox').text(errorString);
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}
	this.showResponse = function(responseString){
		$('#responseBox').text(responseString);
		$('#responseBox').removeClass('error');
		$('#responseBox').show();
	}
	this.hideResponse = function(){
		$('#responseBox').hide();		
	}
}





function TYPOLOGY_CLASS(typologyname, allClassificationOptions, indexOfRootElement, classifiedOptions, classifiedConfidence){
	this.div = document.createElement('div');
	$(this.div).attr('id',typologyname);
	$(this.div).attr('class','typology');
	$(this.div).attr('indexOfRootElement', indexOfRootElement);
	
	// create header
	$(this.div).append('<p>' + typologyname + '</p>');
	
	this.classificationSets = [];
	// add first classificationSet
	var classificationSet = new CLASSIFICATIONSET_CLASS( allClassificationOptions, indexOfRootElement, classifiedOptions, classifiedConfidence);
	// hide removeButton of first classificationSet
	$('.removeButton', classificationSet).addClass('hidden');
	this.classificationSets.push(classificationSet);
	$(this.div).append(classificationSet);
		
	return this.div;
}



function CLASSIFICATIONSET_CLASS( allClassificationOptions, indexOfRootElement, classifiedOptions, classifiedConfidence){
	this.div = document.createElement('div');
	//number++;
	//$(this.div).attr('id','classificationSet'+number);
	$(this.div).attr('class','classificationSet');
	
	// remvove-Button
	this.removeButton = document.createElement('a');
	$(this.removeButton).attr('class','removeButton');
	$(this.removeButton).attr('href','#');
	$(this.removeButton).attr('title','Remove classificationset');
	//$(this.removeButton).addClass('hidden');
	
	$(this.removeButton).on('mouseup', function( event ) {
		// console.log('stop');
		CLASSIFICATOR.changed = true;
		//console.log('classificator changed');
		
		// find superior typology
		var typo = $(this).parents('.typology');		
		// find superior set
		var set = $(this).parents('.classificationSet');
		$(set).remove();
			
		// recalculate sumConfidence
		// calculate sum(confidences) in typology
		var sliders = $('.confidenceSlider', typo);
		var sum = 0;
		sliders.each(function(){
			sum += (this.value)*1;
		});
		sum = Math.round (sum*100)/100;
		//set value sum confidence
		var sumConfidence = $('.sumConfidence', typo);
		sumConfidence.html("<p>Total confidence: <span>" + sum + "</span></p>");
		if (sum < 1)
			sumConfidence.addClass('incomplete');
		else
			sumConfidence.removeClass('incomplete');

		//hide/show addButton
		if (sum < 1)
			// show only last addButton
			$('.addButton', typo).last().removeClass('hidden');
		else
			// hide all addButtons
			$('.addButton', typo).addClass('hidden');
					
		// hide savebutton
		CLASSIFICATOR.showSaveButton();
	});
	$(this.div).append(this.removeButton);

	// create header
	$(this.div).append('<p>Classificationset:</p>');
	
	
	var classificationOption = new CLASSIFICATIONOPTION_CLASS(allClassificationOptions, indexOfRootElement, classifiedOptions, classifiedConfidence);
	$(this.div).append(classificationOption);
	
	return this.div;
}




function CLASSIFICATIONOPTION_CLASS(options, indexOfElement, classifiedOptions, classifiedConfidence){
	this.div = document.createElement('div');
	
	var element = options[indexOfElement];
	
	if (element != undefined)
	if (element.mutuallyExclusive == 0){
		// find children
		// add all children at once
		for(var i=0; i<options.length; i++){
			if (options[i].parentIndex == element.index &&
				options[i].typology == element.typology){
				
				//var div = document.createElement('div');
				// create invisible selector with two option
				var select = document.createElement('select');
				$(select).attr('index',element.index);
				$(select).attr('mutuallyExclusive',element.mutuallyExclusive);
				
				// first empty option
				var option = document.createElement('option');
				option.value = "";
				option.selected = true;
				option.disabled = true;
				option.hidden = true;
				$(select).append(option);
				
				// create only one selectable option
				var option = document.createElement('option');
				option.value = options[i].index;
				$(option).append(options[i].name);
				$(select).val(1);//options[i].index);
				$(select).append(option);
				$(this.div).append(select);
				$(select).hide();
				
				// set selected option when loading classified figure
				if (classifiedOptions != undefined){
					//find value to select
					for(var j=0; j<classifiedOptions.length; j++){
						if ($(select).attr('index') == classifiedOptions[j].parentIndex){
							var elem = classifiedOptions[j];
							classifiedOptions.remove(j);
							if(j>0)
								j--;
							// trigger change, pass param to determine from user-change
							//$(select).val(elem.index).trigger('change', 'auto');
							break;
						}
					}
				}
				
				var classificationOption = new CLASSIFICATIONOPTION_CLASS(options, i, classifiedOptions, classifiedConfidence);
		  		$(this.div).append(classificationOption);
			}
		}
		return this.div;
	}
	else{
		// create selector with options
		var select = document.createElement('select');
		$(select).attr('index',element.index);
		$(select).attr('mutuallyExclusive',element.mutuallyExclusive);
		
		// first empty option
		var option = document.createElement('option');
		option.value = "";
		option.selected = true;
		option.disabled = true;
		option.hidden = true;
		$(select).append(option);
		
		// other options
		for(var i=0; i<options.length; i++){
			if (options[i].parentIndex == element.index &&
				options[i].typology == element.typology){
				// create option entry for selector
				var option = document.createElement('option');
				option.value = options[i].index;
				$(option).append(options[i].name);
				$(option).attr('mutuallyExclusive',options[i].mutuallyExclusive);
				$(option).attr('arrayindex',i);
		
				$(select).append(option);
			}
		}
	
		// attach eventhandler to selector
		$(select).change(function(event, param) {
		  	//alert(this.value);
		  	$(this).nextAll().remove();		// remove all children
		  	CLASSIFICATOR.hideButtons();
		  	
		  	// find superior classificationset
		  	var set = $(this).parents('.classificationSet');
		  	$('.confidenceSliderSet',set).remove();
		  	
		  	//if (!$(this).hasClass(this.value)){	// only if name != parentName
		  		// add subselectors
		  		var classificationOption = new CLASSIFICATIONOPTION_CLASS(options, $("option:selected",this).attr('arrayindex'), classifiedOptions, classifiedConfidence);
		  		$(this.parentNode).append(classificationOption);
		  	//}
		  				
			// loop through selectors in same classificationset and check if all are selected
			var selected = true;
			$('select', set).each(function(){
				if(this.selectedIndex == 0)
					selected = false;
			});
			// all are selected
			if (selected == true){
				var sliderSet = new CONFIDENCESLIDERSET_CLASS(options, classifiedConfidence);
				$(set).append(sliderSet);
				// trigger change, pass param to determine from user-change
				$(sliderSet).trigger("change", "auto");	// trigger event to set value of new slider to restconfidence
				
				// find superior typology
				var typo = $(this).parents('.typology');
				var sumConfidence = $('.sumConfidence', typo);
				if (sumConfidence.length == 0){
					// add new sumConfidence
					var div = document.createElement('div');
					//$(div).attr('id', 'confidence');
					$(div).attr('class', 'sumConfidence');
					$(div).append('<p>Total confidence: <span>1</span></p>');
					typo.append( div );
				}
				else{
					// move sumConfidence
					typo.append( sumConfidence );
				}
			}
			
			// only if changed by user
			if (param == undefined){
			  	CLASSIFICATOR.changed = true;
			  	//console.log('classificator changed');
				//hide/show save-Button
				CLASSIFICATOR.showSaveButton();
				//console.log('show savebutton');
			}

		});
	
		// only append if selector has children
		if ($(select).children().size() > 1)
		{	
			// create header
			$(this.div).append('<p>Select ' + element.name + ':</p>');
			// append selector
			$(this.div).append(select);				
			
			if (element.mutuallyExclusive == 0)
				$(this.div).appendClass('hidden');
				
			// set selected option when loading classified figure
			if (classifiedOptions != undefined){
				//find value to select
				for(var i=0; i<classifiedOptions.length; i++){
					if ($(select).attr('index') == classifiedOptions[i].parentIndex){
						var elem = classifiedOptions[i];
						classifiedOptions.remove(i);
						if(i>0)
							i--;
						// trigger change, pass param to determine from user-change
						$(select).val(elem.index).trigger('change', 'auto');
						break;
					}
				}
			}
			
			return this.div;
		}
	}
	// empty selector, no options added 
	return null;
}



function CONFIDENCESLIDERSET_CLASS(options, classifiedConfidence){

	this.div = document.createElement('div');
	$(this.div).attr('id', 'confidence');
	$(this.div).attr('class', 'confidenceSliderSet');
	$(this.div).append('<p>Set confidence for above classification:</p>');
	
	this.slider = document.createElement('input');
	$(this.slider).attr('class','confidenceSlider');
	$(this.slider).attr('type','range');
	$(this.slider).attr('min','0');
	$(this.slider).attr('max','1');
	$(this.slider).attr('step','0.01');
	if (classifiedConfidence == undefined)
		$(this.slider).attr('value','1');
	else
		$(this.slider).attr('value',classifiedConfidence);
	
	var changeFunction = function(event, param){
		
		// find superior typology
		var typo = $(this).parents('.typology');

		// calculate sum(confidences) in typology
		var sliders = $('.confidenceSlider', typo);
		var sum = 0;
		sliders.each(function(){
			sum += (this.value)*1;
		});
		
		// function may be called on div or on slider -> switch element
		var elem = $(this);
		if ($(this).hasClass('confidenceSliderSet'))
			elem = $('.confidenceSlider',this);
				
		// reduce value of current slider if sum>=1 
		if (sum > 1){
			sum -= elem.val();
			elem.val(1 - sum);
			sum += (elem.val())*1;
		}
		
		//set value in textfield
		elem.next().attr('value',elem.val());
		
		sum = Math.round (sum*100)/100;
		
		//hide/show addButton
		if (sum < 1)
			// show only last addButton
			$('.addButton', typo).last().removeClass('hidden');
		else
			// hide all addButtons
			$('.addButton', typo).addClass('hidden');
		
		//set value sum confidence
		var sumConfidence = $('.sumConfidence', typo);
		sumConfidence.html("<p>Total confidence: <span>" + sum + "</span></p>");
		if (sum < 1)
			sumConfidence.addClass('incomplete');
		else
			sumConfidence.removeClass('incomplete');

		// only if slider touched by user
		if (param == undefined){
		  	CLASSIFICATOR.changed = true;
		  	//console.log('classificator changed');		
			//hide/show save-Button
			CLASSIFICATOR.showSaveButton();
			//console.log('show savebutton');
		}
	}
	$(this.slider).change(changeFunction);
	$(this.div).change(changeFunction);
	
	
	this.addButton = document.createElement('a');
	$(this.addButton).attr('class','addButton');
	$(this.addButton).attr('href','#');
	$(this.addButton).attr('title','Add another classificationset');
	$(this.addButton).addClass('hidden');
	
	$(this.addButton).on('mouseup', function( event ) {
		// console.log('stop');
		$(this).addClass('hidden');
		CLASSIFICATOR.changed = true;
		//console.log('classificator changed');
		
		// find superior typology
		var typo = $(this).parents('.typology');

		// calculate sum(confidences) in this typology
		var sliders = $('.confidenceSlider', typo);
		var sum = 0;
		sliders.each(function(){
			sum += (this.value)*1;
		});
		
		// loop through selectors in same classificationset and check if all are selected
		var selected = true;
		$('select', typo).each(function(){
			if(this.selectedIndex == 0)
				selected = false;
		});
		
		// append new classificationSet if sum<1 and all selectors are selected
		// TODO: only if changed slider is last one ???
		if (sum < 1 && selected == true){
			//var classificationSet = new CLASSIFICATIONSET_CLASS( options, $(typo).attr('indexOfRootElement'));
			var clonedClassificationSet = $(this).parents('.classificationSet').clone(true);
			$('.sumConfidence', typo).before(clonedClassificationSet);
			
			// call change on last select to recaltulate confidence-value
			var select = $('select', clonedClassificationSet).last();
			// trigger change, pass param to determine from user-change
			select.trigger('change', 'auto');
			
			$('.removeButton', clonedClassificationSet).removeClass('hidden');
			CLASSIFICATOR.showSaveButton();
		}
			
	});
	
		
	$(this.div).append(this.slider);
	// textfield
	$(this.div).append('<input type="text" value="1.00" style="width:3em" disabled="disabled"/>');
	
	
	// +-button
	$(this.div).append(this.addButton);

	
	return this.div;
}