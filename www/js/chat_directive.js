angular.module('chatApp.directives', [])
.directive('chatDirective', function() {
  return {
    restrict: 'AE',
    require: '^ngModel',
    scope: '=',
    templateUrl: 'views/chat.html',
    link: function(scope, elem, attrs, ngModelCtrl) {
    }
  };
});