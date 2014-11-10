myApp.controller("PageController", function ($scope, pageInfoService) {
	var port = chrome.runtime.connect({name: "devtool"});

  var tabId = chrome.devtools.inspectedWindow.tabId;
	$scope.onclick = function(name) {
		port.postMessage({key: "tab", message: name, tabId: tabId});
	}
	$scope.sayHi = function() {
		port.postMessage({key: "panel", message: "hi", tabId: tabId});
	}
	$scope.sayHiToName = function(name) {
		port.postMessage({key: "panel", message: name, tabId: tabId});
	}
});
