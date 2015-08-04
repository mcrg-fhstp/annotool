<?php

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