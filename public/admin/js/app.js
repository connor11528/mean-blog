
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
		})
		.state('dashboard', {
			url: "/dashboard",
			templateUrl: "templates/dashboard.html",
			controller: 'DashboardCtrl'
		});

	$urlRouterProvider.otherwise("/");
});

adminApp.controller('LoginCtrl', function($scope, $http, $state){
	$scope.user = {};

});