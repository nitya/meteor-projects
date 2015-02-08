// 9.1
// Retun errors stored in the client-local Errors collection
Template.errors.helpers({ 
	errors: function() {
		return Errors.find(); }
	}
);