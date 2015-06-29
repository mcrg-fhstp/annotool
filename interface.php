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
		
	case "getImageDetails":
		$imageName = $_REQUEST['imageName'];
		if ($imageName)
			getImageDetails($imageName);
		else
			echo("no imageName defined");
		break;

	case "getClassificationOptions":
		getClassificationOptions();
		break;
		
	case "getClassificationOptionsWithQuantity":
		getClassificationOptionsWithQuantity();
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
	
	case "getImagesForAllFiguresWithOption":
		$optionIndex = $_REQUEST['optionIndex'];
		if ($optionIndex){
			getImagesForFiguresWithOption($optionIndex, false);
		}
		else
			echo("no optionIndex defined");
		break;	
	
	case "getImagesForMyFiguresWithOption":
		$optionIndex = $_REQUEST['optionIndex'];
		if ($optionIndex){
			getImagesForFiguresWithOption($optionIndex, true);
		}
		else
			echo("no optionIndex defined");
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
		
	case "exportFiguresAsCSV":
		exportFiguresAsCSV();
		break;
		
	case "saveNewGroupForFigures":
		$figureIDs = $_REQUEST['figureIDs'];
		saveNewGroupForFigures(json_decode($figureIDs));
		break;
	
	case "updateExistingGroupWithFigures":
		$groupID = $_REQUEST['groupID'];
		$figureIDs = $_REQUEST['figureIDs'];
		updateExistingGroupWithFigures($groupID, json_decode($figureIDs));
		break;
		
	case "deleteExistingGroup":
		$groupID = $_REQUEST['groupID'];
		deleteExistingGroup($groupID);
		break;
	
	case "getFiguresInGroupsWithQuantity":
		$optionIndexes = $_REQUEST['optionIndexes'];
		getFiguresInGroupsWithQuantity(json_decode($optionIndexes));
		break;
		
	case "getGroupsOfAllFiguresWithOptions":
		$optionIndexes = $_REQUEST['optionIndexes'];
		if ($optionIndexes){
			getGroupsOfFiguresWithOptions(json_decode($optionIndexes), false);
		}
		else
			echo("no optionIndexes defined");
		break;	
	
	case "getGroupsOfMyFiguresWithOptions":
		$optionIndexes = $_REQUEST['optionIndexes'];
		if ($optionIndexes){
			getGroupsOfFiguresWithOptions(json_decode($optionIndexes), true);
		}
		else
			echo("no optionIndexes defined");
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
		$node['author'] = $row['Author'];
		
		// count # figures
		$sql2 = "SELECT COUNT(*) FROM Figure WHERE TracingName = '" . $node['name'] . "'";
		if ($_SESSION['username'] != 'admin' && $_SESSION['username'] != 'ReadOnly')
			$sql2 .= " AND Username = '" . $_SESSION['username'] . "'";

		$result2 = mysql_query($sql2) or die("Error in getImages, countFigures: " . mysql_error());
		$row2 = mysql_fetch_row($result2);

		$node['nbFigures'] =  $row2[0];
		
		// count # groups
		$sql2 = "SELECT COUNT(DISTINCT groupID) FROM Figure WHERE TracingName = '" . $node['name'] . "' AND groupID > 0";
		if ($_SESSION['username'] != 'admin' && $_SESSION['username'] != 'ReadOnly')
			$sql2 .= " AND Username = '" . $_SESSION['username'] . "'";

		$result2 = mysql_query($sql2) or die("Error in getImages, countFigures: " . mysql_error());
		$row2 = mysql_fetch_row($result2);

		$node['nbGroups'] =  $row2[0];

		array_push($output, $node);
	}
		
	echo json_encode($output);	
}




function getImageDetails($imageName){
	
	$sql = "SELECT * FROM Tracing WHERE Name = '" . $imageName . "'";
			
	$result = mysql_query($sql) or die("Error in getImageDetails: " . mysql_error());
	
	while ($row = mysql_fetch_array($result)) { 
		$node = array();

		$node['name'] = $row['Name'];
		$node['folder'] = $row['Folder'];
		$node['site'] = $row['Site'];
		$node['rock'] = $row['Rock Number'];
		$node['section'] = $row['Section'];
		$node['width'] = $row['Width'];
		$node['height'] = $row['Height'];
		$node['author'] = $row['Author'];
		
	}
		
	echo json_encode($node);	
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




function getClassificationOptionsWithQuantity(){
	
	$sql = "SELECT * FROM FigureTypeNode ORDER BY Typology, `Index`";
		
	$result = mysql_query($sql) or die("Error in getClassificationOptionsWithQuantity: " . mysql_error());
	
	$output = array();
	while ($row = mysql_fetch_array($result)) { 
		$node = array();

		$node['index'] = $row['Index'];
		$node['parentIndex'] = $row['ParentIndex'];
		$node['name'] = $row['Name'];
		//$node['parentName'] = $row['ParentName'];
		$node['mutuallyExclusive'] = $row['MutuallyExclusive'];
		$node['typology'] = $row['Typology'];
		
		
		// count total quantity
		$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE ClassID = '" . $row['Index'] . "' AND Figure.Username !=  'demo'";
		
		$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures1: " . mysql_error());
		$row2 = mysql_fetch_row($result2);

		$node['total_quantity'] = $row2[0];
		
		// count own quantity
		$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE ClassID = '" . $row['Index'] . "' AND Figure.Username = '" . $_SESSION['username'] . "'";
		
		$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures2: " . mysql_error());
		$row2 = mysql_fetch_row($result2);

		$node['your_quantity'] = $row2[0];


		array_push($output, $node);
	}
	
	// Add superimposition, figure incomplete, figure damaged, tracing incomplete
	$node['index'] = 9991;
	$node['parentIndex'] = 0;
	$node['name'] = "Superimposition";
	//$node['parentName'] = $row['ParentName'];
	$node['mutuallyExclusive'] = 0;
	$node['typology'] = "Flags";	
	$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE Superimposition = '1' AND Figure.Username !=  'demo'";		
	$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures1: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['total_quantity'] = $row2[0];	
	$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE Superimposition = '1' AND Figure.Username = '" . $_SESSION['username'] . "'";	
	$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures2: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['your_quantity'] = $row2[0];
	array_push($output, $node);

	$node['index'] = 9992;
	$node['name'] = "Figure incomplete";
	$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE FigureIncomplete = '1' AND Figure.Username !=  'demo'";		
	$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures1: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['total_quantity'] = $row2[0];	
	$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE FigureIncomplete = '1' AND Figure.Username = '" . $_SESSION['username'] . "'";	
	$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures2: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['your_quantity'] = $row2[0];
	array_push($output, $node);
	
	$node['index'] = 9993;
	$node['name'] = "Figure damaged";
	$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE FigureDamaged = '1' AND Figure.Username !=  'demo'";		
	$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures1: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['total_quantity'] = $row2[0];	
	$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE FigureDamaged = '1' AND Figure.Username = '" . $_SESSION['username'] . "'";	
	$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures2: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['your_quantity'] = $row2[0];
	array_push($output, $node);

	$node['index'] = 9994;
	$node['name'] = "Tracing incomplete";
	$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE TracingIncomplete = '1' AND Figure.Username !=  'demo'";		
	$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures1: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['total_quantity'] = $row2[0];	
	$sql2 = "SELECT COUNT(DISTINCT figureID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE TracingIncomplete = '1' AND Figure.Username = '" . $_SESSION['username'] . "'";	
	$result2 = mysql_query($sql2) or die("Error in getClassificationOptionsWithQuantity, countFigures2: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['your_quantity'] = $row2[0];
	array_push($output, $node);
		
	echo json_encode($output);	
}





function getFiguresForImage($imageName){
	
	$sql = "SELECT * FROM Figure WHERE TracingName = '" . $imageName . "'";
	if ($_SESSION['username'] != 'admin' && $_SESSION['username'] != 'ReadOnly')
			$sql .= " AND Username = '" . $_SESSION['username'] . "'";
	else
			$sql .= " AND Username != 'demo'";

		
	$result = mysql_query($sql) or die("Error in getFiguresForImage: " . mysql_error());
	
	$output = array();
	while ($row = mysql_fetch_array($result)) { 
		$figure = array();

		$figure['figureID'] = $row['Index'];
		$figure['imageName'] = $row['TracingName'];
		$figure['boundingBox'] = json_decode($row['Boundingbox']);
		$figure['groupID'] = $row['groupID'];

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
	$sql = "SELECT *,Figure.Created AS figure_created FROM Figure JOIN Tracing ON ( Figure.TracingName = Tracing.Name ) WHERE `Index` = '" . $figureID . "'";
	
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
			$figure['classified_by'] = $row['Username'];
			if($row['Modified'] != 0)
				$figure['classified_on'] = $row['Modified'];
			else
				$figure['classified_on'] = $row['figure_created'];
			$figure['site'] = $row['Site'];
			$figure['rock'] = $row['Rock Number'];
			$figure['section'] = $row['Section'];
	
			//array_push($output, $figure);
		}
	
		
		// get classes
		//$sql = "SELECT * FROM FigureTypes ft, FigureTypeNode ftn 
		//WHERE ft.figureID = '" . $figureID . "' 
		//AND ft.Name = ftn.Name AND ft.ParentName = ftn.ParentName ORDER BY ftn.Typology, ft.Confidence DESC";
		$sql = "SELECT * FROM FigureTypes ft, FigureTypeNode ftn 
		WHERE ft.figureID = '" . $figureID . "' 
		AND ft.ClassID = ftn.Index  
		ORDER BY ftn.Typology, ft.Classificationset, ft.Confidence DESC";

			
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
			$class['classificationset'] = $row['Classificationset'];

			array_push($output, $class);
		}
		
		$figure['classes'] = $output;
			
		echo json_encode($figure);
	}	
}



function getImagesForFiguresWithOption($optionIndex, $my){
	
	switch ($optionIndex){
		case 9991:
			// get figureIDs
			$sql = "SELECT `Index` AS figureID FROM Figure WHERE Superimposition = '1'";	
			break;	
		case 9992:
			// get figureIDs
			$sql = "SELECT `Index` AS figureID FROM Figure WHERE FigureIncomplete = '1'";	
			break;
		case 9993:
			// get figureIDs
			$sql = "SELECT `Index` AS figureID FROM Figure WHERE FigureDamaged = '1'";	
			break;
		case 9994:
			// get figureIDs
			$sql = "SELECT `Index` AS figureID FROM Figure WHERE TracingIncomplete = '1'";	
			break;
		default:
			// get figureIDs
			$sql = "SELECT DISTINCT figureID, ClassID FROM FigureTypes WHERE `ClassID` = '" . $optionIndex . "'";
			break;
	}
		
	$result = mysql_query($sql) or die("Error in getImagesForFiguresWithOption, getFigures: " . mysql_error());
	
	$output = array();
	if (mysql_num_rows($result) == 0) die("No figures with this option."); 
	else {	
		while ($row = mysql_fetch_array($result)) { 
		
			//$figure = array();
	
			$figure['figureID'] = $row['figureID'];
			
			// get figure
			$sql2 = "SELECT * FROM Figure WHERE `Index` = '" . $figure['figureID'] . "' ";
			if ($my)
				$sql2 .= "AND Username = '" . $_SESSION['username'] . "'";
			else
				$sql2 .= "AND Username != 'demo'";
			
			$result2 = mysql_query($sql2) or die("Error in getImagesForAllFiguresWithOption, getFigureImage: " . mysql_error());
			while($row2 = mysql_fetch_array($result2)){
				$figure['pathToMaskFile'] = $row2['PathToMaskFile'];
				
				array_push($output, $figure);
			}
		}
			
		echo json_encode($output);
	}
	
}



/*
function getImagesForMyFiguresWithOption($optionIndex){
	
	switch ($optionIndex){
		case 9991:
			// get figureIDs
			$sql = "SELECT `Index` AS figureID FROM Figure WHERE Superimposition = '1'";	
			break;	
		case 9992:
			// get figureIDs
			$sql = "SELECT `Index` AS figureID FROM Figure WHERE FigureIncomplete = '1'";	
			break;
		case 9993:
			// get figureIDs
			$sql = "SELECT `Index` AS figureID FROM Figure WHERE FigureDamaged = '1'";	
			break;
		case 9994:
			// get figureIDs
			$sql = "SELECT `Index` AS figureID FROM Figure WHERE TracingIncomplete = '1'";	
			break;
		default:
			// get figureIDs
			$sql = "SELECT DISTINCT figureID, ClassID FROM FigureTypes WHERE `ClassID` = '" . $optionIndex . "'";
			break;
	}
		
	$result = mysql_query($sql) or die("Error in getImagesForFiguresWithOption, getFigures: " . mysql_error());

	$output = array();
	if (mysql_num_rows($result) == 0) die("No figures with this option."); 
	else {	
		while ($row = mysql_fetch_array($result)) { 
		
			//$figure = array();
	
			$figure['figureID'] = $row['figureID'];
			
			// get figure
			$sql2 = "SELECT * FROM Figure WHERE `Index` = '" . $figure['figureID'] . "' AND Username = '" . $_SESSION['username'] . "'";
			
			$result2 = mysql_query($sql2) or die("Error in getImagesForMyFiguresWithOption, getFigureImage: " . mysql_error());
			while($row2 = mysql_fetch_array($result2)){
				$figure['pathToMaskFile'] = $row2['PathToMaskFile'];
				
				array_push($output, $figure);
			}
		}
			
		echo json_encode($output);
	}	
}
*/




function saveNewFigure($imageName, $boundingBox, $classes, $superimposition, $figure_incomplete, $figure_damaged, $tracing_incomplete, $maskBase64)
{
	// compare checksum
	// get raw post data
	$postdata = file_get_contents("php://input");
	$postdata = substr($postdata, 0, strpos($postdata,'&checksum'));
	if (strcmp(md5($postdata), $_REQUEST['checksum']) != 0)
		die('Error in checksum');
	
	//echo $maskBase64;
	//removing the "data:image/png;base64," part
	$data = substr($maskBase64,strpos($maskBase64,",")+1);
	$data = str_replace(' ', '+', $data);
	$data = base64_decode($data, true);		// set strict=true to check for valid data
	
	$filename = FIGUREIMAGEUPLOADPATH .'/' . uniqid() . '.bmp';
	
	// save Bitmap-File
    $success = file_put_contents($filename, $data);
	//echo $success;
	
	if (!$success) 
		die ('Error in saveNewFigure: Unable to save file for figure ');
	
	// save Figure
	//$sql = "INSERT INTO Figure (TracingName, Boundingbox, PathToMaskFile, MaskBase64, MaskBlob) VALUES ('". $imageName ."','". $boundingBox ."','". $filename  ."','". $maskBase64  ."','". $data ."')";
	
	// without BLOB; created error with big image, maybe sql-statement too long?
	$sql = "INSERT INTO Figure (TracingName, Boundingbox, PathToMaskFile, MaskBase64, Username, Superimposition, FigureIncomplete, FigureDamaged, TracingIncomplete) VALUES ('". $imageName ."','". $boundingBox ."','". $filename  ."','". $maskBase64 ."','". $_SESSION['username'] ."','". $superimposition ."','". $figure_incomplete ."','". $figure_damaged ."','". $tracing_incomplete ."')";
	
	$result1 = mysql_query($sql) or die("Error in saveNewFigure, saveFigure for figure " . $figureID . ": " . mysql_error());

	$figureID = mysql_insert_id();

	//echo $result1;
	
	// save Classes
	//print_r($classes);
	foreach ($classes as $class) {
		//$sql = "INSERT INTO FigureTypes (figureID, Name, ParentName, Typology, Confidence) VALUES ('". $figureID ."','". $class['name']  ."','". $class['parentName'] ."','". $class['typology']  ."','". $class['confidence'] ."')";
		$sql = "INSERT INTO FigureTypes (figureID, ClassID, Typology, Confidence, Classificationset) VALUES ('". $figureID ."','". $class['index'] ."','". $class['typology']  ."','". $class['confidence']  ."','". $class['classificationset'] ."')";
		
		$result = mysql_query($sql);
		
		if (!$result){
			//reverting figure
			$sql = "DELETE * FROM Figure WHERE `Index` = '". $figureID ."'";
			mysql_query($sql) or die("Error in saveNewFigure, deleting figure " . $figureID . ": " . mysql_error());
			//reverting classes
			$sql = "DELETE * FROM FigureTypes WHERE figureID = '". $figureID ."'";
			mysql_query($sql) or die("Error in saveNewFigure, deleting figureTypes for figure " . $figureID . ": " . mysql_error());
			//exit
			die ("Error in saveNewFigure, saveClasses for figure " . $figureID . ": " . mysql_error());
		}
    }
    
    //successfully saved everything
    echo $figureID;
}






function updateExistingFigure($figureID, $boundingBox, $classes, $superimposition, $figure_incomplete, $figure_damaged, $tracing_incomplete, $maskBase64)
{
	// compare checksum
	// get raw post data
	$postdata = file_get_contents("php://input");
	$postdata = substr($postdata, 0, strpos($postdata,'&checksum'));
	if (strcmp(md5($postdata), $_REQUEST['checksum']) != 0)
		die('Error in checksum');
	
	if ($maskBase64){
		//echo $maskBase64;
		//removing the "data:image/png;base64," part
		$data = substr($maskBase64,strpos($maskBase64,",")+1);
		$data = str_replace(' ', '+', $data);
		$data = base64_decode($data, true);		// set strict=true to check for valid data
		
		$filename = FIGUREIMAGEUPLOADPATH .'/' . uniqid() . '.bmp';

		// save Bitmap-File
		$success = file_put_contents($filename, $data);
	    //echo $success;
	    
	    if (!$success) 
	    	die ('Error in updateExistingFigure: Unable to save file for figure ');
	}
	

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
			
		$result = mysql_query($sql) or die ("Error in updateExistingFigure, removeOldClasses for figure " . $figureID . ": " . mysql_error());
		
		// save Classes
		//print_r($classes);
		foreach ($classes as $class) {
			//$sql = "INSERT INTO FigureTypes (figureID, Name, ParentName, Typology, Confidence) VALUES ('". $figureID ."','". $class['name']  ."','". $class['parentName'] ."','". $class['typology']  ."','". $class['confidence'] ."')";
			$sql = "INSERT INTO FigureTypes (figureID, ClassID, Typology, Confidence, Classificationset) VALUES ('". $figureID ."','". $class['index'] ."','". $class['typology']  ."','". $class['confidence'] ."','". $class['classificationset'] ."')";
			
			$result = mysql_query($sql);
			
			if (!$result){
				//reverting figure
				$sql = "DELETE * FROM Figure WHERE `Index` = '". $figureID ."'";
				mysql_query($sql) or die("Error in updateExistingFigure, deleting figure " . $figureID . ": " . mysql_error());
				//reverting classes
				$sql = "DELETE * FROM FigureTypes WHERE figureID = '". $figureID ."'";
				mysql_query($sql) or die("Error in updateExistingFigure, deleting figureTypes for figure " . $figureID . ": " . mysql_error());
				//exit
				die ("Error in updateExistingFigure, saveClasses for figure " . $figureID . ": " . mysql_error());
			}
	    }
	}

	// everything updated successfully
    echo $figureID;
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





function exportFiguresAsCSV()
{

	// found at: http://www.a2zwebhelp.com/export-data-to-csv
	
	//filter for classes and/or typology
	$typology = "";
	switch (strtolower($_REQUEST['typology']))
	{ 
		case 'chippindale':
		case 'cc':
		case '3d-pitoti':
		case '3dp':
			$typology = "3D-Pitoti project typology";
			break;
		case 'sansoni':
		case 'alexander':
			$typology = "Sansoni typology - Alexander modification";
			break;
	}
	
	if ($_REQUEST['class']){
		$name = $_REQUEST['class'];
		$sql2 = "SELECT `Index` FROM FigureTypeNode WHERE Name = '$name'";
		$result2 = mysql_query($sql2) or die("Error in exportFiguresAsCSV, getParentIndex: " . mysql_error());
		$row2 = mysql_fetch_array($result2);
		$parentIndex = $row2['Index'];
	}
	else
		$parentIndex = 0;	


	
	// Fetch records for table Figure	
	$output = "";
	$sql = "SELECT Figure.`Index` AS figureID, Site, `Rock Number`, Section, Tracing.Width AS tracingWidth, Tracing.Height AS tracingHeight, Tracing.ScaleFactor AS tracingScale, Boundingbox, PathToMaskFile, Figure.Created, Modified, Username, Superimposition, FigureIncomplete, TracingIncomplete, FigureDamaged, groupID, FigureTypeNode.Typology, Confidence, Classificationset FROM Figure JOIN Tracing ON ( Figure.TracingName = Tracing.Name ) JOIN FigureTypes ON (Figure.`Index` = FigureTypes.figureID) JOIN FigureTypeNode ON (FigureTypes.classID = FigureTypeNode.`Index`) WHERE Figure.Username !=  'demo' ";//AND FigureTypeNode.ParentIndex=0";
	
	if ($_REQUEST['figureID'])
		$sql .= " AND Figure.`Index` = '".$_REQUEST['figureID']."'";
	if ($_REQUEST['class'])
		$sql .= " AND ClassID = '$parentIndex'";
	if ($_REQUEST['typology'])
		$sql .= " AND FigureTypeNode.Typology = '$typology'";
	if ($_REQUEST['site'])
		$sql .= " AND Tracing.Site = '".$_REQUEST['site']."'";
	if ($_REQUEST['rock'])
		$sql .= " AND Tracing.`Rock Number` = '".$_REQUEST['rock']."'";
	if ($_REQUEST['section'])
		$sql .= " AND Tracing.Section = '".$_REQUEST['section']."'";
	if ($_REQUEST['ingroup'])
		$sql .= " AND groupID > 0";
	if ($_REQUEST['group'])
		$sql .= " AND groupID = '".$_REQUEST['group']."'";
	$sql .= "GROUP BY Figure.`Index`, FigureTypeNode.Typology, Classificationset, Confidence DESC";
	//$sql .= " ORDER BY Figure.`Index`, FigureTypeNode.Typology, Classificationset, Confidence DESC";	
	$result = mysql_query($sql) or die("Error in exportFiguresAsCSV, getFigures: " . mysql_error());
	$columns_total = mysql_num_fields($result);
	
	// Get Headers
	for ($i = 0; $i < $columns_total; $i++) {
		$heading = mysql_field_name($result, $i);
		if ($heading == 'Boundingbox'){					// split Boundingbox fields (x1, y1, x2, y2)
			$output .= '"Boundingbox_x1","Boundingbox_y1","Boundingbox_x2","Boundingbox_y2",';
		}else if ($heading == 'groupID'){
			$output .= '"groupID","GroupBoundingbox_x1","GroupBoundingbox_y1","GroupBoundingbox_x2","GroupBoundingbox_y2",';
		}else{
			$output .= '"'.$heading.'",';
		}
	}
	
	// Fetch records for table FigureTypeNode recursively as tree
	$children = getChildNodes($parentIndex, $typology);
	
	//echo '<pre>'; print_r($children); echo '</pre>';die();
	$output .= $children[0];
	$indices = $children[1];
	
	//echo $output;die();
	
	$output .="\n";



	
	// Get records from table Figure
	while ($row = mysql_fetch_array($result)) {
		for ($i = 0; $i < $columns_total; $i++) {
			if (mysql_field_name($result, $i) == 'Boundingbox')	// split Boundingbox fields (x1, y1, x2, y2)
			{
				$bb_array = json_decode($row["$i"], true);
				foreach ($bb_array as $bb_coord)
					//var_dump($bb_coord);
					$output .='"'.$bb_coord.'",';
			}else if (mysql_field_name($result, $i) == 'groupID'){	// add groups boundingbox fields (x1, y1, x2, y2)
				// add groupID
				$output .='"'.$row["$i"].'",';
				if ($row["$i"] > 0){
					// query for boundingboxes of all figures in this group
					$sql2 = "SELECT Boundingbox FROM Figure WHERE groupID =" .$row["$i"];
					$result2 = mysql_query($sql2) or die("Error in exportFiguresAsCSV, getGroupBoundingboxes: " . mysql_error());
					$xmin=INF;
					$ymin=INF;
					$xmax=0;
					$ymax=0;
					while ($row2 = mysql_fetch_array($result2)) {
						//print_r( $row2);
						$bb_array = json_decode($row2[0], true);
						//print_r($bb_array);
						if ($bb_array['x1'] < $xmin) $xmin = $bb_array['x1'];
						if ($bb_array['y1'] < $ymin) $ymin = $bb_array['y1'];
						if ($bb_array['x2'] > $xmax) $xmax = $bb_array['x2'];
						if ($bb_array['y2'] > $ymax) $ymax = $bb_array['y2'];
						//echo($xmin." ".$ymin." ".$xmax." ".$ymax."<br>");
					}
					//die();
					$output .='"'.$xmin.'","'.$ymin.'","'.$xmax.'","'.$ymax.'",';
				}else{
					$output .='"0","0","0","0",';
				}
			}else{
				$output .='"'.$row["$i"].'",';
			}
		}
		
		$figureID = $row['figureID'];
		$confidence = $row['Confidence'];
		$typology = $row['Typology'];
		$classificationset = $row['Classificationset'];
		
		//print($figureID);
		//print($confidence);
		//print($typology);
		
		// Fetch records for table FigureTypes
		$sql3 = "SELECT ClassID, Confidence FROM FigureTypes JOIN FigureTypeNode ON (FigureTypes.classID = FigureTypeNode.`Index`) WHERE figureID='". $figureID ."' AND CAST(Confidence AS DECIMAL(3,2))= '".$confidence."' AND Classificationset= '".$classificationset."' AND FigureTypeNode.Typology= '".$typology."' ORDER BY ClassID";
		$result3 = mysql_query($sql3) or die("Error in exportFiguresAsCSV, getFigureTypes: " . mysql_error());
		$columns_total3 = mysql_num_rows($result3);
		//print($columns_total3);
		
		// Get records from table FigureTypes
		$temp_output = array();
		while ($row3 = mysql_fetch_array($result3)) {
			$temp_output[] = $row3['ClassID'];
			//$confidence = $row3['Confidence'];
		}
		//echo '<pre>';print_r($temp_output);echo '</pre>';die();
		
		for ($i = 0; $i < count($indices); $i++) {
			for ($j = 0; $j < count($temp_output); $j++) {
				if ($temp_output[$j] == $indices[$i]){
					$output .='"1",';
					break;
				}
			}
			if ($j == count($temp_output))
				$output .='"0",';
		}

		//$output .='"'.$confidence.'",';
		$output .="\n";		
	}
	

	
	
	
	// Download the file	
	$filename = "FigureExportAsCSV_".$_SERVER['QUERY_STRING']."_".date("Y-m-d H:i:s").".csv";
	header('Content-type: application/csv');
	header('Content-Disposition: attachment; filename='.$filename);
	
	echo $output;
	exit;

}


function getChildNodes($parent, $typology){
	$sql2 = "SELECT `Index`, Name FROM FigureTypeNode WHERE ParentIndex = '$parent'";
	if ($_REQUEST['typology'])
		$sql2 .= " AND Typology = '$typology'";
	$result2 = mysql_query($sql2) or die("Error in exportFiguresAsCSV, getChildNodes: " . mysql_error());
	
	$output = "";
	$indices = array();
	
	// Get records from table FigureTypeNode	
	while ($row2 = mysql_fetch_array($result2)) {
		$output .='"'.$row2['Name'].'",';
		$indices[] = $row2['Index'];
		
		$children = getChildNodes($row2['Index'], $typology);
		$output .= $children[0];
		foreach ($children[1] as $value)
			$indices[] = $value;
	}
	
	$children = array();
	$children[] = $output;
	$children[] = $indices;
	
	return $children;
}


function saveNewGroupForFigures($figureIDs){
	$sql = "SELECT MAX(groupID) FROM Figure";
	$result = mysql_query($sql) or die("Error in saveNewGroupForFigures, selectMaxgroupID: " . mysql_error());
	$row = mysql_fetch_array($result);
	$maxgroupID =$row["MAX(groupID)"];
	
	$sql = "UPDATE Figure SET groupID=" . ($maxgroupID+1) . " WHERE 1=0";
	foreach ($figureIDs as $figureID) {
		$sql .= " OR `Index` = " . $figureID;
	}
	$result = mysql_query($sql) or die("Error in saveNewGroupForFigures, updateFigures: " . mysql_error());
	echo ($maxgroupID+1);
}

function updateExistingGroupWithFigures($groupID, $figureIDs){
	// remove all figures from group
	$sql = "UPDATE Figure SET groupID=0 WHERE groupID=" . $groupID;
	$result = mysql_query($sql) or die("Error in updateExistingGroupWithFigures, deleteGroupIDs: " . mysql_error());
	
	// add new figures
	$sql = "UPDATE Figure SET groupID=" . $groupID ." WHERE 1=0";
	foreach ($figureIDs as $figureID) {
		$sql .= " OR `Index` = " . $figureID;
	}
	$result = mysql_query($sql) or die("Error in updateExistingGroupWithFigures, setGroupIDs: " . mysql_error());
	echo $groupID;	
}

function deleteExistingGroup($groupID){
	$sql = "UPDATE Figure SET groupID=0 WHERE groupID=" . $groupID;
	$result = mysql_query($sql) or die("Error in deleteExistingGroup: " . mysql_error());
	echo $groupID;
}




function getFiguresInGroupsWithQuantity($optionIndexes){
	//print_r($optionIndexes);
	
	// get all ClassificationOptions
	$sql = "SELECT * FROM FigureTypeNode ORDER BY Typology, `Index`";	
	$result = mysql_query($sql) or die("Error in getFiguresInGroupsWithQuantity: " . mysql_error());


	// prepare query parts
	if ($optionIndexes){
		$sql1_part = "SELECT DISTINCT groupID, Figure.`Index` FROM Figure JOIN FigureTypes ON Figure.`Index` = FigureTypes.figureID WHERE groupID > 0 AND Username != 'demo' ";
		$sql2_part = "SELECT DISTINCT groupID, Figure.`Index` FROM Figure JOIN FigureTypes ON Figure.`Index` = FigureTypes.figureID WHERE groupID > 0 AND Username = '" . $_SESSION['username'] . "' ";

	
		// JOINS
		$sql1_joins = "";
		$sql2_joins = "";
		foreach ($optionIndexes as $index => $optionIndex){		
			if ($index == 0){
				$sql1_joins .= "SELECT COUNT(DISTINCT t1.groupID) FROM (" . $sql1_part;
				$sql2_joins .= "SELECT COUNT(DISTINCT t1.groupID) FROM (" . $sql2_part;
			}
			else{
				$sql1_joins .= "INNER JOIN (" . $sql1_part;
				$sql2_joins .= "INNER JOIN (" . $sql2_part;
			}
		
			switch ($optionIndex){
				case 9991:
					// get figureIDs
					$sql1_joins .= "AND Superimposition = '1' ";	
					$sql2_joins .= "AND Superimposition = '1' ";	
					break;	
				case 9992:
					// get figureIDs
					$sql1_joins .= "AND FigureIncomplete = '1' ";	
					$sql2_joins .= "AND FigureIncomplete = '1' ";	
					break;
				case 9993:
					// get figureIDs
					$sql1_joins .= "AND FigureDamaged = '1' ";	
					$sql2_joins .= "AND FigureDamaged = '1' ";	
					break;
				case 9994:
					// get figureIDs
					$sql1_joins .= "AND TracingIncomplete = '1' ";	
					$sql2_joins .= "AND TracingIncomplete = '1' ";	
					break;
				default:
					// get figureIDs
					$sql1_joins .= "AND FigureTypes.ClassID = '" . $optionIndex . "' ";
					$sql2_joins .= "AND FigureTypes.ClassID = '" . $optionIndex . "' ";
					break;
			}
			
			$sql1_joins .= ") AS t" .($index+1). " ";
			$sql2_joins .= ") AS t" .($index+1). " ";
		}
		
		$subquerycount = count($optionIndexes) + 1;
			
		// WHERE CLAUSES
		$sql1_where = "";
		for ($i = 1; $i < $subquerycount; $i++){
			if ($i == 1)
				$sql1_where .= "WHERE t1.groupID = t2.groupID AND t1.`Index` != t2.`Index` ";
			else{
				$sql1_where .= "AND t" . $i . ".groupID = t" . ($i+1) . ".groupID ";
				for ($j = 1; $j < $i+1; $j++)
					$sql1_where .= "AND t" . $j . ".`Index` != t" . ($i+1) . ".`Index` ";
			}
		}
	}
	
	
	

	$output = array();
	while ($row = mysql_fetch_array($result)) { 
		$node = array();

		$node['index'] = $row['Index'];
		$node['parentIndex'] = $row['ParentIndex'];
		$node['name'] = $row['Name'];
		//$node['parentName'] = $row['ParentName'];
		$node['mutuallyExclusive'] = $row['MutuallyExclusive'];
		$node['typology'] = $row['Typology'];
		
		// combine query
		if ($optionIndexes){
			$sql1 = $sql1_joins . "INNER JOIN (" . $sql1_part;
			$sql1 .= "AND FigureTypes.ClassID = '" . $row['Index'] . "' ";
			$sql1 .= ") AS t" .(count($optionIndexes)+1). " ";
			$sql1 .= $sql1_where;
			
			$sql2 = $sql2_joins . "INNER JOIN (" . $sql2_part;
			$sql2 .= "AND FigureTypes.ClassID = '" . $row['Index'] . "' ";
			$sql2 .= ") AS t" .(count($optionIndexes)+1). " ";
			$sql2 .= $sql1_where;
		}
		else{
			$sql1 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE ClassID = '" . $row['Index'] . "' AND GroupID > 0 AND Figure.Username !=  'demo'";
			$sql2 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE ClassID = '" . $row['Index'] . "' AND GroupID > 0 AND Figure.Username = '" . $_SESSION['username'] . "'";
		}	
			
		//echo $sql1;die();
		$result1 = mysql_query($sql1) or die("Error in getFiguresInGroupsWithQuantity, countFigures1: " . mysql_error());
		$row1 = mysql_fetch_row($result1);
		$node['total_quantity'] = $row1[0];
		
				
		//echo $sql2; die();	
		$result2 = mysql_query($sql2) or die("Error in getFiguresInGroupsWithQuantity, countFigures2: " . mysql_error());
		$row2 = mysql_fetch_row($result2);
		$node['your_quantity'] = $row2[0];

		// only output figures that are in a group
		if ($node['total_quantity'] > 0)
			array_push($output, $node);
	}
	
	// Add superimposition, figure incomplete, figure damaged, tracing incomplete

	// combine query
	if ($optionIndexes){
		$sql1 = $sql1_joins . "INNER JOIN (" . $sql1_part;
		$sql1 .= "AND Superimposition = '1' ";
		$sql1 .= ") AS t" .(count($optionIndexes)+1). " ";
		$sql1 .= $sql1_where;
		
		$sql2 = $sql2_joins . "INNER JOIN (" . $sql2_part;
		$sql2 .= "AND Superimposition = '1' ";
		$sql2 .= ") AS t" .(count($optionIndexes)+1). " ";
		$sql2 .= $sql1_where;
	}
	else{
		$sql1 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE Superimposition = '1' AND GroupID > 0 AND Figure.Username !=  'demo'";
		$sql2 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE Superimposition = '1' AND GroupID > 0 AND Figure.Username = '" . $_SESSION['username'] . "'";
	}	
	$node['index'] = 9991;
	$node['parentIndex'] = 0;
	$node['name'] = "Superimposition";
	//$node['parentName'] = $row['ParentName'];
	$node['mutuallyExclusive'] = 0;
	$node['typology'] = "Flags";			
	$result1 = mysql_query($sql1) or die("Error in getFiguresInGroupsWithQuantity, countFigures1: " . mysql_error());
	$row1 = mysql_fetch_row($result1);
	$node['total_quantity'] = $row1[0];	
	$result2 = mysql_query($sql2) or die("Error in getFiguresInGroupsWithQuantity, countFigures2: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['your_quantity'] = $row2[0];
	// only output figures that are in a group
	if ($node['total_quantity'] > 0)
		array_push($output, $node);

	
	// combine query
	if ($optionIndexes){
		$sql1 = $sql1_joins . "INNER JOIN (" . $sql1_part;
		$sql1 .= "AND FigureIncomplete = '1' ";
		$sql1 .= ") AS t" .(count($optionIndexes)+1). " ";
		$sql1 .= $sql1_where;
		
		$sql2 = $sql2_joins . "INNER JOIN (" . $sql2_part;
		$sql2 .= "AND FigureIncomplete = '1' ";
		$sql2 .= ") AS t" .(count($optionIndexes)+1). " ";
		$sql2 .= $sql1_where;
	}
	else{
		$sql1 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE FigureIncomplete = '1' AND GroupID > 0 AND Figure.Username !=  'demo'";
		$sql2 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE FigureIncomplete = '1' AND GroupID > 0 AND Figure.Username = '" . $_SESSION['username'] . "'";
	}	
	$node['index'] = 9992;
	$node['parentIndex'] = 0;
	$node['name'] = "Figure incomplete";
	$node['typology'] = "Flags";	
	$result1 = mysql_query($sql1) or die("Error in getFiguresInGroupsWithQuantity, countFigures1: " . mysql_error());
	$row1 = mysql_fetch_row($result1);
	$node['total_quantity'] = $row1[0];	
	$result2 = mysql_query($sql2) or die("Error in getFiguresInGroupsWithQuantity, countFigures2: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['your_quantity'] = $row2[0];
	// only output figures that are in a group
	if ($node['total_quantity'] > 0)
		array_push($output, $node);
	
	// combine query
	if ($optionIndexes){
		$sql1 = $sql1_joins . "INNER JOIN (" . $sql1_part;
		$sql1 .= "AND FigureDamaged = '1' ";
		$sql1 .= ") AS t" .(count($optionIndexes)+1). " ";
		$sql1 .= $sql1_where;
		
		$sql2 = $sql2_joins . "INNER JOIN (" . $sql2_part;
		$sql2 .= "AND FigureDamaged = '1' ";
		$sql2 .= ") AS t" .(count($optionIndexes)+1). " ";
		$sql2 .= $sql1_where;
	}
	else{
		$sql1 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE FigureDamaged = '1' AND GroupID > 0 AND Figure.Username !=  'demo'";
		$sql2 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE FigureDamaged = '1' AND GroupID > 0 AND Figure.Username = '" . $_SESSION['username'] . "'";
	}	
	$node['index'] = 9993;
	$node['name'] = "Figure damaged";
	$node['typology'] = "Flags";	
	$result1 = mysql_query($sql1) or die("Error in getFiguresInGroupsWithQuantity, countFigures1: " . mysql_error());
	$row1 = mysql_fetch_row($result1);
	$node['total_quantity'] = $row1[0];	
	$result2 = mysql_query($sql2) or die("Error in getFiguresInGroupsWithQuantity, countFigures2: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['your_quantity'] = $row2[0];
	// only output figures that are in a group
	if ($node['total_quantity'] > 0)
		array_push($output, $node);

	// combine query
	if ($optionIndexes){
		$sql1 = $sql1_joins . "INNER JOIN (" . $sql1_part;
		$sql1 .= "AND TracingIncomplete = '1' ";
		$sql1 .= ") AS t" .(count($optionIndexes)+1). " ";
		$sql1 .= $sql1_where;
		
		$sql2 = $sql2_joins . "INNER JOIN (" . $sql2_part;
		$sql2 .= "AND TracingIncomplete = '1' ";
		$sql2 .= ") AS t" .(count($optionIndexes)+1). " ";
		$sql2 .= $sql1_where;
	}
	else{
		$sql1 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE TracingIncomplete = '1' AND GroupID > 0 AND Figure.Username !=  'demo'";
		$sql2 = "SELECT COUNT(DISTINCT groupID) FROM FigureTypes JOIN Figure ON ( FigureTypes.figureID = Figure.Index ) WHERE TracingIncomplete = '1' AND GroupID > 0 AND Figure.Username = '" . $_SESSION['username'] . "'";
	}	
	$node['index'] = 9994;
	$node['name'] = "Tracing incomplete";
	$node['typology'] = "Flags";	
	$result1 = mysql_query($sql1) or die("Error in getFiguresInGroupsWithQuantity, countFigures1: " . mysql_error());
	$row1 = mysql_fetch_row($result1);
	$node['total_quantity'] = $row1[0];	
	$result2 = mysql_query($sql2) or die("Error in getFiguresInGroupsWithQuantity, countFigures2: " . mysql_error());
	$row2 = mysql_fetch_row($result2);
	$node['your_quantity'] = $row2[0];
	// only output figures that are in a group
	if ($node['total_quantity'] > 0)
		array_push($output, $node);
		
	echo json_encode($output);	
}





function getGroupsOfFiguresWithOptions($optionIndexes, $my){

	$sql1 = "SELECT groupID, Figure.`Index` FROM Figure JOIN FigureTypes ON Figure.`Index` = FigureTypes.figureID WHERE groupID > 0 ";
	
	if ($my)
		$sql1 .= "AND Username = '" . $_SESSION['username'] . "' ";
	else
		$sql1 .= "AND Username != 'demo' ";
	
	// JOINS
	foreach ($optionIndexes as $index => $optionIndex){		
		if ($index == 0)
			$sql2 = "SELECT DISTINCT t1.groupID FROM (" . $sql1;
		else
			$sql2 .= "INNER JOIN (" . $sql1;
	
		switch ($optionIndex){
			case 9991:
				// get figureIDs
				$sql2 .= "AND Superimposition = '1' ";	
				break;	
			case 9992:
				// get figureIDs
				$sql2 .= "AND FigureIncomplete = '1' ";	
				break;
			case 9993:
				// get figureIDs
				$sql2 .= "AND FigureDamaged = '1' ";	
				break;
			case 9994:
				// get figureIDs
				$sql2 .= "AND TracingIncomplete = '1' ";	
				break;
			default:
				// get figureIDs
				$sql2 .= "AND FigureTypes.ClassID = '" . $optionIndex . "' ";
				break;
		}
		
		$sql2 .= ") AS t" .($index+1). " ";
	}
	// WHERE CLAUSES
	for ($i = 1; $i < count($optionIndexes); $i++){
		if ($i == 1)
			$sql2 .= "WHERE t1.groupID = t2.groupID AND t1.`Index` != t2.`Index` ";
		else{
			$sql2 .= "AND t" . $i . ".groupID = t" . ($i+1) . ".groupID ";
			for ($j = 1; $j < $i+1; $j++)
				$sql2 .= "AND t" . $j . ".`Index` != t" . ($i+1) . ".`Index` ";
		}
	}

	//echo $sql2;die();
		
	$result = mysql_query($sql2) or die("Error in getGroupsOfFiguresWithOption, getGroups: " . mysql_error());
	
	$output = array();
	if (mysql_num_rows($result) == 0) die("No groups containing a figure with this option."); 
	else {	
		while ($row = mysql_fetch_array($result)) { 
			//echo '<pre>'; print_r($row); echo '</pre>';die();
			$group = array();
	
			$group['groupID'] = $row['groupID'];
			
			// get site and rock
			$sql2 = "SELECT * FROM Figure JOIN Tracing ON Figure.TracingName = Tracing.Name WHERE groupID = " . $group['groupID'];
			
			$result2 = mysql_query($sql2) or die("Error in getGroupsOfFiguresWithOption, getSiteAndRock: " . mysql_error());
			if ($row2 = mysql_fetch_array($result2)){
				$group['site'] = $row2['Site'];
				$group['rock'] = $row2['Rock Number'];
				$group['section'] = $row2['Section'];
				$group['imageName'] = $row2['TracingName'];
				
				array_push($output, $group);
			}
		}
		
		//echo '<pre>'; print_r($output); echo '</pre>';die();
	
		echo json_encode($output);
	}

	
}
?>