myApp.factory('Visuals', function () {
  function execFunc(func, args, cb) {
    chrome.devtools.inspectedWindow.eval("(" + func.toString() + ").apply(this, " + (args ? JSON.stringify(args) : "") + ")", function (result, isException) {
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
    },
    getAssets: function (visualId) {
      function getVisualById(id) {
        var app = Fayde.Application.Current;
        for (var walker = app.MainSurface.walkLayers(); walker.step();) {
          for (var subwalker = walker.current.walkDeep(); subwalker.step();) {
            var node = subwalker.current.getAttachedValue("$node");
            if (node.XObject._ID === id)
              return subwalker.current;
          }
        }
      }

      var upd = getVisualById(visualId);
      if (!upd)
        return null;

      var cache = [];
      var str = JSON.stringify(upd.assets, function(key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      });
      cache = null;

      return JSON.parse(str);
    }
  };

  return {
    getFullTree: function (success, error) {
      execFunc(funcs.getFullTree, [], function (result, err) {
        if (err)
          return error(err);
        success(result);
      })
    },
    getAssets: function (visual, success, error) {
      execFunc(funcs.getAssets, [visual.id], function (result, err) {
        if (err)
          return error(err);
        success(result);
      });
    }
  }
});