var Self = require("sdk/self");
var PageMod = require("sdk/page-mod").PageMod;
var TempFunc = 'var TempElem = document.createElement("Script");'
	+ 'TempElem.type = "Text/JavaScript";'
	+ 'TempElem.textContent = decodeURI("'
	+ encodeURI(Self.data.load("./SteamBBCodes.js"))
	+'"); document.head.appendChild(TempElem);';
PageMod({
	include: /.*steamcommunity.com\/.*/,
	contentScript: TempFunc
});