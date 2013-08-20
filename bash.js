var bash=(function(){
	
	//Initialize table grid	
	var grid = function(w,h) {
		var $d = $("#drawing");
		w = w>>1;
		for(var y=0;y<h;y++) {
			$r = $("<tr></tr>");
			for(var x=0;x<w;x++) {
				$r.append("<td class=x>&nbsp;&nbsp;</td>");
			}
			$d.append($r);
		}
	}
	
	//Decompress the zip in the querystring
	var decompress = function() {
		var rqs = /[?|&]zip=([^&]*)/;
		var rsp = /([a-z]\d*)/;
		var exe = rqs.exec(location.href);
		var pic = [];
		if (exe && exe.length>1 && window.atob) {
			var zip = decodeURIComponent(exe[1]);
			var tmp = [];
			try { 
				zip = atob(zip);
				tmp = zip.split(rsp);
				for(var i=0,l=tmp.length;i<l;i++) if(tmp[i].length) pic.push(tmp[i]);
			} catch (ex) {}
		}
		return pic;
	};
	
	//Naively Compress the image
	var compress = function(pic){
		var zip = [];
		if(pic && pic instanceof Array) {
			var lst = "";
			var num = 0;
			var tmp = "";
			for(var i=0,l=pic.length;i<l;i++) {						
				if (i>0 && pic[i]!==lst) {
					zip.push(lst + num);
					num = 0;		 
				}
				num++;
				lst = pic[i];
			}
		}
		return zip;
	}
	
	//Gets the coded source for the image
	var resp = /\s/g;
	var path = location.pathname + '?zip=';
	var source = function() {
		var $d = $("#drawing");
		var pic = [];
		var zip = "";
		$d.find("tr").each(function(){
			$(this).find("td").each(function(){
				pic.push($(this)[0].className);
			});
			pic.push('e');
		});
		zip = compress(pic);
		$("#output").text(zip.join(' ')+'"');
		if(window.btoa) $("#link").attr("href",path + btoa(zip.join('')));
		return pic;
	}

	
	//Draws a pic to the grid
	var draw = function(pic) {
		if (pic && pic instanceof Array) { 
			var rcl = /([a-z])(\d*)/;
			var pix = [];
			var num = 0;
			var col = "";
			var $r = $("#drawing tr:first");
			var $c = $r.find("td:first");
			for(var i=0,l=pic.length;i<l;i++) {
				pix = rcl.exec(pic[i]);
				if(pix && pix.length>2) {
					col=pix[1];
					num=parseInt(pix[2]);
					if(col === 'e') {
						$r = $r.next("tr");
						$c = $r.find("td:first");
					} else {
						for(var j=0;j<num;j++) {
							$c.removeClass().addClass(col);
							$c = $c.next("td");
						}
					}
				}
			}
		}
	};
		
	//Initialize draw events
	var init = function() {
		grid(80,23);
		draw(decompress());
		source();
		
		var color = "x";
		var active = false;	
		
		var tick  = function(e,f){ setTimeout(f,0); e&&e.preventDefault&&e.preventDefault(); e&&e.stopPropagation&&e.stopPropagation(); return false; };
		var start = function(e)  { active=true;  $(this).removeClass().addClass(color);  return tick(e,source); };	
		var move  = function(e)  { if(active)    $(this).removeClass().addClass(color);  return tick(e,source); };
		var stop  = function(e)  { active=false; $(this).removeClass().addClass(color);  return tick(e,source); };
		var out   = function(e)  { active=false; e.preventDefault(); e.stopPropagation(); return false; };
		var swatch= function(e)  { $("#palette li").removeClass(); color=$(this).addClass("active").attr("data-swatch"); }
		
		$("#drawing")
			.on("mousedown","td",start)
			.on("mousemove","td",move)
			.on("mouseup","td",stop)
			.on("mousout",out);
		
		$("#palette").on("click","li",swatch);
		
		$("#clear").attr("href",location.pathname);
		
		$('#palette li[data-swatch="b"]').trigger("click");
		
	}
	
	init();
	

})();