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


function checkPicture($picture) {
	//echo $_FILES['bild']['name'];

	if (!isPNG($picture)) {
		echo "Bild ist kein PNG!";
		return false;
	} else
		return $picture;
}





function makeTiles_normal($picture, $tilesize, $tilepath) {
	$original = imagecreatefrompng($picture);	// für jedes Dateiformat neu zu definieren
	
	$height = imagesy($original);	//aus php.net gd2
	$width = imagesx($original);
	
	set_time_limit(0);
	
	for( $z = 0; $z <= (log10($width / $tilesize) / log10(2)); $z ++) {
		echo $z . "</br>";
		
		if (!file_exists($tilepath . $z))
			mkdir($tilepath . $z);
	
		$new_width = pow(2, $z) * $tilesize;
		$new_height = pow(2, $z) * $tilesize;
	
		
		$resampled = imagecreatetruecolor($new_width, $new_height);
		imagecopyresampled($resampled, $original, 0,0,0,0, $new_width, $new_height, $width, $height);
		
		for ($x = 0; $x < ($new_width / $tilesize); $x ++) {
			
			if(!file_exists($tilepath . $z . "/" . $x))
				mkdir($tilepath . $z . "/" . $x);
			
			for ($y = 0; $y < ($new_height / $tilesize); $y ++) {
		
				$tile = imagecreatetruecolor($tilesize, $tilesize);
				imagecopy($tile, $resampled, 0,0, $x * $tilesize, $y * $tilesize, $tilesize, $tilesize);
				imagepng($tile, $tilepath . $z . "/" . $x . "/" . $y . ".png");
		
			}
		}
	}
	
	echo "Fertig gerendert!";
	
	//imagejpeg($thumb, $path . basename($picture));
}



function makeTiles($picture, $tilesize, $tilepath) {
	$original = imagecreatefromjpeg($picture);	// für jedes Dateiformat neu zu definieren
	
	$height = imagesy($original);	//aus php.net gd2
	$width = imagesx($original);
	
	set_time_limit(0);
	
	for( $z = (log10($width / $tilesize) / log10(2)); $z >= 0 ; $z --) {
		echo $z . "</br>";
		
		if (!file_exists($tilepath . $z))
			mkdir($tilepath . $z);
	
		$new_width = pow(2, (log10($width / $tilesize) / log10(2)) - $z) * $tilesize;
		$new_height = pow(2, (log10($width / $tilesize) / log10(2)) - $z) * $tilesize;
	
		
		$resampled = imagecreatetruecolor($new_width, $new_height);
		imagecopyresampled($resampled, $original, 0,0,0,0, $new_width, $new_height, $width, $height);
		
		for ($x = 0; $x < ($new_width / $tilesize); $x ++) {
			
			if(!file_exists($tilepath . $z . "/" . $x))
				mkdir($tilepath . $z . "/" . $x);
			
			for ($y = 0; $y < ($new_height / $tilesize); $y ++) {
		
				$tile = imagecreatetruecolor($tilesize, $tilesize);
				imagecopy($tile, $resampled, 0,0, $x * $tilesize, $y * $tilesize, $tilesize, $tilesize);
				imagejpeg($tile, $tilepath . $z . "/" . $x . "/" . $y . ".jpg");
		
			}
		}
	}
	
	echo "Fertig gerendert!";
	
	//imagejpeg($thumb, $path . basename($picture));
}





function makeTilesXY( $tilesize, $tilepath, $x, $y) {
		
	set_time_limit(0);
	
	for( $z = 0; file_exists($tilepath . ($z+1)) ; $z ++) {
		echo ($z+1) . "</br>";
		
		$stackedimage = imagecreatetruecolor($tilesize, $tilesize);
		
		imagecolortransparent($stackedimage, imagecolorallocatealpha($stackedimage, 0, 0, 0, 127));
		imagealphablending($stackedimage, false);
		imagesavealpha($stackedimage, true);
		imagefill($stackedimage, 0, 0, imagecolorallocatealpha($stackedimage, 0, 0, 0, 127));
		
		if (($x % 2) == 0) {
			if (($y % 2) == 0) {
				if (file_exists($tilepath . $z . "/" . $x . "/" . $y . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . $y . ".png");
				else
					$original = createNewBlankImage($tilesize);
				imagecopyresampled($stackedimage, $original, 0,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . $x . "/" . ($y+1) . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . ($y+1) . ".png");
				else
					$original = createNewBlankImage($tilesize);
				imagecopyresampled($stackedimage, $original, 0,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . ($x+1) . "/" . $y . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . ($x+1) . "/" . $y . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, $tilesize/2,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if(file_exists($tilepath . $z . "/" . ($x+1) . "/" . ($y+1) . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . ($x+1) . "/" . ($y+1) . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, $tilesize/2,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				$y = $y/2;
			}
			else if (($y % 2) == 1) {
				if (file_exists($tilepath . $z . "/" . $x . "/" . ($y-1) . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . ($y-1) . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, 0,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . $x . "/" . $y . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . $y . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, 0,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . ($x+1) . "/" . ($y-1) . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . ($x+1) . "/" . ($y-1) . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, $tilesize/2,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . ($x+1) . "/" . $y . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . ($x+1) . "/" . $y . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, $tilesize/2,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				$y = ($y-1)/2;
			}
			$x = $x/2;
		}
		else if (($x % 2) == 1) {
			if (($y % 2) == 0) {
				
				if (file_exists($tilepath . $z . "/" . ($x-1) . "/" . $y . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . ($x-1) . "/" . $y . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, 0,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . ($x-1) . "/" . ($y+1) . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . ($x-1) . "/" . ($y+1) . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, 0,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . $x . "/" . $y . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . $y . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, $tilesize/2,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . $x . "/" . ($y+1) . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . ($y+1) . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, $tilesize/2,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				$y = $y/2;
			}
			else if (($y % 2) == 1) {
				
				if (file_exists($tilepath . $z . "/" . ($x-1) . "/" . ($y-1) . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . ($x-1) . "/" . ($y-1) . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, 0,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . ($x-1) . "/" . $y . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . ($x-1) . "/" . $y . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, 0,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . $x . "/" . ($y-1) . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . ($y-1) . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, $tilesize/2,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				if (file_exists($tilepath . $z . "/" . $x . "/" . $y . ".png"))
					$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . $y . ".png");
				else
					$original = createNewBlankImage($tilesize);	
				imagecopyresampled($stackedimage, $original, $tilesize/2,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
				
				$y = ($y-1)/2;
			}
			$x = ($x-1)/2;
		}
		
		$tile = imagecreatetruecolor($tilesize, $tilesize);
		imagecolortransparent($tile, imagecolorallocatealpha($tile, 0, 0, 0, 127));
		imagealphablending($tile, false);
		imagesavealpha($tile, true);
		imagefill($tile, 0, 0, imagecolorallocatealpha($stackedimage, 0, 0, 0, 127));

		imagecopy($tile, $stackedimage, 0,0, 0,0, $tilesize, $tilesize);
		
		if (!file_exists($tilepath . ($z+1) . "/" . $x ))
			mkdir($tilepath . ($z+1) . "/" . $x );
		
		imagepng($tile, $tilepath . ($z+1) . "/" . $x . "/" . $y . ".png");

	}
	
	echo "Fertig gerendert!";
}



function createNewBlankImage($tilesize) {
	$original = imagecreatetruecolor($tilesize, $tilesize);
	imagealphablending($original, false);
	imagesavealpha($original, true);
	$trans_colour = imagecolorallocatealpha($original, 0, 0, 0, 127);
	imagecolortransparent($original, $trans_colour);
	imagefill($original, 0, 0, $trans_colour);
	return $original;
}




function makeTilesAll( $tilesize, $tilepath) {
		
	set_time_limit(0);
	
	for( $z = 0; file_exists($tilepath . ($z+1)) ; $z ++) {
		$maxZ = $z+1;
	}
	
	for( $z = 0; $z < $maxZ ; $z ++) {
		echo ($z+1) . "</br>";
		
		for( $x = 0; $x < pow(2, ($maxZ -$z)) ; $x +=2) {
			
			for( $y = 0; $y < pow(2, ($maxZ -$z)) ; $y +=2) {
		
				$stackedimage = imagecreatetruecolor($tilesize, $tilesize);
				   
				imagecolortransparent($stackedimage, imagecolorallocatealpha($stackedimage, 0, 0, 0, 127));
				imagealphablending($stackedimage, false);
				imagesavealpha($stackedimage, true);
				imagefill($stackedimage, 0, 0, imagecolorallocatealpha($stackedimage, 0, 0, 0, 127));
				
				if (($x % 2) == 0) {
					if (($y % 2) == 0) {
						if (file_exists($tilepath . $z . "/" . $x . "/" . $y . ".png"))
							$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . $y . ".png");
						else
							$original = createNewBlankImage($tilesize);	
						imagecopyresampled($stackedimage, $original, 0,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
						
						if (file_exists($tilepath . $z . "/" . $x . "/" . ($y+1) . ".png"))
							$original = imagecreatefrompng($tilepath . $z . "/" . $x . "/" . ($y+1) . ".png");
						else
							$original = createNewBlankImage($tilesize);	
						imagecopyresampled($stackedimage, $original, 0,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
						
						if (file_exists($tilepath . $z . "/" . ($x+1) . "/" . $y . ".png"))
							$original = imagecreatefrompng($tilepath . $z . "/" . ($x+1) . "/" . $y . ".png");
						else
							$original = createNewBlankImage($tilesize);	
						imagecopyresampled($stackedimage, $original, $tilesize/2,0,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
						
						if (file_exists($tilepath . $z . "/" . ($x+1) . "/" . ($y+1) . ".png"))
							$original = imagecreatefrompng($tilepath . $z . "/" . ($x+1) . "/" . ($y+1) . ".png");
						else
							$original = createNewBlankImage($tilesize);	
						imagecopyresampled($stackedimage, $original, $tilesize/2,$tilesize/2,0,0, $tilesize/2, $tilesize/2, $tilesize, $tilesize);
					}
				}
				
				$tile = imagecreatetruecolor($tilesize, $tilesize);
				imagecolortransparent($tile, imagecolorallocatealpha($tile, 0, 0, 0, 127));
				imagealphablending($tile, false);
				imagesavealpha($tile, true);
				imagefill($tile, 0, 0, imagecolorallocatealpha($stackedimage, 0, 0, 0, 127));
				
				imagecopy($tile, $stackedimage, 0,0, 0,0, $tilesize, $tilesize);
				
				if (!file_exists($tilepath . ($z+1) . "/" . ($x/2) ))
					mkdir($tilepath . ($z+1) . "/" . ($x/2) );
				imagepng($tile, $tilepath . ($z+1) . "/" . ($x/2) . "/" . ($y/2) . ".png");
			}
		}
	}
	
	echo "Fertig gerendert!";
}


function makeTilesAllBereich( $tilesize, $tilepath, $start, $stop) {
		
	set_time_limit(0);
	
	for( $x = $start; $x < $stop ; $x ++) {
		for( $y = $start; $y < $stop ; $y ++) {
			makeTilesXY_rev( $tilesize, $tilepath, $x, $y);
		}
	}
	
}


function checkOverlay($x, $y, $tilePath, $overlayPath){
	//x -> ordner
	//y -> dateiname
	//x-ordner erstellen falls nicht vorhanden
	$overlayExamplePath = $overlayPath."overlay.png";
	//falls overlay an neuer bildpos -> overlay entfernen
	$newPicturePath = $overlayPath."/0/".$x."/".$y.".png";
	if(file_exists($newPicturePath)){
		unlink($newPicturePath);
		makeTilesXY(256, $overlayPath, $x, $y);
	}
	//umliegende Felder kontrollieren
	//gibts die ordner schon
	if(!file_exists($overlayPath . "/0/" . ($x-1))){
		mkdir($overlayPath . "/0/" . ($x-1));
	}
	if(!file_exists($overlayPath . "/0/" . $x)){
		mkdir($overlayPath . "/0/" . $x);
	}
	if(!file_exists($overlayPath . "/0/" . ($x+1))){
		mkdir($overlayPath . "/0/" . ($x+1));
	}
	//overlay felder befüllen falls noch nicht mit bild befüllt
	//Spalte links vom Bild
	for( $z = 0; file_exists($tilePath . ($z+1)) ; $z ++) {
		$max_size = pow(2,$z+1);
	}
	
	if($x>0){
		if($y>0){
			/*
			if(!file_exists($tilePath."/0/".($x-1)."/".($y-1).".png")){
				copy($overlayExamplePath,$overlayPath."/0/".($x-1)."/".($y-1).".png");
				makeTilesXY(256, $overlayPath, ($x-1), ($y-1));
			}
			*/
			if(!file_exists($tilePath."/0/".$x."/".($y-1).".png")){
				copy($overlayExamplePath,$overlayPath."/0/".$x."/".($y-1).".png");
				makeTilesXY(256, $overlayPath, ($x), ($y-1));
			}
		}
		if(!file_exists($tilePath."/0/".($x-1)."/".$y.".png")){
			copy($overlayExamplePath,$overlayPath."/0/".($x-1)."/".$y.".png");
			makeTilesXY(256, $overlayPath, ($x-1), ($y));
		}
		if($y < ($max_size-2)){
			/*
			if(!file_exists($tilePath."/0/".($x-1)."/".($y+1).".png")){
				copy($overlayExamplePath,$overlayPath."/0/".($x-1)."/".($y+1).".png");
				makeTilesXY(256, $overlayPath, ($x-1), ($y+1));
			}
			*/
			if(!file_exists($tilePath."/0/".$x."/".($y+1).".png")){
				copy($overlayExamplePath,$overlayPath."/0/".$x."/".($y+1).".png");
				makeTilesXY(256, $overlayPath, ($x), ($y+1));
			}
		}
		if($x < ($max_size-2)){
			if($y>0){
				/*
				if(!file_exists($tilePath."/0/".($x+1)."/".($y-1).".png")){
				copy($overlayExamplePath,$overlayPath."/0/".($x+1)."/".($y-1).".png");
				makeTilesXY(256, $overlayPath, ($x+1), ($y-1));
				}
				*/
			}
			if(!file_exists($tilePath."/0/".($x+1)."/".$y.".png")){
				copy($overlayExamplePath,$overlayPath."/0/".($x+1)."/".$y.".png");
				makeTilesXY(256, $overlayPath, ($x+1), ($y));
			}
			if($y < ($max_size-2)){
				/*
				if(!file_exists($tilePath."/0/".($x+1)."/".($y+1).".png")){
					copy($overlayExamplePath,$overlayPath."/0/".($x+1)."/".($y+1).".png");
					makeTilesXY(256, $overlayPath, ($x+1), ($y+1));
				}
				*/
			}
		}
	}
}


function getRandomOverlay($overlayPath) {
	if(!file_exists($overlayPath . "/0/")){
		return -1;
	}
	else {
		return 0;	
	}
}



function isPNG($file) {
	$filename = basename($file);
	
	//$endung = substr($filename, -3); 	// nur die letzten drei Zeichen
	$endung = substr($filename, strrpos($filename, ".")+1);	// ab dem letzten Punkt
	$endung = strtolower($endung);		// in Kleinbuchstaben umwandeln
	
	if ($endung == "png")
		return true;
	else return false;
}
?>