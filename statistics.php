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
	.span-right{
		float: right;
		width: 4em;
		text-align: right;
	}
	.span-right2{
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
					$(h3).append("<span style='float:right'>in total</span>");
					<?php if($_SESSION['username'] != "ReadOnly"): ?>
					$(h3).append("<span style='float:right'>by you /&nbsp;</span>");
					<?php endif; ?>
					$(ul).append(h3);
				}
				// append new child node
				var li = document.createElement('li');
				
				
					var option = "" + options[i].name + "<span class='span-right'><a href='figurelist.php?option=" + escape(options[i].name) + "&index=" + options[i].index + "'>" + options[i].total_quantity + "</a></span>";
					<?php if($_SESSION['username'] != "ReadOnly"): ?>
					option += "<span class='span-right2'><a href='figurelist_my.php?option=" + escape(options[i].name) + "&index=" + options[i].index + "'>" + options[i].your_quantity + "</a>&nbsp;&nbsp;&nbsp;&nbsp;/</span>";
					<?php endif; ?>
				
				$(li).append(option);
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