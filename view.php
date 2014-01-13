<?php
	session_start();
	if($_SESSION['username'] != "admin") header('Location: index.php');	// wenn Seite direkt ?ber URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen

	//show warnings
	error_reporting(E_ERROR | E_WARNING | E_PARSE);
	
	require_once('config.inc.php');
	
	$db = connectDB();


	$sql = "SELECT * FROM Figure";
		
	$result = mysql_query($sql) or die("Error in getFigures: " . mysql_error());
	
	echo "<table>";
	echo "<th>figureID</th><th>mask</th>";
	
	$output = array();
	while ($row = mysql_fetch_array($result)) { 
	
		echo "<tr>";
		
		echo "<td>" . $row['Index'] . "</td>";
		
		echo "<td><img src='" . $row['PathToMaskFile'] . "'></td>";
		/*
		$node = array();

		$node['figureID'] = $row['Index'];
		$node['imageName'] = $row['TracingName'];
		$node['maskPath'] = $row['PathToMaskFile'];

		$node['superimposition'] = $row['Superimposition'];
		$node['figure_incomplete'] = $row['FigureIncomplete'];
		$node['figure_damaged'] = $row['FigureDamaged'];
		$node['tracing_incomplete'] = $row['TracingIncomplete'];

		array_push($output, $node);
		*/
		
		echo "</tr>";
	}
	
	echo "</table>";

	closeDB($db);

?>