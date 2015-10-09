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
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt Ùber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
?> 

<?php include('html_head_inc.php'); ?>
	
	<script src="js/md5.js"></script>
	<script>
		function crypt(){
			document.change_pwd.password.value = CryptoJS.MD5(document.change_pwd.password.value);
			document.change_pwd.new_password1.value = CryptoJS.MD5(document.change_pwd.new_password1.value);
			document.change_pwd.new_password2.value = CryptoJS.MD5(document.change_pwd.new_password2.value);
		}
	</script>
</head>

<body>

<?php include('header_inc.php'); ?>
<?php include('footer_inc.php'); ?>


<div id="login">
	<div>
		<h1>Change password for <?php echo $_SESSION['username']; ?>:</h1>
		<form name="change_pwd" action="scripts/change_pwd.php" method="POST">
			Old password: <input type="password" name="password" /><br/>
		    New Password: <input type="password" name="new_password1" /><br/>
		    Repeat new password: <input type="password" name="new_password2" /><br/>
		    <input type="submit" value="Change password" onclick="crypt();"/>
		</form>
	</div>
</div>

</body>
</html>