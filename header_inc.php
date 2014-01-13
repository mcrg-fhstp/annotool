<div id="header">

	<?php if (basename($_SERVER['PHP_SELF'], ".php") != 'index'): ?>
	<a id="back" href="javascript:history.back()" >&lt; Back</a>
	<?php endif; ?>

	<h1>3D-Pitoti AnnoTool
		<span> v1.1b</span>
	</h1>
	
	<?php if($_SESSION['username'] != ""): ?>
		
	<div id="info">
		<a title="Open infobox" class="" onclick="$('#infobox').show(); return false;" href="#"></a>	
	
		<form id="logout" action="scripts/logout.php" method="post">
			<input type="submit" name="logout" value="logout" />
		</form>
		
		<form><input type="button" value="Change password" onclick="location.href='change_pwd.php';"></form>
		
		<?php if($_SESSION['username'] == "admin"): ?>
			<form><input type="button" value="Register new user" onclick="location.href='register.php';"></form>
		<?php endif; ?>

		<p id="user">Logged in as <?php echo $_SESSION['username']; ?></p>
	</div>	
		
	<?php endif; ?>

</div>