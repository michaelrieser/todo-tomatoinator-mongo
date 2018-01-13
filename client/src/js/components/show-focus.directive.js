function ShowFocus($timeout) {
  'ngInject';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.showFocus,
        function(newValue) {
          $timeout(function() {
            newValue && element[0].focus();            
            element[0].selectionStart = 0; // Selects all text in field since caret set to end of text when focused
            // element[0].setSelectionRange(0,0); // Sets cursor to first position
          })
        });
        // element.on('$destroy', function() {
        //   console.log('showFocus destroyed')
        // });
    }
  }
}

export default ShowFocus;
