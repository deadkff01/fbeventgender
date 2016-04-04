app.directive('facebookname', function() {
  return {
    restrict: 'A',
    template: '<div class="sparkline">{{facebookName}}</div><button ng-click="logout()">logout</button>',
    link: function (scope, element, attr) {
      scope.$watch('facebookName', function (val) {
            if (val != null)
              $(element).show();
            else
              $(element).hide();
      });
    }
  }
});