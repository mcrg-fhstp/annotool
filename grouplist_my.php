<?php
	session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt Ÿber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
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



<script language="javascript" type="text/javascript" src="js/loader.js"></script>


<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
<script language="javascript" type="text/javascript" src="js/jquery.json-2.2.min.js"></script>

<link rel="stylesheet" type="text/css" href="css/styles.css" />

<style>

	.wrapper{
		height: 100px;
		width: 100px;
		float:left;
		background-color: white;
	}
	.wrapper img{
		max-width:100%;
		max-height:100%;
	}
	<?php if($_SESSION['username'] == "admin"): ?>
		.wrapper img:hover{
			border: 1px solid orange;
			max-width:98%;
			max-height:98%;
		}
	<?php endif; ?>
	#content{
		bottom: auto;
		overflow: visible;
	}
</style>

</head>


<body id="statisticsPage">


<?php include('header_inc.php'); ?>

<div id="content">
<p>List of <b><u>your groups</u></b> containing figures with option<?php if ($_GET['option']){
		$figureOptions = json_decode($_GET['option']);
		if (sizeof($figureOptions) > 1) echo ("s");
		echo (" <b>"); 
		foreach ($figureOptions as $index => $option){
			echo ($option);
			if (sizeof($figureOptions) > 1 && $index < sizeof($figureOptions)-2) echo (", ");
			if ($index == sizeof($figureOptions)-2) echo ("</b> and <b>");
		}
		echo ("</b>");
	}
?>
:</p></br>
<div id="groupsList"></div>
<div id="responseBox"></div>
</div>
<?php include('infobox_inc.php'); ?>

<script language="javascript" type="text/javascript">
	var data = LOADER.loadGroupsOfMyFiguresWithOptions(<?php echo $_GET['index'] ?>);

	if( Object.prototype.toString.call( data ) === '[object Array]' ) {
		var table = document.createElement('table');
	    for(var i=0; i<data.length; i++){
	    	var group = data[i];
	    	
	    	var tr = "<tr><td><a href='figures.php?imageName=" + group.imageName + '&groupID=' + group.groupID + "'>Group " + group.groupID + "</a></td>";
	    	tr += "<td>" + group.site;
			if (group.rock != "")	tr += " Rock " + group.rock;
			if (group.section != "")	tr += " Section " + group.section;
			tr += " </td>";
			
			$(table).append(tr);
	    }
	    $('#groupsList').append(table);
	}
	else{
		$('#responseBox').text(data);
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}
	
	if (data.length == 0){
		$('#responseBox').text('No group containing a figure with this option.');
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}

	
</script>


</body>
</html>