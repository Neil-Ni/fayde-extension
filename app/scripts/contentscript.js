'use strict';

chrome.runtime.onMessage.addListener(function (message, sender) {
	console.log('Received message from background; sending it to DOM context (content.js): ' + message);
	executeScriptInPageContext(message);
});

function executeScriptInPageContext(m) { alert(m); }