myApp.controller("PageController", function ($scope, pageInfoService) {
	var port = chrome.runtime.connect({name: "Eval in context"});
	$scope.onclick = function() {
		port.postMessage("hi");
	}
});
