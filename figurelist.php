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

<script language="javascript" type="text/javascript" src="js/loader.js"></script>


<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
<script language="javascript" type="text/javascript" src="js/jquery.json-2.2.min.js"></script>

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
<p>List of <b><u>all figures</u></b> for option <b><?php echo $_GET['option']; ?></b>:</p><br/><br/>
<div id="responseBox"></div>
</div>
<?php include('infobox_inc.php'); ?>

<script language="javascript" type="text/javascript">
	var data = LOADER.loadImagesOfAllFiguresWithOption(<?php echo $_GET['index'] ?>);

	if( Object.prototype.toString.call( data ) === '[object Array]' ) {
	    for(var i=0; i<data.length; i++){
	    	var figure = data[i];
	    	
	    	var wrapper = document.createElement('div');
	    	$(wrapper).addClass('wrapper');
	    	
	    	if (figure.pathToMaskFile != null){
	    		var img = document.createElement('img');
	    		$(img).attr('src', figure.pathToMaskFile);
	    		<?php if($_SESSION['username'] == "admin" || $_SESSION['username'] == "ReadOnly"): ?>
	    			var a = document.createElement('a');
	    			$(a).attr('href', 'figuredetails.php?figureID=' + figure.figureID);
	    			$(a).append(img);
	    			$(wrapper).append(a);
	    		<?php else: ?>
	    			$(wrapper).append(img);
	    		<?php endif; ?>
	    		$('#content').append(wrapper);
	    	}
	    }
	}
	else{
		$('#responseBox').text(data);
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}
	
	if (data.length == 0){
		$('#responseBox').text('No figures annotated with this option.');
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}

	
</script>


</body>
</html>