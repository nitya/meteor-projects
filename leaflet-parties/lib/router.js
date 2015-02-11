/**
* Using Iron-Router for routing by default
* See: https://github.com/EventedMind/iron-router
*
* Some terminology 
*	route = tells app where to go when it sees a URL
*	path = URL within app (can be static/dynamic, have query params)
*	segments = parts of the path (delimited by '/')
* 	hooks = actions you want to have taken {before, after, during} routing
*	filters = hooks defined globally (for reuse across routes)
*	templates = view to render for route (default = route name itself)
*	layouts = container frame used for route (manages view templates)
* 	controllers = common routing logic, parameters abstracted for reuse
*
* Keep in mind that routing hooks are reactive. i.e., the associated
* function/state changes, the hook automatically re-executes and 
* renders an updated route/page.
*/


// use requireLogin as a beforeAction hook for any route that 
// requires the user to be logged in..
// e.g, Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
var requireLogin = function(){
	if (! Meteor.user()){
		if (Meteor.loggingIn()){ 
			this.render(this.loadingTemplate);
		}
		else {this.render('accessDenied');}
	}
	else {
		this.next();
	}
};


// Router.configure sets GLOBAL context, properties for router
Router.configure({
	layoutTemplate  : 'layout',
	loadingTemplate : 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function(){
		return [ 
			//Meteor.subscribe('parties'), 
			//Meteor.subscribe('directory')
		];
	}		
});

// Router.route sets per-route properties
Router.route('/', 
	{ name: 'page'}
);
