myApp.directive('treeView', ['$q', function ($q) {
	return {
		restrict: 'A',
		scope: {
			value: '=treeView'
		},
		replace: true,
		template:
			'<div class="tree">' +
				'<div tree-view-node="value">' +
				'</div>' +
			'</div>',
		controller: ['$scope', function ($scope) {

			var self = this,
				selectedNode;

			self.selectNode = function (value) {
				if (selectedFile) {
					selectedFile = undefined;
				}
				selectedNode = value;
			};

			self.isSelected = function (value) {
				return value === selectedNode;
			};

		}]
	};
}]);

myApp.directive('treeViewNode', ['$q', '$compile', function ($q, $compile) {
	return {
		restrict: 'A',
		require: '^treeView',
		link: function (scope, element, attrs, controller) {

			scope.expanded = false;

			scope.selectNode = function (value, event) {
				event.preventDefault();
				toggleExpanded();
				var nodeScope = scope;
				while (nodeScope.value) {
					nodeScope = nodeScope.$parent;
				}
				controller.selectNode(value);
			};
			
			scope.isSelected = function (node) {
				return controller.isSelected(node);
			};

			scope.isDict = function (obj) {
				if (obj != undefined) {
					if (obj.constructor === Array) {
						return false;
					} 
					if (obj.constructor === String) {
						return false;
					} 
					if (obj.constructor === Object) {
						return true;
					}
					if (obj.constructor === Number) {
						return true;
					}
					return false;
				} else {
					return false;
				}
			}
			scope.getFileType = function(obj) {
				if (obj != undefined) {
					if (obj.constructor === Array) {
						return 'Array';
					}
					if (obj.constructor === String) {
						return 'String';
					} 
					if (obj.constructor === Object) {
						return 'Obj';
					}
					if (obj.constructor === Number) {
						return 'Number';
					}
					return 'N/A';
				} else {
					return 'N/A';
				}
			}

			function toggleExpanded() {
				if (!scope.isDict(scope.value)) return;
				scope.expanded = !scope.expanded;
			}

			function render() {
				var template =
					'<div class="tree-folder" ng-repeat="(key, value) in ' + attrs.treeViewNode + '">' +
						'<a href="#" class="tree-folder-header inline" ng-click="selectNode(value, $event)"}" ng-class="{ selected: isSelected(value) }">' +
							'<span class="tree-folder-name">{{key}} {{getFileType(value)}}</span> ' +
						'</a>' +
						'<div class="tree-folder-content" ng-show="expanded" >' +
							'<div ng-if="isDict(value)">' +
								'<div tree-view-node="value"></div>' +
							'</div>' +
							'<div ng-if="!isDict(value)">' +
								'<div class="tree-folder">' +
									'<div class="tree-folder-header inline">{{value}}</div>' +
								'</div>' + 
							'</div>' +
						'</div>' +
					'</div>';

				element.html('').append($compile(template)(scope));
			}

			render();
		}
	};
}]);