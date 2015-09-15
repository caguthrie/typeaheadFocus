/**
 * created by Yohai Rosen.
 * https://github.com/yohairosen
 * email: yohairoz@gmail.com
 * twitter: @distruptivehobo
 *
 * https://github.com/yohairosen/typeaheadFocus.git
 * Version: 0.0.1
 * License: MIT
 */

angular.module('typeahead-focus', [])
    .directive('typeaheadFocus', function ($timeout) {
      return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {

          // Have we already overriden angular ui bootstrap typeahead parser?
          var setParser = false;

          // Array of keyCode values for arrow keys and enter
          const ARROW_KEYS = [13,37,38,39,40];

          function manipulateViewValue(e) {
            /*
             * This is a workaround to not call the angular-ui bootstrap parser in the typeahead directive
             * if the input is blank.  Because the typeahead was not designed for that, strange activities
             * occur such as being unable to click an element in the typeahead if input already existed.
             */
            if( !setParser ){
              const oldFunc = ngModel.$parsers[0];
              ngModel.$parsers[0] = function(inputValue){
                if( inputValue == "")
                  return;
                oldFunc(inputValue);
              };
              setParser = true;
            }

            /* we have to check to see if the arrow keys were in the input because if they were trying to select
             * a menu option in the typeahead, this may cause unexpected behavior if we were to execute the rest
             * of this function
             */
            if( ARROW_KEYS.indexOf(e.keyCode) >= 0 )
              return;

            var viewValue = ngModel.$viewValue;

            //restore to null value so that the typeahead can detect a change
            if (ngModel.$viewValue == ' ') {
              ngModel.$setViewValue(null);
            }

            //force trigger the popup
            ngModel.$setViewValue(' ');

            //set the actual value in case there was already a value in the input
            ngModel.$setViewValue(viewValue || ' ');
          }

          /* trigger the popup on 'click' because 'focus'
           * is also triggered after the item selection.
           * also trigger when input is deleted via keyboard
           */
          element.bind('click keyup', manipulateViewValue);

          //compare function that treats the empty space as a match
          scope.$emptyOrMatch = function (actual, expected) {
            if (expected == ' ') {
              return true;
            }
            return actual ? actual.toString().toLowerCase().indexOf(expected.toLowerCase()) > -1 : false;
          };
        }
      };
    });
