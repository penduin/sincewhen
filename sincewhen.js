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
	if(data.date) {
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
		document.querySelector("#date").innerHTML = str;
		str = [
			pad((now - date) / 1000 / 60 / 60 / 24 / 7), "w ",
			Math.floor((now - date) / 1000 / 60 / 60 / 24 % 7), "d ",
			pad((now - date) / 1000 / 60 / 60 % 24), ":",
			pad((now - date) / 1000 / 60 % 60), ":",
			pad((now - date) / 1000 % 60), "  ago"
		].join("");
		document.querySelector("#ago").innerHTML = str;
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
	showdata(data);
}

window.addEventListener("load", function() {
	var log = loadlog();
	if(log.length) {
		showdata(log[log.length - 1]);
	}
	document.querySelector("#now").addEventListener("click", now);
});
