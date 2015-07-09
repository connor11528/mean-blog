
var adminApp = angular.module('ghost-clone.admin', [
	'ui.router'
]);

adminApp.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('login', {
			url: "/",
			templateUrl: "templates/login.html",
			controller: 'LoginCtrl'
		})
		.state('register', {
			url: "/",
			templateUrl: "templates/register.html",
			controller: 'LoginCtrl'
		});

	$urlRouterProvider.otherwise("/");
});

adminApp.controller('LoginCtrl', function($scope, $http){
	$scope.user = {};

	$scope.adminLogin = function(){
		console.log('send login');
		var userCreds = {
			email: $scope.user.email,
			password: $scope.user.password
		};

		$http.post('/api/login', userCreds).then(function(response){
			console.log(response);
			$scope.user = {};
		});
		
	};

	$scope.registerNewUser = function(){
		var newUser = {
			email: $scope.user.email,
			password: $scope.user.password
		};
		$http.post('/api/register', newUser).then(function(response){
			console.log(response);
		});
	};
});