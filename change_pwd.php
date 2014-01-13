<?php
	session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt Ùber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
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

	<link rel="stylesheet" type="text/css" href="css/styles.css" />
	
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