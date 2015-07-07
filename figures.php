<?php
	session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt über URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
?>  

<!doctype html>
<html lang="en-US">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>3D-Pitoti AnnoTool</title>
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="icon" href="favicon.ico">
  
  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->


<script language="javascript" type="text/javascript" src="js/imageloader.js"></script>
<script language="javascript" type="text/javascript" src="js/canvaszoom.js"></script>

<script language="javascript" type="text/javascript" src="js/tools.js"></script>
<script language="javascript" type="text/javascript" src="js/selection.js"></script>
<script language="javascript" type="text/javascript" src="js/controls.js"></script>
<script language="javascript" type="text/javascript" src="js/figures.js"></script>
<script language="javascript" type="text/javascript" src="js/groups.js"></script>
<script language="javascript" type="text/javascript" src="js/classificator.js"></script>
<script language="javascript" type="text/javascript" src="js/groupselector.js"></script>
<script language="javascript" type="text/javascript" src="js/loader.js"></script>
<script language="javascript" type="text/javascript" src="js/md5.js"></script>


<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
<script language="javascript" type="text/javascript" src="js/jquery.json-2.2.min.js"></script>
<script language="javascript" type="text/javascript" src="js/helpers.js"></script>
<script language="javascript" type="text/javascript" src="js/bitmap.js"></script>

<link rel="stylesheet" type="text/css" href="css/styles.css" />

</head>


<body onload="setupImage();" <?php if($_SESSION['username'] == "admin") echo('class="admin"'); ?>>

<?php include('header_inc.php'); ?>
<?php include('footer_inc.php'); ?>


<div id="imagePage">
	<div id="left">
		<div id="imageDescription">
			<p id="site"><b>Site:</b> <span>Campanine</span></p>
			<p id="rock"><b>Rock:</b> <span>1</span></p>
			<p id="section"><b>Section:</b> <span>B</span></p>
			<p id="author"><b>Author:</b> <span>B</span></p>
		</div>
		
		<div id="zoom_controls">
			<p><b>Zoom</b></p>
			<a title="Zoom out" style="background-position: -45px -45px;" class="" onclick="IMAGE.zoomOutCentre(); IMAGE.redrawSelectionOutline();" onmouseup="clearTimeout(IMAGE.zoomTimer); IMAGE.zoomTimer = setTimeout(IMAGE.zoomTimeOutFunction, IMAGE.zoomTimeOut);" href="#" ></a>
			<a title="Zoom in" style="background-position: 5px -45px;" class="" onclick="IMAGE.zoomInCentre(); IMAGE.redrawSelectionOutline();" onmouseup="clearTimeout(IMAGE.zoomTimer); IMAGE.zoomTimer = setTimeout(IMAGE.zoomTimeOutFunction, IMAGE.zoomTimeOut);" href="#" ></a>
			<p class="hint"><span id="zoom_nr">100</span>%<p>
			<br />
			<input id="zoom_range" type="range" value="1" min="1" max="10" step="1" oninput="IMAGE.zoomCentre(this.value); IMAGE.redrawSelectionOutline();" onmouseup="clearTimeout(IMAGE.zoomTimer); IMAGE.zoomTimer = setTimeout(IMAGE.zoomTimeOutFunction, IMAGE.zoomTimeOut);"/> 
		</div>

		
		
		<p id="selection_tools"><b>Selection tools</b></p>
		<div id="tools"></div>
		<div id="lab_select"><input id="lab_checkbox" type="checkbox">use different sensitivity (better for filiform-select)</input></div>
		
		<div id="alt_key_pressed" class="key_pressed">ALT-Key pressed</div>
		<div id="shift_key_pressed" class="key_pressed">SHIFT-Key pressed</div>
		
		<div id="clear_selection" style="clear:both; margin:0;"></div>
		
		<div id="selection_options">
			<p><b>Undo/Redo/Clear selection</b></p>
			<a id="undo_tool" title="Undo selection" style="background-position: -446px -43px;" class="" onclick="SELECTION.undo(); return false;" href="#"></a>
			<a id="redo_tool" title="Redo selection" style="background-position: -498px -43px;" class="inactive" onclick="SELECTION.redo(); return false;" href="#"></a>

			<a title="Clear selection" style="background-position: -95px -45px;" class="" onclick="SELECTION.push(); SELECTION.clear(); $('.figureBox').removeClass('selected'); FIGURES.selectedFigure = null; IMAGE.redrawSelectionFull(); $('.figureBox').removeClass('grouped'); GROUPS.selectedGroup = null; FIGURES.groupedFigures = []; $('.groupBox').removeClass('selected'); $('#groupSelector').hide(); TOOLS.reset(); return false;" href="#"></a>	
		</div>
		
		<?php if($_SESSION['username'] == "admin"): ?>
		<div>
			<a href="#" onmousedown="this.href='interface.php?action=exportFiguresAsCSV&site='+$('#imageDescription #site span').text()+'&rock='+$('#imageDescription #rock span').text()+'&section='+$('#imageDescription #section span').text();">export as CSV</a>
		</div>
		<?php endif; ?>
		
		<div id="tool_options">
			<ol class="hint" style="-webkit-padding-start: 30px;">
			<li>Zoom into image</li>
			<li>Select figure</li>
			<li>Classify figure</li>
			<li>Save annotation</li>
			</ol>
		</div>
		
		<a href="AncientCamunianAlphabet.pdf">Download ancient camunian alphabet</a>
	</div>
   
	<div id="right">
		<div id="debug">
		<input type="button" value="generate bitmapimage" onclick="var maskBase64 = window.generateOneBitBitmapDataURL(SELECTION.current, SELECTION.boundingBox); window.open(maskBase64);"/>
		</div>
		<div id="classificator">
			<?php if($_SESSION['username'] == "admin"): ?>
			<div id="classifier_data">
				<p>figureID: <span id="figureid"></span></p>
				<p>classified by: <span id="classified_by"></span></p>
				<p>on: <span id="classified_on"></span></p>
				<p><br/></p>
			</div>
			<?php endif; ?>
			
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
			<input id="save" type="button" value="Save to DB" onclick="SELECTION.saveClassificationData(); TOOLS.reset(); return false;" disabled />
			<input id="delete" type="button" value="Delete from DB" onclick="FIGURES.removeClassificationData(); TOOLS.reset(); return false;" disabled />
			<?php endif; ?>
			<input id="cancel" type="button" value="Cancel" onclick="SELECTION.clear(); $('.figureBox').removeClass('selected'); FIGURES.selectedFigure = null; IMAGE.redrawSelectionFull(); TOOLS.reset(); return false;" />
			<div id="classificationHint">Complete all classificationsets and make sure all total confidences are 1!</div>
		</div>
		
		<div id="groupSelector">
			<input id="createGroup" type="button" value="Create group" onclick="GROUPSELECTOR.createNewGroup(); return false;" disabled />
			<input id="updateGroup" type="button" value="Update group" onclick="GROUPSELECTOR.updateExistingGroup(); return false;" disabled />
			<input id="deleteGroup" type="button" value="Delete group" onclick="GROUPSELECTOR.deleteExistingGroup(); return false;" disabled />
		</div>
		
		<div id="responseBox"></div>
	</div>
	
	<div id="center">
		<canvas id="imageCanvas" ></canvas>
		<canvas id="overlayCanvas" ></canvas>
		<canvas id="toolCanvas" ></canvas>
		<div id="groupHolder" style="width: 100%; height: 100%;"></div>
		<div id="figureHolder" style="width: 100%; height: 100%;"></div>
	</div>
</div>


<?php include('infobox_inc.php'); ?>


<div id="wait">
	<img id="spinner" src="img/ajaxSpinner.gif"/>
</div>


<script language="javascript" type="text/javascript" src="js/setup.js"></script>


</body>
</html>