
var adminApp = angular.module('ghost-clone.admin', [
	'ui.router',
	'btford.markdown'
]);

adminApp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');
	
	$stateProvider
		.state('allPosts', {
			url: '/',
			templateUrl: '/admin/templates/allPosts.html'
		})
		.state('addPost', {
			url: '/',
			templateUrl: '/admin/templates/addPost.html'
		})
});