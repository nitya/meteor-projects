// 3.2 
// Item helper complements the data context passed down from the
// list template handler, by providing the relevant 'domain' context
//
// 10.2
// Bind helper for comments count
Template.postItem.helpers({ 
	// 8.1
	ownPost: function() {
		return this.userId === Meteor.userId(); 
	},

	domain: function() {
		var a = document.createElement('a'); 
		a.href = this.url;
		return a.hostname;
	},

	commentsCount: function() {
		return Comments.find({ postId: this._id}).count();
	}
});