<?php
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
					$(h3).append("<span style='float:right'>in total</span>");
					<?php if($_SESSION['username'] != "ReadOnly"): ?>
					$(h3).append("<span style='float:right'>by you /&nbsp;</span>");
					<?php endif; ?>
					$(ul).append(h3);
				}
				// append new child node
				var li = document.createElement('li');
				
				
					var option = "<a href='group_statistics.php?option=" + JSON.stringify(oldOptions.concat([options[i].name])) + "&index=" + JSON.stringify(oldOptionIndexes.concat([options[i].index])) + "'>" + options[i].name + "</a>";
					
					option += "<span class='span-right'>";
					<?php if($_SESSION['username'] == "admin"): ?>
						option += "<a href='grouplist.php?option=" + JSON.stringify(oldOptions.concat([options[i].name])) + "&index=" + JSON.stringify(oldOptionIndexes.concat([options[i].index])) + "'>" + options[i].total_quantity + "</a>";
					<?php else: ?>	
						option += options[i].total_quantity;
					<?php endif; ?>
					option += "</span>";
					
					<?php if($_SESSION['username'] != "ReadOnly"): ?>
					option += "<span class='span-right2'><a href='grouplist_my.php?option=" + JSON.stringify(oldOptions.concat([options[i].name])) + "&index=" + JSON.stringify(oldOptionIndexes.concat([options[i].index])) + "'>" + options[i].your_quantity + "</a>&nbsp;&nbsp;&nbsp;&nbsp;/</span>";
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