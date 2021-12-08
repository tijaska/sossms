<h2>Rescue Stranded Drivers in Nature Reserves</h2>

<p>This is a free, open source project that offers three smartphone apps that act together to help a stranded driver in a nature reserve
to communicate their location and problem to a rescue hub in the reserve.  The rescue hub can then forward the help request to the rescue
driver best placed to render assistance.  The app uses geolocation to find out where the stranded driver is, and shows that location to
the rescue hub and drivers in a choice of maps.</p>

<p>Anyone is free to copy and amend the source code as they choose, and to host the modified version wherever they will. Such copies must
refer to the original version <a href="https://github.com/tijaska/sossms">here</a>.</p>

<p>The source code of the sossms project can be accessed on the Github shared repository <a href="https://github.com/tijaska/sossms">here</a>.
The Github server also supports a running, ready to use version of the code:</p>

<h3>Try the apps:</h3>
<ul>
  <li><a href="web/caller/">Stranded driver app</a></li>
  <li><a href="web/hub/">Rescue hub app</a></li>
  <li><a href="web/rescue/">Rescue driver app</a></li>
  <!--li><a href="web/hub/?m=d">Rescue driver app 2</a></li-->
</ul>
<!--p>Each app displays an info icon <img src="web/images/help.png"  width="15" height="15"> which shows help for that app if clicked.</p-->

<h3>How the apps work together</h3>
<p>If a nature reserve chooses to use the apps then their rescue hub must install the rescue hub app on a cellphone that remains permanently
in the rescue hub, and configure the app with the nature reserve's name and the rescue cellphone's number.</p>

<h4>The rescue hub app</h4>
<p>This app helps the hub to extend rescue invitations to stranded drivers.  This can be done in several different ways:</p>

<ul>
    <li>The rescue invitation may be included as a link in the nature reserve's Contact us web page.  When clicked by a stranded driver,
        the link will open the stranded driver's app in the caller's phone.  The hub app can be used to create the required link.</li>
    <li>The rescue invitation link may be included as a QR code on a pamphlet that gets handed to each visitor on entry.  When scanned
        by a stranded driver, it will open the stranded driver's app in the caller's phone.  The hub app can be used to create the required
        QR code.</li>
    <li>The nature reserve's rescue cellphone number may already be in their Contact us web page, and/or on a pamphlet that gets handed to each
	visitor on entry.  A stranded driver can call this number for help.  The rescue hub app can then be used to send a rescue invite back
	to the caller in the form of an SMS (or WhatsApp, if the caller has it installed).  The rescue invite will contain a link which, if clicked,
	open the stranded driver app in the caller's phone.</li>
</ul>

<h4>The stranded caller's app</h4>
<p>This app runs when the stranded driver opens a rescue invite from the hub.  It asks the caller to enter their name and a few other details.
It uses geolocation to get the caller's coordinates, then it builds a rescue request message and invites the caller to click the Send button to
send it to the rescue hub by SMS (or WhatsApp, if the rescue hub phone supports it).</p>

<p>Of course visitors don't go on trips expecting vehicle breakdowns, so we can't expect them to install the stranded driver app in advance.
To be fail safe, the app is packaged as a <strong>Progressive Web App</strong> (PWA) that can run on the fly in a standard browser window,
and perhaps be installed as a stand-alone phone app at a later time if the user so chooses.</p>

<h4>Back to the rescue hub app</h4>
<p>Each help request sent by a stranded driver arrives at the rescue hub cellphone as an SMS or WhatsApp that contains a summary of the stranded
driver's situation, and with a link embedded within it. When this link is clicked, the hub app opens and displays the details of the request
from the stranded driver. It shows the stranded driver's location, name, and needs. The hub app can then be instructed to forward the message
to the rescue driver best placed to render assistance. The request for help could be sent by radio instead, but the advantage of the rescue app
system is the rescue driver gets the exact location of the stranded driver, and can open this in an online map to see both the stranded driver's
location, and their own. This info helps them to find the stranded driver in terrain where road names may be few and far between.</p>

<H4>The rescue driver's app</h4>
<p>Rescue drivers should install this app. But they may go on leave or fall ill, and others be drafted in at short notice, and not have
the rescue driver app installed. To be fail-safe, the rescue driver's app is a progressive web app. When first invoked, it will open in
a browser window on the rescue driver's phone, and invite the driver to install it for future use.</p>

<h3>Why SMS?</h3>
<p>SMS messaging is the oldest, clunkiest smart phone messaging system around. Why does sossms make use of it?</p>

<p>Well firstly WhatsApp is offered as an alternative to SMS. It costs less to use.  But it will only work if both the sender and the recipient
have the WhatsApp app installed. And there's no guarantee that this will be the case. On the other hand, the SMS messaging app is built into every
cellphone from the oldest to the newest, and this app can't be uninstalled.</p>

<p>The sossms apps are designed to operate reliably in an environment where some participants have their sossms apps installed, while others don't.
Apps can't push messages to participants who don't have the corresponding app installed, so sossms piggybacks on the oldest and most widely
used messaging system, SMS text messaging. About 20 billion SMS text messages flow through the cellphone networks each day.  The sossms apps
create messages to be sent, and then pass them to the SMS app. The user need only press the SMS send button, and the message will flow to its
intended recipient. When the SMS arrives, the recipient clicks the link within it and their corresponding app will open, populated with the
details forwarded to them.</p>

<p>The sossms apps are implemented as <strong>Progressive Web Apps (PWAs)</strong>. These can be downloaded and installed on smartphones
in much the same way as are classic phone apps, and launched from an icon on the desktop. But if the need for the app arises unexpectedly,
as it well may do for a rescue messaging system, and the needed app hasn't already been installed in advance, it will run in a browser web
page, and then invite the user to install a local copy.  This is vital, since visitors to nature reserves probably won't think to install
the stranded driver's app before they need it.  Indeed, they probably won't even know that it exists.  Hence it is packaged as a progressive
web app which can run at the click of the link in the invitation sent to them by the rescue hub, or by scanning the hub's QR code.</p>

<h3>A choice of maps</h3>

<p>When a stranded driver initiates a help request, their app uses their phone's geolocation facilities to get an accurate measure of their
current location. This is automatically included on the message that their app sends to the rescue hub, with the other data entered by the
stranded driver. The recipient will see the info entered by the stranded driver, and can display a map showing their location.  The rescue
driver can request turn by turn navigational guidance to the stranded driver, if the maps of the reserve in question are accurate.</p>

<p>Android phones use Google street view as their default map type.  It does a great job of identifying streets in towns and cities, but not
so much dirt tracks in nature reserves.
The sossms apps offer three choices of map. Here they are, all pointing to the same area in a nature reserve:</p>
 
<ul>
  <li><a href="https://www.google.com/maps/@-24.8084045,28.1284559,16z">Google street maps</a></li>
  <li><a href="https://www.google.com/maps/@-24.8084045,28.1284559,2112m/data=!3m1!1e3">Google satellite view</a></li>
  <li><a href="https://www.openstreetmap.org/#map=16/-24.8081/28.1292">OpenStreetMap</a></li>
</ul>

<p>The human eye can do a good job of discerning dirt tracks in Google satellite view, even if they are covered by trees here and there,
which seems to put Google street view off. OpenStreetMaps does a pretty good job of identifying secondary roads, and allows users to
accurately track roads by driving them with the
<a href="https://play.google.com/store/apps/details?id=net.osmtracker&hl=en_ZA&gl=US">OpenStreetMap tracker (OSMTracker)</a> app running,
and to edit maps to include street and place names. Nature reserve employees traverse roads regularly in order to maintain them, fences,
fire breaks, and other assets, so getting all of the roads onto the record in OpenStreetMap with names should not be too onerous.</p>
