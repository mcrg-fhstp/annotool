<?php

	define('SV_NAME','localhost');
	define('DB_NAME','db_flock-0396_1');
	define('DB_USER','root');
	define('DB_PW','');

	define('FIGUREIMAGEUPLOADPATH','figures');



	function db_connect() {
			// Verbindung zur Datenbank aufbauen
		try{
			$db = new PDO('mysql:host='.SV_NAME.';dbname='.DB_NAME, DB_USER, DB_PW);
		}
		catch (PDOException $e) {			// Ausnahmebehandlung, damit nicht das Passwort ausgegeben wird
			echo 'Verbindung fehlgeschlagen!';
			echo $e;		// ursprüngliche Fehlermeldung ausgeben
			die();
		}
		return $db;
	}
	
	
	function connectDB(){
		$dbName = "db_flock-0396_1";
		$dbUser = "root";
		$dbPassword = "";
		$host = "localhost";
		
		$db = mysql_connect($host, $dbUser, $dbPassword);
		if (!$db) {
			die('DB-Connection error: ' . mysql_error());
		}
		
		mysql_select_db($dbName, $db) or die('Could not select database.');
		
		return $db;

	}
	
	function closeDB($db){
		mysql_close($db);
	}

?>