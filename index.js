var postcss = require('postcss'),
  concat = require('lodash.concat'),
  each = require('lodash.foreach');

module.exports = postcss.plugin('postcss-opacity', function (opts) {
  opts = opts || {};
  opts.legacy = opts.legacy || false;

  var PROP = 'opacity';

  return function (css) {

    css.walkRules(function (rule) {
      // Search through props, ignore current and insert whats missing

      var propsToTestInsert = (function (def) {
        return concat(def, (opts.legacy) ? ['filter', '-moz-opacity', '-khtml-opacity'] : []);
      })(['opacity', '-ms-filter']);

      var propsToInsert = [];

      each(propsToTestInsert, function (v) {
        // find if prop based on legacy is found
        var isPropAlreadyPresent = false;
        rule.walkDecls(v, function () {
          isPropAlreadyPresent = true;
        });

        if (!isPropAlreadyPresent) {
          propsToInsert.push(v);
        }
      });

      each(propsToInsert, function (addProp) {
        rule.walkDecls(PROP, function (decl) {
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
            rule.insertAfter(decl, { prop: addProp, value: value });
          }
        });
      });
    });

  };
});
