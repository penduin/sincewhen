var timer = null;

function loadlog() {
/*
			if(window.localStorage) {
				localStorage.removeItem("fieldState");
			this.fieldState = localStorage.getItem("fieldState");
			if(this.fieldState) {
				this.fieldState = Json.evaluate(this.fieldState, true);
			if(window.localStorage) {
				window.localStorage.setItem("actionState",
											Json.toString(that.actionState));
			}
*/
	var log = [];
	if(window.localStorage) {
		log = JSON.parse(localStorage.getItem("sincewhen_log") || "[]");
	}

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
		button = document.createElement("button");
		button.className = "delete";
		button.innerHTML = "X";
		button.title = "Delete item " + i;
		button.addEventListener("click", function(e) {
			var id = parseInt(e.target.title.replace("Delete item ", ""), null);
			log.splice(id, 1);
			if(window.localStorage) {
				localStorage.setItem("sincewhen_log", JSON.stringify(log));
			}
			load();
		});
		div.appendChild(button);
		date = new Date(log[i].date);
		div.appendChild(document.createTextNode(date.toLocaleString()));
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

function addlog(item) {
	var log = loadlog();
	log.push(item);
	if(window.localStorage) {
		localStorage.setItem("sincewhen_log", JSON.stringify(log));
	}
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
		str = [
			Math.floor((now - date) / 1000 / 60 / 60 / 24 / 7), "w ",
			Math.floor((now - date) / 1000 / 60 / 60 / 24 % 7), "d ",
			pad((now - date) / 1000 / 60 / 60 % 24), ":",
			pad((now - date) / 1000 / 60 % 60), ":",
			pad((now - date) / 1000 % 60), "  ago"
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
		date: new Date()
	};
	addlog(data);
	load();
}

function showpage(e) {
	var show = e.target.className.replace("show_", "");
	console.log("showpage", show);
	var pages = document.querySelectorAll(".page");
	var i = 0;
	for(i = 0; i < pages.length; ++i) {
		pages[i].classList.add("hidden");
	}
	document.querySelector("#" + show).classList.remove("hidden");
}

function load() {
	var log = loadlog();
	if(log.length) {
		showdata(log[log.length - 1]);
	} else {
		showdata();
	}
}

window.addEventListener("load", function() {
	load();
	document.querySelector("#now").addEventListener("click", now);
	var btns = document.querySelectorAll("button[class^='show_']");
	var i = 0;
	for(i = 0; i < btns.length; ++i) {
		btns[i].addEventListener("click", showpage);
	}
});
