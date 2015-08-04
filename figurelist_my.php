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
	.wrapper img:hover{
		border: 1px solid orange;
		max-width:98%;
		max-height:98%;
	}
	#content{
		bottom: auto;
		overflow: visible;
	}
</style>

</head>


<body id="statisticsPage">


<?php include('header_inc.php'); ?>

<div id="content">
<p>List of <b><u>your figures</u></b> for option <b><?php echo $_GET['option']; ?></b>:</p><br/><br/>
<div id="responseBox"></div>
</div>
<?php include('infobox_inc.php'); ?>

<script language="javascript" type="text/javascript">
	var data = LOADER.loadImagesOfMyFiguresWithOption(<?php echo $_GET['index'] ?>);

	if( Object.prototype.toString.call( data ) === '[object Array]' ) {
	    for(var i=0; i<data.length; i++){
	    	var figure = data[i];
	    	
	    	var wrapper = document.createElement('div');
	    	$(wrapper).addClass('wrapper');
	    	var a = document.createElement('a');
	    	var img = document.createElement('img');
	    	if (figure.pathToMaskFile != null){
	    		$(img).attr('src', figure.pathToMaskFile);
	    		$(a).attr('href', 'figuredetails.php?figureID=' + figure.figureID);
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
	}
	
	if (data.length == 0){
		$('#responseBox').text('You did not annotate any figures with this option.');
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}

	
</script>


</body>
</html>