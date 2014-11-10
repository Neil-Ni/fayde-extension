'use strict';

chrome.runtime.onMessage.addListener(function (message, sender) {
	console.log('Received message from background; sending it to DOM context (content.js): ' + message);
	switch(message.key) {
		case "panel":
			executeScriptInPageContext(message.message);
			return
		case "tab":
			var script = document.createElement('script');
			script.textContent = '(function(){' +
									'window.greeting = "hola, ";' +
									'window.button = document.getElementById("mybutton");' +
									'button.person_name = \'' + message.message + '\'' +
									'})()';
			(document.head||document.documentElement).appendChild(script);
			script.parentNode.removeChild(script);
			return;
		default:
			console.log("nothing happened");
			return
	}

});

function executeScriptInPageContext(m) { alert(m); }