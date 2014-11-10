myApp.factory('Visuals', function () {
  function execFunc(func, cb) {
    chrome.devtools.inspectedWindow.eval("(" + func.toString() + ")()", function (result, isException) {
      cb(result, isException);
    });
  }

  var funcs = {
    getFullTree: function () {
      function serializeUpdater(upd) {
        var node = upd.getAttachedValue("$node");
        var xobj = node.XObject;
        var xtype = xobj.constructor;
        var children = [];
        for (var cwalker = upd.tree.walk(); cwalker.step();) {
          children.push(serializeUpdater(cwalker.current));
        }
        return {
          id: xobj._ID,
          type: {
            xmlns: xtype.$$xmlns,
            name: xtype.name
          },
          children: children
        };
      }

      var arr = [];
      var app = Fayde.Application.Current;
      for (var walker = app.MainSurface.walkLayers(); walker.step();) {
        arr.push(serializeUpdater(walker.current));
      }
      return arr;
    }
  };

  return {
    getFullTree: function (success, error) {
      execFunc(funcs.getFullTree, function (result, isException) {
        if (isException)
          return error(isException);
        success(result);
      })
    }
  }
});