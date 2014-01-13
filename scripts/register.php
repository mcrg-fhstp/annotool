<?php
session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt Ÿber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen

if($_POST["username"] && $_POST["password1"] && $_POST["password2"]) {	// wurde etwas übergeben
	
	require_once('../config.inc.php');		// wenn Datei nicht gefunden wird, wird Skript abgebrochen
	$pdo = db_connect();

	$stmt = $pdo->prepare('SELECT * FROM Users WHERE username = ?');
	$stmt->bindValue(1, $_POST["username"]);
	$stmt->execute();
	
	//print_r($db->errorInfo());		// Fehler anzeigen
	$users = $stmt->fetchAll();		// in Array umwandeln
	//echo "<pre>"; print_r($users); echo"</pre>";	// Inhalt der Antwort ausgeben

	foreach($users as $user) {		
		if ($user["username"] == $_POST["username"]) {
			echo "User already existing!";
			echo '<br />
				<a href="../index.php">Back to Login-page</a>';
			die();
		}
	}
	
	if ($_POST["password1"] == $_POST["password2"]) {
		try{
			$stmt = $pdo->prepare('INSERT INTO Users VALUES (:eins, :zwei);');
			$stmt->bindParam(':eins', $_POST["username"]);
			$stmt->bindParam(':zwei', $_POST["password1"]);
			$stmt->execute();
			
			//if (!$stmt) {
			//    echo "\nPDO::errorInfo():\n";
			//    print_r($stmt->errorInfo());
			//}

			echo "New user successfully added!";
			echo '<br />
				<a href="javascript:history.back()">&lt; Back</a>';
			die();
		} 
        catch(PDOException $e){ 
                return $this->pack('dbError', $e->getMessage()); 
        } 
	}
	else {
		echo "Passwords not the same!";
		echo '<br />
		<a href="javascript:history.back()">&lt; Back</a>';
		die();
	}
}

echo "Please enter username and password!";

?>
<br />
<a href="javascript:history.back()">&lt; Back</a>'