// 4.1 Adding collections (but in insecure, autopublish mode)
Posts = new Mongo.Collection('posts');

// 7.2 Remove 'insecure', add explict security rules
Posts.allow({
	insert: function(userId, doc){
		// only allow posting if you are logged in 
		// (checks that userId is not null)
		return !! userId;
	}
});

// 7.6 Declare postInsert method
// Note that we are using check methods to validate data
// Also note that Meteor.methods execute on server, so they
// can direcly call CRUD methods on collections (no deny,allow)
//
// Note that since methods are defined in a shared space, they can
// run in parallel on client and server (latency compensation) where
// the client side "fakes" the related database calls on the client side
// cache, and can show updated UI -- but server side commits and then
// confirms client change (else rolls it back)
Meteor.methods({
	postInsert: function(postAttributes){

		// validate data
		check(Meteor.userId(), 
			String
		);
		check(postAttributes, {
			title:String, 
			url:String
		});

		// 7.7 check for duplicate data
		//  Note how returned object can now carry attributes that 
		//  don't exist in the collection but are created on the fly
		//  e.g., here postExists: true
		var postWithSameLink = Posts.findOne({url: postAttributes.url}); 
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			};
		}

		// extend input attributes with user info
		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});

		// insert object into collection on server
		var postId = Posts.insert(post);
		return {_id: postId};
	}
});