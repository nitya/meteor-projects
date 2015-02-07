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
			// display error to the user and abort
			if (error)	
				return alert(error.reason);

			// 7.7 Now we can check for duplicate entry
			if (result.postExists)
				alert('This link has already been posted');
      	});

		// 7.5.1 Taken out of .call loop to show Latency Comp.
		// If new or duplicate, show page for that entry
  		Router.go('postsList');

		/* -- replaced in 7.6 above
		// Once inserted, then route to details page
		post._id = Posts.insert(post);
		Router.go('postPage', post);
		*/
	}
});