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
Router.configure({
	layoutTemplate: 'layout'		
});

// Router.route sets per-route properties
// Why name routes? Because it lets us use the associated URLs for
// building or referencing dynamic links later using 'pathFor'
// 		e.g., href="{{pathFor 'postsList'}}" 
// will now dynamically bind to "/" given the route declaration below
Router.route('/', {name: 'postsList'});