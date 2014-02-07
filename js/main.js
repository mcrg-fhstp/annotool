function generateImagesList(){
	var images = LOADER.loadImages();
	
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