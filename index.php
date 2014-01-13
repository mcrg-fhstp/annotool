<?php
//session_start();
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
		<h1>Login:</h1>
		<form name="login" action="scripts/login.php" method="POST">
			Username: <input type="text" name="username" /><br/>
		    Password: <input type="password" name="password" /><br/>
		    <input type="submit" value="Login" onclick="crypt();"/>
		</form>
	</div>
</div>

</body>
</html>
