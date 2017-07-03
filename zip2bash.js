#!/usr/bin/env node

/**************************************************************************************
*
* Command line URL pic zip decompressor. Use it like this:
*
* echo "/bash.html?zip=eDdyMjV4OGUxeDdyNnc4cjExeDhlMXg3cjd3NnIxMng4ZTF4N3I4dzRyMTN4OGUxeDdyOHc0cjEzeDhlMXg3cjh3NHIxM3g4ZTF4N3I4dzRyMTN4OGUxeDdyOHc0cjEzeDhlMXg3cjh3NHIxM3g4ZTF4N3I4dzRyMTN4OGUxeDdyOHc0cjEzeDhlMXg3cjh3NHIxM3g4ZTF4N3I4dzRyMTN4OGUxeDdyOHc0cjEzeDhlMXg3cjh3NHIxM3g4ZTF4N3I4dzRyMTN4OGUxeDdyOHc0cjEzeDhlMXg3cjh3NHIxM3g4ZTF4N3I4dzRyN3cxcjV4OGUxeDdyOHc0cjZ3MnI1eDhlMXg3cjd3MTNyNXg4ZTF4N3I2dzE0cjV4OGUxeDdyMjV4OA==" | xargs ./zip2bash.js | bash
*
**************************************************************************************/

//base64 parse
function atob(str) {
	return new Buffer(str, 'base64').toString('binary');
}

//Decompress the zip in the querystring
var decompress = function(url) {
	var rqs = /[?|&]zip=([^&]*)/;
	var rsp = /([a-z]\d*)/;
	var exe = rqs.exec(url);
	var pic = [];
	if (exe && exe.length>1) {
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

//parse and return the image script
var parse = function(url) {

	var img = decompress(url).join(' ');

	return `
		#Background Colors
		E=$(tput sgr0);    R=$(tput setab 1); G=$(tput setab 2); Y=$(tput setab 3);
		B=$(tput setab 4); M=$(tput setab 5); C=$(tput setab 6); W=$(tput setab 7);
		function e() { echo -e "$E"; }
		function x() { echo -n "$E  "; }
		function r() { echo -n "$R  "; }
		function g() { echo -n "$G  "; }
		function y() { echo -n "$Y  "; }
		function b() { echo -n "$B  "; }
		function m() { echo -n "$M  "; }
		function c() { echo -n "$C  "; }
		function w() { echo -n "$W  "; }

		#putpixels
		function u() { 
		    h="$*";o=$\{h:0:1};v=$\{h:1}; 
		    for i in \`seq $v\` 
		    do 
		        $o;
		    done 
		}

		img="${img}"

		for n in $img
		do
		    u $n
		done
		e;
		exit 0;
	`;
};

console.log(parse(process.argv[2]));