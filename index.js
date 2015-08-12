var postcss = require('postcss');

module.exports = postcss.plugin('postcss-opacity', function (opts) {
  opts = opts || {};

  var PROP         = 'opacity';
  var PROP_REPLACE = '-ms-filter';

  return function (css) {

    css.eachRule(function (rule) {
      rule.eachDecl(PROP, function (decl) {

        // get amount and create value
        var amount = Math.floor(decl.value * 100);
        var VAL_REPLACE  = '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + amount + ')"';

        // find if a filter opacity is already present
        var isFilterAlreadyPresent = false;
        rule.eachDecl(PROP_REPLACE, function (d) {
          if (d.value === VAL_REPLACE) {
            isFilterAlreadyPresent = true;
          }
        });

        // adds new property only if it's not present yet
        if (!isFilterAlreadyPresent) {
          rule.insertAfter(decl, {prop: PROP_REPLACE, value: VAL_REPLACE});
        }

      });
    });

  };
});
