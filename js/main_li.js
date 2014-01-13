function generateImagesList(){
	var images = LOADER.loadImages();
	
	for(var i in images){
		//console.log(images[i].name);
		
		var li = '<li><a href="figures.php?imageName=' + images[i].name + '&imagePath=' + images[i].folder + '&imageWidth=' + images[i].width + '&imageHeight=' + images[i].height;
		var name = '';
		if (images[i].site != ""){
			name += images[i].site;
			li += '&site=' + images[i].site;
		}
		if (images[i].rock != ""){
			name += ' Rock ' + images[i].rock;
			li += '&rock=' + images[i].rock;			
		}
		if (images[i].section != ""){
			name += ' Section ' + images[i].section;
			li += '&section=' + images[i].section;
		}
		li += '">';
		li += name;
		li += '</a>';
		if (images[i].nbFigures != "")
			li += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + images[i].nbFigures + ' figures';
		li += '</li>';
		
		$('#imageList').append(li);
	}
}