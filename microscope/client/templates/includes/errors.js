// 9.1
// Retun errors stored in the client-local Errors collection
Template.errors.helpers({ 
	errors: function() {
		return Errors.find(); }
	}
);

// 9.3
// Rendered callbacks are triggered on a template right after
// it has been created and rendered into the view
// The 'this' is a handle to the active template instance
// The 'this.data' is a handle to its bound data context
Template.error.rendered = function() { 
	var error = this.data; 
	Meteor.setTimeout(function () {
    	Errors.remove(error._id);
  	}, 3000);
};