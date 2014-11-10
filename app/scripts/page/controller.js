myApp.controller("PageController", function ($scope, pageInfoService, Visuals) {
  var port = chrome.runtime.connect({name: "devtool"});
  var tabId = chrome.devtools.inspectedWindow.tabId;

  $scope.layers = [];

  $scope.getFullTree = function () {
    Visuals.getFullTree(function (layers) {
      $scope.layers = layers;
      $scope.$digest();
    }, function (error) {
      debug(error);
      $scope.root = "error";
      $scope.$digest();
    });
  };

  $scope.getFullTree();


  $scope.onclick = function (name) {
    port.postMessage({key: "tab", message: name, tabId: tabId});
  };
  $scope.sayHi = function () {
    port.postMessage({key: "panel", message: "hi", tabId: tabId});
  };
  $scope.sayHiToName = function (name) {
    port.postMessage({key: "panel", message: name, tabId: tabId});
  };

  function debug(msg) {
    port.postMessage({key: "debug", message: msg, tabId: tabId});
  }
});
