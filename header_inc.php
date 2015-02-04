<div id="header">


	<?php if($_SESSION['username'] != ""): ?>
		
	<div id="right">
		<a title="Open infobox" class="" onclick="$('#infobox').show(); return false;" href="#"></a>	
	
		<form id="logout" action="scripts/logout.php" method="post">
			<input type="submit" name="logout" value="logout" />
		</form>
		
		<?php if($_SESSION['username'] != "demo" && $_SESSION['username'] != "ReadOnly"): ?>
			<form><input type="button" value="Change password" onclick="location.href='change_pwd.php';"></form>
		<?php endif; ?>
		
		<?php if($_SESSION['username'] == "admin"): ?>
			<form><input type="button" value="Register new user" onclick="location.href='register.php';"></form>
		<?php endif; ?>

		<p id="user">Logged in as <?php echo $_SESSION['username']; ?></p>
	</div>	
		
	<?php endif; ?>



	<div id="left">
		<?php if (basename($_SERVER['PHP_SELF'], ".php") != 'index'): ?>
		<a id="back" href="javascript:history.back()" >&lt; Back</a>
		<form><input type="button" value="Figure statistics" onclick="location.href='figure_statistics.php';"></form>
		<form><input type="button" value="Group statistics" onclick="location.href='group_statistics.php';"></form>
		<?php endif; ?>
	</div>	



	<h1>3D-Pitoti AnnoTool - Local
		<span> v1.7</span>
	</h1>
	

</div>