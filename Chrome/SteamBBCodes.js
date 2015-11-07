/*
Steam BBCodes userscript 1.0.0
Written by ZeroUnderscoreOu
http://steamcommunity.com/id/ZeroUnderscoreOu/
http://steamcommunity.com/groups/0_oWassup/discussions/4/
https://github.com/ZeroUnderscoreOu/SteamBBCodes
*/

//document.getElementsByClassName("forumtopic_reply_textarea")[0]; // forum
//document.getElementsByClassName("commentthread_textarea")[0]; // comment
//document.getElementsByClassName("input_box")[0]; // review

var TextArea;
function BBCodesInitialize() {
	var TempElem;
	var TextAreas = document.body.getElementsByTagName("TextArea");
	if (TextAreas.length>0) { // if there is a textarea, probably it is for comments
		for (var A=0;A<TextAreas.length;A++) {
			TextAreas[A].onfocus = function() {
				SwitchArea(this); // switching active textarea
			};
		};
		TempElem = document.head.appendChild(new Element("Script"));
		TempElem.src = "http://steamcommunity-a.akamaihd.net/public/javascript/livepipe.js?v=.sk9HEaDHE9C5"; // scripts from guide editor
		TempElem.type = "Text/JavaScript";
		TempElem.onload = function() {
			TempElem = document.head.appendChild(new Element("Script"));
			TempElem.src = "http://steamcommunity-a.akamaihd.net/public/javascript/textarea.js?v=.KmmHJqTpwrPO";
			TempElem.type = "Text/JavaScript";
			TempElem.onload = function() {InitSectionDescriptionTextArea();}; // initializing only after scripts are loaded
		};
		//TempElem = document.head.appendChild(new Element("Style"));
		//TempElem.textContent = ".BBCodeButtons {Float:Left; Position:Relative; Left:44px;}";
	} else {
		console.log("No BB on "+window.location.href);
	};
};
function InsertButtons(Buttons,InsertionPoints) {
	for (var A=0;A<InsertionPoints.length;A++) {
		InsertionPoints[A].insertBefore(Buttons.clone(true),InsertionPoints[A].firstElementChild); // inserting buttons; cloning should be done here and not in the call as it may lead to reuse of the same element
	};
};
function SwitchArea(ActiveTextArea) {
	TextArea = new Control.TextArea(ActiveTextArea); // OnContentChanged
};
function InitSectionDescriptionTextArea() {
	var InsertionPoints;
	var TempElem = new Element("Div"); // temporary element, containing buttons
	//TempElem.className = "BBCodeButtons";
	TempElem.style.float = "Left";
	TempElem.style.position = "Relative";
	TempElem.style.left = "44px";
	TempElem.innerHTML =
		'<a onclick="BBCode_BoldSelection(this);" class="btn_grey_black btn_small_thin">'
			+ '<span><img src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_bold.png"></span>'
		+ '</a>'
		+ '<a onclick="BBCode_UnderlineSelection();" class="btn_grey_black btn_small_thin">'
			+ '<span><img src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_underline.png"></span>'
		+ '</a>'
		+ '<a onclick="BBCode_ItalicizeSelection();" class="btn_grey_black btn_small_thin">'
			+ '<span><img src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_italic.png"></span>'
		+ '</a>'
		+ '<a onclick="BBCode_StrikethroughSelection();" class="btn_grey_black btn_small_thin">'
			+ '<span><img src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_strike.png"></span>'
		+ '</a>'
		+ '<a onclick="BBCode_MakeURLFromSelection();" class="btn_grey_black btn_small_thin">'
			+ '<span><img src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_link.png"></span>'
		+ '</a>'
		+ '<a onclick="BBCode_MakeListFromSelection();" class="btn_grey_black btn_small_thin">'
			+ '<span><img src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_bullet.png"></span>'
		+ '</a>'
		+ '<a onclick="BBCode_H1Selection();" class="btn_grey_black btn_small_thin">'
			+ '<span><img src="http://steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_header1.png"></span>'
		+ '</a>';
	InsertionPoints = document.getElementsByClassName("commentthread_entry_submitlink"); // space under textarea
	InsertButtons(TempElem,InsertionPoints);
	InsertionPoints = document.getElementsByClassName("forum_newtopic_action");
	InsertButtons(TempElem,InsertionPoints);
	TempElem.style.left = "0px"; // changing dynamically according to insertion point
	InsertionPoints = document.getElementsByClassName("commentthread_edit_buttons");
	InsertButtons(TempElem,InsertionPoints);
	//blotter_status_submit_ctn
	/*
	if (!TextArea) {
		alert("Couldn't find textarea.");
	};
	*/
};
function BBCode_BoldSelection() {
	TextArea.wrapSelection('[B]','[/B]');
};
function BBCode_UnderlineSelection() {
	TextArea.wrapSelection('[U]','[/U]');
};
function BBCode_ItalicizeSelection() {
	TextArea.wrapSelection('[I]','[/I]');
};
function BBCode_StrikethroughSelection() {
	TextArea.wrapSelection('[Strike]','[/Strike]');
};
function BBCode_MakeURLFromSelection() {
	TextArea.wrapSelection('[URL=','][/URL]');
};
function BBCode_H1Selection() {
	TextArea.wrapSelection('[H1]','[/H1]');
};
function BBCode_MakeListFromSelection() {
	TextArea.collectFromEachSelectedLine(function(line) {
		return (line.match(/\*+\s/)?'[*]':'[*] ') + line;
	},'[List]\n','\n[/List]');
};
BBCodesInitialize();