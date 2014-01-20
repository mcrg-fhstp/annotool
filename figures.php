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
<script language="javascript" type="text/javascript" src="js/classificator.js"></script>
<script language="javascript" type="text/javascript" src="js/loader.js"></script>


<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
<script language="javascript" type="text/javascript" src="js/jquery.json-2.2.min.js"></script>
<script language="javascript" type="text/javascript" src="js/helpers.js"></script>
<script language="javascript" type="text/javascript" src="js/bitmap.js"></script>

<link rel="stylesheet" type="text/css" href="css/styles.css" />

</head>


<body onload="setupImage();">

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
			<a title="Zoom out" style="background-position: -45px -45px;" class="" onclick="IMAGE.zoomOutCentre()" href="#" ></a>
			<a title="Zoom in" style="background-position: 5px -45px;" class="" onclick="IMAGE.zoomInCentre()" href="#" ></a>
			<p class="hint"><span id="zoom_nr">100</span>%<p>
			<br />
			<input id="zoom_range" type="range" value="1" min="1" max="10" step="1" oninput="IMAGE.zoomCentre(this.value);" /> 
		</div>

		
		
		<p id="selection_tools"><b>Selection tools</b></p>
		<div id="tools"></div>
		
		<div id="alt_key_pressed" class="key_pressed">ALT-Key pressed</div>
		<div id="shift_key_pressed" class="key_pressed">SHIFT-Key pressed</div>
		
		<div id="clear_selection" style="clear:both; margin:0;"></div>
		
		<div id="selection_options">
			<p><b>Undo/Redo/Clear selection</b></p>
			<a id="undo_tool" title="Undo selection" style="background-position: -446px -43px;" class="" onclick="SELECTION.undo(); return false;" href="#"></a>
			<a id="redo_tool" title="Redo selection" style="background-position: -498px -43px;" class="inactive" onclick="SELECTION.redo(); return false;" href="#"></a>

			<a title="Clear selection" style="background-position: -95px -45px;" class="" onclick="SELECTION.push(); SELECTION.clear(); $('.figureBox').removeClass('selected'); FIGURES.selectedFigure = null; IMAGE.redrawSelectionFull(); TOOLS.reset(); return false;" href="#"></a>	
		</div>
		
		<div id="tool_options">
			<ol class="hint" style="-webkit-padding-start: 30px;">
			<li>Zoom into image</li>
			<li>Select figure</li>
			<li>Classify figure</li>
			<li>Save annotation</li>
			</ol>
		</div>
	</div>
   
	<div id="right">
		<div id="debug">
		<input type="button" value="generate bitmapimage" onclick="var maskBase64 = window.generateOneBitBitmapDataURL(SELECTION.current, SELECTION.boundingBox); window.open(maskBase64);"/>
		</div>
		<div id="classificator">
			<div id="optionHolder"></div>
			
			<div id="superimposition">
			<span>Superimposition:</span>
			<select onchange="CLASSIFICATOR.showSaveButton(); CLASSIFICATOR.changed = true;">
			<option value disabled hidden selected="selected"></option>
			<option value="1">yes</option>
			<option value="0">no</option>
			</select>
			</div>
			
			<div id="figure_incomplete">
			<span>Figure incomplete:</span>
			<select onchange="CLASSIFICATOR.showSaveButton(); CLASSIFICATOR.changed = true;">
			<option value disabled hidden selected="selected"></option>
			<option value="1">yes</option>
			<option value="0">no</option>
			</select>
			</div>
			
			<div id="figure_damaged">
			<span>Figure damaged:</span>
			<select onchange="CLASSIFICATOR.showSaveButton(); CLASSIFICATOR.changed = true;">
			<option value disabled hidden selected="selected"></option>
			<option value="1">yes</option>
			<option value="0">no</option>
			</select>
			</div>
			
			<div id="tracing_incomplete">
			<span>Tracing incomplete:</span>
			<select onchange="CLASSIFICATOR.showSaveButton(); CLASSIFICATOR.changed = true;">
			<option value disabled hidden selected="selected"></option>
			<option value="1">yes</option>
			<option value="0">no</option>
			</select>
			</div>
			
			<input id="save" type="button" value="Save to DB" onclick="SELECTION.saveClassificationData()" disabled />
			<input id="delete" type="button" value="Delete from DB" onclick="FIGURES.removeClassificationData()" disabled />
			<input id="cancel" type="button" value="Cancel" onclick="SELECTION.clear(); $('.figureBox').removeClass('selected'); FIGURES.selectedFigure = null; IMAGE.redrawSelectionFull(); TOOLS.reset(); return false;" />
			<div id="classificationHint">Complete all classificationsets and make sure all total confidences are 1!</div>
		</div>
		
		<div id="responseBox"></div>
	</div>
	
	<div id="center">
		<canvas id="imageCanvas" ></canvas>
		<canvas id="overlayCanvas" ></canvas>
		<canvas id="toolCanvas" ></canvas>
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