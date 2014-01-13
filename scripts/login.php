<?php

session_start();

if($_POST["username"]) {	// wurde etwas übergeben
	
	require_once('../config.inc.php');		// wenn Datei nicht gefunden wird, wird Skript abgebrochen
	$pdo = db_connect();

	$stmt = $pdo->prepare('SELECT * FROM Users WHERE username = :paramEins');
	$array = array(
	    ':paramEins' => $_POST["username"],
	);
	$stmt->execute($array);
	
	//print_r($db->errorInfo());		// Fehler anzeigen
	$users = $stmt->fetchAll();		// in Array umwandeln
	//echo "<pre>"; print_r($users); echo"</pre>";	// Inhalt der Antwort ausgeben

	foreach($users as $user) {
		if ( $user["password"] == $_POST["password"] ) {
			$_SESSION["username"] = $user["username"];
			if ($_POST["user"] == 'admin')
				$_SESSION["admin"] = 1;
			header('Location: ../images.php');		// umleiten 
		}
	}
	
	// wenn kein Benutzername und Passwort passt
	echo "Wrong username or password!";
}
?>
<br />
<a href="../index.php">back to Login-page</a>