<?php
	session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt Ÿber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
?>  

<?php include('html_head_inc.php'); ?>

<script language="javascript" type="text/javascript" src="js/loader.js"></script>

<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
<script language="javascript" type="text/javascript" src="js/jquery.json-2.2.min.js"></script>

<script language="javascript" type="text/javascript" src="js/main.js"></script>

</head>


<body onload="generateImagesList();">

<?php include('header_inc.php'); ?>
<?php include('footer_inc.php'); ?>


<div id="overviewPage">
	<div id="content">
	<p>Please select a rock to classify data on:</p><br/>
	<ul id="imageList">
	<!--li><u>Campanine Rock 1 Section A</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 figures</li>
	<li><a href="#" onclick="loadImage();">Campanine Rock 1 Section B</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 figures</li>
	<li><u>Campanine Rock 1 Section C</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 figures</li>
	<li><u>Campanine Rock 2 Section A</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 figures</li>
	<li><u>Campanine Rock 2 Section B</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 figures</li>
	<li>...</li-->
	</ul>
	<div id="responseBox"></div>
	</div>
</div>


<?php include('infobox_inc.php'); ?>

</body>