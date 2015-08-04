<?php
//session_start();
?>

<?php include('html_head_inc.php'); ?>
	
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


</div>

</body>
</html>
