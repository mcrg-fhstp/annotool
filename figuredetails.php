<?php
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


	session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt Ÿber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
?>  

<?php include('html_head_inc.php'); ?>

<script language="javascript" type="text/javascript" src="js/classificator.js"></script>
<script language="javascript" type="text/javascript" src="js/loader.js"></script>


<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
<script language="javascript" type="text/javascript" src="js/jquery.json-2.2.min.js"></script>
<script language="javascript" type="text/javascript" src="js/helpers.js"></script>

<style>

	#content{
		bottom: auto;
		overflow: visible;
	}
	#content #left{
		position:absolute; top: 0px; left:0;  right: 500px;
		padding: 20px; box-sizing: border-box;
	}
	#content #right{
		position:absolute; top: 0px; right:0;  width: 500px;
		padding: 20px; box-sizing: border-box;
		overflow: auto;
		font-size: 0.8em;
	}
</style>

</head>


<body>


<?php include('header_inc.php'); ?>

<div id="content">

<div id="left">
	<p>Details for figure <?php echo $_GET['figureID'] ?>:</p><br/><br/>
</div>

<div id="right">
	<div id="classificator">
		<div id="optionHolder"></div>
		
		<div id="superimposition">
		<span>Figure contains superimposition:</span>
		<select onchange="CLASSIFICATOR.showSaveButton(); CLASSIFICATOR.changed = true;">
		<option value disabled hidden selected="selected"></option>
		<option value="1">yes</option>
		<option value="0">no</option>
		</select>
		</div>
		
		<div id="figure_incomplete">
		<span>Figure is incomplete due to author:</span>
		<select onchange="CLASSIFICATOR.showSaveButton(); CLASSIFICATOR.changed = true;">
		<option value disabled hidden selected="selected"></option>
		<option value="1">yes</option>
		<option value="0">no</option>
		</select>
		</div>
		
		<div id="figure_damaged">
		<span>Figure is damaged:</span>
		<select onchange="CLASSIFICATOR.showSaveButton(); CLASSIFICATOR.changed = true;">
		<option value disabled hidden selected="selected"></option>
		<option value="1">yes</option>
		<option value="0">no</option>
		</select>
		</div>
		
		<div id="tracing_incomplete">
		<span>Figure is incomplete due to missing parts of tracing:</span>
		<select onchange="CLASSIFICATOR.showSaveButton(); CLASSIFICATOR.changed = true;">
		<option value disabled hidden selected="selected"></option>
		<option value="1">yes</option>
		<option value="0">no</option>
		</select>
		</div>
		
		<?php if($_SESSION['username'] != "ReadOnly"): ?>
		<input id="save" type="button" value="Save to DB" onclick="saveClassificationData()" disabled />
		<input id="delete" type="button" value="Delete from DB" onclick="removeClassificationData()" disabled />
		<?php endif; ?>
		<!--input id="cancel" type="button" value="Cancel" onclick="SELECTION.clear(); $('.figureBox').removeClass('selected'); FIGURES.selectedFigure = null; IMAGE.redrawSelectionFull(); TOOLS.reset(); return false;" /-->
		<div id="classificationHint">Complete all classificationsets and make sure all total confidences are 1!</div>
	</div>
	
	<div id="responseBox"><a href="">Reload</a></div>
</div>	
		
</div>

<script language="javascript" type="text/javascript">
	
	
	var data = LOADER.loadMaskOfFigure(<?php echo $_GET['figureID'] ?>);

	if (data.boundingBox && data.maskBase64 && data.classes && data.superimposition && data.figure_incomplete && data.figure_damaged && data.tracing_incomplete){
		
		var img = document.createElement('img');
		$(img).attr('src', data.maskBase64);
	
		CLASSIFICATOR.loadOptions();
		CLASSIFICATOR.fill(data.classes, data.superimposition, data.figure_incomplete, data.figure_damaged, data.tracing_incomplete);
		CLASSIFICATOR.show();
		CLASSIFICATOR.showDeleteButton();
		
		$('#content #left').append('<p>Site: ' + data.site + '</p>');
		$('#content #left').append('<p>Rock: ' + data.rock + '</p>');
		$('#content #left').append('<p>Section: ' + data.section + '</p>');
		$('#content #left').append('<br/>');
	
		
		var link = document.createElement('a');
		$(link).attr('href','figures.php?imageName=' + data.imageName + '&figureID=' + data.figureID );
		$(link).append(img);
		$('#content #left').append(link);
		
		$('#content #left').append('<br/><br/>');
			$('#content #left').append('<p>classified by: ' + data.classified_by + '</p>');
		$('#content #left').append('<p>on: ' + data.classified_on + '</p>');
	
		var link = document.createElement('a');
		$(link).attr('href','figures.php?imageName=' + data.imageName + '&figureID=' + data.figureID );	
		$(link).append('<br/><br/>Show figure in tracing');
		//$('#content #left').append(img);
		$('#content #left').append(link);	
	}
	else{
		CLASSIFICATOR.hide();
		CLASSIFICATOR.showError(data);
	}



	// update classification data for figure in db
	function saveClassificationData(){
		$('#wait').show();					
		setTimeout(function(){				
			var maskBase64 = null;
			var figure = new Object();
			figure.boundingBox = "";

				var classificationData = CLASSIFICATOR.getSelectedClasses();
				var response = LOADER.updateExistingFigure(<?php echo $_GET['figureID'] ?>, 
											data.boundingBox, 
											classificationData.classes, 
											classificationData.superimposition, 
											classificationData.figure_incomplete,
											classificationData.figure_damaged,
											classificationData.tracing_incomplete,
											maskBase64);
				CLASSIFICATOR.hide();
				if(!parseInt(response)){
					CLASSIFICATOR.showError(figure.figureID);
				}
				else{
					CLASSIFICATOR.showResponse("Figure " + response + " updated successfully!");
				}
				$('#responseBox').append("<br/><br/><a href=''>Reload</a>");
			
			$('#wait').hide();
		},50);
	}
	
	
	// remove classification data for existing figure from db
	function removeClassificationData(){
		var resp = LOADER.deleteClassificationDataOfFigure(<?php echo $_GET['figureID'] ?>);
		if (parseInt(resp)){
			CLASSIFICATOR.reset();
			CLASSIFICATOR.hide();
			CLASSIFICATOR.showResponse("Figure " + resp + " deleted successfully!")
		}
		else{
			CLASSIFICATOR.hide();
			CLASSIFICATOR.showError(resp);
		}
		$('#responseBox').append("<br/><br/><a href=''>Reload</a>");

	}
	
</script>

<div id="wait">
	<img id="spinner" src="img/ajaxSpinner.gif"/>
</div>


</body>
</html>