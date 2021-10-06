var cellNo = /(^\+\d{10,}$)|(0\d{8,})/;  // cell numbers may start with + (country code) or 0 (local)
var cookies = {};
var parameters = {};  // parameters passed in location.hash, if any
var hub = {};  // info about the hub, e.g. latitude and longitude
var caller = {};  // info about the caller, e.g. cell number
var gotCallerLocation = false;
function init() {
	window.parameters = getHash();  // set caller's fields from location.hash, if passed
	// if latitude parameters present and plausible, accept caller's data
	gotCallerLocation = parameters.lat && parameters.lat >= -90 && parameters.lat <= 90
		&& parameters.long && parameters.long >= -180 && parameters.long <= 180;
	byId("noCallerInfo").style.display = gotCallerLocation ? "none" : "block";
	geolocate();  // start locating the rescue driver's cellphone's physical position
	if (gotCallerLocation) {  // if the rescue hub's fields are full and we have the caller's location
		parameters.latLong = prettify(parameters.lat, parameters.long);
		fields = ["caller", "cell", "vehicle", "problem", "latLong", "t"];
		for (let i in fields) {  // copy passed parameters into the caller info box
			if (parameters[fields[i]]) {  // if a value is passed
				if (fields[i] == "t")
					document.callerInfo.dateTime.value = dateTime(parameters.t);  // convert timestamp to date/time
				else
					document.callerInfo[fields[i]].value = parameters[fields[i]];
				if (fields[i] == "cell" && window.parameters[fields[i]])
					byId("pleaseFill").style.display = "none";
			}
		}
		byId("extraInfo").style.display = "table-row-group";  // show extra caller fields
//		callerURLs(parameters.lat, parameters.long, "");  // set up map URLs showing caller
		showDistance();  // show the distance between the caller and the hub
		byId("result").style.display = "block";  // block
		window.scrollBy(0, 100);  // scroll down to show newly displayed lines
	}
}  // init()
/* set the hub location into a Google maps link */
function setHubloc(lat, long) {
	byId("hubloc").href = "https://maps.google.com/maps?t=k&q=loc:" + lat + (long >= 0 ? "+" : "") + long;
}
function pasteTest() {
	document.callerInfo.in.value = `This is a test SoS SMS
Hippo Hollow, South Africa
https://maps.google.com/maps?f=q&q=(-24.81270,28.14054)`;
	window.scrollBy(0, 200);  // scroll down to lower lines
	return false;
}
/* set map URLs to show where caller is 
function callerURLs(lat, long, msg) {
	parameters.msg = msg;  // keep for fixCountry()
	let googleURL = "https://maps.google.com/maps?f=q&q=(" + lat + "," + long + ")";
	let googleSatURL = "https://maps.google.com/maps?t=k&q=loc:" + lat + (long >= 0 ? "+" : "") + long;  // satellite view
	var shortLink = makeShortCode(parseFloat(lat), parseFloat(long), 17);
	let osmurl = "https://osm.org/go/" + shortLink + "?m";
//	var tips = window.location.href.substr(0, window.location.href.lastIndexOf('/')) + "/tips.html";  // help for rescue driver
//	byId("previewGS").href = googleSatURL;
//	byId("previewG").href = googleURL;
//	byId("previewO").href = osmurl;
//	let text = "*SoS SMS to rescue driver*"
//		+ (parameters.caller ? "\nFrom: " + parameters.caller : "")
//		+ (parameters.cell ? "\nCell: " + parameters.cell + " _(click to dial)_" : "")
//		+ (parameters.vehicle ? "\nVehicle: " + parameters.vehicle + " " : "")
//		+ (parameters.problem ? "\nProblem: " + parameters.problem : "") + (msg ? "\n" + msg : "");
	showDistance();  // show the distance between the caller and the hub
	byId("result").style.display = "block";  // block
	window.scrollBy(0, 100);  // scroll down to show newly displayed lines
}  // callerURLs()	*/
/* fix the country code on a phone number; optionally fix URLs */
function fixCountry(that, next, fixURLs) {
	if (that.value) {  // if a rescue driver's number has been supplied,
		if (that.value.match(/^0/)) {  // if number start with a zero,
			that.value = hub.country + that.value.substr(1);  // drop leading 0, prefix with country
			byId(next).innerHTML = "<b>Hub country code " + hub.country + " added; fix if wrong.<b>";
		} else
			byId(next).innerHTML = "";
//		if (fixURLs)
//			callerURLs(parameters.lat, parameters.long, parameters.msg);
	}
}
function OKtogo() {
	if (parameters.lat != null || parameters.long != null)  // if caller's location is known,
		return true;  // OK to go
	var msg = document.callerInfo.in.value;  // look for the caller's SoS SMS
	if (msg.trim() == "")
		return err("Please paste the caller's SoS SMS into the box above.");
}
function err(text) {
	byId("message").innerHTML = text;
	if (text) {
		byId("message").innerHTML = text;  // publish error message
		window.scrollBy(0, 200);  // scroll down to show error line
		return false;
	} else {
		byId("message").innerHTML = "";  // clear previous error message
		return true;
	}
}
function encode(arg) {
	return encodeURIComponent(arg);
}
function sendCallerMsg(link, type) {
	caller.cell = document.callerInfo.cell.value;
	if (caller.cell.match(/^0/))  // if number start with a zero,
		caller.cell = hub.country + caller.cell.substr(1);  // drop leading 0, prefix with country
	let callerUrl = location.href/*.split("?")[0]*/.replace('hub', 'caller');  // drop ?search and #parameters, if any
	let hubURL = "hub.name=" + encode(hub.name) + "&hub.cell=" + encode(hub.cell) + "&caller.cell=" + encode(caller.cell);
	link.href = (type == 1 ? "sms://" + caller.cell + "?body=" : "https://wa.me/" + caller.cell + "?text=")
		+ encode("Please send your location to the " + hub.name + " rescue hub."
			+ "\nTo get help on how to do this, please click this link:\n" + callerUrl + "#" + (type == 1 ? encode(hubURL) : hubURL));
	window.scrollBy(0, 200);  // scroll down to show lower lines
	return true;  // true;
}
function setCookie(name, value, max_age) {
	document.cookie = name + "=" + encode(value) + "; max-age=" + max_age * 3600 * 24;
}
function checkCell(cellNo, pattern, text) {  // check a cell number in the form
	var fixed = cellNo.value.split(/[\s-]/).join('');  // strip out blanks and dashes
	if (fixed == '')
		return badCell(cellNo, text);
	if (fixed.match(pattern) == null)
		return badCell(cellNo, cellNo.name + " looks odd");
	cellNo.style = "background-color: white";
	// keep hub.name, hub.cell and hub.country cookies for a year; sender for an hour
	setCookie("hub.cell", fixed, 3600 * (cellNo.name == "sender" ? 1 : 24 * 365));
	return true;
}
function badCell(field, text) {
	field.style = "background-color: #FCC";
	alert(text);
	field.focus();
	return false;
}
function fixUnitCell(that) {
	var fixed = that.value.split(/[\s-]/).join('');  // strip out blanks and dashes
	if (fixed == '') {
		alert("Please fill in your hub's cell number");
		that.focus();
	} else
	if (fixed.length < 10) {
		alert("That cell number looks too short");
		that.focus();
	} else
	if (fixed.match(/^\+?\d*$/) == null) {
		alert("Cell number must be numeric with optional leading +");
		that.focus();
	} else
		document.cookie = "hub.cell=" + fixed;
}
/** show or hide hub fields **
function seeHubConfig(checkbox, setting) {
	let showtime = typeof setting != "undefined" ? setting : checkbox.checked;  // true if setting == true or checkbox is checked
	checkbox.checked = showtime;
	byId("hubFields").style.display = showtime ? "block" : "none";
}	*/
/** get the browser's physical coordinates */
function geolocate() {
	byId("geoloc").style.display = "block";
	let options = {timeout: 5000 /* msec */};
	if (navigator.geolocation)
		navigator.geolocation.getCurrentPosition(onPositionGot, onPositionFail, options);
	else {
		byId("geoloc").innerHTML = "<b>Your browser can't get your location. "
			+ "Sorry, you can't use this app to determine your location.</b>";
	}
	return false;  // inhibit form submission
}  // geolocate()
/** This function is called if/when geolocation completes.
 * Compute distance between caller and hub using the Haversine formula. */
function onPositionGot(position) {
	hub.lat = round5(position.coords.latitude);
	hub.long = round5(position.coords.longitude);
	let latLong = prettify(hub.lat, hub.long);
	byId("geoloc").innerHTML += "<br>" + latLong;
	showDistance();
}
/** this function is called if/when geolocation fails */
function onPositionFail(err) {
	byId("geoloc").innerHTML = "<b>Geolocation failed. Sorry, you can't use this app to send your location to the rescue centre.  "
		+ "Your browser can't locate its position.</b><br><span style='color: gray'>" + err.message + "</span>";
}
/* show the hub user how far away the caller is */
function showDistance() {
	let km = Math.round(distance(parameters.lat, parameters.long, hub.lat, hub.long) * 10) / 10;
	let far = (km > 10 ? true : false);  // because let km = far > 10 doesn't work!!
	let bear = Math.round(bearing(parameters.lat, parameters.long, hub.lat, hub.long));
	byId("distance").innerHTML = (far ? "<b>" : "") + "The stranded driver is currently " + km
		+ " km from you, bearing: " + bear + "°" + (far ? "</b>" : "")
		+ '&nbsp; <img src="../images/arrow18.png" style="transform: rotate(' + bear + 'deg); vertical-align: bottom">';
//	byId("distance").style = far ? "display: inline; font-style: italic; font-weight: bold; background-color: #FEE;" : "";
}
function round5(num) {  // return num rounded to 5 decimals
	return Math.round(num * 100000) / 100000;
}
function delCookie(name) {
	document.cookies = name + "=;max-age=0";
}
// from https://web.dev/customize-install/
