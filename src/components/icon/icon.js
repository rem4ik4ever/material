(function() {
'use strict';

/*
 * @ngdoc module
 * @name material.components.icon
 * @description
 * Icon
 */
angular.module('material.components.icon', [
  'material.core'
])
  .directive('mdIcon', mdIconDirective);

/*
 * @ngdoc directive
 * @name mdIcon
 * @module material.components.icon
 *
 * @restrict E
 *
 * @description
 * The `<md-icon>` directive is an element useful for SVG icons
 *
 * @usage
 * <hljs lang="html">
 *  <md-icon icon="/img/icons/ic_access_time_24px.svg">
 *  </md-icon>
 * </hljs>
 *
 */
function mdIconDirective($http, $window) {
  var dummy = angular.element('<div>'),
      lookup = {};
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      var icon = attr.icon,
          svg;
      if (!icon) return;

      if (lookup[icon]) $timeout(function () { writeHTML(lookup[icon]); }, 0, false);
      else $http.get(icon).success(handleSuccess);

      function handleSuccess (xml) {
        var color = $window.getComputedStyle(element[0]).color;
        dummy.html(xml);
        svg = dummy.find('svg');
        dummy.empty().append(svg);
        writeHTML(dummy.html());
      }

      function writeHTML(html) {
        lookup[icon] = html;
        element.html(html);
        colorizeIcon(element);
        function colorizeIcon(elem) {
          angular.forEach(elem.children(), function (child) {
            //-- wrap child with jqLite
            child = angular.element(child);
            //-- if no fill property, add one
            if (!child.attr('fill')) child.attr({ fill: color });
            //-- parse children
            colorizeIcon(child);
          });
        }
      }
    }
  };
}
})();
