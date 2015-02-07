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

		// 7.6 Replace the simple Posts.insert with a Method
		// call if the insert requires additional processing
		// Methods are server-side functions called from client
		// (callbacks return error or success status)
		Meteor.call('postInsert', post, function(error, result){
			if (error)	// display error to the user and abort
				return alert(error.reason);
      		Router.go('postPage', {_id: result._id});
      	});

		/* -- replaced in 7.6 above
		// Once inserted, then route to details page
		post._id = Posts.insert(post);
		Router.go('postPage', post);
		*/
	}
});