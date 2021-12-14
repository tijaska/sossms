var geoloc = false;  // until geolocation succeeds
var notMobiTablet = isitaPC()  // true if user's device isn't a mobile...
	&& !window.location.search.match(/mobi1e/);  //  or tablet, unless we claim it for debug purposes.
var parameters = {};  // parameters passed in the ?search fragment, if any
var hub = {};  // rescue hub parameters
var caller = {};  // caller parameters
function init() {
	getValues();  // fetch values stored in localStorage, if any
	if (location.hash == "#debug")
		byId("debug").style.display = "block";  // display the debug area
	let xx = document.createElement("p");
	xx.innerHTML = '<small style="color: brown">' + cacheName + /*', ' + progress +*/ '</small>';
	document.body.appendChild(xx);  // show service-worker.js cache name and version
	window.telno = "unknown";  // cellphone number of the to-be selected rescue hub
	parameters = getParms();  // get parameters passed in the URL's ?search
	for (let name in parameters) {  // copy hub and caller values from parameters, leave other entries in place
		if (name.match(/^hub\./))
			hub[name.substr(4)] = parameters[name];
		else if (name.match(/^caller\./))
			caller[name.substr(7)] = parameters[name];
	}
    if (parameters.h && (parameters.h).search("w") >= 0)  // if the hub accepts WhatsApp,
        byId("whatsapp").style.display = "inline";  // display the WhatsApp button
	let hubInHash = hub.name && /*hub.country &&*/ hub.cell;  // true if search contains hub's name, country & cell
	for (let name in localStorage) {  // copy hub and caller values from localStorage as defaults
		if (name.match(/^hub\./))
			if (! hub[name.substr(4)])  // if this entry didn't come in search,
				hub[name.substr(4)] = localStorage[name];  // use localStorage value as default
		else if (name.match(/^caller\./))
			if (! caller[name.substr(7)])  // if this entry didn't come in search,
				caller[name.substr(7)] = localStorage[name];  // use localStorage value as default
		else if (! parameters[name])  // if this entry didn't come in search,
			parameters[name] = localStorage[name];  // use localStorage value as default
	}
	if (hubInHash) {  // if a hub was passed in search,
		byId("whichHub").innerHTML = "This rescue hub has sent you an S<b>o</b>S SMS invitation:";
		byId("oldHub").style.display = "none";  // it's not an old hub
	} else if (hub.name && /*hub.country &&*/ hub.cell) {  // if no hub in search but the caller has seen a hub before,
		byId("whichHub").innerHTML = "The last rescue hub that contacted you is shown below. Last seen "
			+ YMDHM(parameters.t);  // (unless a fresh one is passed in parameters)
		byId("oldHub").style.display = "block";  // warn it's an old hub
	}
	if (!hub.cell) {  // if still no hub cell available,
		byId("showHub").style.display = "none";  // hide hub info block
		byId("notHub").style.display = "block";  // warn no hub info
		return;  // and quit
	} else {
		byId("showHub").style.display = "block";  // show hub info block
		byId("notHub").style.display = "none";  // hide no hub info warning
	}
	if (hub.name) {  // if hub name was passed in search, or kept in localStorage,
		byId("hubname").innerHTML = hub.name;  // already copied into hub.name
		document.hubForm.hubName.value = hub.name;
	}
	document.hubForm.hubCell.value = hub.cell;  /*getCell(hub.country, hub.cell);*/
//	byId("oldHub").style.display = "block";  // show last used hub
//	byId("notHub").style.display = "none";
	byId("getCaller").style.display = "block";  // open block for caller info
	byId("telCentre").style.display = "block";
	byId("hub.cell").href = "tel:" + hub.cell;
	if (hub.name) {
//		byId("hubname").innerHTML = hub.name;
		byId("hubname2").innerHTML = hub.name;
	}
//\\getValues();  // fetch values stored in localStorage, if any
	if (window.parameters.skipLocate) {
		byId("geoloc").innerHTML = "<b>You have skipped getting your physical location.</b>";
		byId("geoloc").style.display = "block";
		showButtons();
	} else
		geolocate();  // locate the browser's physical position
	if (caller.name)
		document.called.name.value = caller.name;
	if (caller.cell)
		document.called.cell.value = caller.cell;
	if (caller.vehicle)
		document.called.vehicle.value = caller.vehicle;
}  // init()
function showButtons() {
	byId("getCaller").style.display = "block";
	byId("buttons").style.display = "block";
	return;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*	if (!hub.cell || document.called.name.value.trim() == "")
		return;
	caller.name = document.called.name.value.trim();
	if (caller.name == "")
		caller.name = "stranded driver";
	else
		setValue("caller.name", caller.name);
	caller.cell = document.called.cell.value.trim();
	if (caller.cell)
		setValue("caller.cell", caller.cell);
	caller.vehicle = document.called.vehicle.value.trim();
	if (caller.vehicle)
		setValue("caller.vehicle", caller.vehicle);
	let problem = document.called.problem.value.trim();
//  problem = problem.length > 0 ?  problem + "\n" : "";
	let Gmap = "http://maps.google.com/maps?";  // Google maps
	let mapURL = Gmap + "t=k&q=loc:" + caller.lat + (caller.long >= 0 ? "+" : "") + caller.long;  // satellite view
	let timestamp = getNow();  // date/time stamp radix 36
	let hubUrl = location.href.replace("/caller", "/hub");  // direct SMS to the rescue hub
	hubUrl = hubUrl.split(/\?|#/, 1)[0];  // split on first embedded ? or # if present, drop what follows
	hubUrl += "?t=" + timestamp + "&lat=" + caller.lat + "&long=" + caller.long + "&caller=" + encode(caller.name) + "&cell=" + caller.cell
		+ "&vehicle=" + encode(caller.vehicle) + "&problem=" + encode(problem);
	// we double-encode the hrefs contained within the SMS text, else first & stops the sms:// URL
	let text = "SoS SMS to rescue hub – please click:\n"
        + encode(hubUrl)
        + "\n\nFrom: " + caller.name
		+ (caller.cell ? "\nCell: " + caller.cell : "")  //  + " _(click to call)_"
		+ (caller.vehicle ? "\nVehicle: " + caller.vehicle : "")
		+ (problem ? "\nProblem: " + problem : "")
		+ (parameters.ua ? "\nUA: " + /\(([^)]+)\)/.exec(navigator.userAgent)[0] : "")  // show userAgent if ua parameter in ?search
        + "\nLocation: " + encode(mapURL);
//	byId("sms").href = (isitaPC() ? "../simSMS.html?" : ("sms://" + hub.cell + "?body="))
//		+ encode(text.replace(/\*     /g, "").replace(/_/g, ""));  // 5 blanks inserted between * and /
//	byId("previewer").onclick = function() {window.open(hubUrl, "_blank")};
	if (notMobiTablet) {  // if not a mobile or tablet,
		byId("getCaller").className = "PC";  // warn the user that location is probably wrong
		byId("notMobiTablet").style.display = "block";
	}
//	byId("getCaller").style.display = "block";
//	byId("buttons").style.display = "block";		*/
}
/** get the browser's physical coordinates */
function geolocate() {
	
	window.startLocate = new Date().getTime();  //\\//\\
	
	byId("geoloc").style.display = "block";
	let options = {timeout: 5000 /* msec */};
	if (navigator.geolocation)
		navigator.geolocation.getCurrentPosition(onPositionGot, onPositionFail, options);
	else
		byId("geoloc").innerHTML = "<b>Your browser can't get your location.<br>"
			+ "Sorry, you can't use this app to send your location.</b>";
	return false;
}
/** this function is called if/when geolocation completes */
function onPositionGot(position) {
	caller.lat = round5(position.coords.latitude);
	caller.long = round5(position.coords.longitude);
	byId("geoloc").innerHTML = "Your location is:<br>" + Math.abs(caller.lat) + (caller.lat >= 0 ? "&deg; north, " : "&deg; south, ")
		+ Math.abs(caller.long) + (caller.long >= 0 ? "&deg; east" : "&deg; west")
		+ " after " + (new Date().getTime() - window.startLocate) + " msec";
	showButtons();
	showDistance();  // show caller's distance from the rescue hub
}
/** this function is called if/when geolocation fails */
function onPositionFail(err) {
	byId("geoloc").innerHTML = "<b>Geolocation failed. Your browser can't locate its position. "
		+ "Please show your phone the sky and&nbsp; <a onclick='return geolocate();' href=''>try&nbsp;again</a></b><br>"
		+ "<span style='color: gray'>" + err.message + "</span>";
	caller.lat = hub.lat;  // don't know where caller is, pretend at the hub
	caller.long = hub.long;
	if (parameters.nofi)  // if no network connection
		showButtons();  // show buttons to allow debug
	else
		byId("buttons").style.display = "none";  // hide the Send SMS button
}
function round5(num) {  // return num rounded to 5 decimals
	return Math.round(num * 100000) / 100000;
}
/* show the caller how far away the hub is */
function showDistance() {
	let km = Math.round(distance(hub.lat, hub.long, caller.lat, caller.long) * 10) / 10;
	let far = (km > 10 ? true : false);  // because let km = far > 10 doesn't work!!
	let bear = Math.round(bearing(hub.lat, hub.long, caller.lat, caller.long));
	byId("distance").innerHTML = (far ? "<b>" : "") + "The rescue hub is " + km + " km from you, bearing: "
		+ bear + "°" + (far ? "</b>" : "")
		+ '&nbsp; <img src="../images/arrow18.png" style="transform: rotate(' + bear + 'deg); vertical-align: bottom">';
	byId("distance").style = far ? "display: block; font-style: italic; font-weight: bold; background-color: #FEE;" : "";
}

/* send an SMS or WhatsApp to a rescue hub */
function OKtogo(which, that) {  // which == 1 is SMS, 2 is WhatsApp; "that" is the link that called OKtogo
	let fields = ["name", "cell", "vehicle", "problem"];  // fields that the user must fill in
	for (let ff in fields) {
		if (document.called[fields[ff]].value == "") {
			alert("Please enter a value in " + fields[ff] + " and click again");
			return false;
		}
	}
	let Gmap = "http://maps.google.com/maps?";  // Google maps
	let mapURL = Gmap + "t=k&q=loc:" + caller.lat + (caller.long >= 0 ? "+" : "") + caller.long;  // satellite view
	let timestamp = getNow();  // date/time stamp radix 36
	let problem = document.called.problem.value.trim();
	let hubUrl = location.href.replace("/caller", "/hub");  // direct SMS to the rescue hub
	hubUrl = hubUrl.split(/\?|#/, 1)[0];  // split on first embedded ? or # if present, drop what follows
	hubUrl += (which == 2 ? "?c=w&" : "?") + "t=" + timestamp + "&lat=" + caller.lat + "&long=" + caller.long + "&caller=" + encode(caller.name)
		+ "&cell=" + caller.cell + "&vehicle=" + encode(caller.vehicle) + "&problem=" + encode(problem)
		+ (parameters.ua ? "&ua=" + encode(userAgent()) : "")  // show userAgent if ua parameter in ?search
;
	// we double-encode the hrefs contained within the SMS text, else first & stops the sms:// URL
	let text = "Rescue hub – please click this SoS SMS:\n"
        + encode(hubUrl)
        + "\n\nFrom: " + caller.name
		+ (caller.cell ? "\nCell: " + caller.cell : "")  //  + " _(click to call)_"
        + "\nLocation: " + encode(mapURL)
		+ (caller.vehicle ? "\nVehicle: " + caller.vehicle : "")
		+ (problem ? "\nProblem: " + problem : "");
    if (which == 1) {  // SMS
        // point to SMS simulation if we're on a PC, SMS app if on mobile:
        let target = isitaPC() ? "../simSMS.html?" : "sms://" + hub.cell + "?body=";  //?
        that.href = target + encode(text);
        return true;  // OK to go
    } else if (which == 2) {  // WhatsApp
        that.href = "https://wa.me/" + hub.cell + "?text=" + text.replace(/\n/g, "%0A");  // replace new line chars with %0A (or %0D)
        return true;  // OK to go
    } else
        return false;  // invalid which value, don't go
}
