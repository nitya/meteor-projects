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
		post._id = Posts.insert(post);
		
		// Once inserted, then route to details page
		Router.go('postPage', post);
	}
});