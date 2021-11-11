var cellNo = /(^\+\d{10,}$)|(0\d{8,})/;  // cell numbers may start with + (country code) or 0 (local)
var parameters = {};  // parameters passed in location.search, if any
var hub = {};  // info about the hub, e.g. latitude and longitude
var caller = {};  // info about the caller, e.g. cell number
/* journal of past help requests.  Format: {dateTime: [caller.cell, caller.name, lat, long, vehicle, problem]} */
var journal = localStorage.journal ?  // if we have a record of past help requests in localStorage,
	JSON.parse(localStorage.journal) : {};  // grab it; else journal is empty
var journalCell = {};  // index by caller.cell into journal.  Format: {cell: [dateTime]}
for (let dateTime in journal) {  // populate cell index into journal
	let row = journal[dateTime];  // a past call
	let cell = row[0];  // caller's cell no
	if (journalCell[cell]) {  // if there's already an entry for this cell,
		if (! journalCell[cell].includes(dateTime))  // if doesn't have this dateTime yet,
			journalCell[cell].push(dateTime);  // append it
	} else
		journalCell[cell] = [dateTime];  // start a new entry for this cell
}
var extraText = "";  // hub may add to the message
var gotCallerLocation = false;

// from https://web.dev/customize-install/
var deferredPrompt;  // Initialize deferredPrompt for use later to show browser install prompt.
window.addEventListener('beforeinstallprompt', (evt) => {
	evt.preventDefault();  // Prevent the mini-infobar from appearing on mobile
	deferredPrompt = evt;  // Stash the event so it can be triggered later.
	byId("installer").style.display = "block";  // Update UI notify the user they can install the PWA
//	window.scrollBy(0, 200);  // scroll down to show lower lines
	console.log(`'beforeinstallprompt' event was fired.`);  // Optionally, send analytics event that PWA install promo was shown.
});


function init() {
	if (location.protocol == "http:" && location.hostname != "localhost")
		location = location.href.replace("http:", "https:");  // promote to secure
    if (! isitaPC())  // if it isn't a PC, offer to install
        byId("installit").style.display = "block";
	let xx = document.createElement("p");
	xx.innerHTML = '<small style="color: brown">' + cacheName + ', ' + progress + '</small>';
	document.body.appendChild(xx);  // show service-worker.js cache name and version
	getValues();  // get saved values from localSorage
	for (let name in hub) {
		if (document.hubForm[name])  // if the hub form has this field name,
			document.hubForm[name].value = hub[name];  // initialise it from the value.
	}
    document.hubForm.canWhatsApp.checked = hub.f == "w";  // can hub Whatsapp?
	let fields = ["name", "cell", "country"/*, "lat", "long"*/];  // hub fields set from localStorage
	var hubComplete = true;
	for (let ii in fields) {
		let name = fields[ii];
		if (document.hubForm[name].value == "") {  // if this field is not initialised,
			hubComplete = false;
			seeHubConfig(document.hubForm.hubConfig, true);  // show the hub configuration section
		}
	}  // for ii
	if (!hubComplete) {
		byId("noHubComplete").style.display = "block";
		byId("hubIsComplete").style.display = "none";
		byId("noCallerInfo").style.display = "none";
		byId("callerData").style.display = "none";
	}
    var driver = parameters.m == "d";  // true if the user is a rescue driver, rather than a rescue hub
	parameters = getParms();  // get parameters from location.search, if any
	if (parameters.T) {  // if parameter T is set then we have a reference from hub/log.html
		let row = journal[parameters.T];  // get the selected row from the journal
		location.search = "cell=" + row[0] + "&caller=" + row[1] + "&lat=" + row[2] + "&long=" + row[3]
			+ "&vehicle=" + row[4] + "&problem=" + row[5] + "&t=" + parameters.T;
		parameters = getParms();
	}
	if (parameters.cell && parameters.t) {  // if we got the caller's cell number and the dateTime of the request,
		let cell = parameters.cell;
		let dateTime = parameters.t;
		let row = [cell, parameters.caller, parameters.lat, parameters.long, parameters.vehicle, parameters.problem];
		journal[dateTime] = row;
		if (journalCell[cell]) {  // if there's already an entry for this cell,
			if (! journalCell[cell].includes(dateTime))  // if doesn't have this dateTime yet,
				journalCell[cell].push(dateTime);  // append it
		} else
			journalCell[cell] = [dateTime];  // start a new entry for this cell
		localStorage.journal = JSON.stringify(journal);  // snapshot the journal
//		localStorage.journalCell = JSON.stringify(journalCell);  // snapshot the cell index into the journal
	}
	for (let name in parameters) {  // scan parameters passed
		if (parameters[fields[name]]) {  // if a value is passed
			if (fields[name] == "t")
				document.callerInfo.dateTime.value = dateTime(parameters.t);  // convert timestamp to date/time
			else
				document.callerInfo[fields[name]].value = parameters[fields[name]];
			if (fields[name] == "cell" && window.parameters[fields[name]])
				byId("pleaseFill").style.display = "none";
		}
	}
	// if latitude parameters present and plausible, accept caller's data
	gotCallerLocation = parameters.lat && parameters.lat >= -90 && parameters.lat <= 90
		&& parameters.long && parameters.long >= -180 && parameters.long <= 180;
	// if the caller hasn't sent lat and long, suggest sending an SMS to collect it
	byId("ifCaller").style.display = gotCallerLocation ? "block" : "none";
	byId("ifNoCaller").style.display = gotCallerLocation ? "none" : "block";
	byId("noCallerInfo").style.display = gotCallerLocation ? "none" : "block";
	byId("extraInfo").style.display = gotCallerLocation ? "table-row-group" : "none";  // show extra caller fields
	byId("result").style.display = gotCallerLocation ? "block" : "none";
	if (document.referrer.search("/log.html") > 0)  // if this is an old record from the log,
		byId("ifCaller").innerHTML = "<h3>This is an old record from the log:</h3>";  // say so.

	if (hub.lat && hub.long) {  // if hub coordinates known,
		document.hubForm.location.value = prettify(hub.lat, hub.long);
		setHubloc(hub.lat, hub.long);
		byId("yourLoc").innerHTML = "Your hub's location is on record as:";
	} else {
		geolocate();  // start locating the hub cellphone's physical position
		byId("yourLoc").innerHTML = "Your hub's location seems to be:";
	}
	if (hubComplete && gotCallerLocation) {  // if the rescue hub's fields are full and we have the caller's location
		parameters.latLong = prettify(parameters.lat, parameters.long);
		fields = ["caller", "cell", "vehicle", "problem", "latLong", "t"];
		for (let i in fields) {  // copy passed parameters into the caller info box
			if (window.parameters[fields[i]]) {
				if (fields[i] == "t")
					document.callerInfo.dateTime.value = dateTime(parameters.t);  // convert timestamp to date/time
				else
					document.callerInfo[fields[i]].value = parameters[fields[i]];
				if (fields[i] == "cell" && parameters[fields[i]])
					byId("pleaseFill").style.display = "none";
			}
		}
		if (hub.lat && hub.long) {  // if hub coordinates found,
			document.hubForm.location.value = prettify(hub.lat, hub.long);
		}
//		callerURLs(parameters.lat, parameters.long, "");  // set up map URLs showing caller
		showDistance();  // show the distance between the caller and the hub
//		window.scrollBy(0, 100);  // scroll down to show newly displayed lines
	}
}  // init()
/* if rescue hub's fields change, save the rescue hub's details in localStorage */
function saveHub() {
	if (document.hubForm.name.value == "" || document.hubForm.country.value == "" || document.hubForm.cell.value == "") {
		alert("Please fill in your hub's name, country, and cell number");
		return;
	}
	hub.name = document.hubForm.name.value;
	hub.country = document.hubForm.country.value;
	hub.cell = document.hubForm.cell.value;
    hub.flags = document.hubForm.canWhatsApp.checked ? "w" : "";  // set hub WhatsApp flag if checked
	if (hub.name != "" && hub.cell != "" && hub.country != "") {
		setValue("hub.name", hub.name);
		setValue("hub.country", hub.country);
		setValue("hub.cell", hub.cell);
		setValue("hub.flags", hub.flags);  // 
		if (hub.lat)
			setValue("hub.lat", hub.lat);
		if (hub.long)
			setValue("hub.long", hub.long);
		document.hubForm.style = "background-color: #EFE";
//	\\				byId("extraInfo").style.display = "table-row-group";  // show extra caller details
	} //	else
//	\\				byId("extraInfo").style.display = "none";  // hide extra caller details
	byId("hubFields").style.display = "none";
	document.hubForm.hubConfig.checked = false;
	byId("noHubComplete").style.display = "none";
	byId("hubIsComplete").style.display = "block";
	byId("noCallerInfo").style.display = "block";
	byId("callerData").style.display = "block";
	return false;  // prevent form submission
}
/* set the hub location into a Google maps link */
function setHubloc(lat, long) {
	byId("hubloc").href = "https://maps.google.com/maps?t=k&q=loc:" + lat + (long >= 0 ? "+" : "") + long;
}
/* fix the country code on a phone number, enable dial */
function fixCountry(that, next, sender) {
	if (that.value == "0") {  // leading zero means no country code
		that.value = hub.country;  // change leading zero to country code
		byId(next).innerHTML = "<b>Hub country code " + hub.country + " added; fix if wrong.<b>";
	} else if (that.value.length >= 10) {  // if there's a full caller phone number,
		byId(sender).style.display = "block";
	} else if (that.value.length > 0) {  // if there's a caller phone number,
		byId("callerCell").style.display = "inline";
		byId("callerCell").href = "tel:" + that.value;  // let the user phone it
	}
}
/* send an SMS or WhatsApp to a rescue driver */
function OKtogo(which, that) {  // which == 1 is SMS, 2 is WhatsApp; that is the link that called OKtogo
	if (parameters.lat != null || parameters.long != null) {  // if caller's location is known,
		let rescueURL = window.location.href.replace("/hub", "/rescue");
//		var rescuer = document.callerInfo.rescueDriver.value.trim();  // rescue driver's cell number (optional)
//		rescuer = rescuer.split(" ").join("").split("-").join("").split("+").join("");  // squeeze out imbedded blanks and dashes, leading +
		let text = "*SoS SMS Driver, please rescue:*\n"
			+ parameters.caller
			+ "\nCell: " + parameters.cell
			+ "\nVehicle: " + parameters.vehicle
			+ "\nProblem: " + parameters.problem
			+ "\n*Click this link while you still have network access:*\n";
		if (which == 1) {  // SMS
			// point to SMS simulation if we're on a PC, SMS app if on mobile:
			let target = isitaPC() ? "../simSMS.html?" : "sms://" + /*(rescuer ? rescuer : "") +*/ "?body=";
			that.href = target + encode(text + encode(rescueURL) + (extraText ? "\n" + extraText : ""));
		} else if (which == 2) {  // WhatsApp
			that.href = "https://wa.me/" + /*(rescuer ? rescuer : "") +*/ "?text="
			+ encode(text + rescueURL + (extraText ? "\n" + extraText : ""));
		}
		if (! journal[parameters.t][6])  // if we don't already have a respond time,
            journal[parameters.t][6] = getNow();  // add send time to the journal row
//		journal[parameters.t][7] = document.callerInfo.rescueDriver.value;  // add rescue driver's number, if given
		localStorage.journal = JSON.stringify(journal);  // snapshot the journal
		return true;  // OK to go
	}
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
/* send the caller an SMS with a link that starts their app, gets their location, lets them to send it to the hub */
function sendCallerMsg(link, type) {
	if (!checkInputs())
		return false;
	caller.cell = document.callerInfo.cell.value;
	if (caller.cell.match(/^0/))  // if number starts with a zero,
		caller.cell = hub.country + caller.cell.substr(1);  // drop leading 0, prefix with country
	let callerUrl = location.href.split("?")[0].replace("/hub", "/caller");  // drop ?parameters, if any
	let hubURL = "hub.name=" + encode(hub.name) + "&hub.cell=" + encode(getCell(hub.country, hub.cell))
		+ "&hub.lat=" + encode(hub.lat) + "&hub.long=" + encode(hub.long) + (hub.flags ? "&h=w" : "")  // w=h means hub likes WhatsApp
        + "&caller.cell=" + encode(caller.cell) + "&t=" + getNow();
	let rest = encode("Please send your location to the " + hub.name + " rescue hub."
		+ "\nTo get help in doing this, please click this link:\n" + callerUrl + "?" + (type == 1 ? encode(hubURL) : hubURL));
	if (type = 1)
		link.href = (isitaPC() ? "../simSMS.html?" : "sms://" + caller.cell + "?body=") + rest;
	else if (type == 2)
		link.href = "https://wa.me/" + caller.cell + "?text=" + rest.replace(/\n/g, "%0D");  // replace new line chars with %0D
	else if (type == 3)
		link.href = callerUrl + "?" + hubURL;
	window.scrollBy(0, 200);  // scroll down to show lower lines
	return true;  // true;
}
function checkInputs() {
	var hubName = document.hubForm.name;
	if (hubName.value == "") {
		hubName.style = "background-color: #FCC";
		alert("Please fill in your hub's name, e.g. Control Centre");
		hubName.focus();
		return false;
	}
	setValue("hub.name", hubName.value);
	// full country code = optional + and 1-3 digits, optionally followed by - and another 1-3 digits, e.g. +1-242 = Bahamas
	// needs regexp /^\+?\d{1,3}$|^\+?\d{1,3}-\d{1,3}$/, but we will ignore hyphenated country codes for now.
	if (!checkCell(document.hubForm.country, /^\+\d{1,3}$/, "Please fill in your country's phone code"))
		return false;
	if (!checkCell(document.hubForm.cell, cellNo, "Please fill in your hub's cell number"))
		return false;
//	\\		if (! checkCell(document.callerInfo.cell, cellNo, "Please fill in the stranded driver's cell number"))
//	\\			return false;
	if (document.callerInfo.cell.value == "") {
		byId("pleaseFill").style = "color: maroon; font-weight: bold";
		document.callerInfo.cell.style = "background-color: #FCC";
		return false;
	} else {
		byId("pleaseFill").style.display = "none";
		document.callerInfo.cell.style = "background-color: white";
	}
	return true;  // passed all checks
}
function checkCell(cellNo, pattern, text) {  // check a cell number in the form
	var fixed = cellNo.value.split(/[\s-]/).join('');  // strip out blanks and dashes
	if (fixed == '')
		return badCell(cellNo, text);
	if (fixed.match(pattern) == null)
		return badCell(cellNo, cellNo.name + " looks odd");
	cellNo.style = "background-color: white";
	// keep hub.name, hub.cell and hub.country
	setValue("hub.cell", fixed);
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
		setValue("hub.cell", fixed);
}
/** hub operator no longer provides driver's cell no; use SMS or WhatsApp contact picker instead.
 function driverChange() {  // invoked if the user changes the rescue vehicle driver's phone number
 byId("result").style.display = "none";  // hide SMS conversion results again
 }	*/
/** show or hide hub fields */
function seeHubConfig(checkbox, setting) {
	let showtime = typeof setting != "undefined" ? setting : checkbox.checked;  // true if setting == true or checkbox is checked
	checkbox.checked = showtime;
	byId("hubFields").style.display = showtime ? "block" : "none";
}
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
/** This function is called if/when geolocation completes */
function onPositionGot(position) {
	hub.lat = round5(position.coords.latitude);
	hub.long = round5(position.coords.longitude);
	let latLong = prettify(hub.lat, hub.long);  //Math.abs(hub.lat) + "° " + (hub.lat >= 0 ? "north, " : "south, ")  // &deg;
	// + Math.abs(hub.long) + "° " + (hub.long >= 0 ? "east" : "west");
	byId("geoloc").innerHTML += "<br>" + latLong;
	document.hubForm.location.value = latLong;
//			saveHub();  // save the latitude and longitude
	setValue("hub.lat", hub.lat);
	setValue("hub.long", hub.long);
	setHubloc(hub.lat, hub.long);
	seeHubConfig(document.hubForm.hubConfig, true);  // show hub details
	showDistance();
}
/** this function is called if/when geolocation fails */
function onPositionFail(err) {
	byId("geoloc").innerHTML = "<b>Geolocation failed. Your browser can't locate its position.</b>"
		+ "<br><span style='color: gray'>" + err.message + "</span>";
}
/* show the hub user how far away the caller is using the Haversine formula */
function showDistance() {
//	byId("result").style.display = "block";  // let hub user send request on if caller's location known
	let km = Math.round(distance(parameters.lat, parameters.long, hub.lat, hub.long) * 10) / 10;
	let far = (km > 10 ? true : false);  // because let km = far > 10 doesn't work!!
	let bear = Math.round(bearing(parameters.lat, parameters.long, hub.lat, hub.long));
	byId("distance").innerHTML = (far ? "<b>" : "") + "The caller is " + km + " km from you, bearing: "
		+ bear + "°" + (far ? "</b>" : "")
		+ '&nbsp; <img src="../images/arrow18.png" style="transform: rotate(' + bear + 'deg); vertical-align: bottom">';
	byId("distance").style = far ? "display: block; font-style: italic; font-weight: bold; background-color: #FEE;" : "";
}
function round5(num) {  // return num rounded to 5 decimals
	return Math.round(num * 100000) / 100000;
}
function addExtra(that) {
	extraText = that.value;  // copy the text added by the hub operator
	byId("sendSMS").style.background = extraText.length > 0 ? "#F6DDCC" : "#EBEDEF";  // discourage SMS if extra
	byId("sendWhat").style.background = extraText.length > 0 ? "#D5F5E3" : "#EBEDEF";  // encourage WhatsApp if extra
}  // from https://web.dev/customize-install/
/* build a QR code invitation to  the rescue hub */
function buildQR(that) {  // from sendCallerMsg()
	that.href = "../QRcode/build.html?hub.name=" + encode(hub.name) + "&hub.cell=" + encode(getCell(hub.country, hub.cell))
		+ "&hub.lat=" + encode(hub.lat) + "&hub.long=" + encode(hub.long) + "&t=" + getNow();
	return true;
}
/* build a QR code invitation to  the rescue hub */
function buildQR2() {  // from sendCallerMsg()
	return "../QRcode/build.html?hub.name=" + encode(hub.name) + "&hub.cell=" + encode(getCell(hub.country, hub.cell))
		+ "&hub.lat=" + encode(hub.lat) + "&hub.long=" + encode(hub.long) + "&t=" + getNow();
}
/* tell user how to install the PWA */
function installer() {
    alert("To install this app on an Android phone,\nclick the menu (3 dots in top right corner)\nthen click Install app");
}