<h2>Rescue Stranded Drivers in Nature Reserves</h2>

<p>This is a free, open source project that offers three smartphone apps that act together to help a stranded driver in a nature reserve
to communicate their location and problem to a rescue hub in the reserve.  The rescue hub can then forward the help request to the rescue
driver best placed to render assistance.  The app uses geolocation to find out where the stranded driver is, and shows that location to
the rescue hub and drivers in a choice of maps.</p>

<p>The source code of the sossms project can be accessed on the Github shared repository <a href="https://github.com/tijaska/sossms">here</a>.
The Github server also supports a running, ready to use version of the code <a href="https://tijaska.github.io/sossms/">here</a>.</p>

<p>Anyone is free to copy and amend the source code as they choose, and to host the modified version wherever they will. Such copies must
refer to the original version <a href="https://github.com/tijaska/sossms">here</a>.</p>

<h3>See the apps:</h3>

<ul>
  <!--li><a href="web/index.html">A description of this system</a></li-->
  <li><a href="web/caller/">Stranded caller app</a></li>
  <li><a href="web/hub/">Rescue hub app</a></li>
  <li><a href="web/rescue/">Rescue driver app</a></li>
</ul>

<h3>How the apps work together</h3>

<p>The rescue hub installs the <strong>rescue hub app</strong> and then enters their name and phone number into it. The app automatically
uses geolocation to determine their location.  The app can then be used to build a QR code for inclusion in the pamphlets handed out to
visitors on entry to the reserve.  If a visitor scans the QR code it will offer a link to the stranded driver's app.  This link will
include the rescue hub's name, number, and location. When clicked, the stranded driver's app will run.</p>

<p>Alternatively, the stranded driver can phone the rescue hub, who can then use their hub app to send an invite to the stranded driver.
This arrives as an SMS with an embedded link that contains an invite, just like the QR code.</p>

<p>When the <strong>the stranded driver's app</strong> opens, it asks the stranded driver for their name, phone number, vehicle description,
and needs. It automatically uses geolocation to capture the driver's location, and then forwards the message to the rescue hub. The stranded
driver's app opens when the rescue hub sends an invite message to the driver. It arrives as an SMS that contains an explanation and a URL
that, when clicked, runs the stranded driver's app in a browser window, or as a stand-alone app if the driver agrees to install it.</p>

<!--p>Of course drivers don't go on trips expecting vehicle breakdowns, so we can't expect them to install the stranded driver app in advance.
For this reason the app is packaged as a <strong>Progressive Web App</strong>
(PWA) that can run on the fly in a standard browser window, or be installed as a stand-alone phone app as the user chooses.</p-->

<p>Each request from a stranded driver arrives at the rescue hub as an SMS with an explanation and a link embedded within it. When the link
is clicked, the hub app opens and displays the request from the stranded driver. The app shows the stranded driver's position, name, and needs,
and can be used to forward the message to the rescue driver best placed to render assistance.</p>

<p>The rescue drivers should install the <strong>rescue driver app</strong>. But rescue drivers may go on leave or fall ill, and others be
drafted in at short notice, and not have the rescue driver app installed. In these cases the rescue driver app will open in a browser window
first time round, and invite the driver to install it for future use.</p>

<p>Therefore sossms is designed to operate reliably in an environment where some participants have their sossms apps installed, and
others don't. Apps can't push messages to participants who don't have the corresponding app installed, so sossms piggybacks on the
oldest and most widely used messaging system, SMS text messaging. About 20 billion SMS text messages flow through the cellphone networks
each day.  The sossms apps create messages to be sent, and then pass them to the SMS app. The user need only press the SMS send button,
and the message will flow to its intended recipient.</p>

<p>The sossms apps are implemented as <strong>progressive web apps (PWAs)</strong>. These can be downloaded and installed on smartphones
just like classic phone apps, and launched from an icon on the desktop. But even if they haven't been installed in advance, they can still
run like a web page in a browser if the need arises unexpectedly. As it well may for a rescue messaging system.</p>

<h3>A choice of maps</h3>

<p>When a stranded driver initiates a help request, their app uses their phone's geolocation facilities to get an accurate measure of their
current location. This is included on the message that their app sends to the rescue hub, with the other data entered by the stranded driver.
The recipient will see the info entered by the stranded driver, and can display a map showing their location. The rescue driver can request
turn by turn navigational guidance to the stranded driver, if the maps of the reserve in question are accurate.</p>

<p>Google street view maps does a great job of identifying streets in towns and cities, but not so much dirt tracks in nature reserves.
The sossms apps offer three choices of map. Here they are, all pointing to the same area in a nature reserve:</p>
 
<ul>
  <li><a href="https://www.google.com/maps/@-24.8084045,28.1284559,16z">Google street maps</a></li>
  <li><a href="https://www.google.com/maps/@-24.8084045,28.1284559,2112m/data=!3m1!1e3">Google satellite view</a></li>
  <li><a href="https://www.openstreetmap.org/#map=16/-24.8081/28.1292">OpenStreetMap</a></li>
</ul>

<p>The human eye can do a good job of discerning dirt tracks in Google satellite view, even if they are covered by trees here and there,
which seems to put Google street view off. OpenStreetMaps allows users to reveal roads by driving them with the
<a href="https://play.google.com/store/apps/details?id=net.osmtracker&hl=en_ZA&gl=US">OpenStreetMap tracker (OSMTracker) app</a> running,
and to edit maps to include street and place names. Nature reserve employees traverse roads in order to maintain them, fences, fire breaks,
and other assets, so getting all of the roads onto the record in OpenStreetMap should not be too onerous.</p>
