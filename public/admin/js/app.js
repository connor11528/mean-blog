
var adminApp = angular.module('ghost-clone.admin', [
	'ui.router'
]);

adminApp.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('login', {
			url: "/",
			templateUrl: "templates/login.html",
			controller: 'LoginCtrl'
		});

	$urlRouterProvider.otherwise("/");
});

adminApp.controller('LoginCtrl', function($scope){
	$scope.user = {};

	$scope.adminLogin = function(){
		console.log('send login');

		$scope.user = {};
	};
});