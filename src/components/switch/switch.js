/**
 * @private
 * @ngdoc module
 * @name material.components.switch
 */

angular.module('material.components.switch', [
  'material.components.checkbox',
  'material.components.radioButton',
  'material.services.theming'
])

.directive('mdSwitch', [
  'mdCheckboxDirective',
  '$mdTheming',
  '$mdEffects',
  '$mdUtil',
  MdSwitch
]);

/**
 * @private
 * @ngdoc directive
 * @module material.components.switch
 * @name mdSwitch
 * @restrict E
 *
 * The switch directive is used very much like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ngTrueValue The value to which the expression should be set when selected.
 * @param {expression=} ngFalseValue The value to which the expression should be set when not selected.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} noink Use of attribute indicates use of ripple ink effects.
 * @param {boolean=} disabled Use of attribute indicates the switch is disabled: no ink effects and not selectable
 * @param {string=} ariaLabel Publish the button label used by screen-readers for accessibility. Defaults to the switch's text.
 *
 * @usage
 * <hljs lang="html">
 * <md-switch ng-model="isActive" aria-label="Finished?">
 *   Finished ?
 * </md-switch>
 *
 * <md-switch noink ng-model="hasInk" aria-label="No Ink Effects">
 *   No Ink Effects
 * </md-switch>
 *
 * <md-switch disabled ng-model="isDisabled" aria-label="Disabled">
 *   Disabled
 * </md-switch>
 *
 * </hljs>
 */
function MdSwitch(checkboxDirectives, $mdTheming, $mdEffects, $mdUtil) {
  var checkboxDirective = checkboxDirectives[0];

  return {
    restrict: 'E',
    transclude: true,
    template:
      '<div class="md-bar">' +
      '</div>' +
      '<div class="md-thumb-container">' +
        '<div class="md-thumb">' +
        '</div>' +
      '</div>',
    require: '?ngModel',
    compile: compile
  };

  function compile(element, attr) {
    var checkboxLink = checkboxDirective.compile(element, attr);

    return function postLink(scope, element, attr, ngModelCtrl) {
      ngModelCtrl = ngModelCtrl || $mdUtil.createFakeNgModel();

      var thumb = angular.element(element[0].querySelector('.md-thumb'));
      var thumbContainer = angular.element(element[0].querySelector('.md-thumb-container'));
      checkboxLink(scope, element, attr, ngModelCtrl);

      var hammertime = new Hammer(element[0]);
      hammertime.on('panstart', onPanStart);
      hammertime.on('pan', onPan);
      hammertime.on('panend', onPanEnd);

      var pan;
      function onPanStart(ev) {
        if (pan || element[0].hasAttribute('disabled')) return;
        pan = {
          distance: thumbContainer.prop('clientWidth'),
          startX: ev.center.x,
        };
        pan.thumbStart = ngModelCtrl.$viewValue ? pan.distance : 0;
        element.addClass('no-animate');
      }
      function onPan(ev) {
        if (!pan) return;
        thumbContainer.css($mdEffects.TRANSFORM, 'translate3d(' +
                    getPosition(ev.center.x) + 'px,0,0)');
      }
      function onPanEnd(ev) {
        if (!pan) return;
        var percent = Math.abs(getPosition(ev.center.x) / pan.distance);
        var checked = ngModelCtrl.$viewValue;

        if ((checked && percent < 0.5) || (!checked && percent > 0.5)) {
          element.triggerHandler('click');
        }
        element.removeClass('no-animate');
        thumbContainer.css($mdEffects.TRANSFORM, '');

        pan = null;
      }

      function getPosition(x) {
        var position = pan.thumbStart + (x - pan.startX);
        return Math.max(0, Math.min(position, pan.distance));
      }
    };
  }

}
