<?php
	session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt �ber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
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


<script language="javascript" type="text/javascript" src="js/classificator.js"></script>
<script language="javascript" type="text/javascript" src="js/loader.js"></script>


<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
<script language="javascript" type="text/javascript" src="js/jquery.json-2.2.min.js"></script>

<link rel="stylesheet" type="text/css" href="css/styles.css" />

<style>

	.wrapper{
		height: 100px;
		width: 100px;
		float:left;
	}
	.wrapper img{
		max-width:100%;
		max-height:100%;
	}
	.wrapper img:hover{
		border: 1px solid yellow;
	}
	#content{
		bottom: auto;
		overflow: visible;
	}
</style>

</head>


<body>


<?php include('header_inc.php'); ?>

<div id="content">
<p>Details for figure <?php echo $_GET['figureID'] ?>:</p><br/><br/>
<div id="responseBox"></div>


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
		
		
</div>

<script language="javascript" type="text/javascript">
	var img = document.createElement('img');
	$(img).attr('src', <?php echo "'".$_GET['path']."'" ?>);
	$('#classificator').before(img);
	
	var data = LOADER.loadMaskOfFigure(<?php echo $_GET['figureID'] ?>);

	CLASSIFICATOR.loadOptions();
	CLASSIFICATOR.fill(data.classes, data.superimposition, data.figure_incomplete, data.figure_damaged, data.tracing_incomplete);

	/*if( Object.prototype.toString.call( data ) === '[object Array]' ) {
	    for(var i=0; i<data.length; i++){
	    	var figure = data[i];
	    	
	    	var wrapper = document.createElement('div');
	    	$(wrapper).addClass('wrapper');
	    	var a = document.createElement('a');
	    	var img = document.createElement('img');
	    	if (figure.pathToMaskFile != null){
	    		$(img).attr('src', figure.pathToMaskFile);
	    		$(a).attr('href', figure.pathToMaskFile);
	    		$(a).append(img);
	    		$(wrapper).append(a);
	    		$('#content').append(wrapper);
	    	}
	    }
	}
	else{
		$('#responseBox').text(data);
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}*/

	
</script>


</body>
</html>