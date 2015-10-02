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


	// DB credentials

	define('SV_NAME','localhost');
	define('DB_NAME','annotool');
	define('DB_USER','root');
	define('DB_PW','');

	define('FIGUREIMAGEUPLOADPATH','figures');


	// connect to DB
	// returns PDO-object

	function db_connect() {
		// try to connect to DB
		try{
			$db = new PDO('mysql:host='.SV_NAME.';dbname='.DB_NAME, DB_USER, DB_PW);
		}
		catch (PDOException $e) {			// error handling, so that password isn't displayed
			echo 'Connection aborted!';
			echo ('Error: ' .$e);			// output original error message
			die();
		}
		return $db;
	}
	
	
	// open and close DB
	// returns a MySQL DB connection

	function connectDB(){
	
		$db = mysql_connect(SV_NAME, DB_USER, DB_PW);
		if (!$db) {
			die('DB-Connection error: ' . mysql_error());
		}		
		mysql_select_db(DB_NAME, $db) or die('Could not select database.');		
		return $db;

	}
	
	function closeDB($db){
		mysql_close($db);
	}

?>