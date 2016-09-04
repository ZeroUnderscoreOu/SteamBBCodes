/*
Steam BBCodes userscript 1.1.1-beta
Written by ZeroUnderscoreOu
http://steamcommunity.com/id/ZeroUnderscoreOu/
http://steamcommunity.com/groups/0_oWassup/discussions/4/
https://github.com/ZeroUnderscoreOu/SteamBBCodes
*/

//document.getElementsByClassName("forumtopic_reply_textarea")[0]; // forum
//document.getElementsByClassName("commentthread_textarea")[0]; // comment
//document.getElementsByClassName("input_box")[0]; // review

/*
//steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_bold.png
//steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_italic.png
//steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_underline.png
//steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_strike.png
//steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_link.png
//steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_header1.png
//steamcommunity-a.akamaihd.net/public/images/sharedfiles/guides/format_bullet.png
*/

/* ToDO
(возможно) переписать вставку кнопок на передачу функции для вставки, а не элемента-цели, как параметра
переписать длинный if в InsertionInitialize() на switch
*/

var TextArea;
//var TagList = ["B","I","U","Strike","Spoiler","Code","NoParse","URL","H1","Quote","List","OList"];
var TagList = { // available tags
	B: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:csgob:",
		Extended: false
	},
	I: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:Li:",
		Extended: false
	},
	U: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:U_Pneuma:",
		Extended: false
	},
	Strike: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:sforslash:",
		Extended: false
	},
	Spoiler: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:sow_info:",
		Extended: false
	},
	Code: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:hack_the_planet:",
		Extended: true
	},
	NoParse: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:cancel:",
		Extended: false
	},
	//-: "", // separator
	URL: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:LIS_Arrow:",
		Extended: false
	},
	H1: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:greenexclamation:",
		Extended: true
	},
	Quote: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:missingsay:",
		Extended: true
	},
	List: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:tablet:",
		Extended: true
	},
	OList: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:NOTES:",
		Extended: true
	},
	Table: {
		URL: "//steamcommunity-a.akamaihd.net/economy/emoticon/:cabinet:",
		Extended: true
	}
};
var Responder = { // should keep an eye on unintentionally doubling buttons
	onComplete: function(AjaxData,XHRData) {
		if (XHRData.responseJSON&&XHRData.responseJSON.comments_html) { // assuming comments' refresh either by edit or new page
			TextAreaInitialize();
			InsertionPoint = document.getElementsByClassName("commentthread_edit_buttons");
			InsertButtons(InsertionPoint,"0px","22px",BBFull);
		};
	}
};
var ButtonContainer = document.createElement("Div"); // buttons' container; new Element("Div")
var ButtonBase = document.createElement("Button"); // button template; new Element("Button")
var ButtonStyle = document.createElement("Style");
var TriggerCheck = false; // check for rules' triggering
var BBFull = true; // booleans for clearer calls of InsertButtons()
var BBLimited = false;
ButtonStyle.type = "Text/CSS";
ButtonStyle.textContent = ".BBCodeContainer {Position: Relative; Float: Left;}"
	+ ".BBCodeButton {Margin-Right: 4px; Vertical-Align: Middle;}"
	+ ".BBCodeIcon {Width: 18px; Height: 18px; Vertical-Align: Middle;}";
ButtonContainer.className = "BBCodeContainer";
//ButtonContainer.style.float = "Left";
//ButtonContainer.style.position = "Relative";
//ButtonContainer.style["text-align"] = "Left";
ButtonBase.type = "Button";
ButtonBase.className = "btn_grey_black BBCodeButton";
//InsertionPoint[0].getElementsByClassName("btn_green_white_innerfade")[0].className.replace("btn_green_white_innerfade","");
//ButtonBase.style.padding = "0px";
//ButtonBase.style["margin-right"] = "2px";
//ButtonBase.style["font-size"] = "12px";
//ButtonBase.style["text-align"] = "Left";
//ButtonContainer.style["vertical-align"] = "Middle";
function BBCodesInitialize() {
	var TempElem;
	var TextAreas = document.body.getElementsByTagName("TextArea");
	if (TextAreas.length>0) { // if there is a textarea, probably it's for comments
		document.head.appendChild(ButtonStyle);
		TextAreaInitialize();
		/**/
		if (typeof($)=="undefined") { // checking for Prototype
			console.log("Prototype")
			TempElem = document.head.appendChild(document.createElement("Script"));
			TempElem.src = "//steamcommunity-a.akamaihd.net/public/javascript/prototype-1.7.js?v=.55t44gwuwgvw";
			TempElem.type = "Text/JavaScript";
		} else {
			false;
		};
		TempElem = document.head.appendChild(document.createElement("Script")); // new Element("Script")
		TempElem.src = "//steamcommunity-a.akamaihd.net/public/javascript/livepipe.js?v=.sk9HEaDHE9C5"; // scripts from guide editor
		TempElem.type = "Text/JavaScript";
		TempElem.onload = function() {
			TempElem = document.head.appendChild(document.createElement("Script")); // new Element("Script")
			TempElem.src = "//steamcommunity-a.akamaihd.net/public/javascript/textarea.js?v=.KmmHJqTpwrPO";
			TempElem.type = "Text/JavaScript";
			TempElem.onload = function() {InsertionInitialize();}; // initializing only after scripts are loaded
		};
		/**/
		Ajax.Responders.register(Responder); // reinserting buttons in case of comment reloading - new post/edited post/new page
		//InsertionInitialize();
	};
};
function TextAreaInitialize() {
	var TextAreas = document.body.getElementsByTagName("TextArea");
	if (TextAreas.length>0) { // if there is a textarea, probably it's for comments
		for (var A=0;A<TextAreas.length;A++) {
			TextAreas[A].onfocus = function() {
				TextAreaSwitch(this); // switching active textarea
			};
		};
	} else {
		alert("No textareas on "+document.location.href); //console.log
	};
};
function TextAreaSwitch(ActiveTextArea) {
	TextArea = new Control.TextArea(ActiveTextArea); // OnContentChanged
};
function InsertionInitialize() { // I don't make additional check for if any elements were found because it would be just a cycle with 0 iterations in InsertButtons() if not
	var InsertionPoint;
	console.log("Check",!InsertionPoint);
	InsertionPoint = document.getElementsByClassName("commentthread_entry_submitlink"); // has different offset and tag support depending on page
	if (document.location.href.search("/home")>-1 // new comment in activity; trailing slash omitted just in case
		||document.location.href.search("/status/")>-1 // new comment in status
		||document.location.href.search("/friendactivitydetail/")>-1) { // new comment in purchase
		InsertButtons(InsertionPoint,"50px","22px",BBLimited);
console.log("Point",01);
	} else if (document.location.href.search("/discussions/")>-1) { // new comment on forum
		InsertButtons(InsertionPoint,"44px","22px",BBFull);
console.log("Point",02);
	} else if (document.location.href.search(/\/(id|profiles|groups)\/[^\/]*\/?$/)>-1 // new comment in profile/group
		||document.location.href.search("/filedetails/")>-1 // new comment in screenshot/artwork/Workshop/Greenlight
		||document.location.href.search("announcements/detail/")>-1 // new comment in announcement of a group/game
		||document.location.href.search("/recommended/")>-1 // new comment in review
		||document.location.href.search("/news/")>-1) { // new comment in news; Store & Community has separate news
		InsertButtons(InsertionPoint,"44px","22px",BBLimited);
		//document.location.href.search(/\/games\/\d*\/announcements\/detail\//) should be no longer needed
console.log("Point",03);
	} else if (InsertionPoint.length>0) { // kinda default
		InsertButtons(InsertionPoint,"44px","22px",BBLimited);
		alert("Steam BBCodes inserted at default point - report this page\r\n"+document.location.href);
console.log("Point",04);
	};
	if (document.location.href.search("/home")>-1) { // status
		InsertionPoint = document.getElementsByClassName("blotter_status_submit_ctn");
		InsertButtons(InsertionPoint,"40px","24px",BBLimited);
console.log("Point",10);
	};
	if (document.location.href.search("/discussions")>-1) { // new topic, topic edit; comment edit; trailing slash omitted to work with group forum index
		InsertionPoint = document.getElementsByClassName("forum_newtopic_action"); // "forum_newtopic_textcontrols" forum_newtopic_area forum_newtopic_box
		InsertButtons(InsertionPoint,"44px","22px",BBFull);
console.log("Point",11);
		InsertionPoint = document.getElementsByClassName("commentthread_edit_buttons");
		InsertButtons(InsertionPoint,"0px","22px",BBFull);
console.log("Point",12);
	};
	if (document.location.href.search("store.steampowered.com/app/")>-1) { // new review
		ButtonContainer.style.float = "none"; // prventing siblings from being on the same line
		ButtonContainer.style["margin-bottom"] = "9px";
		//InsertionPoint = document.getElementsByClassName("review_controls_right")[0];
		InsertionPoint = document.getElementsByClassName("review_controls")[0];
		InsertButtons([InsertionPoint],"0px","22px",BBFull); // passing 1 element as an array to enable length property; doesn't have suitable block for buttons, passing like this to remove additional checks
console.log("Point",13);
		//if (InsertionPoint) {};
	};
	if (document.location.href.search("/recommended/")>-1) { // review edit
		InsertionPoint = document.getElementById("ReviewEdit");
		InsertButtons([InsertionPoint],"0px","22px",BBFull,"insertBefore",document.getElementById("ReviewEditTextArea").nextSibling);
console.log("Point",14);
		//if (InsertionPoint) {};
	};
	if (document.location.href.search(/\/announcements\/(create|edit)/)>-1) { // new group announcement
		InsertionPoint = document.getElementsByClassName("btn_grey_black btn_small_thin")[0]; // "Formatting help" button
		InsertButtons([InsertionPoint.parentElement],"0px","22px",BBFull); // has a suitable block, but it doesn't have unique handles
console.log("Point",15);
		//if (InsertionPoint&&document.location.href.search("")>-1) {};
	};
	if (document.location.href.search(/\/edit$/)>-1) { // profile edit
		InsertionPoint = document.getElementsByClassName("btn_grey_black btn_small_thin")[0];
		InsertButtons([InsertionPoint.parentElement],"0px","22px",BBLimited);
console.log("Point",16);
	};
	if (document.location.href.search("/itemedittext/")>-1) { // screenshot/artwork/workshop edit
		ButtonContainer.style["margin-top"] = "5px";
		InsertionPoint = document.getElementById("ItemEditText");
		InsertButtons([InsertionPoint],"158px","22px",BBFull,"insertBefore",InsertionPoint.getElementsByClassName("btn_green_white_innerfade btn_medium")[0]); // I already use insertBefore, MB refactor other way?
console.log("Point",17);
	};
	if (document.location.href.search("/sharedfiles/edititem/")>-1) {
		InsertionPoint = document.getElementsByClassName("workshopDescContainer")[0];
		InsertButtons([InsertionPoint.lastElementChild],"0px","22px",BBFull);
console.log("Point",18);
	};
	if (!TriggerCheck) {
		alert("Didn't trigger\r\n"+document.location.href);
	};
};
function InsertButtons(InsertionPoint,ButtonOffset,ButtonHeight,BBExtended,InsertionFunction,InsertionRelation) {
	TriggerCheck = true; // check
	ButtonContainer.style.left = ButtonOffset; // changing dynamically according to insertion point
	ButtonBase.style.width = ButtonHeight; // ["min-width"]
	ButtonBase.style.height = ButtonHeight;
	for (var A=0;A<InsertionPoint.length;A++) {
		console.log("Log",InsertionPoint.length,"/",A+1,ButtonOffset,ButtonHeight,BBExtended,InsertionPoint[A]);
		var ClonedContainer = ButtonContainer.clone(true);
		/*
		var RestyledButtons = InsertionPoint[A].getElementsByClassName("btn_medium");
		for (var C=RestyledButtons.length-1;C>=0;C--) { // live collection
			RestyledButtons[C].className = RestyledButtons[C].className.replace("btn_medium","btn_small"); // resizing buttons
		};
		*/
		//TagList.forEach(function(Match)
		for (var B in TagList) // building buttons each time 'cause I need to cycle them anyway after cloning to set event handlers
		{
			if (TagList[B].Extended&&!BBExtended) { // if tag is an extended one and not supported; depends on comment destination; also serves to prevent controls' overlaping
				continue; // skip
			} else {
				if (B=="-") { // unused now
					ClonedContainer.appendChild(document.createElement("Br")); // new Element("Br")
				} else {
					var TempImg = document.createElement("Img"); // new Element("Img")
					TempImg.src = TagList[B].URL;
					TempImg.alt = B;
					TempImg.className = "BBCodeIcon";
					var ClonedBase = ButtonBase.clone();
					ClonedBase.appendChild(TempImg);
					ClonedContainer.appendChild(ClonedBase).addEventListener("click",BBCode.bind(null,B),false); // function(){}
				};
			};
		}
		//);
		if (InsertionFunction!=undefined&&InsertionRelation!=undefined) {
			InsertionPoint[A][InsertionFunction](ClonedContainer,InsertionRelation);
		} else {
			InsertionPoint[A].insertBefore(ClonedContainer,InsertionPoint[A].firstElementChild); // inserting buttons
		};
	};
};
function BBCode(Tag) {
	switch (Tag) {
		case "URL":
			TextArea.wrapSelection('['+Tag+'=','][/'+Tag+']');
			break;
		case "List":
		case "OList":
			TextArea.collectFromEachSelectedLine(function(Line) {
				return (Line.match(/\*+\s/)?'[*]':'[*] ') + Line;
			},'['+Tag+']\r\n','\r\n[/'+Tag+']');
			break;
		case "Table":
			var TableSize = prompt("Table size, width x height:").match(/\s*(\d+)\s*.\s*(\d+)\s*/);
			if (TableSize) {
				//TableSize[1] = parseInt(TableSize[1],10);
				//TableSize[2] = parseInt(TableSize[2],10);
				console.log("Table",TableSize[1],"x",TableSize[2]);
				var TableStructure = "[Table]\r\n";
				for (var A=0;A<TableSize[2];A++) {
					TableStructure += "[TR]";
					for (var B=0;B<TableSize[1];B++) {
						TableStructure += "[TD][/TD]";
					};
					TableStructure += "[/TR]\r\n";
				};
				TextArea.element.value += TableStructure + "[/Table]";
			} else {
				alert("Wrong dimensions.");
			};
			break;
		default:
			TextArea.wrapSelection('['+Tag+']','[/'+Tag+']');
			break;
	};
};
BBCodesInitialize();
//Ajax.Responders.unregister(Responder);