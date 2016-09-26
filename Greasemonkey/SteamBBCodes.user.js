// ==UserScript==
// @name        Steam BBCodes
// @author      ZeroUnderscoreOu
// @version     1.3.3
// @icon        https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamBBCodes/master/Logo128.png
// @description Steam BBCodes editor
// @namespace   https://github.com/ZeroUnderscoreOu/
// @include     /^https?:\/\/steamcommunity.com\/(app\/\d+\/discussions|discussions\/forum|news\/post)\/.*/
// @include     /^https?:\/\/steamcommunity.com\/sharedfiles\/(filedetails|edititem|itemedittext)\/.*/
// @include     /^https?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/($|allcomments|edit|friendactivitydetail|home(?!\/invites)|recommended|status).*/
// @include     /^https?:\/\/steamcommunity.com\/groups\/([^#\/]+)(#?$|#comments|#events|\/edit|\/discussions|\/reporteddiscussions).*/
// @include     /^https?:\/\/steamcommunity.com\/groups\/([^#\/]+)(#|\/)announcements\/(create|detail|edit).*/
// @match       *://steamcommunity.com/games/*/announcements/detail/*
// @match       *://store.steampowered.com/app/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_getResourceText
// @require     https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamBBCodes/master/Beholder.js
// @resource    SteamBBCodes https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamBBCodes/master/SteamBBCodes.js
// @downloadURL https://github.com/ZeroUnderscoreOu/SteamBBCodes/raw/master/Userscript/SteamBBCodes.user.js
// @updateURL   https://github.com/ZeroUnderscoreOu/SteamBBCodes/raw/master/Userscript/SteamBBCodes.user.js
// ==/UserScript==

// Do not install from here.
// Please delete previous version if you have it.
// Install from new path:
// https://github.com/ZeroUnderscoreOu/SteamBBCodes/raw/master/Userscript/SteamBBCodes.user.js