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
?>


<div id="infobox">
	<div id="infobox_foreground">
		<div id="infobox_content">
			
			<p id="begin"><b>AnnoTool</b> is a Multiuser Annotation Webtool for large 2D graphics.<br/>
			Figures can be selected utilizing several state-of-the-art selection tools, and annotated with class labels from multiple typologies.</p>
			
			<p>The workflow consists of 4 steps:</p>
			<ol>
			<p><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#choosetracing').offset().top}, 1000);return false;">Choose a tracing:</a> describes tracing selection</p>
			<p><li><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#zoominto').offset().top}, 1000);return false;">Zoom into image:</a> describes zoom tools</li></p>
			<p><li><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#selectfigure').offset().top}, 1000);return false;">Select figure:</a> describes selection tools</li></p>
			<p><li><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#classify').offset().top}, 1000);return false;">Classify figure:</a> describes classification tools</li></p>
			<p><li><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#savedata').offset().top}, 1000);return false;">Save annotation</a></li></p>
			<p><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#grouping').offset().top}, 1000);return false;">Group figures:</a> describes figure grouping</p>
			</ol>
			<p><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#error').offset().top}, 1000);return false;">What to do when an error occurs?</a></p>
			<p><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#credits').offset().top}, 1000);return false;">CREDITS</a></p>
			<p><a href="#" onclick="$('#infobox_content').animate({scrollTop: $('#citation').offset().top}, 1000);return false;">CITATION</a></p>
			<p>The development of AnnoTool has received funding from the EC FP7 project <a href="http://3d-pitoti.eu">3D-PITOTI</a> (ICT-2011-600545).</p>
			<ol>
			<h2 id="choosetracing">Choose a tracing:</h2>
				<p>
				<img src="./img/choose_tracing.png"/>
				Click on a site to get a list of all available tracings.<br/>
				Click on a tracing to start the annotation process.
				</p>
			
			<h2 id="zoominto"><li>Zoom into image:</li></h2>
				<p>
				<img src="./img/zoom_controls.png"/>
				Use mousewheel or zoom-controls (buttons/slider) to zoom to maximum zoomlevel.<br/>
				Only at maximum zoomlevel a selection can be done.
				</p>
			
			
			<h2 id="selectfigure"><li>Select figure:</li></h2>

				<div style="float:right; margin-left: 1em;">
					<p><i>Draw selection area:</i></p> 
					<img src="./img/polygon_selection.png" /><br/>
					<p><i>Choose color to select:</i></p>
					<img src="./img/polygon_selection_color.png" /><br/>
					<p><i>Selection is colored bordered:</i></p>
					<img src="./img/polygon_selection_selected.png" />
				</div>
				
				<p>
				<img src="./img/selection_tools.png"/>
				Select one single figure with the help of the selection tools.<br/><br/>
				Once a selection is started, zooming and dragging of the canvas is restricted until selection is finished or cancelled.
				</p>
				
				<ul style="list-style: none;">
				<p><li><div class="tool" title="Move canvas tool" style="background-position: 3px -98px;"></div>
				<b>Move tool</b>
				<p>Click and drag the canvas around.</p>
				<p>Select an already annotated figure to load its classification data.<br/>
				The figure itself and its classification data can be changed and saved again, as well as deleted from the database.</p>
				</li></p>
				
				<p><li><div class="tool" title="Rectangle selection tool" style="background-position: -46px 5px;"></div>
				<b>Rectangle selection tool</b>
				<p>Drag a rectangle around a figure and then choose the color of the pixels to select.</p>
				<p><b><i>SHIFT + click</i></b> when selecting color to add new selection to current selection.<br/>
				<b><i>ALT + click</i></b> when selecting color to subtract new selection from current selection.</p>
				<p><b><i>Right-click and drag</i></b>, to move the canvas around, as long as the selection was not started.</p>
				<p><b><i>ESC</i></b> to cancel the tool.</p>
				</li></p>
				
				<p><li><div class="tool" title="Polygon selection tool" style="background-position: -398px -47px;"></div>
				<b>Polygon selection tool</b>
				<p>Draw a polygon around a figure (click to add points) and then choose the color of the pixels to select.</p>
				<p><b><i>SHIFT + click</i></b> when selecting color to add new selection to current selection.<br/>
				<b><i>ALT + click</i></b> when selecting color to subtract new selection from current selection.</p>
				<p><b><i>Right-click and drag</i></b>, to move the canvas around, as long as the selection was not started.</p>
				<p><b><i>ESC</i></b> to cancel the tool.</p>
				<p><b><i>Backspace</i></b> to delete last point of the polygon.</p>
				</li></p>
				
				<p><li><div class="tool" title="Magic wand selection tool" style="background-position: -149px -48px;"></div>
				<b>Magic wand selection tool</b>
				<p>Click on a colored pixel, all neighbouring pixels with the same color will be selected.</p>
				<p><b><i>SHIFT + click</i></b> to add new selection to current selection.<br/>
				<b><i>ALT + click</i></b> to subtract new selection from current selection.</p>
				<p><b><i>Right-click and drag</i></b>, to move the canvas around, as long as the selection was not started.</p>
				<p><b><i>ESC</i></b> to cancel the tool.</p>
				</li></p>
				
				<p><li><img src="./img/selection_option_filiforms.png" />
				<b>Filiform selection option</b>
				<p>Check this box before the color selection in any of the three tools above to use a different sensitivity of the tool. This is especially helpful for the selection of small lines (filiforms).</p>
				</li></p>
				</ul>
				
			<h2 id="classify"><li>Classify figure:</li></h2>
				Use the <b>dropdowns</b> to select the appropriate classes.
				<p>
				<img src="./img/classification_dropdowns.png"/>
				Complete all typologies.
								
				<div style="clear:left"></div>
				Choose a <b>confidence value</b> &lt; 1 to add a second classification set for one typology.
				<p>
				<img src="./img/classification_slider.png"/>
				<br/>
				<div class="tool" title="Rectangle selection tool" style="background-position: 5px -45px;"></div>
				Add a classification-set.<br/><br/>
				<div class="tool" title="Rectangle selection tool" style="background-position: -95px -45px;"></div>
				Remove a classification-set.
				</p>
			
				<div style="clear:left"></div>
				Fill in <b>Superimposition</b>, <b>Figure incomplete</b>, <b>Figure damaged</b> and <b>Tracing incomplete</b>-forms.
				<p>
				<img src="./img/classification_superimposition.png"/>
				<p><b>Superimposition:</b> Yes, when the figure contains overlaps with other figures. Otherwise, no.</p>
				<p><b>Figure incomplete:</b> Yes, when the figure was not finished by the author. Otherwise, no.</p>
				<p><b>Figure damaged:</b> Yes, when the figure is damaged due to erosion or other external factors. Otherwise, no.</p>
				<p><b>Tracing incomplete:</b> Yes, when parts of the figure are missing due to incompleteness of the tracing. Otherwise, no.</p>
				</p>
				<table style="clear:both;width:100%;text-align:center;"><tr>
				<td><i>Example for superimposition:<br/><b>Interpolation of missing areas!</b></i></td>
				<td><i>Example for incomplete figure:</i></td>
				<td><i>Example for damaged figure:</i></td>
				<td><i>Example for incomplete tracing:</i></td>
				</tr><tr>
				<td><img src="./img/superimposition.png"/></td>
				<td><img src="./img/figure_incomplete.png"/></td>
				<td><img src="./img/figure_damaged.png"/></td>
				<td><img src="./img/tracing_incomplete.png"/></td>
				</tr></table>
				
			<h2 id="savedata"><li>Save annotation:</li></h2>
				<p>
				<img src="./img/save_classification.png"/>
				Once the classification is completed and all forms are filled, the figure and classification data can be saved to the database.
				</p>
				<p style="clear:left;">
				<img src="./img/saving_success.png"/>
				A success-message is shown, when the figure and classification data were saved successfully.
				</p>
			
			<h2 id="grouping">Group figures:</h2>
				<p style="clear:left;">
				<img src="./img/group_highlight.png"/>
				<p>To group figures, each of them has to be annotated first.<br/>
				Each figure can be in only one group.<br/>
				Groups are visualized with a light gray bounding box spanning all contained figures.<br/>
				When hovering over it with the mouse cursor, the bounding box of the group is highlighted in turquoise.</p>
				</p>
				<p style="clear:left;">
				<img src="./img/group_selected.png"/>
				<p>Click on the bounding box of a group the select it.<br/>
				The bounding boxes of all figures belonging to that group are highlighted in magenta.<br/>
				You can then add and remove figures to/from an existing group.<br/>
				</p>
				<p style="clear:left;">
				<img src="./img/group_update_delete.png"/>
				Click <i>"update group"</i> to save changes, or <i>"delete group"</i> to remove it from the database.</p>
				</p>
				<p style="clear:left;">
				<img src="./img/group_new.png"/>
				<p>Click on the first figure you want to be in the group. The mask and annotation data for this figure is loaded.</p>
				<p><b><i>SHIFT + click</i></b> on another figure to add it to the group.<br/>
				<b><i>ALT + click</i></b> on a grouped figure to subtract it from the group.</p>
				<p>When adding a figure that is already member of a group, it will be removed from the old group.</p> 
				</p>
				<p style="clear:left;">
				<img src="./img/group_create.png"/>
				<p>Click <i>"create group"</i> to save the new group to the database.</p>			
				</p>
					
			</ol>
			
			<h2 id="error">What to do when an error occurs?</h2>
				<p><p>
				<img src="./img/error_classificator.png"/>
				An error might occur when loading data from or saving data to the database.<br/>
				An error-message will be shown.
				</p>
				<br/>
				<p>If you observe an unexpected behaviour of the webtool without an error-message, you might want to open the developer console of Google Chrome (Alt+Cmd+i on OSX, Ctrl+Shift+i on Windows), click on <i>Console</i> and look for error-messages there:<br/><br/>
				<img src="./img/error_console.png"/></p>
				
				</p>
				

			<h2 id="credits">CREDITS</h2>
			<p>
				<p>AnnoTool was developed in the 3D-PITOTI project (<a href="http://www.3d-pitoti.eu">http://www.3d-pitoti.eu</a>) for the annotation of large tracings of prehistoric rock art figures. The development of AnnoTool has received funding from the EC FP7 project 3D-PITOTI (ICT-2011-600545).</p>
				<p>It is based on <a href="https://developer.mozilla.org/en-US/demos/detail/minipaint">Mozilla miniPaint</a>, and <a href="http://www.akademy.co.uk/software/canvaszoom/canvaszoom.php">CanvasZoom</a>.</p>
				<p><b>Libraries used:</b></p>
				<p>	<ul><li><a href="https://code.google.com/p/crypto-js/">CryptoJS</a></li>
					<li><a href="https://jquery.com">jQuery</a></li>
					<li><a href="http://mrcoles.com/blog/making-images-byte-by-byte-javascript/">bitmap.js</a></li></ul>
				</p>
				<p>(C) 2012-2015 Media Computing Research Group <a href="http://mc.fhstp.ac.at">http://mc.fhstp.ac.at</a><br/>
				Institute for Creative \Media/ Technologies (IC\M/T)<br/>
				St. Poelten, University of Applied Sciences (FHSTP) <a href="http://www.fhstp.ac.at">http://www.fhstp.ac.at</a><br/>
				</p>

				<p>Developed by: <ul><li>Ewald Wieser</li>
						<li>Markus Seidl</li>
						<li>Matthias Zeppelzauer</li></ul></p>

				<p>Released under GPLv3 (see <a href="LICENSE.txt">LICENSE.txt</a>)</p>
				<p>For more information, see <a href="README.md">README.md</a></p>
			</p>

			<h2 id="citation">CITATION</h2>
			<p>
				<p>If you use the AnnoTool and if appropriate, please cite the following article in which the tool is explained in detail:</p>
				<p>Seidl M., Wieser E., Alexander C., 2015, Automated classification of petroglyphs, <em>Digital Applications in Archaeology and Cultural Heritage</em> 3, 2015, pp.196-212. <a href="http://dx.doi.org/10.1016/j.daach.2015.03.001">http://dx.doi.org/10.1016/j.daach.2015.03.001</a></p>
		</div>
		<a title="Close infobox" style="background-position: -95px -45px;" class="" onclick="$('#infobox_content').animate({scrollTop: 0}, 0);$('#infobox').hide();return false;" href="#"></a>
	</div>
</div>