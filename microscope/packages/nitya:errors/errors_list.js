// 9.1
// Return errors stored in the client-local Errors collection

// 9.5 
// Moved here from client/includes/errors.js for package scope
// Updated to use package-scoped names (Errors.collection,
// meteorErrors, meteorError etc.)
Template.meteorErrors.helpers({ 
	errors: function() {
		return Errors.collection.find(); }
	}
);

// 9.3
// Rendered callbacks are triggered on a template right after
// it has been created and rendered into the view
// The 'this' is a handle to the active template instance
// The 'this.data' is a handle to its bound data context
Template.meteorError.rendered = function() { 
	var error = this.data; 
	Meteor.setTimeout(function () {
    	Errors.collection.remove(error._id);
  	}, 3000);
};