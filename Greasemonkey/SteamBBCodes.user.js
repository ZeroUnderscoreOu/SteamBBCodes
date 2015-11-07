/*
Steam BBCodes userscript 1.0.0
Written by ZeroUnderscoreOu
http://steamcommunity.com/id/ZeroUnderscoreOu/
http://steamcommunity.com/groups/0_oWassup/discussions/4/
https://github.com/ZeroUnderscoreOu/SteamBBCodes
*/

// ==UserScript==
// @name        SteamActivityFilter
// @author      ZeroUnderscoreOu
// @version     1.0.0
// @icon        https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamBBCodes/master/SteamOrange.png
// @description Steam BBCodes editor
// @downloadURL https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamActivityFilter/master/Greasemonkey/SteamBBCodes.user.js
// @updateURL   https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamActivityFilter/master/Greasemonkey/SteamBBCodes.user.js
// @namespace   https://github.com/ZeroUnderscoreOu/
// @include     *://steamcommunity.com/*
// @run-at      document-end
// @grant       GM_getResourceText
// @resource    SteamBBCodes https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamBBCodes/master/SteamBBCodes.js
// ==/UserScript==

(function(){
	var TempElem = document.createElement("Script");
	TempElem.type = "Text/JavaScript";
	TempElem.textContent = GM_getResourceText("SteamBBCodes");
	document.head.appendChild(TempElem);
})();