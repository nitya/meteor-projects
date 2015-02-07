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

		// extend input attributes with user info
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});

		// insert object into collection on server
		var postId = Posts.insert(post);
		return {_id: postId};

	};
});