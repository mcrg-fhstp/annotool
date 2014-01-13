<?php
	session_start();
	if($_SESSION['username'] != "admin") header('Location: index.php');	// wenn Seite direkt Ùber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
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
			document.login.password.value = CryptoJS.MD5(document.login.password.value);
		}
		function crypt2(){
			document.register.password1.value = CryptoJS.MD5(document.register.password1.value);
			document.register.password2.value = CryptoJS.MD5(document.register.password2.value);
		}
	</script>
</head>

<body>

<?php include('header_inc.php'); ?>
<?php include('footer_inc.php'); ?>


<div id="login">
	<div>
		<h1>Register new user:</h1>
		<form name="register" action="scripts/register.php" method="POST">
			Benutzername eingeben: <input type="text" name="username" /><br/>
		    Passwort eingeben: <input type="password" name="password1" /><br/>
		    Passwort nochmals eingeben: <input type="password" name="password2" /><br/>
		    <input type="submit" value="Register" onclick="crypt2();"/>
		</form>
	</div>
</div>

</body>
</html>