<?php
	session_start();
	if($_SESSION['username'] == "") header('Location: index.php');	// wenn Seite direkt ?ber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen

ini_set('memory_limit', '-1');


require_once('functions.inc.php');

makeTiles("./R 1 Settore B.jpg", 256, "./test/");

?>