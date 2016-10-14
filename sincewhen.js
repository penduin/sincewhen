var timer = null;
var editing = null;

function loadlog() {
	var log = [];
	log = JSON.parse(localStorage.getItem("sincewhen_log") || "[]");

	var i = 0;
	var elm = document.querySelector("#log");
	while(elm.firstChild) {
		elm.removeChild(elm.firstChild);
	}
	var div = null;
	var clear = null;
	var button = null;
	var date = null;
	for(i = 0; i < log.length; ++i) {
		div = document.createElement("div");
		div.className = "log";

		// delete
		button = document.createElement("a");
		button.href = "#";
		button.className = "delete";
		button.innerHTML = "X";
		button.title = "Delete item " + i;
		button.addEventListener("click", function(e) {
			var id = parseInt(e.target.title.replace("Delete item ", ""), null);
			log.splice(id, 1);
			localStorage.setItem("sincewhen_log", JSON.stringify(log));
			load();
		});
		div.appendChild(button);

		// edit
		button = document.createElement("a");
		button.href = "#";
		button.className = "edit";
		button.innerHTML = "&hellip;";
		button.title = "Edit item " + i;
		button.addEventListener("click", function(e) {
			var id = parseInt(e.target.title.replace("Edit item ", ""), null);
			editing = id;
			var input = document.querySelector("#recdate");

			/* works in ff but not in chrome
			var dat = new Date(log[id].date);
			var utc = new Date();
			var offset = utc.valueOf() - new Date(utc.toISOString().substring(0, 19)).valueOf();
			console.log(dat, utc, offset);
			input.value = new Date(dat.valueOf() + offset).toISOString().substring(0, 19);
			*/
			/* works in chrome but not fucking mobile chrome
			var dat = new Date(log[id].date);
			var local = new Date();
			local.setUTCFullYear(dat.getFullYear());
			local.setUTCMonth(dat.getMonth());
			local.setUTCDate(dat.getDate());
			local.setUTCHours(dat.getHours());
			local.setUTCMinutes(dat.getMinutes());
			local.setUTCSeconds(dat.getSeconds());
			input.value = local.toISOString().substring(0, 19);
			*/
			var dat = new Date(log[id].date);
			input.value = [
				dat.getFullYear(),
				"-",
				pad(dat.getMonth() + 1, 2),
				"-",
				pad(dat.getDate(), 2),
				"T",
				pad(dat.getHours(), 2),
				":",
				pad(dat.getMinutes(), 2),
				":",
				pad(dat.getSeconds(), 2)
			].join("");

			var sel = document.querySelector("#rectype");
			while(sel.firstChild) {
				sel.removeChild(sel.firstChild);
			}
			var lbls = document.querySelectorAll("#type option.custom");
			var option = document.createElement("option");
			option.value = "";
			option.innerHTML = "(no label)";
			sel.appendChild(option);
			for(i = 0; i < lbls.length; ++i) {
				option = lbls.item(i).cloneNode(true);
				option.selected = (log[id].label === option.value);
				sel.appendChild(option);
			}
			showpage({target: {className: "show_edit"}});
		});
		div.appendChild(button);

		date = new Date(log[i].date);
		div.appendChild(document.createTextNode(date.toLocaleString()));
		div.appendChild(document.createElement("br"));
		div.appendChild(document.createTextNode(log[i].label || ""));
		clear = document.createElement("div");
		clear.className = "clear";
		div.appendChild(clear);
		elm.appendChild(div);
	}
	if(i < 1) {
		elm.appendChild(document.createTextNode("No history."));
	}

	return log;
}

function set() {
	var log = JSON.parse(localStorage.getItem("sincewhen_log") || "[]");

//	var dat = new Date(document.querySelector("#recdate").value);
//	var utc = new Date();
//	var offset = utc.valueOf() - new Date(utc.toISOString().substring(0, 19)).valueOf();
//	var date = new Date(dat.valueOf() - offset).toISOString().substring(0, 19);
/*
	var local = new Date(document.querySelector("#recdate").value);
	var date = new Date();
	date.setFullYear(local.getUTCFullYear());
	date.setMonth(local.getUTCMonth());
	date.setDate(local.getUTCDate());
	date.setHours(local.getUTCHours());
	date.setMinutes(local.getUTCMinutes());
	date.setSeconds(local.getUTCSeconds());
*/
	var str = document.querySelector("#recdate").value;
	var date = new Date();
	// "0123-56-89T12:45:78"
	date.setFullYear(str.substring(0, 4));
	date.setMonth(parseInt(str.substring(5, 7) - 1, null));
	date.setDate(str.substring(8, 10));
	date.setHours(str.substring(11, 13));
	date.setMinutes(str.substring(14, 16));
	date.setSeconds(str.substring(17, 19));

	var data = {
		date: date,
		label: document.querySelector("#rectype").value
	};
	log.splice(editing, 1, data);
	log = log.sort(function(a, b) {
		return new Date(a.date) - new Date(b.date);
	});
	localStorage.setItem("sincewhen_log", JSON.stringify(log));
	load();
	showpage({target: {className: "show_history"}});
}

function addlog(item) {
	var log = loadlog();
	log.push(item);
	localStorage.setItem("sincewhen_log", JSON.stringify(log));
}

function loadlabels() {
	var tag = [];
	tag = JSON.parse(localStorage.getItem("sincewhen_tag") || "[]");

	var picker = document.querySelector("#type");
	var option = null;
	while(option = picker.querySelector("option.custom")) {
		picker.removeChild(option);
	}

	var i = 0;
	var elm = document.querySelector("#tag");
	while(elm.firstChild) {
		elm.removeChild(elm.firstChild);
	}
	var div = null;
	var clear = null;
	var button = null;
	for(i = 0; i < tag.length; ++i) {
		div = document.createElement("div");
		div.className = "tag";
		button = document.createElement("a");
		button.href = "#";
		button.className = "delete";
		button.innerHTML = "X";
		button.title = "Delete item " + i;
		button.addEventListener("click", function(e) {
			var id = parseInt(e.target.title.replace("Delete item ", ""), null);
			tag.splice(id, 1);
			localStorage.setItem("sincewhen_tag", JSON.stringify(tag));
			load();
		});
		div.appendChild(button);
		div.appendChild(document.createTextNode(tag[i]));
		clear = document.createElement("div");
		clear.className = "clear";
		div.appendChild(clear);
		elm.appendChild(div);

		option = document.createElement("option");
		option.className = "custom";
		option.value = tag[i];
		option.appendChild(document.createTextNode(tag[i]));
		picker.insertBefore(option, picker.querySelector(".last"));
	}
	if(i < 1) {
		elm.appendChild(document.createTextNode("No labels."));
	}

	picker.value = localStorage.getItem("sincewhen_filter") || "";

	return tag;
}

function addlabel() {
	var item = prompt("New label name");
	if(!item) {
		return;
	}
	if(item === "_labels") {
		alert("Can't add a label called '_labels'.  Sorry!");
		return;
	}
	var tag = loadlabels();
	tag.push(item);
	localStorage.setItem("sincewhen_tag", JSON.stringify(tag));
	loadlabels();
}

function picklabel(e) {
	if(this.value === "_labels") {
		showpage({target: {className: "show_labels"}});
		document.querySelector("#type").value = localStorage.getItem("sincewhen_filter") || "";
		return;
	}
	localStorage.setItem("sincewhen_filter", this.value);
	load();
}

function pad(num, len) {
	len = len || 2;
	var str = Math.floor(num).toString();
	while(str.length < len) {
		str = "0" + str;
	}
	return str;
}

function showdata(data) {
	if(timer) {
		clearTimeout(timer);
	}
	if(data && data.date) {
		var date = new Date(data.date);
		var now = new Date();
		var future = false;
		var str = [
			date.getFullYear(), "-",
			pad(date.getMonth() + 1), "-",
			pad(date.getDate()),
			"  ",
			pad(date.getHours()), ":",
			pad(date.getMinutes()), ":",
			pad(date.getSeconds())
		].join("");
//		document.querySelector("#date").innerHTML = str;
		document.querySelector("#date").innerHTML = date.toLocaleString();
		if(date > now) {
			future = true;
			var tmp = date;
			date = now;
			now = tmp;
		}
		str = [
			(future ? "in " : ""),
			Math.floor((now - date) / 1000 / 60 / 60 / 24 / 7), "w ",
			Math.floor((now - date) / 1000 / 60 / 60 / 24 % 7), "d ",
			pad((now - date) / 1000 / 60 / 60 % 24), ":",
			pad((now - date) / 1000 / 60 % 60), ":",
			pad((now - date) / 1000 % 60), (future ? "" : "  ago")
		].join("");
		document.querySelector("#ago").innerHTML = str;
	} else {
		document.querySelector("#date").innerHTML = "----------  --:--:--";
		document.querySelector("#ago").innerHTML = "--- -- --:--:--  ago";
	}
	timer = setTimeout(function() {
		showdata(data);
	}, 1000);
}

function now() {
	var data = {
		date: new Date(),
		label: localStorage.getItem("sincewhen_filter") || ""
	};
	addlog(data);
	load();
}

function showpage(e) {
	var show = e.target.className.replace("show_", "");
	//console.log("showpage", show);
	var pages = document.querySelectorAll(".page");
	var i = 0;
	for(i = 0; i < pages.length; ++i) {
		pages[i].classList.add("hidden");
	}
	document.querySelector("#" + show).classList.remove("hidden");
}

function load() {
	var log = loadlog();
	var filt = localStorage.getItem("sincewhen_filter") || "";
	if(filt) {
		log = log.filter(function(item) {
			return item.label && item.label === filt;
		});
	}
	if(log.length) {
		showdata(log[log.length - 1]);
	} else {
		showdata();
	}

	loadlabels();
}

window.addEventListener("load", function() {
	load();
	document.querySelector("#now").addEventListener("click", now);
	document.querySelector("#set").addEventListener("click", set);
	var btns = document.querySelectorAll("a[class^='show_']");
	var i = 0;
	for(i = 0; i < btns.length; ++i) {
		btns[i].addEventListener("click", showpage);
	}

	document.querySelector("#type").addEventListener("change", picklabel);
	document.querySelector("#addlabel").addEventListener("click", addlabel);
});

// hacks for dumb modern mobile browsers
document.addEventListener("touchstart", function(){}, true);
