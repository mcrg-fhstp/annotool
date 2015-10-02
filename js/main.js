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


 function generateImagesList(){
	var images = LOADER.loadImages();
	
	if( Object.prototype.toString.call( images ) === '[object Array]' ){
		var header = '';
		var table = '<table>';
		
		for(var i in images){
			//console.log(images[i].name);
			
			if (header != images[i].site){
				if (header != ''){
					$('#imageList').append(table);
					table = '<table>';
				}
				$('#imageList').append('<h4>'+images[i].site+'</h4>');
				//$('#imageList').append('<table>');
				header = images[i].site;
			}
			
			var tr = '<tr><td><a href="figures.php?imageName=' + images[i].name + '">';
			var name = '';
			if (images[i].site != ""){
				name += images[i].site;
			}
			if (images[i].rock != ""){
				name += ' Rock ' + images[i].rock;
			}
			if (images[i].section != ""){
				name += ' Section ' + images[i].section;
			}
			tr += name;
			tr += '</a></td>';
			if (images[i].nbFigures != "")
				tr += '<td>' + images[i].nbFigures + ' figures annotated</td>';
			if (images[i].nbGroups != "")
				tr += '<td>' + images[i].nbGroups + ' groups</td>';
			tr += '</tr>';
			
			//$('#imageList').append(tr);
			table += tr;
		}
		
		$('#imageList').append(table);
		
		
		$('#imageList table').css('display','none');
		//$('#imageList table').first().css('display','none');
	
		
		$('#imageList').find('h4').click(function(){
		    $(this).next().toggle();
		    $("#imageList table").not($(this).next()).hide();
		});
	}
	else{
		$('#responseBox').text(images);
		$('#responseBox').addClass('error');
		$('#responseBox').show();
	}
}