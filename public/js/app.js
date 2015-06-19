
var app = angular.module('mean-boilerplate', [
	'ui.router'
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "templates/main.html",
			controller: 'MainCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		})
		// .state('register', {
		// 	url: '/register',
		// 	templateUrl: 'templates/register.html'
		// });

	$urlRouterProvider.otherwise("/login");
});