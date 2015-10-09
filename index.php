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


//session_start();
?>

<?php include('html_head_inc.php'); ?>
	
	<script language="javascript" type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
	<script src="js/md5.js"></script>
	<script>
		function crypt(){
			document.login.password.value = CryptoJS.MD5(document.login.password.value);
		}
		function crypt2(){
			document.register.password1.value = CryptoJS.MD5(document.register.password1.value);
			document.register.password2.value = CryptoJS.MD5(document.register.password2.value);
		}
	</script>
</head>

<body id="indexPage">

<div id="wrapper">

<?php include('header_inc.php'); ?>


<div id="login">
	<div>
		<h1>Login:</h1>
		<form name="login" action="scripts/login.php" method="POST">
			Username: <input type="text" name="username" /><br/>
		    Password: <input type="password" name="password" /><br/>
		    <input type="submit" value="Login" onclick="crypt();"/>
		</form>
	</div>
</div>

<?php include('footer_inc.php'); ?>
<?php include('infobox_inc.php'); ?>


</div>

</body>
</html>
