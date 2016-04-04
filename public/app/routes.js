app.config(['$routeProvider', '$locationProvider', 
function($routeProvider, $locationProvider) {
 $routeProvider
	.when("/", {
		templateUrl : '/views/login.html',
		controller : 'LoginController'
	})
	.when("/dashboard", {
		templateUrl : '/views/dashboard.html',
		controller : 'DashboardController',
		authenticated: true
	})
	.otherwise('/', {
		templateUrl : '/views/login.html',
		controller : 'LoginController'
	});

	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});
}]);


app.run(['$rootScope', '$location', 'authToken', 
	function($rootScope, $location, authToken){
	 $rootScope.$on('$routeChangeStart', function(event, next, cur) {
	 	/*Check if user are authenticated*/
	    var userAuth = authToken.getAccessToken();
	 	var facebookUser = authToken.getUserinfo();
		authToken.start = true;
	 	if(!userAuth) 		 
	 	   	$location.path('/');
		else 
		 	$location.path('/dashboard');
	 });
}]);

