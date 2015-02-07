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

// 7.3 This named function can now be called in the onBeforeAction
//  hook (gets executed before the related route is taken)
var requireLogin = function(){
	if (! Meteor.user()){
		this.render('accessDenied');
	}
	else {
		this.next();
	}
};


// Router.configure sets GLOBAL context, properties
// waitOn ensures that the function specified completes before the route
//  renders. in the meantime, a 'loading' template is shown
Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function(){
		return Meteor.subscribe('posts');
	}		
});


// 5.4
// What happens if a route is valid (i.e., in form /posts/xyz) but the data
// context is not (i.e., no post with id=xyz exists)
// Currently this won't show a 404 - rather, it will show an invalid page
// template rendering, or throw an exception. We actually want it to show a 
// 404 (effectively telling client this page does not exist)
// 
// How do you map invalid data context onto 404 errors? Use the 'dataNotFound'
// hook below to indicate that, for THAT route, show 404 if data does not exist
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});


// Router.route sets per-route properties
// Why name routes? Because it lets us use the associated URLs for
// building or referencing dynamic links later using 'pathFor'
// 		e.g., href="{{pathFor 'postsList'}}" 
// will now dynamically bind to "/" given the route declaration below
Router.route('/', 
	{ name: 'postsList'}
);

// 5.3 
// the "_id" parameter is now available in the 'params' array
// associated with the router. Also note that 'data' is a reserved
// word that effectively sets the data context for the associated 
// template rendered against this route.
// i.e., now postPage template can use "this" to refer to object
//   passed in via the data property here
// 
// (Aside) 
// data contexts can be passed to a template helper in many ways. 
//		1. Routers use the 'data' property. 
//		2. The {{#each}} template iterator sets it to current item
//      3. The {{#with}} syntax enables it to be set explicitly for a 
//			 contained template e.g., 
//				{{#with myPostData}} {{> postPage}} {{/with}}
//      4. Or just pass it directly as a paramter to template call e.g.,
//				{{> postPage myPostData}}
//
Router.route('/posts/:_id',
	{ 
		name: 'postPage',
		data: function() { return Posts.findOne(this.params._id); }
	}
);

// 7.1 
Router.route('/submit', 
	{ name: 'postSubmit' }
);

