/* Called to create a short code for the short link for Open Street Map */
function makeShortCode(lat, lon, zoom) {
	var char_array = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_~";
	var x = Math.round((lon + 180.0) * ((1 << 30) / 90.0));
	var y = Math.round((lat + 90.0) * ((1 << 30) / 45.0));
	// JavaScript only has to keep 32 bits of bitwise operators, so this has to be
	// done in two parts. each of the parts c1/c2 has 30 bits of the total in it
	// and drops the last 4 bits of the full 64 bit Morton code.
	var str = "";
	var c1 = interlace(x >>> 17, y >>> 17), c2 = interlace((x >>> 2) & 0x7fff, (y >>> 2) & 0x7fff);
	for (var i = 0; i < Math.ceil((zoom + 8) / 3.0) && i < 5; ++i) {
		digit = (c1 >> (24 - 6 * i)) & 0x3f;
		str += char_array.charAt(digit);
	}
	for (var i = 5; i < Math.ceil((zoom + 8) / 3.0); ++i) {
		digit = (c2 >> (24 - 6 * (i - 5))) & 0x3f;
		str += char_array.charAt(digit);
	}
	for (var i = 0; i < ((zoom + 8) % 3); ++i) {
		str += "-";
	}
	return str;
}
/* Called to interlace the bits in x and y, making a Morton code */
function interlace(x, y) {
	x = (x | (x << 8)) & 0x00ff00ff;
	x = (x | (x << 4)) & 0x0f0f0f0f;
	x = (x | (x << 2)) & 0x33333333;
	x = (x | (x << 1)) & 0x55555555;
	y = (y | (y << 8)) & 0x00ff00ff;
	y = (y | (y << 4)) & 0x0f0f0f0f;
	y = (y | (y << 2)) & 0x33333333;
	y = (y | (y << 1)) & 0x55555555;
	return (x << 1) | y;
}
function byId(id) {
	return document.getElementById(id);
}
function encode(arg) {
	return encodeURIComponent(arg);
}
function decode(arg) {
	return decodeURIComponent(arg);
}
/** get parameter=value pairs from location.search */
function getParms() {
	let result = {};
	let search = decode(decode(window.location.search));
	if (search.length > 0) {
		if (search.charAt(0) == "?")
			search = search.substr(1);  // skip leading ?
		let parms = search.split("&");  // 
		for (let i in parms) {  // scan the & delimited parameters
			if (parms[i].length > 0) {
				let parts = parms[i].split("=");  // split name = value
				if (parts[0].length > 0)  // if a name is present, give it a value if present, else "?"
					result[parts[0]] = parts.length == 1 ? "?" : parts[1] == "" ? "?" : decode(parts[1]);
			}
		}
	}
	return result;
}
/** calculate distance between two points given their latitudes and longitudes */
function distance(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
		+ Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
		* Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}
// Converts from degrees to radians.
function deg2rad(deg) {
	return deg * (Math.PI / 180);
}
// Converts from radians to degrees.
function rad2deg(radians) {
	return radians * 180 / Math.PI;
}
/** calculate the bearing of one latitude-longitude point from another */
function bearing(destLat, destLng, startLat, startLng) {
	let y = Math.sin(deg2rad(destLng - startLng)) * Math.cos(deg2rad(destLat));
	let x = Math.cos(deg2rad(startLat)) * Math.sin(deg2rad(destLat))
		- Math.sin(deg2rad(startLat)) * Math.cos(deg2rad(destLat)) * Math.cos(deg2rad(destLng - startLng));
	let z = Math.atan2(y, x) * 180 / Math.PI;
	return z < 0 ? z + 360 : z;
}
/* called if map type selector is changed to supply map URLs */
function showMap(that, lat, long) {
	if (that.selectedIndex == 0)
		return
	let googleURL = "https://maps.google.com/maps?f=q&q=(" + lat + "," + long + ")";
	let googleSatURL = "https://maps.google.com/maps?t=k&q=loc:" + lat + (long >= 0 ? "+" : "") + long;  // satellite view
	let shortLink = makeShortCode(parseFloat(lat), parseFloat(long), 17);
	let osmurl = "https://osm.org/go/" + shortLink + "?m";
	window.open(["Choose map type", googleSatURL, googleURL, osmurl][that.selectedIndex], "_blank");
	that.selectedIndex = 0;
}
/* prettify +-latitide and longitude as North, South, East, West */
function prettify(lat, long) {  // ° chokes .csv file download in log.html&.js
	return Math.abs(lat) + "" + (lat >= 0 ? "N" : "S") + "  " + Math.abs(long) + "" + (long >= 0 ? "E" : "W");
}
/* Save a named value in localStorage.  Name is object.component */
function setValue(name, value) {
	localStorage[name] = value;
}
/* Get values from localStorage.  Names are object.attribute format */
function getValues() {
	let keys = Object.keys(localStorage);
	for (let i in keys) {
		let parts = keys[i].split(".");
		if (parts.length == 2)  // if the key name has two parts separated by a .
			eval(parts[0] + "." + parts[1] + " = localStorage[keys[i]]");
	}
}
/* delete 1 or more values.  argz may be a scalar, several comma-separated scalars, and array, or an object. */
function delValues(argz) {
	if (argz instanceof Array) {  // if argz is an [Array]
		for (let i in argz)  // each element is a persist name,
			delValue(argz[i]);  // delete each
	} else if (argz instanceof Object) {  // else if argz is an {Object}
		for (let name in argz)  // each attribute name is a persist name,
			delValue(name);  // delete each
	} else
		for (let i = 0; i < arguments.length; i++)  // else one or more scalar value names passed,
			delValue(arguments[i]);  // delete each
}
/* delete a single value from localStorage */
function delValue(name) {
	delete window.persist[name];
	delete localStorage[name];  // delete value from localStorage
}
/* return a full cell number given country code and number */
function getCell(country, number) {
	return country = number.charAt(0) == "0" ? country + number.substr(1) : number;
}
/* if the user is using a PC, show simulated SMS; else do real SMS */
function makeSMS(rescuer, body, url) {
	return (isitaPC() ? "../simSMS.html#" : ("sms://" + (rescuer ? rescuer : "") + "?body="))
		+ encode(body + (isitaPC() ? url : encode(url)));
}
/* return true if user's device isn't a mobile, unless "&mobile" is in location.search */
function isitaPC() {
	return navigator.userAgent.match(/tablet|mobi/i) == null && location.search.indexOf("&mobile") < 0;
}
/* current date/time radix 36 */
function getNow() {
	return new Date().getTime().toString(36);
}
/* get date base 36 in minutes, return in YYYY-MM-DD HH:MM format, or YYYY-MM-DD if short */
function YMDHM(date, short) {
	if (date == null)
		return "";  // or "–" = &ndash;
	let dd = date ? new Date(parseInt(date, 36)) : new Date();
	let iso = new Date(dd.getTime()-60000*dd.getTimezoneOffset()).toISOString();  // YYYY-MM-DDTHH:MM:SS.SSSZ
	return iso.substr(0, 10) + (! short ? " " + iso.substr(11, 5) : "");
}
/* convert timestamp in seconds to date/time - reverse YMDHM() */
function getDateTime(t, short) {
	let text = new Date(parseInt(t, 36)).toString();
	let pos = short ? text.indexOf(" GMT") : text.indexOf("(");  // find (local time zone in words)
	return text.substr(0, pos);  // drop the words
}
function goto(target) {
	window.location = target;
}
/** make sure field is in csv format */
function csv(field) {  // if it contains a , or \n then wrap it in " and double each embedded "
	return /,|\\n/.test(field) ? '"' + field.replace(/"/g, /""/) + '"' : field;
}
function evalDebug() {
	let debugz;
	eval("debugz =" + byId("debugIn").value);
	byId("debugOut").value = JSON.stringify(debugz);
	return false;
}
/* return the browser device from the userAgent string */
function userAgent() {
	let ua = /\(([^)]+)\)/.exec(navigator.userAgent);
	return ua && ua[1] ? ua[1] : "?";
}