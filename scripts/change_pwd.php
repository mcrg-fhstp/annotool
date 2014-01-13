<?php
session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt Ùber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen

if($_SESSION["username"] && $_POST["password"] && $_POST["new_password1"] && $_POST["new_password2"]) {	// wurde etwas Ÿbergeben
	
	require_once('../config.inc.php');		// wenn Datei nicht gefunden wird, wird Skript abgebrochen
	$pdo = db_connect();

	$stmt = $pdo->prepare('SELECT * FROM Users WHERE username = ?');
	$stmt->bindValue(1, $_SESSION["username"]);
	$stmt->execute();
	
	//print_r($db->errorInfo());		// Fehler anzeigen
	$users = $stmt->fetchAll();		// in Array umwandeln
	//echo "<pre>"; print_r($users); echo"</pre>";	// Inhalt der Antwort ausgeben

	foreach($users as $user) {		
		if ($user["password"] == $_POST["password"]) {
			if ($_POST["new_password1"] == $_POST["new_password2"]) {
				try{
					$stmt = $pdo->prepare('UPDATE Users SET password = (:eins) WHERE username = (:zwei) AND password = (:drei);');
					$stmt->bindParam(':eins', $_POST["new_password1"]);
					$stmt->bindParam(':zwei', $_SESSION["username"]);
					$stmt->bindParam(':drei', $_POST["password"]);
					$stmt->execute();
					
					//if (!$stmt) {
					//    echo "\nPDO::errorInfo():\n";
					//    print_r($stmt->errorInfo());
					//}
		
					echo "New password successfully set!";
					echo '<br />
					<a href="javascript:history.go(-2)">&lt; Back</a>';
					die();
				} 
		        catch(PDOException $e){ 
		                return $this->pack('dbError', $e->getMessage()); 
		        } 
			}
			else {
				echo "New Password not the same!";
				echo '<br />
				<a href="javascript:history.back()">&lt; Back</a>';
				die();
			}
		}
		else{
			echo "Old Password not correct!";
			echo '<br />
			<a href="javascript:history.back()">&lt; Back</a>';
			die();
		}
	}
}
echo $_SESSION["username"];
echo "Please enter old and new passwords!";

?>
<br />
<a href="javascript:history.back()">&lt; Back</a>'