<?php
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