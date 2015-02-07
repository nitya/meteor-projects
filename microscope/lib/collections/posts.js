// 4.1 Adding collections (but in insecure, autopublish mode)
Posts = new Mongo.Collection('posts');

// 7.2 Remove 'insecure', add explict security rules
Posts.allow({
	insert: function(userId, doc){
		// only allow posting if you are logged in
		return !! userId;
	}
});