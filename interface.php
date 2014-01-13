<?php
	session_start();

	if($_SESSION['username'] == ""){
		echo 'Sorry, you are currently not logged in!';
		echo('<br/><br/>Please log in: <a href="index.php">index.php</a>');	// wenn Seite direkt über URL angesteuert und nicht eingeloggt, dann Umleitung zum Einloggen
		die();
	}
	//ini_set('suhosin.post.max_value_length', 2000000);
	//echo phpinfo().'\n';
	//echo ini_get('post_max_size');
	//echo suhosin.post.max_value_length;

//show warnings
error_reporting(E_ERROR | E_WARNING | E_PARSE);

require_once('config.inc.php');

//get action
$action = $_REQUEST['action'];

$db = connectDB();



switch($action){
	case "getImages":
		getImages();
		break;

	case "getClassificationOptions":
		getClassificationOptions();
		break;

	case "getFiguresForImage":
		$imageName = $_REQUEST['imageName'];
		if ($imageName)
			getFiguresForImage($imageName);
		else
			echo("no imageName defined");
		break;
		
	/*case "getCoordinatesForFigure":
		$imageName = $_REQUEST['imageName'];
		$boundingBox = $_REQUEST['boundingBox'];
		if ($imageName){
			if ($boundingBox)
				getCoordinatesForFigure($imageName, $boundingBox);
			else
				echo("no boundingBox defined");
		}
		else
			echo("no imageName defined");
		break;
	*/	
	case "getMaskForFigure":
		$figureID = $_REQUEST['figureID'];
		if ($figureID){
			getMaskForFigure($figureID);
		}
		else
			echo("no figureID defined");
		break;
		
	case "saveNewFigure":
		$imageName = $_REQUEST['imageName'];
		$boundingBox = $_REQUEST['boundingBox'];
		$classes = $_REQUEST['classes'];
		$maskBase64 = $_REQUEST['maskBase64'];
		$superimposition = $_REQUEST['superimposition'];
		$figure_incomplete = $_REQUEST['figure_incomplete'];
		$figure_damaged = $_REQUEST['figure_damaged'];
		$tracing_incomplete = $_REQUEST['tracing_incomplete'];
		
		if ($imageName != ""){
			if ($boundingBox != ""){
				if ($classes != ""){
					if ($superimposition != ""){
						if ($figure_incomplete != ""){
						if ($figure_damaged != ""){
						if ($tracing_incomplete != ""){
							if ($maskBase64 != "")
								saveNewFigure($imageName, $boundingBox, $classes, $superimposition, $figure_incomplete, $figure_damaged, $tracing_incomplete, $maskBase64);
							else
								echo("no mask defined");
						}
						else
							echo ("tracing_incomplete not defined");
						}
						else
							echo ("figure_damaged not defined");
						}
						else
							echo ("figure_incomplete not defined");
					}
					else
						echo("no superimposition defined");
				}
				else
					echo("no classes defined");
			}
			else
				echo("no boundingBox defined");
		}
		else
			echo("no imageName defined");
		break;

	case "updateExistingFigure":
		$figureID = $_REQUEST['figureID'];
		$boundingBox = $_REQUEST['boundingBox'];
		$classes = $_REQUEST['classes'];
		$maskBase64 = $_REQUEST['maskBase64'];
		$superimposition = $_REQUEST['superimposition'];
		$figure_incomplete = $_REQUEST['figure_incomplete'];
		$figure_damaged = $_REQUEST['figure_damaged'];
		$tracing_incomplete = $_REQUEST['tracing_incomplete'];

		
		if ($figureID){
			if ($boundingBox != "" || $classes != "" || $maskBase64 != "" || $superimposition != "" || $figure_incomplete != "" || $figure_damaged != "" || $tracing_incomplete != "")
				updateExistingFigure($figureID, $boundingBox, $classes, $superimposition, $figure_incomplete, $figure_damaged, $tracing_incomplete, $maskBase64);
			else
				echo("no mask, classes, boundingBox, superimposition, figure_incomplete, figure_damaged or tracing_incomplete defined");
		}
		else
			echo("no figureID defined");
		break;

	case "deleteFigure":
		$figureID = $_REQUEST['figureID'];
		if ($figureID){
			deleteFigure($figureID);
		}
		else
			echo("no figureID defined");
		break;
						
	default:	
		echo("wrong action or no action defined");
		break;
}

closeDB($db);







function getImages(){
	
	$sql = "SELECT * FROM Tracing ORDER BY Site, `Rock Number`, Section";
		
	$result = mysql_query($sql) or die("Error in getImages: " . mysql_error());
	
	$output = array();
	while ($row = mysql_fetch_array($result)) { 
		$node = array();

		$node['name'] = $row['Name'];
		$node['folder'] = $row['Folder'];
		$node['site'] = $row['Site'];
		$node['rock'] = $row['Rock Number'];
		$node['section'] = $row['Section'];
		$node['width'] = $row['Width'];
		$node['height'] = $row['Height'];
		
		$sql2 = "SELECT COUNT(*) FROM Figure WHERE TracingName = '" . $node['name'] . "'";
		if ($_SESSION['username'] != 'admin')
			$sql2 .= " AND Username = '" . $_SESSION['username'] . "'";

		$result2 = mysql_query($sql2) or die("Error in getImages, countFigures: " . mysql_error());
		$row2 = mysql_fetch_row($result2);

		$node['nbFigures'] =  $row2[0];

		array_push($output, $node);
	}
		
	echo json_encode($output);	
}






function getClassificationOptions(){
	
	$sql = "SELECT * FROM FigureTypeNode ORDER BY Typology, `Index`";
		
	$result = mysql_query($sql) or die("Error in getClassificationOptions: " . mysql_error());
	
	$output = array();
	while ($row = mysql_fetch_array($result)) { 
		$node = array();

		$node['index'] = $row['Index'];
		$node['parentIndex'] = $row['ParentIndex'];
		$node['name'] = $row['Name'];
		//$node['parentName'] = $row['ParentName'];
		$node['mutuallyExclusive'] = $row['MutuallyExclusive'];
		$node['typology'] = $row['Typology'];


		array_push($output, $node);
	}
		
	echo json_encode($output);	
}





function getFiguresForImage($imageName){
	
	$sql = "SELECT * FROM Figure WHERE TracingName = '" . $imageName . "'";
	if ($_SESSION['username'] != 'admin')
			$sql .= " AND Username = '" . $_SESSION['username'] . "'";
		
	$result = mysql_query($sql) or die("Error in getFiguresForImage: " . mysql_error());
	
	$output = array();
	while ($row = mysql_fetch_array($result)) { 
		$figure = array();

		$figure['figureID'] = $row['Index'];
		$figure['imageName'] = $row['TracingName'];
		$figure['boundingBox'] = json_decode($row['Boundingbox']);

		array_push($output, $figure);
	}
		
	echo json_encode($output);	
}






/*
function getCoordinatesForFigure($imageName, $boundingBox){
	
	// get figure
	$sql = "SELECT * FROM Figure WHERE TracingName = '" . $imageName . "' AND
										Boundingbox = '" . $boundingBox . "'";
		
	$result = mysql_query($sql) or die("Error in getCoordinatesForFigure, getFigure: " . mysql_error());
	
	$output = array();
	while ($row = mysql_fetch_array($result)) { 
		//$figure = array();

		$figure['imageName'] = $row['TracingName'];
		$figure['boundingBox'] = json_decode($row['Boundingbox']);
		$figure['coordinates'] = json_decode($row['Coordinates']);

		//array_push($output, $figure);
	}


	// get classes
	$sql = "SELECT * FROM FigureTypes ft, FigureTypeNode ftn 
	WHERE ft.TracingName = '" . $imageName . "' AND ft.Boundingbox = '" . $boundingBox . "' 
	AND ft.Name = ftn.Name AND ft.ParentName = ftn.ParentName";
		
	$result = mysql_query($sql) or die("Error in getCoordinatesForFigure, getClasses: " . mysql_error());
	
	$output = array();
	while ($row = mysql_fetch_array($result)) { 
		$class = array();

		$class['name'] = $row['Name'];
		$class['parentName'] = $row['ParentName'];
		$class['mutuallyExclusive'] = $row['MutuallyExclusive'];
		


		array_push($output, $class);
	}
	
	$figure['classes'] = $output;
		
	echo json_encode($figure);	
}
*/





function getMaskForFigure($figureID){
	
	// get figure
	$sql = "SELECT * FROM Figure WHERE `Index` = '" . $figureID . "'";
	
	$result = mysql_query($sql) or die("Error in getMaskForFigure, getFigure: " . mysql_error());

	$output = array();
	if (mysql_num_rows($result) == 0) die("Error in getMaskForFigure for figure " . $figureID . ": No result!"); 
	else {	
		while ($row = mysql_fetch_array($result)) { 
		
			//$figure = array();
	
			$figure['figureID'] = $figureID;
			$figure['imageName'] = $row['TracingName'];
			$figure['boundingBox'] = json_decode($row['Boundingbox']);
			$figure['maskBase64'] = $row['MaskBase64'];
			$figure['superimposition'] = $row['Superimposition'];
			$figure['figure_incomplete'] = $row['FigureIncomplete'];
			$figure['figure_damaged'] = $row['FigureDamaged'];
			$figure['tracing_incomplete'] = $row['TracingIncomplete'];
	
			//array_push($output, $figure);
		}
	
		
		// get classes
		//$sql = "SELECT * FROM FigureTypes ft, FigureTypeNode ftn 
		//WHERE ft.figureID = '" . $figureID . "' 
		//AND ft.Name = ftn.Name AND ft.ParentName = ftn.ParentName ORDER BY ftn.Typology, ft.Confidence DESC";
		$sql = "SELECT * FROM FigureTypes ft, FigureTypeNode ftn 
		WHERE ft.figureID = '" . $figureID . "' 
		AND ft.ClassID = ftn.Index  
		ORDER BY ftn.Typology, ft.Confidence DESC";

			
		$result = mysql_query($sql) or die("Error in getMaskForFigure, getClasses for figure " . $figureID . ": " . mysql_error());
		
		$output = array();
		if (mysql_num_rows($result) == 0) die("Error in getMaskForFigure, getClasses for figure " . $figureID . ": No result!");
		else
		while ($row = mysql_fetch_array($result)) { 
			$class = array();
	
			$class['index'] = $row['Index'];
			$class['parentIndex'] = $row['ParentIndex'];

			//$class['name'] = $row['Name'];
			//$class['parentName'] = $row['ParentName'];
			$class['mutuallyExclusive'] = $row['MutuallyExclusive'];
			$class['typology'] = $row['Typology'];
			$class['confidence'] = $row['Confidence'];

			array_push($output, $class);
		}
		
		$figure['classes'] = $output;
			
		echo json_encode($figure);
	}	
}






function saveNewFigure($imageName, $boundingBox, $classes, $superimposition, $figure_incomplete, $figure_damaged, $tracing_incomplete, $maskBase64)
{
	//echo $maskBase64;
	//removing the "data:image/png;base64," part
	$data = substr($maskBase64,strpos($maskBase64,",")+1);
	$data = str_replace(' ', '+', $data);
	$data = base64_decode($data);
	
	$filename = FIGUREIMAGEUPLOADPATH .'/' . uniqid() . '.bmp';
	
	// begin transaction
	mysql_query("START TRANSACTION");
	mysql_query("BEGIN");
	
	// save Figure
	//$sql = "INSERT INTO Figure (TracingName, Boundingbox, PathToMaskFile, MaskBase64, MaskBlob) VALUES ('". $imageName ."','". $boundingBox ."','". $filename  ."','". $maskBase64  ."','". $data ."')";
	
	// without BLOB; created error with big image, maybe sql-statement too long?
	$sql = "INSERT INTO Figure (TracingName, Boundingbox, PathToMaskFile, MaskBase64, Username, Superimposition, FigureIncomplete, FigureDamaged, TracingIncomplete) VALUES ('". $imageName ."','". $boundingBox ."','". $filename  ."','". $maskBase64 ."','". $_SESSION['username'] ."','". $superimposition ."','". $figure_incomplete ."','". $figure_damaged ."','". $tracing_incomplete ."')";
	
	$result1 = mysql_query($sql) or die("Error in saveNewFigure, saveFigure for figure " . $figureID . ": " . mysql_error());

	$figureID = mysql_insert_id();

	echo $result;
	
	// save Classes
	//print_r($classes);
	foreach ($classes as $class) {
		//$sql = "INSERT INTO FigureTypes (figureID, Name, ParentName, Typology, Confidence) VALUES ('". $figureID ."','". $class['name']  ."','". $class['parentName'] ."','". $class['typology']  ."','". $class['confidence'] ."')";
		$sql = "INSERT INTO FigureTypes (figureID, ClassID, Typology, Confidence) VALUES ('". $figureID ."','". $class['index'] ."','". $class['typology']  ."','". $class['confidence'] ."')";
		
		$result = mysql_query($sql);
		
		if (!$result){
			echo ("Error in saveNewFigure, saveClasses for figure " . $figureID . ": " . mysql_error());
			break;
		}
    }

    // save Bitmap-File
    if ($result1 && $result){
	    $success = file_put_contents($filename, $data);
	    //echo $success;
		print $success ? $file : 'Error in saveNewFigure: Unable to save file for figure ' . $figureID . ': '.$success;
	}
		
	if(!$success || !$result1 || !$result){
		mysql_query("ROLLBACK");
	}
	else{
		mysql_query("COMMIT");
		echo $figureID;
	}
}






function updateExistingFigure($figureID, $boundingBox, $classes, $superimposition, $figure_incomplete, $figure_damaged, $tracing_incomplete, $maskBase64)
{
	if ($maskBase64){
		//echo $maskBase64;
		//removing the "data:image/png;base64," part
		$data = substr($maskBase64,strpos($maskBase64,",")+1);
		$data = str_replace(' ', '+', $data);
		$data = base64_decode($data);
		
		$filename = FIGUREIMAGEUPLOADPATH .'/' . uniqid() . '.bmp';
	}
	
	// begin transaction
	mysql_query("START TRANSACTION");
	mysql_query("BEGIN");
	
	// save Figure
	//$sql = "INSERT INTO Figure (TracingName, Boundingbox, PathToMaskFile, MaskBase64, MaskBlob) VALUES ('". $imageName ."','". $boundingBox ."','". $filename  ."','". $maskBase64  ."','". $data ."')";
	
	// without BLOB; created error with big image, maybe sql-statement too long?
	$sql = "UPDATE Figure SET Username='". $_SESSION['username'] ."', Modified=NOW()";
	
	if ($boundingBox)
		$sql .= ", Boundingbox='". $boundingBox ."'";
	if ($maskBase64){
		$sql .= ", PathToMaskFile='". $filename  ."'";
		$sql .= ", MaskBase64='". $maskBase64  ."'";
	}
	if ($superimposition != "")
		$sql .= ", Superimposition='". $superimposition ."'";
	if ($figure_incomplete != "")
		$sql .= ", FigureIncomplete='". $figure_incomplete ."'";
	if ($figure_damaged != "")
		$sql .= ", FigureDamaged='". $figure_damaged ."'";
	if ($tracing_incomplete != "")
		$sql .= ", TracingIncomplete='". $tracing_incomplete ."'";
		
	$sql .= " WHERE `Index` = '". $figureID ."'";
	//echo $sql;

	$result1 = mysql_query($sql) or die("Error in updateExistingFigure, updateFigure for figure " . $figureID . ": " . mysql_error());
	
	if ($classes){	
		// delete old classes
		$sql = "DELETE FROM FigureTypes WHERE figureID='". $figureID ."'";
			
		$result = mysql_query($sql);
		
		if (!$result){
			echo ("Error in updateExistingFigure, removeOldClasses for figure " . $figureID . ": " . mysql_error());
		}
		
		// save Classes
		//print_r($classes);
		if ($result)
		foreach ($classes as $class) {
			//$sql = "INSERT INTO FigureTypes (figureID, Name, ParentName, Typology, Confidence) VALUES ('". $figureID ."','". $class['name']  ."','". $class['parentName'] ."','". $class['typology']  ."','". $class['confidence'] ."')";
			$sql = "INSERT INTO FigureTypes (figureID, ClassID, Typology, Confidence) VALUES ('". $figureID ."','". $class['index'] ."','". $class['typology']  ."','". $class['confidence'] ."')";
			
			$result = mysql_query($sql);
			
			if (!$result){
				echo ("Error in updateExistingFigure, insertNewClasses for figure " . $figureID . ": " . mysql_error());
				break;
			}
	    }
	}

    // save Bitmap-File
    if (($result1 && $maskBase64 && !$classes) ||
    	($result1 && $maskBase64 && $result && $classes)){
	    $success = file_put_contents($filename, $data);
	    //echo $success;
		print $success ? $file : 'Error in updateExistingFigure: Unable to save file for figure ' . $figureID . '.';
	}
		
	if(($maskBase64 && !$success) || !$result1 || ($classes && !$result)){
		mysql_query("ROLLBACK");
		echo ("Error in updateExistingFigure,: ROLLBACK");
	}
	else{
		mysql_query("COMMIT");
		echo $figureID;
	}
}






function deleteFigure($figureID)
{
	// begin transaction
	mysql_query("START TRANSACTION");
	mysql_query("BEGIN");
	
	// delete figure
	$sql = "DELETE FROM Figure WHERE `Index` = '". $figureID ."'";
	
	$result1 = mysql_query($sql) or die("Error in deleteFigure, deleteFigure: " . mysql_error());

	//echo $result;
	
	// delete old classes
	$sql = "DELETE FROM FigureTypes WHERE figureID='". $figureID ."'";
		
	$result = mysql_query($sql);
	
	if (!$result){
		echo ("Error in deleteFigure, removeOldClasses: " . mysql_error());
	}
		
	if(!$result1 || !$result){
		mysql_query("ROLLBACK");
	}
	else{
		mysql_query("COMMIT");
		echo $figureID;
	}
}






?>