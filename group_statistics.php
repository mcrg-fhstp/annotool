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

<script language="javascript" type="text/javascript" src="js/setup.js"></script>
<script language="javascript" type="text/javascript" src="js/loader.js"></script>


<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
<script language="javascript" type="text/javascript" src="js/jquery.json-2.2.min.js"></script>

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


<body id="statisticsPage">


<?php include('header_inc.php'); ?>

<div id="content">

Number of <b><u>groups</u></b> that have a figure with option<?php if (isset($_GET['option'])){
		echo ("s <b>");
		$figureOptions = json_decode($_GET['option']); 
		foreach ($figureOptions as $index => $option){
			echo ($option);
			if ($index < sizeof($figureOptions)-1) echo(", ");
		}
		echo ("</b> and");
	}
?>
:<br>
<div id="wrapper">
</div>
<div id="responseBox"></div>
</div>
<?php include('infobox_inc.php'); ?>

<script language="javascript" type="text/javascript">
	
	if (GET('option') != '')
		var oldOptions = JSON.parse(GET('option'));
	else
		var oldOptions = [];
	
	if (GET('index') != '')
		var oldOptionIndexes = JSON.parse(GET('index'));
	else
		var oldOptionIndexes = [];
	
	
	var options = LOADER.loadFiguresInGroupsWithQuantity(oldOptionIndexes);
	
	// recursively add list elements
	function appendSubElements(index, elem){
		
		var ul = document.createElement('ul');
		
		// look for childnodes
		for(var i=0; i<options.length; i++){
			if (options[i].parentIndex == index){
				// new header
				if ((index == 0) &&
					!$(ul).is(':contains(' + options[i].typology +')')){
					var h3 = document.createElement('h3');
					$(h3).append(options[i].typology);
					<?php if($_SESSION['username'] != "demo"): ?>
					$(h3).append("<span style='float:right'>in total</span>");
					<?php endif; if($_SESSION['username'] != "ReadOnly"): ?>
					var span = "<span style='float:right'>by you";
						<?php if($_SESSION['username'] != "demo"): ?>
						$span += "/&nbsp;";
						<?php endif; ?>
					span += "</span>";
					$(h3).append(span);
					<?php endif; ?>
					$(ul).append(h3);
				}
				// append new child node
				var li = document.createElement('li');
				
				
					var option = "<a href='group_statistics.php?option=" + JSON.stringify(oldOptions.concat([options[i].name])) + "&index=" + JSON.stringify(oldOptionIndexes.concat([options[i].index])) + "'>" + options[i].name + "</a>";
					
					option += "<span class='span-right'>";
					<?php if($_SESSION['username'] == "admin"): ?>
						option += "<a href='grouplist.php?option=" + JSON.stringify(oldOptions.concat([options[i].name])) + "&index=" + JSON.stringify(oldOptionIndexes.concat([options[i].index])) + "'>" + options[i].total_quantity + "</a>";
					<?php endif; if($_SESSION['username'] != "demo"): ?>	
						option += options[i].total_quantity;
					<?php endif; ?>
					option += "</span>";
					
					<?php if($_SESSION['username'] != "ReadOnly"): ?>
					option += "<span class='span-right2'><a href='grouplist_my.php?option=" + JSON.stringify(oldOptions.concat([options[i].name])) + "&index=" + JSON.stringify(oldOptionIndexes.concat([options[i].index])) + "'>" + options[i].your_quantity + "</a>";
						<?php if($_SESSION['username'] != "demo"): ?>
						option += "&nbsp;&nbsp;&nbsp;&nbsp;/";
						<?php endif; ?>
					option += "</span>";
					<?php endif; ?>
				
				$(li).append(option);
				$(ul).append(li);
				appendSubElements(options[i].index, $(li));
			}
		}
		elem.append(ul);
	}	
	
	
	if( Object.prototype.toString.call( options ) === '[object Array]' )
		appendSubElements(0, $('#wrapper'));
	else{
		$('#responseBox').text(options);
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}
	
	if (options.length == 0){
		$('#responseBox').text('No group containing a figure with this option.');
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}
	
</script>


</body>
</html>