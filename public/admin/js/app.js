
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
			url: '/addPost',
			templateUrl: '/admin/templates/addPost.html'
		})
});

adminApp.controller('NavCtrl', function($scope, $state){
	$scope.active = $state;
	$scope.isActive = function(viewLocation){
		var active = (viewLocation === $state.current.name);
		return active;
	};
})