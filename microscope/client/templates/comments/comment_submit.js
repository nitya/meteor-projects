// 10.3 
// Handle template submission events, provide data helpers
/*
 * See template API: http://docs.meteor.com/#/full/templates_api
 *   .events({ eventMap })   ==> registers handlers per-event
 *   .helpers({ object })    ==> registers named helper functions
 *   .rendered = callback-fn ==> invoked when template instance rendered into DOM
 *   .created = callback-fn  ==> invoked when template instance is created
 *   .destroyed = callback-fn ==> invoked when tempalte instance destroyed
 *
 * Sequence in which template callback-functions are invoked is:
 *   .created -- .rendered -- .destroyed
 * Use created to initialize properties (runs once on loading)
 * Use rendered to post-process DOM elements (runs on reactive updates )
 * Use destroyed to cleanup or reverse created effects (runs once, last callback)
 *
 * See template instance API: http://docs.meteor.com/#/full/template_inst
 *  Template instance is accessible as:
 *     - the 'this' object within created/rendered/destroyed callbacks
 *     - the 'template' argument passed in to event handlers 
 *     - Template.instance() e.g., within helpers
 * 
 * LOCAL USAGE
 * Template.currentData() - returns current data context for template
 * Template.parentData([numLevels]) - returns data context enclosures
 *
 * GLOBAL USAGE
 * Template.body = hardcoded access to template for <body> element
 * Template.registerHelper(name, function) = set variables for global binding
 *
 * DYNAMIC TEMPLATE USAGE
 *   {{> Template.dynamic template=fooName fooData}}
 * where fooName & fooData can be obtained from template helpers
 *
 * allowing the actual template (fooName) and data context (fooData)
 * to be dynamically specified in the parent template 
 *
 * e.g., an ad template container can replace ad content/layout 
 * dynamically. a news widget can switch between headlines and breaking
 * news alerts, each themed differently
*/

Template.commentSubmit.created = function() { 
	console.log("CommentSubmit: created");
	Session.set('commentSubmitErrors', {});
};

Template.commentSubmit.rendered = function() { 
	console.log("CommentSubmit: rendered");
};

Template.commentSubmit.destroyed = function() { 
	console.log("CommentSubmit: destroyed");
};

Template.commentSubmit.helpers({ 
	errorMessage: function(field) {
		return Session.get('commentSubmitErrors')[field]; 
	},
	errorClass: function (field) {
		return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
	} 
});


Template.commentSubmit.events({
	'submit form': function(e, template) {
		e.preventDefault();
		var $body = $(e.target).find('[name=body]'); 
		var comment = {
			body: $body.val(),
			postId: template.data._id
		};
		
		var errors = {};

		if (! comment.body) {
			errors.body = "Please write some content";
			return Session.set('commentSubmitErrors', errors); 
		}

		Meteor.call('commentInsert', comment, function(error, commentId) { 
			if (error){
				Errors.throw(error.reason); 
			} else {
				$body.val('');
			}
		}); 
	}
});