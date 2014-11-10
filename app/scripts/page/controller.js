myApp.controller("PageController", function ($scope, pageInfoService) {
	var port = chrome.runtime.connect({name: "devtool"});
	$scope.onclick = function(name) {
		port.postMessage({key: "tab", message: name})
	}
	$scope.sayHi = function() {
		port.postMessage({key: "panel", message: "hi"});
	}
	$scope.sayHiToName = function(name) {
		port.postMessage({key: "panel", message: name});
	}
});
