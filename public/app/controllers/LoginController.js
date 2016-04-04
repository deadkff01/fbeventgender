app.controller('LoginController', ['$scope','$http', '$rootScope','$location', '$cookieStore', 'authToken', 
 function($scope, $http, $rootScope, $location, $cookieStore, authToken) {

    $scope.checkFacebookUser = function(facebook){
        $http.post('/checkFacebookUser', facebook).success(function(response){
            $location.path('/dashboard');
        }).error(function(response){
                console.log('Application unavailable... Try later.');
        });
    }

	$scope.facebookLogin = function() {
     FB.login(function(response){
                if (response.authResponse) {
                    FB.api('/me', function(response) {
                        $cookieStore.put('facebookUser', response);    
                        var accessToken = FB.getAuthResponse().accessToken;
                        authToken.setAccessToken(accessToken);
                        $scope.checkFacebookUser(response);
                        $scope.$applyAsync();
                    });
                } else {
                    $location.path('/');
                }
            });
	};
}]);