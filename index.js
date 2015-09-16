var postcss = require('postcss');

module.exports = postcss.plugin('postcss-opacity', function (opts) {
  opts = opts || {};

  var PROP         = 'opacity';
  var PROP_REPLACE = '-ms-filter';

  return function (css) {

    css.walkRules(function (rule) {

      if (rule.parent.type === 'atrule'
            && rule.parent.name === 'keyframes'
                || rule.parent.name === '-o-keyframes'
                || rule.parent.name === '-moz-keyframes'
                || rule.parent.name === '-webkit-keyframes'
      ) {
        return;
      }
                
      // find if a filter opacity is already present
      var isFilterAlreadyPresent = false;
      rule.walkDecls(PROP_REPLACE, function () {
        isFilterAlreadyPresent = true;
      });

      if (!isFilterAlreadyPresent) {
        rule.walkDecls(PROP, function (decl) {

          // get amount and create value
          var amount = Math.floor(decl.value * 100);
          var VAL_REPLACE  = '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + amount + ')"';

          // adds new property only if it's not present yet
          rule.insertAfter(decl, {prop: PROP_REPLACE, value: VAL_REPLACE});

        });
      }
    });

  };
});
