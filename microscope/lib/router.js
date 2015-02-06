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
*/

// Router.configure sets GLOBAL context, properties
// waitOn ensures that the function specified completes before the route
//  renders. in the meantime, a 'loading' template is shown
Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function(){
		return Meteor.subscribe('posts');
	}		
});

// Router.route sets per-route properties
// Why name routes? Because it lets us use the associated URLs for
// building or referencing dynamic links later using 'pathFor'
// 		e.g., href="{{pathFor 'postsList'}}" 
// will now dynamically bind to "/" given the route declaration below
Router.route('/', 
	{ name: 'postsList'}
);

// 5.3 the "_id" parameter is now available in the 'params' array
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
Router.route('/posts/:_id',{ 
		name: 'postPage',
		data: function() { return Posts.findOne(this.params._id); }
	}
);