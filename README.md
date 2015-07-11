Ghost clone
=====

A blog made out of the javascripts. Uses mongoose, angular, express and the node.js and the mongodbs for realz


#### Getting started
```
$ git clone <this_repo>
$ npm install
$ nodemon server # OR npm start
```


# Blog post part 1

I'm posting a blog post on how to make a blog. So meta.

![](http://media.giphy.com/media/roLxlT1nPN8GI/giphy.gif)

###### Get crackin

Install the starter template and change the names, delete the silly image in the README.

```
$ git clone git@github.com:jasonshark/mean-starter.git
$ mv mean-starter mean-blog && cd mean-blog
$ npm install
$ node server
```

**Pro tip:** install [nodemon](https://github.com/remy/nodemon) globally and you won't have to refresh the page all the time

###### Render admin login

There are lots of ways to handle authentication within the meanstack. We're going to use [Passport.js](http://passportjs.org/), the express server and ejs templates. The angular will come in handy once the template is already rendered.

First define our basic routes for the login and register pages. These go in **server/routes.js**.

```
app.use('/api', apiRouter);	// haven't built any api yet
	app.use('/', router);

	// home route
	router.get('/', function(req, res) {
		res.render('index');
	});

	// admin route
	router.get('/admin', function(req, res) {
		res.render('admin/login');
	});

	router.get('/admin/register', function(req, res) {
		res.render('admin/register');
	});
```

Now let's set up the views. We are going to add the ejs template engine and store the views in a new folder called views. First we'll configure the server to render ejs templates. Add this to the **server.js** express config block:

`app.set('view engine', 'ejs');`

And add ejs as a dependency for the server:

`$ npm install ejs --save`

Next create the views folder and files:
```
$ mkdir views
$ mv public/index.html views/index.ejs
$ mkdir views/admin
$ touch views/404.ejs views/admin/login.ejs views/admin/register.ejs views/admin/dashboard.ejs
```

In the **views/admin/login.ejs** we will render a basic login form. This will load a full html page with a new `<head>` and `<body>`. The body of the template looks like this:

```
<body>
  <div class='container'>
    <div class='row'>
		<div class='col-sm-4 col-sm-offset-4 text-center'>
			<h1>Admin Login</h1>
			<form method='post' action='/login'>
				<input type='text' placeholder='Email' name='email' ng-model='user.email' class='form-control'>

				<input type='password' placeholder='Password' name='password' ng-model='user.password' class='form-control'>
				<input type='submit' class='btn btn-primary' value='Login'>
			</form>
			<a href='/admin/register'>Register a new account</a>
		</div>
	</div>
  </div>
</body>
```

Make sure to include bootstrap CSS and you're golden. The register form looks like this:

```
<body>
  <div class='container'>
    <div class='row'>
      <div class='col-sm-4 col-sm-offset-4 text-center'>
        <h1>New user registration</h1>
        <form <form method='post' action='/register'>
          <input type='text' placeholder='Email' name='email' ng-model='user.email' class='form-control'>

          <input type='password' placeholder='Password' name='password' ng-model='user.password' class='form-control'>
          <input type='submit' class='btn btn-primary' value='Register'>
        </form>
        <a href='/admin'>Login with an existing account</a>
      </div>
    </div>
  </div>
</body>
```

Almost exactly the same. You can now check out the basic forms by navigating to `/admin` and `/admin/register`. The next step will be creating users and logging them in

###### Create user model and set up passport

So in order to have admins we're going to create a user model in our database. Create the model in **server/models/user.js**:

```
var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
	email: {
		type: String, 
		required: '{PATH} is required!'
	}
});

// Passport-Local-Mongoose will add a username, 
// hash and salt field to store the username, 
// the hashed password and the salt value

// configure to use email for username field
User.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', User);
```

To make user management with passport.js simple we're using [passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose), which is a layer of abstraction on top of [passport-local](https://github.com/jaredhanson/passport-local). Passport local is an "authentication strategy" on top of passport. You can include multiple strategies for different providers. This confused me for a long time. Scotch.io has a great [tutorial series](https://scotch.io/tutorials/easy-node-authentication-setup-and-local) on authenticating with multiple strategies in an express app. I also have an [example app](https://github.com/jasonshark/express-auth) that implements login with email/password, facebook and spotify together as one. For now we're going to keep moving forward.

![keep swimming](http://media.giphy.com/media/1sSWWMNnaZLlm/giphy.gif)


Install the dependencies:
```
$ npm install passport passport-local passport-local-mongoose --save
```

Initialize passport.js sessions in **server.js**:

```
var passport = require('passport');
require('./server/passport')(passport);   // this file is defined below
app.use(passport.initialize());
app.use(passport.session());
```

Define the passport configuration options in **server/passport.js**. I got this directly form the passport-local-mongoose [README](https://github.com/saintedlama/passport-local-mongoose):

```
// requires the model with Passport-Local Mongoose plugged in
var User = require('./models/user'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
	// use static authenticate method of model in LocalStrategy
	passport.use(User.createStrategy());

	// use static serialize and deserialize of model for passport session support
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
};
```

###### Create routes for handling user login/registration

We have our forms that send plain old POST request. Set up some express routes with passport.js magical middleware. Middleware in express are functions that the request passes through when a route is hit. The request hits the route (for example POST to "/login") and then goes through a series of functions that take the format `function(req, res, next){}`. If the `next()` function gets called the request continues down the chain. Passport provides us middleware that follows this `req, res, next` pattern:

```
router.get('/admin/dashboard', isAdmin, function(req, res){
		res.render('admin/dashboard', {user: req.user});
	});

	router.post('/register', function(req, res){

		// passport-local-mongoose: Convenience method to register a new user instance with a given password. Checks if username is unique
		User.register(new User({
			email: req.body.email
		}), req.body.password, function(err, user) {
	        if (err) {
	            console.error(err);
	            return;
	        }

	        // log the user in after it is created
	        passport.authenticate('local')(req, res, function(){
	        	console.log('authenticated by passport');
	        	res.redirect('/admin/dashboard');
	        });
	    });
	});

	router.post('/login', passport.authenticate('local'), function(req, res){
		res.redirect('/admin/dashboard');
	});

	app.use(function(req, res, next){
		res.status(404);

		res.render('404');
		return;
	});
```

Make sure you have the mongoose User model defined:

`var User = require('./models/user')`

You'll see that I threw in an `isAdmin` variable. That is some middleware I defined myself. It is janky but it will make sure that even if someone registers an account they cannot get to the dashboard unless they log in with my email address.

```
function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.email === 'connorleech@gmail.com'){
		console.log('cool you are an admin, carry on your way');
		next();
	} else {
		console.log('You are not an admin');
		res.redirect('/admin');
	}
}
```

For more complex apps you could add roles to users. You could add roles by issuing commands to records in MongoDB directly. Here's how to check out the contents of our database (go ahead and `/admin/register` first, so you have some data to look at!)

###### Check in the database that users exist

Let's check out our database. Open up a mongo shell (`$ mongod` must be running).

```
$ mongo
> show dbs
ghost-clone     0.078GB
test            0.078GB
> use ghost-clone
switched to db ghost-clone
> show collections
system.indexes
users
> db.users.find();
```
This changes into our database and shows the users. The database may be called "mean-starter" if you do not rename the development database in **server/env.js**.

###### Set up the admin dashboard

We've created users in the database and logged them in. What we actually want is a protected dashboard where we can create, edit and save our posts.

First we're going to set up the layout and create a new angular app called `ghost-clone.admin`. This app will handle everything that goes on from the **dashboard.ejs** template. I've set it up a little like how the ghost platform works. We can add more functionality in later tutorials.

![](http://cdn.meme.am/instances2/500x/700982.jpg)

I changed the `public/` directory to distinguish between our admin angular app and the home angular app:

```
public
  |- admin
     |- js
     |- css
     |- templates
  |- home
     |- js
     |- css
     |- templates
``` 

Create the angular app in **public/admin/js/app.js**:

```
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
```

Next we're going to hand off the user object passport added on the server `req.user` to our `user` variable and give that to the angular application.

```
<script src='/admin/js/app.js'></script>
  <script type='text/javascript'>
    var currentUser = <%- JSON.stringify(user); %>;
    adminApp.run(function($rootScope){
      $rootScope.currentUser = currentUser;
    });
  </script>
```

The `<%- -%>` is how ejs renders variables. We stringify that and then pass it to our $rootScope.

![ejs variables to angular.js](http://cdn.meme.am/instances2/500x/700964.jpg)

In the body I link to a navbar template:

`<div ng-include='"/admin/templates/nav.html"'></div>`.

It's important to note now angular's using client side templates with ui.router. These are separate from the server-side ejs templates.

So now create a navbar template in **public/admin/templates/nav.html**:

```
<!-- Top navigation -->
<nav class="navbar navbar-default navbar-fixed-top" ng-controller='NavCtrl'>
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Ghost clone</a>
      </div>
      <div id="navbar" class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
          <li ng-class="{ active: isActive('allPosts') }"><a ui-sref="allPosts">All posts</a></li>
          <li ng-class="{ active: isActive('addPost') }"><a ui-sref="addPost">New Post</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a href>{{currentUser.email}}</a></li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </nav>
<!-- /Top navigation -->
```

And also make a `NavCtrl` for this navbar that will toggle the `.active` class based on the current $state ui.router is in:

```
adminApp.controller('NavCtrl', function($scope, $state){
	$scope.active = $state;
	$scope.isActive = function(viewLocation){
		var active = (viewLocation === $state.current.name);
		return active;
	};
})

```

Below the nav.html tag in **dashboard.ejs** include a space to render our views

`<div ui-view class='full-height' id='main-content'></div>`

Add then paste some CSS into **public/admin/css/main.css**:

```
html, body, section, .full-height {
    height: 100%;
}

#pad{
    font-family: Menlo,Monaco,Consolas,"Courier New",monospace;

    border: none;
    overflow: auto;
    outline: none;
    resize: none;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
}

#markdown {
    overflow: auto;
    border-left: 1px solid black;
}

#main-content {
    margin-top:70px;
}
```


###### Parsing markdown

We're going to create two more templates to add a post and also show all of our posts. Create two files **addPost.html** and **allPosts.html** in **public/admin/templates**.

Next add the [angular-markdown-directive](https://github.com/jasonshark/angular-markdown-directive). Grab the **markdown.js** file and include it as a `<script>` in **dashboard.ejs**.

Also add `ngSanitize` and the [showdown.js](https://github.com/showdownjs/showdown) library:

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.2/angular-sanitize.js"></script>
   <script src="https://cdn.rawgit.com/showdownjs/showdown/1.0.2/dist/showdown.min.js"></script>
<script src='/admin/js/lib/markdown.js'></script>
```

Then create a template for adding a title and a body. On the right hand column we'll view the markdown preview of the post we're posting:

```
<div class="row full-height">
    <div class='col-lg-12'>
      <div class='form-group'>
      <input type='text' placeholder='Title' name='title' class='form-control'>
      </div>
    </div>
    <div class="col-lg-12 full-height">
        <textarea class="col-md-6 full-height" id="pad" ng-model='text' placeholder='Write your blog post here...'></textarea>
        <div class="col-md-6 full-height" id="markdown">
          <div btf-markdown='text'></div>
        </div>
    </div>
</div>
```

Navigate to New Post (http://localhost:3000/admin/dashboard#/addPost), start typing a `# title` and you'll see the markdown preview version, thanks to showdown.js and angular.js data binding.


###### Conclusion of part 1

Phew we have done a lot. We have a database of users, protected admin access, two angular applications and a template for parsing markdown.

In the next post we will Create, Read, Update and Delete posts. If you have questions about this tutorial, feel free to [hit me up on twitter](http://twitter.com/cleechtech).

![](http://media0.giphy.com/media/V0BIjUQRfl8tO/giphy.gif)
