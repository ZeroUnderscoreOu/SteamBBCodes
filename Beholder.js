var Pulldown = document.getElementById("account_pulldown"); // account menu with nickname
var SteamBBCodes; // little easteregg
var Userscript = document.createElement("Script"); // main script
if (Pulldown
	&&Pulldown.textContent.toLocaleUpperCase().includes("BEHOLDER")
	&&GM_getValue("Beholder")==undefined) {
	GM_setValue("Beholder",true);
};
if (GM_getValue("Beholder")) {
	console.log("You are Beholder! Type \"SteamBBCodes.Blink()\" here and reload the page to close your eye and pretend to be normal.");
};
SteamBBCodes = // Chrome doesn't support Object.toSource()
	'{'
		+ 'HeSeesUs: ' + GM_getValue("Beholder") + ','
		+ 'Blink: function(){'
			+ 'document.dispatchEvent(new Event("Blink"));'
		+ '}'
	+ '};';

function BlinkBack() {
	GM_setValue("Beholder",!GM_getValue("Beholder"));
};

document.addEventListener("Blink",BlinkBack,false);
window.eval("var SteamBBCodes = "+SteamBBCodes);
Userscript.type = "Text/JavaScript";
Userscript.textContent = GM_getResourceText("SteamBBCodes");
document.head.appendChild(Userscript);