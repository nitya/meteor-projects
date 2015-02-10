// 10.1 Add collection for comments
Comments = new Mongo.Collection('comments');

// 10.3 handle comment creation
Meteor.methods({
	commentInsert: function(commentAttributes) {
		check(this.userId, String); 
		check(commentAttributes, {
			postId: String,
      		body: String
    	});

		var user = Meteor.user();
		var post = Posts.findOne(commentAttributes.postId);
		if (!post)
			throw new Meteor.Error('invalid-comment', 
				'You must comment on a post');

		comment = _.extend(commentAttributes, { 
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});

		return Comments.insert(comment); 
	}
});