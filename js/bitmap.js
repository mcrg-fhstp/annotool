/*!
 * Generate Bitmap Data URL
 * http://mrcoles.com/low-res-paint/
 *
 * Copyright 2010, Peter Coles
 * Licensed under the MIT licenses.
 * http://mrcoles.com/media/mit-license.txt
 *
 * Date: Tue Oct 26 00:00:00 2010 -0500
 */

/*
 * Code to generate Bitmap images (using data urls) from rows of RGB arrays.
 * Specifically for use with http://mrcoles.com/low-rest-paint/
 *
 * Research:
 *
 * RFC 2397 data URL
 * http://www.xs4all.nl/~wrb/Articles/Article_IMG_RFC2397_P1_01.htm
 *
 * BMP file Format
 * http://en.wikipedia.org/wiki/BMP_file_format#Example_of_a_2.C3.972_Pixel.2C_24-Bit_Bitmap_.28Windows_V3_DIB.29
 *
 * BMP Notes
 *
 * - Integer values are little-endian, including RGB pixels, e.g., (255, 0, 0) -> \x00\x00\xFF
 * - Bitmap data starts at lower left (and reads across rows)
 * - In the BMP data, padding bytes are inserted in order to keep the lines of data in multiples of four,
 *   e.g., a 24-bit bitmap with width 1 would have 3 bytes of data per row (R, G, B) + 1 byte of padding
 */

(function() {

    function _asLittleEndianHex(value, bytes) {
        // Convert value into little endian hex bytes
        // value - the number as a decimal integer (representing bytes)
        // bytes - the number of bytes that this value takes up in a string

        // Example:
        // _asLittleEndianHex(2835, 4)
        // > '\x13\x0b\x00\x00'

        var result = [];

        for (; bytes>0; bytes--) {
            result.push(String.fromCharCode(value & 255));
            value >>= 8;
        }

        return result.join('');
    }

    function _collapseData(mask, row_padding, boundingBox) {
        // Convert rows of RGB arrays into BMP data
        var i,
            //rows_len = rows.length,
            j,
            //pixels_len = rows_len ? rows[0].length : 0,
            //pixel,
            padding = '',
            result = [];

        for (; row_padding > 0; row_padding--) {
            padding += '\x00';
        }


        for(var i=boundingBox[1][1]; i >= boundingBox[0][1]; i--){  // Ymax -> Ymin
			for(var j=boundingBox[0][0]; j < boundingBox[1][0]; j+=8){	// Xmin -> Xmax		// bug corrected: < instead <= !
				var byte = 0;
				for (var k=0; k<8; k++){
					byte = byte << 1;
					if(mask[j+k] == undefined || mask[j+k][i] == undefined || mask[j+k][i] == false){
						//byte = byte & 127;  // & 01111111
					}
					else
						byte = byte | 1;  // | 00000001
				}
				result.push(String.fromCharCode(byte));
			}		
			result.push(padding);
		}
/*
        for (i=0; i<rows_len; i++) {
            for (j=0; j<pixels_len; j++) {
                pixel = rows[i][j];
                result.push(String.fromCharCode(pixel[2]) +  // b
                            String.fromCharCode(pixel[1]) +  // g
                            String.fromCharCode(pixel[0]));  // r
            }
            result.push(padding);
        }
*/
        return result.join('');
    }
    
    
    
    function _uncollapseData(datastring, row_padding, boundingBox){    
	    var mask = [],
	    	x = 0,
	    	y = 0,
	    	width = boundingBox.x2 - boundingBox.x1;
	        
	    for(var i = 0; i< datastring.length; i++){
		    var byte = datastring.charCodeAt(i);
		    for (var k=0; k<8; k++){
				if ((byte & 128) > 0){
					if (mask[boundingBox.x1 + x] == undefined)
						mask[boundingBox.x1 + x] = [];
					mask[boundingBox.x1 + x][boundingBox.y2 - y] = true;	// DON'T KNOW why y is reversed?
				} 
			    // shift left
				byte = byte << 1;
				x++;
				// end of line
				if (x >= width){	// bug corrected: >= instead > !
					x = 0;
					y++;
					i += row_padding;
					break;
				}
			}
	    }
	    return mask;
    }



    window.generateOneBitBitmapDataURL = function(mask, boundingBox) {
        // Expects rows starting in bottom left
        // formatted like this: [[[255, 0, 0], [255, 255, 0], ...], ...]
        // which represents: [[red, yellow, ...], ...]

        if (!window.btoa) {
            alert('Oh no, your browser does not support base64 encoding - window.btoa()!!');
            return false;
        }

        var height = boundingBox[1][1] - boundingBox[0][1],                                // the number of rows
            width = boundingBox[1][0] - boundingBox[0][0],                 // the number of columns per row
            row_padding = (4 - Math.ceil(width/8)  % 4) % 4,             // pad each row to a multiple of 4 bytes
            num_data_bytes = (Math.ceil(width/8) + row_padding) * height, // size in bytes of BMP data
            num_file_bytes = 62 + num_data_bytes,                // full header size (offset) + size of data
            file;

        height = _asLittleEndianHex(height, 4);
        width = _asLittleEndianHex(width, 4);
        num_data_bytes = _asLittleEndianHex(num_data_bytes, 4);
        num_file_bytes = _asLittleEndianHex(num_file_bytes, 4);

        // these are the actual bytes of the file...

        file = ('BM' +               // "Magic Number"
                num_file_bytes +     // size of the file (bytes)*
                '\x00\x00' +         // reserved
                '\x00\x00' +         // reserved
                '\x3e\x00\x00\x00' + // offset of where BMP data lives (62 bytes)
                '\x28\x00\x00\x00' + // number of remaining bytes in header from here (40 bytes)
                width +              // the width of the bitmap in pixels*
                height +             // the height of the bitmap in pixels*
                '\x01\x00' +         // the number of color planes (1)
                '\x01\x00' +         // 1 bit / pixel
                '\x00\x00\x00\x00' + // No compression (0)
                num_data_bytes +     // size of the BMP data (bytes)*
                '\x13\x0B\x00\x00' + // 2835 pixels/meter - horizontal resolution
                '\x13\x0B\x00\x00' + // 2835 pixels/meter - the vertical resolution
                '\x00\x00\x00\x00' + // Number of colors in the palette
                '\x00\x00\x00\x00' + // 0 important colors (means all colors are important)
                '\xff\xff\xff\x00' + // white
                '\x00\x00\x00\x00' + // black
                _collapseData(mask, row_padding, boundingBox)
               );

        return 'data:image/bmp;base64,' + btoa(file);
    };
    
    
    
    
    window.disassembleOneBitBitmap = function(maskBase64, boundingBox){
    
    	if (!window.atob) {
            alert('Oh no, your browser does not support base64 encoding - window.atob()!!');
            return false;
        }
        
        var height = boundingBox.y2 - boundingBox.y1,                                // the number of rows
            width = boundingBox.x2 - boundingBox.x1,                 // the number of columns per row
            row_padding = (4 - Math.ceil(width/8)  % 4) % 4,             // pad each row to a multiple of 4 bytes
            num_data_bytes = (Math.ceil(width/8) + row_padding) * height, // size in bytes of BMP data
            num_file_bytes = 62 + num_data_bytes,                // full header size (offset) + size of data
            num_header_bytes = 62;
		
		//bugfix for broken segmentation masks caused by interrupted upload	
		try{
		    // split 'data:image/bmp;base64,'
		    var array = maskBase64.split(",");
		    // base64 decode
		    var file = atob(array[1]);
		    // split header
		    var data = file.substr(num_header_bytes);
		    
		    var mask = _uncollapseData(data, row_padding, boundingBox);
		    return mask;
	    }
	    catch(e){
		    console.error('AnnoTool: error decoding segmentation mask');
		    return [];
		}
    }

})();







function generateBitmap (mask, boundingBox) {
        /* test image * /
        rows = [
            [[255, 0, 0], [255, 255, 255]],
            [[0, 0, 255], [0, 255,0]]
        ];
        /* */

        img = document.createElement('img');
        src = window.generateOneBitBitmapDataURL(mask, boundingBox);
        img.src = src;
        img.alt = 'If you can read this, your browser probably doesn\'t support the data URL scheme format! Oh no!';
        img.title = 'You generated an image, great job! To save it, drag it to your Desktop or right click and select save as.';
        img_parent = document.getElementById('img');
        if (img_parent === null) {
            img_parent = document.createElement('div');
            img_parent.id = 'img';
            document.body.appendChild(img_parent);
        }
       
        img_parent.appendChild(img);
        return false;
    }    
