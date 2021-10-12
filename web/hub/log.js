/* journal of past help requests.  Format: {dateTime: [caller.cell, caller.name, lat, long, vehicle, problem]} */
var journal;
var whens = [];  // journal sorted in descending date sequence
var parameters = getHash();  // parameters passed in location.hash, if any
var hub = {};  // info about the hub, e.g. latitude and longitude
var caller = {};  // info about the caller, e.g. cell number
function show(that) {
//	alert(dateTime(that["data-when"]));
	window.location = document.referrer + "#T=" + that.dataset.when;  // point back to the hub index.html, choose this request
}
function init() {
	if (! localStorage.journal) {
		byId("empty").style.display = "block";  // show log is empty
		return;
	}
	journal = JSON.parse(localStorage.journal);
	whens = Object.keys(journal).sort().reverse();  // most recent calls first
	for (when = 0; when < whens.length; when++) {
		let row = journal[whens[when]];  // [caller.cell, caller.name, lat, long, vehicle, problem]
		let report = byId("report");
		let newRow = report.insertRow();
		let cell = newRow.insertCell();
		cell.innerHTML = YMDHM(whens[when]);  // date and time as YYYY-MM-DD HH:MM
		cell.style = "cursor: pointer";
		cell.setAttribute("data-when", whens[when]);
		if (whens[when] == parameters.t)  // if this is the current request,
			newRow.style.background = "yellow";  // highlight the row
		cell.onclick = function () {show(this)};
		cell = newRow.insertCell();
		cell.innerHTML = row[0];  // caller.cell
		cell = newRow.insertCell();
		cell.innerHTML = row[1];  // caller.name
//		cell = newRow.insertCell();
//		cell.innerHTML = prettify(row[2], row[3]);  // caller lat, long
		cell = newRow.insertCell();
		cell.innerHTML = row[4];  // vehicle
		cell = newRow.insertCell();
		cell.innerHTML = row[5];  // problem
		cell = newRow.insertCell();
		cell.innerHTML = YMDHM(row[6]);  // when sent
		cell = newRow.insertCell();
		cell.innerHTML = elapsed(whens[when], row[6]);  // delay
		cell = newRow.insertCell();
		cell.innerHTML = row[7] ? row[7] : "";  // rescuer
	}  // for
}
// download a copy of the log
function downloader(that) {
	let log = 'When called,Caller cell,Caller name,Where,Vehicle,Problem,Forwarded,Delay ",Rescuer #';
	for (when = 0; when < whens.length; when++) {
		let row = journal[whens[when]];  // [caller.cell, caller.name, lat, long, vehicle, problem]
		log += "\n" + csv(YMDHM(whens[when]));  // date and time as YYYY-MM-DD HH:MM
		log += "," + csv(row[0]);  // caller.cell
		log += "," + csv(row[1]);  // caller.name
		log += "," + csv(prettify(row[2], row[3]));  // caller lat, long
		log += "," + csv(row[4]);  // vehicle
		log += "," + csv(row[5]);  // problem
		log += "," + csv(row[6] ? YMDHM(row[6]) : "");  // when sent to rescuer
		log += "," + elapsed(whens[when], row[6]);  // elapsed seconds
		log += "," + csv((row[7] ? row[7] : ""));  // rescuer's number
	}  // for
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(log));
    element.setAttribute('download', "SoSlog.csv");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
	return false;
}
function elapsed(from, to) {  // calculate elapsed time in seconds
	return to ? Math.round((parseInt(to, 36) - parseInt(from, 36))/1000) : "";
}
function check(that) {
	byId("emailer").style.display = that.checked ? "block" : "none";  // enable emailing log
}