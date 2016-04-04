makeSortString = (function() {
    var translate_re = /[¹²³áàâãäåaaaÀÁÂÃÄÅAAAÆccç©CCÇÐÐèéê?ëeeeeeÈÊËÉ?EEEEE€gGiìíîïìiiiÌÍÎÏ?ÌIIIlLnnñNNÑòóôõöoooøÒÓÔÕÖOOOØŒr®Ršs?ßŠS?ùúûüuuuuÙÚÛÜUUUUýÿÝŸžzzŽZZ]/g;
    var translate = {
"¹":"1","²":"2","³":"3","á":"a","à":"a","â":"a","ã":"a","ä":"a","å":"a","a":"a","a":"a","a":"a","À":"a","Á":"a","Â":"a","Ã":"a","Ä":"a","Å":"a","A":"a","A":"a",
"A":"a","Æ":"a","c":"c","c":"c","ç":"c","©":"c","C":"c","C":"c","Ç":"c","Ð":"d","Ð":"d","è":"e","é":"e","ê":"e","?":"e","ë":"e","e":"e","e":"e","e":"e","e":"e",
"e":"e","È":"e","Ê":"e","Ë":"e","?":"e","E":"e","E":"e","E":"e","E":"e","E":"e","€":"e","g":"g","G":"g","i":"i","ì":"i","í":"i","î":"i","ï":"i","ì":"i","i":"i",
"i":"i","i":"i","Ì":"i","Í":"i","Î":"i","Ï":"i","?":"i","Ì":"i","I":"i","I":"i","I":"i","l":"l","L":"l","n":"n","n":"n","ñ":"n","N":"n","N":"n","Ñ":"n","ò":"o",
"ó":"o","ô":"o","õ":"o","ö":"o","o":"o","o":"o","o":"o","ø":"o","Ò":"o","Ó":"o","Ô":"o","Õ":"o","Ö":"o","O":"o","O":"o","O":"o","Ø":"o","Œ":"o","r":"r","®":"r",
"R":"r","š":"s","s":"s","?":"s","ß":"s","Š":"s","S":"s","?":"s","ù":"u","ú":"u","û":"u","ü":"u","u":"u","u":"u","u":"u","u":"u","Ù":"u","Ú":"u","Û":"u","Ü":"u",
"U":"u","U":"u","U":"u","U":"u","ý":"y","ÿ":"y","Ý":"y","Ÿ":"y","ž":"z","z":"z","z":"z","Ž":"z","Z":"z","Z":"z"
    };
    return function(s) {
        return(s.replace(translate_re, function(match){return translate[match];}) );
    }
})();

var alphabet = "abcdefghijklmnopqrstuvwxyz";

function verifyLetter(letter) {
    for(var i = 0; i < alphabet.length; i++)
        if(letter == alphabet.charAt(i))
            return true;
    return false;
}


app.controller('DashboardController', ['$scope', '$http', '$q', 'authToken',
	function($scope, $http, $q, authToken) {
    authToken.start = 'ok';
    $http.get('/getNames').success(function(response) {
            $scope.maleNames = response.male_names;
            $scope.femaleNames = response.female_names;
    });

    $scope.allMatches = {
        matched: 0,
        malepercentage: 0,
        femalepercentage: 0,
        eventname:''
    };
    $scope.eventId = {value:''};
    $scope.eventAttendingCount = 0;
    $scope.maleCount = 0;
    $scope.femaleCount = 0;
    $scope.mappedAttending = 0;
    $scope.mappedPercent = 0;
    var eventNextNames = null;

    function hasNextNames(response) {
       eventNextNames = (response.paging.hasOwnProperty("next")) ? response.paging.next : null;
    }

    function mathNames(m, f) {
      var matched = parseInt(f + m);
      var malePercentage = ((m / matched) * 100).toFixed(2);
      var femalePercentage = ((f / matched) * 100).toFixed(2);
      $scope.allMatches.matched = Math.round((matched / $scope.eventAttendingCount) * 100);
      $scope.allMatches.malepercentage = Math.round(malePercentage);
      $scope.allMatches.femalepercentage = Math.round(femalePercentage);   
      $scope.$applyAsync();  
    }

    function calcNames(names) {
      $scope.mappedAttending += names.length;
      $scope.mappedPercent = Math.round(($scope.mappedAttending / $scope.eventAttendingCount) * 100); // Its not totally right, the API sometimes does not provide all attending users..
      names.map(function(w) {
        var currentName = makeSortString(w.name.split(' ')[0]);
        var currentLetter = currentName.toLowerCase().charAt(0);
        if(verifyLetter(currentLetter)) {   
           $scope.maleNames.map(function(name) { 
            for(var j = 1; j < name[currentLetter].length; j++) 
              if(currentName.toLowerCase() == name[currentLetter][j])
                return $scope.maleCount++;                   
           });
           $scope.femaleNames.map(function(name) { 
            for(var j = 1; j < name[currentLetter].length; j++) 
                if(currentName.toLowerCase() == name[currentLetter][j])
                 return $scope.femaleCount++;                    
            });                            
        }//verify letter..
       });
      mathNames($scope.maleCount, $scope.femaleCount);
    }

    function attCountName() {
        FB.api('https://graph.facebook.com/'+$scope.eventId.value+'?fields=attending_count,name',
                    function (response) {
                      if (response && !response.error) {
                       $scope.eventAttendingCount = parseInt(response.attending_count);
                       $scope.eventname = response.name;
                       $scope.maleCount = 0;
                       $scope.femaleCount = 0;
                       $scope.mappedAttendings = 0;
                       $scope.$applyAsync();
                      }
                    }
        );
    }

    function firstNamesReq() {
        var def = $q.defer();
              FB.api('https://graph.facebook.com/'+$scope.eventId.value+'/attending?pretty=0&limit='+1300,
                     function (response) {
                       if (response && !response.error){
                        hasNextNames(response);
                        calcNames(response.data);
                        $scope.$applyAsync(); 
                        def.resolve(); 
                       } else {
                          def.reject(response.error);
                       }
                     }
              );
            return def.promise;
    }

    function nextNames() {
        if(eventNextNames != null){
            FB.api(eventNextNames,
                     function (response) {
                       if (response && !response.error){
                        hasNextNames(response);
                        calcNames(response.data);
                        $scope.$applyAsync(); 
                        return nextNames();
                      } 
              });
            } else {
               $scope.mappedPercent = 100; // To correct blank space of API... =/
               return null;
            }
    }

	  $scope.search = function() {
      var chain = $q.when();
      chain.then(attCountName())
           .then(
                firstNamesReq().then(function() {
                  nextNames();
                }, function(reason) {
                   console.log(reason);
                }));
    };//end search
}]);
