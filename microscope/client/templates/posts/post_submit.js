// 9.4 Use Session to store error state
// postSubmitErrors will be updated by an error handler
//  to contain relevant url and messsage attributes
Template.postSubmit.created = function() { 
	Session.set('postSubmitErrors', {});
}

// 9.4 Bind data context for template to session state
// Retrieves url/message from Session state
Template.postSubmit.helpers({ 
	errorMessage: function(field) {
		return Session.get('postSubmitErrors')[field]; 
	},
	errorClass: function (field) {
		return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
	} 
});

// 7.1 Handle submit event on form element
Template.postSubmit.events({ 
	'submit form': function(e) {
		// suppress  browser's default action to submit form
		e.preventDefault();

		// instead replace it with insertion into collection
		var post = {
			url: $(e.target).find('[name=url]').val(), 
			title: $(e.target).find('[name=title]').val()
		};

		// 9.4 CLIENT SIDE post validation
		// validate post for errors and set Session state
		// Note that if errors exist, we return after setting
		// state to stop other helpers executing unnecessarily
		var errors = validatePost(post);
		if (errors.title || errors.url)
			return Session.set('postSubmitErrors', errors);

		// 7.6 Replace the simple Posts.insert with a Method
		// call if the insert requires additional processing
		// Methods are server-side functions called from client
		// (callbacks return error or success status)
		//
		// 9.2 update to use throwError instead of alert
		Meteor.call('postInsert', post, function(error, result){
			// display error to the user and abort
			if (error)	
				return throwError(error.reason);

			// 7.7 Now we can check for duplicate entry
			if (result.postExists)
				throwError('This link has already been posted');

			// If new or duplicate, show page for that entry
      		Router.go('postPage', {_id: result._id});
      	});

		/* -- replaced in 7.6 above
		// Once inserted, then route to details page
		post._id = Posts.insert(post);
		Router.go('postPage', post);
		*/
	}
});