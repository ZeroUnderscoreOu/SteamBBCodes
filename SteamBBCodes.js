/*
Steam BBCodes userscript 1.3.0
Written by ZeroUnderscoreOu
http://steamcommunity.com/id/ZeroUnderscoreOu/
http://steamcommunity.com/groups/0_oWassup/discussions/4/
https://github.com/ZeroUnderscoreOu/SteamBBCodes
*/

//document.getElementsByClassName("forumtopic_reply_textarea")[0]; // forum
//document.getElementsByClassName("commentthread_textarea")[0]; // comment
//document.getElementsByClassName("input_box")[0]; // review

/* ToDO
(возможно) переписать создание кнопок полностью динамически, без клонирования; создавать ButtonContainer динамически; придумать, как передавать стили для него
(возможно) переписать массивы из одного элемента и сложные селекторы в InsertionInitialization()
*/

"use strict";
var CurTextArea; // selected textarea
var ButtonContainer = document.createElement("Div"); // buttons' container;
var ButtonBase = document.createElement("Button"); // button template;
var BBFull = true; // booleans for clearer calls of ButtonInsertion()
var BBLimited = false;
var TagList = { // available tags
	B: {
		Title: "Bold",
		Offset: (-16 * 0).toString(10) + "px 0px",
		Extended: false
	},
	I: {
		Title: "Italics",
		Offset: (-16 * 1).toString(10) + "px 0px",
		Extended: false
	},
	U: {
		Title: "Underline",
		Offset: (-16 * 2).toString(10) + "px 0px",
		Extended: false
	},
	Strike: {
		Title: "Strikethrough",
		Offset: (-16 * 3).toString(10) + "px 0px",
		Extended: false
	},
	URL: {
		Title: "URL",
		Offset: (-16 * 4).toString(10) + "px 0px",
		Extended: false
	},
	Spoiler: {
		Title: SteamBBCodes.HeSeesUs
			? "BEHOLDER\r\nSee the console"
			: "Spoiler",
		Offset: SteamBBCodes.HeSeesUs
			? (-16 * 13).toString(10) + "px 0px"
			: (-16 * 5).toString(10) + "px 0px",
		Extended: false
	},
	H1: {
		Title: "Header",
		Offset: (-16 * 6).toString(10) + "px 0px",
		Extended: true
	},
	Quote: {
		Title: "Quote",
		Offset: (-16 * 7).toString(10) + "px 0px",
		Extended: true
	},
	Code: {
		Title: "Code",
		Offset: (-16 * 8).toString(10) + "px 0px",
		Extended: true
	},
	NoParse: {
		Title: "NoParse",
		Offset: (-16 * 9).toString(10) + "px 0px",
		Extended: false
	},
	OList: {
		Title: "Ordered list",
		Offset: (-16 * 10).toString(10) + "px 0px",
		Extended: true
	},
	List: {
		Title: "Unordered list",
		Offset: (-16 * 11).toString(10) + "px 0px",
		Extended: true
	},
	Table: {
		Title: "Table",
		Offset: (-16 * 12).toString(10) + "px 0px",
		Extended: true
	}
};
var Responder = { // reinserting buttons - new post/edited post/new page on forum; announcement/event/comment in group
	onComplete: function(AjaxData,XHRData) {
		let URLHash = document.location.hash;
		if ((document.location.pathname.includes("/discussions")||document.location.pathname.includes("/reporteddiscussions/"))
			&&XHRData.responseJSON
			&&XHRData.responseJSON.comments_html) { // comments' refresh either by edit or new page
			let InsertionPoint = document.getElementsByClassName("commentthread_edit_buttons");
			let TextArea = document.getElementsByClassName("commentthread_textarea")
			TextAreaInitialization(TextArea);
			console.log("Point",13,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"0px","22px",BBFull);
			DiscussionsButtonFix();
		};
		if ((URLHash.includes("announcements/detail/")||URLHash.includes("comments")||URLHash.includes("events/"))
			&&XHRData.responseText
			&&XHRData.responseText.includes("group_tab_content_announcements")) { // event details
			let InsertionPoint = document.querySelectorAll("#group_tab_content_announcements .commentthread_entry_submitlink");
			let TextArea = document.querySelectorAll("#group_tab_content_announcements .commentthread_textarea");
			TextAreaInitialization(TextArea);
			console.log("Point",14,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"44px","22px",BBLimited);
		};
	}
};
ButtonContainer.className = "BBCodeContainer";
ButtonBase.type = "Button";
ButtonBase.className = "btn_grey_black BBCodeButton";
ButtonBase = ButtonBase.appendChild(document.createElement("Img"));
ButtonBase.className = "ico16";
ButtonBase = ButtonBase.parentElement;
BBCodesInitialization();

function BBCodesInitialization() {
var TextArea = document.body.getElementsByTagName("TextArea");
	if (TextArea.length) { // if there is a textarea, probably it's for comments
		let ButtonStyle = document.createElement("Style");
		ButtonStyle.type = "Text/CSS";
		ButtonStyle.textContent =
			".BBCodeContainer {Position: Relative; Float: Left;}"
			+ "Button.BBCodeButton {Margin-Right: 4px;}"
			+ "Button.BBCodeButton .ico16 {Width: 16px; Height: 16px; Vertical-Align: Middle; Background-Image: URL(https://raw.githubusercontent.com/ZeroUnderscoreOu/SteamBBCodes/master/BackgroundIcons.png);}";
		document.head.appendChild(ButtonStyle);
		TextAreaInitialization(TextArea);
		InsertionInitialization();
	} else {
		alert("Steam BBCodes found no textareas on\r\n"+document.location.href); // should remove this check later
	};
};

function TextAreaInitialization(TextArea) {
	for (let A=0;A<TextArea.length;A++) { // forEach
		TextArea[A].addEventListener(
			"focus",
			function(){CurTextArea=this},
			false
		);
	};
};

function InsertionInitialization() { // I don't make additional check for if any elements were found because it would be just a cycle with 0 iterations in ButtonInsertion() if not
	var InsertionPoint; // preventing repeated declaration in cases; has different offset and tag support depending on page
	var URLPath = document.location.pathname;
	var URLHash = document.location.hash;
	switch (true) { // needs to be true
		case URLPath.includes("/home"): // new status, new comment in activity; trailing slash omitted just in case; no break for the next case
			InsertionPoint = document.getElementsByClassName("blotter_status_submit_ctn");
			console.log("Point",1,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"40px","24px",BBLimited);
		case URLPath.includes("/status/"): // new comment in status
		case URLPath.includes("/friendactivitydetail/"): // new comment in purchase
			InsertionPoint = document.getElementsByClassName("commentthread_entry_submitlink");
			console.log("Point",2,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"50px","22px",BBLimited);
			break;
		case URLPath.includes("/recommended/"): // new comment in review, review edit; no break
			InsertionPoint = [document.getElementById("ReviewEdit")]; // making a 1 element array to enable length property
			console.log("Point",3,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"0px","22px",BBFull,"insertBefore",document.getElementById("ReviewEditTextArea").nextSibling);
			//if (InsertionPoint) {};
		case !!URLPath.match(/\/(id|profiles|groups)\/[^\/]+\/?$/): // new comment in profile/group
		case URLPath.includes("/sharedfiles/filedetails/"): // new comment in screenshot/artwork/Workshop/Greenlight
		case document.location.href.includes("announcements/detail/"): // new comment in announcement of a group/game; may be either path or hash
		case URLPath.includes("/news/"): // new comment in news; Store & Community has separate news
		//case URLHash.includes("events/"): // new comment in group event; falls under group path match
		//case URLHash.includes("comments"): // new comment on group's comments page; falls under group path match
		case URLPath.includes("/allcomments"): // new comment on profile's comments page
			InsertionPoint = document.getElementsByClassName("commentthread_entry_submitlink");
			console.log("Point",4,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"44px","22px",BBLimited);
			Ajax.Responders.register(Responder);
			break;
		case !!URLPath.match(/\/discussions(\/forum)?\/\d{1,2}\/\d+/): // new comment, comment edit on forum; no break
		case URLPath.includes("/reporteddiscussions/"): // new comment in report
			InsertionPoint = document.getElementsByClassName("commentthread_entry_submitlink");
			console.log("Point",5.1,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"44px","22px",BBFull);
			InsertionPoint = document.getElementsByClassName("commentthread_edit_buttons");
			console.log("Point",5.2,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"0px","22px",BBFull);
			Ajax.Responders.register(Responder);
		case URLPath.includes("/discussions"): // new topic, topic edit on forum; report edit; trailing slash omitted to work with group forum index
			InsertionPoint = document.querySelectorAll(".forum_newtopic_action:Not([Id*='throbber'])"); // avoiding the throbber // forum_newtopic_textcontrols
			console.log("Point",6,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"44px","22px",BBFull);
			DiscussionsButtonFix();
			break;
		case document.location.href.includes("store.steampowered.com/app/"): // new review
			ButtonContainer.style.float = "none"; // prventing siblings from being on the same line
			ButtonContainer.style["margin-bottom"] = "9px";
			//InsertionPoint = document.getElementsByClassName("review_controls_right")[0];
			InsertionPoint = [document.getElementsByClassName("review_controls")[0]];
			console.log("Point",7,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"0px","22px",BBFull); // doesn't have suitable block for buttons, passing like this to remove additional checks
			//if (InsertionPoint) {};
			break;
		case !!URLPath.match(/\/announcements\/(create|edit)/): // new group announcement
			ButtonContainer.style.top = "1px";
			InsertionPoint = [document.getElementsByClassName("btn_grey_black btn_small_thin")[0].parentElement]; // "Formatting help" button; has a suitable block, but it doesn't have unique handles
			console.log("Point",8,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"0px","22px",BBFull);
			//if (InsertionPoint&&URLPath.includes("")) {};
			break;
		case !!URLPath.match(/\/edit(\/profile)?$/): // user/group profile edit
			ButtonContainer.style.top = "1px";
			InsertionPoint = [document.getElementsByClassName("btn_grey_black btn_small_thin")[0].parentElement];
			console.log("Point",9,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"0px","22px",BBLimited);
			break;
		case URLPath.includes("/sharedfiles/itemedittext/"): // screenshot/artwork/workshop edit
			ButtonContainer.style["margin-top"] = "5px";
			InsertionPoint = [document.getElementById("ItemEditText")];
			console.log("Point",10,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"158px","22px",BBFull,"insertBefore",InsertionPoint[0].getElementsByClassName("btn_green_white_innerfade btn_medium")[0]); // I already use insertBefore, MB refactor other way?
			break;
		case URLPath.includes("/sharedfiles/edititem/"): // new artwork
			InsertionPoint = [document.getElementsByClassName("workshopDescContainer")[0].lastElementChild];
			console.log("Point",11,InsertionPoint.length);
			ButtonInsertion(InsertionPoint,"0px","22px",BBFull);
			break;
		default: // kinda default
			InsertionPoint = document.getElementsByClassName("commentthread_entry_submitlink");
			if (InsertionPoint.length) {
				console.log("Point",12,InsertionPoint.length);
				ButtonInsertion(InsertionPoint,"44px","22px",BBLimited);
				alert("Steam BBCodes inserted at default point\r\n"+document.location.href);
			} else {
				console.log("Point",0,InsertionPoint.length);
				alert("Steam BBCodes has no place to insert to\r\n"+document.location.href);
			};
			break;
	};
};

function ButtonInsertion(InsertionPoint,ButtonOffset,ButtonHeight,BBExtended,InsertionFunction,InsertionRelation) {
	ButtonContainer.style.left = ButtonOffset; // changing dynamically according to insertion point
	ButtonBase.style.width = ButtonHeight; // ["min-width"]
	ButtonBase.style.height = ButtonHeight;
	for (let A=0;A<InsertionPoint.length;A++) { // forEach()
		let ClonedContainer = ButtonContainer.cloneNode(true);
		Object.keys(TagList).forEach(function(Match){ // building buttons each time 'cause I need to cycle them anyway after cloning to set event handlers
			if (BBExtended||!TagList[Match].Extended) { // if all tags are supported or tag isn't an extended one; depends on comment destination; also serves to prevent controls' overlaping
				let ClonedBase = ButtonBase.cloneNode(true);
				ClonedBase.title = TagList[Match].Title;
				ClonedBase.querySelector("Img").style["background-position"] = TagList[Match].Offset;
				ClonedContainer.appendChild(ClonedBase).addEventListener(
					"click",
					BBCode.bind(this,Match),
					false
				);
			};
		});
		if (InsertionFunction!=undefined&&InsertionRelation!=undefined) {
			InsertionPoint[A][InsertionFunction](ClonedContainer,InsertionRelation);
		} else {
			InsertionPoint[A].insertBefore(ClonedContainer,InsertionPoint[A].firstElementChild); // inserting buttons
		};
	};
};

function DiscussionsButtonFix() { // resizing buttons for consistent look
	Array.from(document.querySelectorAll(".forum_newtopic_action > .btn_medium,	.commentthread_edit_buttons > .btn_medium")).forEach(function(Match){
		Match.classList.toggle("btn_medium"); // medium size off
		Match.classList.toggle("btn_small"); // small size on
	});
};

function BBCode(Tag) { // tags use only "\n" to match form linebreaks in further checks
	switch (Tag) {
		case "URL":
			WrapSelection("["+Tag+"="+prompt("Link:")+"]","[/"+Tag+"]");
			break;
		case "List":
		case "OList":
			WrapSelectionMultiline("["+Tag+"]\n","\n[/"+Tag+"]","[*] ");
			break;
		case "Table":
			let TableSize = prompt("Table size, width x height:").match(/\s*(\d+)\s*.\s*(\d+)\s*/);
			if (TableSize) {
				let Start = CurTextArea.selectionEnd;
				let Text = CurTextArea.value;
				let TableStructure = "[Table]\n";
				TableSize[1] = parseInt(TableSize[1],10);
				TableSize[2] = parseInt(TableSize[2],10);
				for (let A=0;A<TableSize[2];A++) {
					TableStructure += "    [TR]\n";
					for (let B=0;B<TableSize[1];B++) {
						TableStructure += "        [TD]\n        [/TD]\n";
					};
					TableStructure += "    [/TR]\n";
				};
				TableStructure += "[/Table]";
				CurTextArea.value = Text.substring(0,CurTextArea.selectionEnd)
					+ TableStructure
					+ Text.substring(CurTextArea.selectionEnd,Text.length);
				CurTextArea.selectionStart = Start;
				CurTextArea.selectionEnd = Start + TableStructure.length;
			} else {
				alert("Wrong dimensions.");
			};
			break;
		default:
			WrapSelection("["+Tag+"]","[/"+Tag+"]");
			break;
	};
};

function WrapSelection(Before,After) {
	var Start = CurTextArea.selectionStart;
	var End = CurTextArea.selectionEnd;
	var Text = CurTextArea.value;
	var Selection = Text.substring(CurTextArea.selectionStart,CurTextArea.selectionEnd);
	if (Selection.startsWith(Before)&&Selection.endsWith(After)) {
		Selection = Selection.substring(Before.length,Selection.length-After.length);
		End -= Before.length + After.length;
	} else {
		Selection = (Before || "") + Selection + (After || "");
		End += Before.length + After.length;
	};
	CurTextArea.value = Text.substring(0,CurTextArea.selectionStart)
		+ Selection
		+ Text.substring(CurTextArea.selectionEnd,Text.length);
	CurTextArea.selectionStart = Start; // preserving selection
	CurTextArea.selectionEnd = End;
};

function WrapSelectionMultiline(Before,After,LineBefore,LineAfter) {
	var Start = CurTextArea.selectionStart;
	var End = CurTextArea.selectionEnd;
	var Text = CurTextArea.value;
	var Selection = Text.substring(CurTextArea.selectionStart,CurTextArea.selectionEnd);
	var SelectionLength = Selection.length;
	if (Selection.startsWith(Before)&&Selection.endsWith(After)) {
		Selection = Selection.substring(Before.length,Selection.length-After.length);
		Selection = Selection.split("\n");
		Selection.forEach(function(Match,Index){
			Selection[Index] = Match.substring((LineBefore||"").length,Match.length-(LineAfter||"").length);
		});
		Selection = Selection.join("\n");
		End -= SelectionLength - Selection.length;
	} else {
		Selection = Selection.split("\n");
		Selection.forEach(function(Match,Index){
			Selection[Index] = (LineBefore || "") + Match + (LineAfter || "");
		});
		Selection = Selection.join("\n");
		Selection = (Before || "") + Selection + (After || "");
		End += Selection.length - SelectionLength;
	};
	CurTextArea.value = Text.substring(0,CurTextArea.selectionStart)
		+ Selection
		+ Text.substring(CurTextArea.selectionEnd,Text.length);
	CurTextArea.selectionStart = Start;
	CurTextArea.selectionEnd = End;
};

//Ajax.Responders.unregister(Responder);