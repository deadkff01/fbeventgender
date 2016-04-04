app.controller('HeaderController', ['$scope', 'authToken', 
	function($scope, authToken) {
      $scope.$watch(function() {
					  return authToken.start;
					},
                    function(newValue, oldValue) { 
                     if(authToken.getUserinfo() != undefined){

				      var facebookUser = authToken.getUserinfo();
					  $scope.facebookName = facebookUser.name;
				    }
        });


	$scope.logout = function(){
		$scope.facebookName = null;
		authToken.logout();
	}

}]);