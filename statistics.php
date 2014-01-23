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
	#wrapper{
		display: inline-block;
	}
	#span-right{
		float: right;
		margin-left: 2em;
	}
	li {
		border-top: 1px solid black;
	}
	h3{
		margin: 2em 0 1em -1em; 
	}
	#content{
		bottom: auto;
	}
</style>

</head>


<body>


<?php include('header_inc.php'); ?>

<div id="content">
<div id="wrapper">
Statistic of total number of annotated figures per node:
</div>
</div>

<script language="javascript" type="text/javascript">
	var options = LOADER.loadClassificationOptionsWithQuantity();


	function appendSubElements(index, elem){
		
		var ul = document.createElement('ul');
		
		// look for childnodes
		for(var i=0; i<options.length; i++){
			if (options[i].parentIndex == index){
				if (index == 0){
					var h3 = document.createElement('h3');
					$(h3).append(options[i].typology);
					$(ul).append(h3);
				}
				// append new child node
				var li = document.createElement('li');
				var text = document.createTextNode(options[i].name + "<tab align=right>" + options[i].quantity);
				$(li).append(options[i].name + "<span id='span-right'>" + options[i].quantity + "</span>");
				$(ul).append(li);
				appendSubElements(options[i].index, $(li));
			}
		}
		elem.append(ul);
	}	
	
	appendSubElements(0, $('#wrapper'));
	

	
</script>


</body>
</html>