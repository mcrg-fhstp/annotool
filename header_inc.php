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
?>


<div id="header">

		
	<div id="right">
		<a title="Open infobox" class="" onclick="$('#infobox').show(); return false;" href="#"></a>	

		<?php if (session_id()) if($_SESSION['username'] != ""): ?>
	
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

		<?php endif; ?>
	</div>	
		




	<div id="left">
		<?php if (basename($_SERVER['PHP_SELF'], ".php") != 'index'): ?>
		<a id="back" href="javascript:history.back()" >&lt; Back</a>
		<form><input type="button" value="Figure statistics" onclick="location.href='figure_statistics.php';"></form>
		<form><input type="button" value="Group statistics" onclick="location.href='group_statistics.php';"></form>
		<?php endif; ?>
	</div>	



	<h1>AnnoTool
		<span></span>
	</h1>
	

</div>