function generateImagesList(){
	var images = LOADER.loadImages();
	
	var table = '<table>';
	
	for(var i in images){
		//console.log(images[i].name);
		
		var tr = '<tr><td><a href="figures.php?imageName=' + images[i].name + '&imagePath=' + images[i].folder + '&imageWidth=' + images[i].width + '&imageHeight=' + images[i].height;
		var name = '';
		if (images[i].site != ""){
			name += images[i].site;
			tr += '&site=' + images[i].site;
		}
		if (images[i].rock != ""){
			name += ' Rock ' + images[i].rock;
			tr += '&rock=' + images[i].rock;			
		}
		if (images[i].section != ""){
			name += ' Section ' + images[i].section;
			tr += '&section=' + images[i].section;
		}
		tr += '">';
		tr += name;
		tr += '</a></td>';
		if (images[i].nbFigures != "")
			tr += '<td>' + images[i].nbFigures + ' figures annotated</td>';
		tr += '</tr>';
		
		table += tr;
	}
	
	table += '</table>';
	
	$('#imageList').append(table);
}