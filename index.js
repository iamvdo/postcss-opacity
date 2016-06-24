var postcss = require('postcss');

module.exports = postcss.plugin('postcss-opacity', function(opts) {
  opts = opts || {};
  opts.legacy = opts.legacy || false;

  var PROP = 'opacity';

  return function(css) {

    css.walkRules(function(rule) {
      // Search through props, ignore current and insert whats missing

      var propsToTestInsert = (function(def) {
        return def.concat((opts.legacy) ? [{ prop: 'filter', order: 1 }, { prop: '-moz-opacity', order: 2 }, { prop: '-khtml-opacity', order: 3 }] : []);
      })([{ prop: 'opacity', order: 4 }, { prop: '-ms-filter', order: 0 }]);

      var propsToInsert = [];

      propsToTestInsert.sort(function(a, b) {
        return a.order > b.order;
      }).forEach(function(v) {
        // find if prop based on legacy is found
        var isPropAlreadyPresent = false;
        rule.walkDecls(v.prop, function() {
          isPropAlreadyPresent = true;
        });

        if (!isPropAlreadyPresent) {
          propsToInsert.push(v.prop);
        }
      });

      propsToInsert.forEach(function(addProp) {
        rule.walkDecls(PROP, function(decl) {
          var value = void 0,
            subOne = decl.value,
            subHundred = Math.floor(subOne * 100);

          switch (addProp) {
            case 'opacity':
            case '-moz-opacity':
            case '-khtml-opacity':
              value = subOne;
              break;
            case 'filter':
              value = 'alpha(opacity=' + subHundred + ')';
              break;
            case '-ms-filter':
              value = '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + subHundred + ')"';
              break;
          }

          if (value) {
            // adds new property only if it's not present yet and we actually found a prop
            rule.insertBefore(decl, { prop: addProp, value: value });
          }
        });
      });
    });

  };
});
