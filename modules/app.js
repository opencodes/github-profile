(function(){                                                                     
    //Angular module
	var app =  angular.module("gitProfile", ['ngRoute']);  
	
	
	//Angular Routes
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', 			
				{ templateUrl : 'views/home.html', 				controller : 'HomePageController' , requireLogin : false})
			
			//Otherwise redirect to error page
			.otherwise({redirectTo:'/'});
	}]);
	
	//Angular Controllers
	app.controller('HomePageController', ['$scope','GitHubService','$rootScope', function($scope, GitHubService, $rootScope) {
		console.log(GitHubService)
		if (!$rootScope.projects) {
			$rootScope.projects = {};
			GitHubService.getList().then(function(data){
				$rootScope.projects = data.items;
			})
		};
	}])
	

	//Directive
	app.directive('projectItem',  function() {
		return {
			restrict : 'E',
			templateUrl : "views/project-item.html",
			scope : {
				project : '=project'
			}

		}
	});
	
	app.filter('filterByCategory', function () {

		return function(input, cat){
		    var out = [];
		    angular.forEach(input, function(itemm){		    
		      if (cat) {
		      	if(itemm.category == cat){
			        out.push(itemm)
			     }
		      }else{
		      	    out.push(itemm);
		      }
		      
		    })
		    return out;
		}
	});


	app.service('GitHubService', ['webService', function(webService){
		this.getList = function (query) {
			return webService.callAPI('https://api.github.com/search/repositories?q=stars:%3E1&s=stars&type=Repositories');
		}
	}])
	app.service('webService', ['$http','$q', function($http, $q) { 

		// I transform the error response, unwrapping the application dta from
                // the API response payload.
        function handleError( response ) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (! angular.isObject( response.data ) || ! response.data.message) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            return( response.data );
        }


		this.callAPI = function (url) {
			var request = $http({
                method: "get",
                url: url                        
            });
            return( request.then( handleSuccess, handleError ) );
		}
	}]); 



})();  




