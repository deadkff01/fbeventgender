app.factory('authToken',['$cookieStore', '$location', function($cookieStore, $location){
	var token = {};
    token.start = null;

	token.setAccessToken = function(accessToken) {
		$cookieStore.put('accessToken', accessToken);
	}

	token.getAccessToken = function() {
		token.authToken = $cookieStore.get('accessToken');
		return token.authToken;
	}
	token.getUserinfo = function() {
		token.userInfo = $cookieStore.get('facebookUser');

		if(token.userInfo)
		 return token.userInfo;	
	}

	token.logout = function(){
		$cookieStore.remove("accessToken");
		$cookieStore.remove('facebookUser');
		$location.path('/');
	}

	return token;
}]);