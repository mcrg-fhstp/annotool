function generateImagesList(){
	var images = LOADER.loadImages();
	
	var table = '<table>';
	
	for(var i in images){
		//console.log(images[i].name);
		
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
		tr += '</tr>';
		
		table += tr;
	}
	
	table += '</table>';
	
	$('#imageList').append(table);
}