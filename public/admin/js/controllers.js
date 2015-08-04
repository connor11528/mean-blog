
adminApp.controller('NavCtrl', function($scope, $state){
	$scope.active = $state;
	$scope.isActive = function(viewLocation){
		var active = (viewLocation === $state.current.name);
		return active;
	};
});

adminApp.controller('AllPostsCtrl', function($scope, postList){
	$scope.posts = postList;
	$scope.activePost = false;
	$scope.setActive = function(post){
		$scope.activePost = post;
	}
});

adminApp.controller('AddPostCtrl', function($scope, Posts){
	$scope.post = {};
	$scope.addPost = function(newPost){
		Posts.add(newPost).then(function(res){
			console.log(res);
		});
	};


});