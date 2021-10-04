<h2>Rescue Stranded Drivers in Nature Parks</h2>
<h3>Options:</h3>
<ul>
  <li><a href="web/index.html">Description of this system</a></li>
  <li><a href="web/caller/">Stranded caller app</a></li>
  <li><a href="web/hub/">Rescue hub app</a></li>
  <li><a href="web/rescue/">Rescue driver app</a></li>
</ul>

<p>This project offers three progressive web apps (PWAs) that act together to help stranded drivers in nature parks to communicate
their location and problem to a rescue hub in the park, assuming it has one. The hub can check the stranded driver's position and needs,
and forward the message to the rescue driver best placed to render assistance. The hub should install the hub specific PWA, and the
rescue drivers should install their rescue specific PWA. But a rescue driver may go on leave or fall ill, and another be drafted in
at short notice and not have the rescue PWA installed. And of course stranded drivers don't go on trips expecting vehicle breakdowns,
so we can't expect them to install the stranded driver specific PWA in advance.</p>
<p>Therefore sossms is designed to operate reliably in an environment where some participants have their sossms apps installed, and
others don't. Apps can't push messages to participants who don't have the corresponding app installed, so sossms piggybacks on the
oldest and most widely used messaging system, SMS text messaging. About 20 billion SMS text messages flow through the cellphone networks
each day.  The sossms apps create messages to be sent and then pass them to the SMS app. The user need only press the SMS send button,
and the message flows.</p>
<p>Each message sent contains the data entered by the stranded driver, and a URL that when clicked by the recipient will open the target
PWA if it is installed, or default to opening a web page that delivers the same function if the PWA is not installed.  Either way, the
recipient gets to see the info entered by the stranded driver, and can display a map showing their location.  The the rescue driver can
request turn by turn navigational guidance to the stranded driver.</p>
<p>Google street view maps does a great job of identifying streets in towns and cities, but not so much dirt tracks in nature reserves.
The sossms apps offer three choices:</p>
<ul>
  <li><a href="https://www.google.com/maps/@-24.8084045,28.1284559,16z">Google street maps</a></li>
  <li><a href="https://www.google.com/maps/@-24.8084045,28.1284559,2112m/data=!3m1!1e3">Google satellite view</a></li>
  <li><a href="https://www.openstreetmap.org/#map=16/-24.8081/28.1292">OpenStreetMap</a></li>
</ul>
<p>The human eye can do a good job of discerning dirt tracks in Google satellite view, even if they are covered by trees here and there,
which seems to put Google street view off. OpenStreetMaps allows users to reveal roads by driving them with the OSMTracker app running,
and to edit maps to include street and place names. Nature park employees traverse roads in order to maintain them, fences, fire breaks,
and other assets, so getting all of the roads onto the record in OpenStreetMap should not be too onerous.</p>
